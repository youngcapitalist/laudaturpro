/**
 * Täyttää email_key-kentät olemassa oleville riveille.
 * node scripts/backfill-email-key.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { canonicalEmailKey, normalizeEmail } from "../lib/drip/email-normalize.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
for (const file of [".env.vercel", ".env.local"]) {
  const p = resolve(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function backfillTable(table, emailField = "email") {
  const res = await fetch(`${base}/rest/v1/${table}?select=*`, { headers: { ...headers, Prefer: "count=exact" } }).catch(
    () => null
  );
  // Use REST list via postgrest
  const list = await fetch(`${base}/rest/v1/${table}?${emailField}=not.is.null&select=id,${emailField},email_key`, {
    headers,
  });
  if (!list.ok) {
    console.log(table, "skip", list.status);
    return;
  }
  const rows = await list.json();
  let updated = 0;
  for (const row of rows) {
    const email = row[emailField];
    if (!email) continue;
    const email_key = canonicalEmailKey(email);
    if (row.email_key === email_key) continue;
    const norm = normalizeEmail(email);
    const patch = await fetch(`${base}/rest/v1/${table}?id=eq.${row.id}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ email: norm, email_key }),
    });
    if (patch.ok) updated++;
  }
  console.log(table, "updated", updated, "of", rows.length);
}

// marketing_stream_unsubscribes has composite PK — patch by email+stream
async function backfillUnsubscribes() {
  const list = await fetch(`${base}/rest/v1/marketing_stream_unsubscribes?select=email,stream,email_key`, { headers });
  if (!list.ok) return;
  const rows = await list.json();
  let updated = 0;
  for (const row of rows) {
    const email_key = canonicalEmailKey(row.email);
    if (row.email_key === email_key) continue;
    await fetch(
      `${base}/rest/v1/marketing_stream_unsubscribes?email=eq.${encodeURIComponent(row.email)}&stream=eq.${encodeURIComponent(row.stream)}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ email: normalizeEmail(row.email), email_key }),
      }
    );
    updated++;
  }
  console.log("marketing_stream_unsubscribes updated", updated);
}

await backfillTable("lead_drip_enrollments");
await backfillTable("laudatur_access");
await backfillUnsubscribes();
console.log("Backfill valmis");
