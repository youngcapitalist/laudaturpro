import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

const email = "hannesnikkinen1@gmail.com";

const tableCheck = await fetch(`${url}/rest/v1/lead_drip_enrollments?select=id&limit=1`, { headers });
console.log("lead_drip_enrollments:", tableCheck.status, tableCheck.ok ? "OK" : await tableCheck.text());

const enroll = await fetch(
  `${url}/rest/v1/lead_drip_enrollments?email=eq.${encodeURIComponent(email)}&stream=eq.laudaturpro&select=*`,
  { headers }
);
if (enroll.ok) {
  const rows = await enroll.json();
  console.log("enrollment:", rows.length ? rows[0].status + " step " + rows[0].step_index : "none");
}

const lead = await fetch(
  `${url}/rest/v1/valintakoe_hub_leads?email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1&select=email,source,offered_price_eur`,
  { headers }
);
if (lead.ok) {
  const rows = await lead.json();
  console.log("lead:", rows[0] || "none");
}
