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

const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };

for (let i = 0; i < 5; i++) {
  const res = await fetch(`${base}/functions/v1/process-email-queue`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
  });
  console.log(`run ${i + 1}:`, res.status, await res.text());
  await new Promise((r) => setTimeout(r, 2000));
}

const log = await fetch(
  `${base}/rest/v1/email_send_log?recipient_email=eq.hannesnikkinen1@gmail.com&order=created_at.desc&limit=10&select=template_name,status,error_message,created_at`,
  { headers }
);
console.log("send_log:", await log.json());
