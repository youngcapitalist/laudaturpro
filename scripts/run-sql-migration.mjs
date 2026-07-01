/**
 * Aja lead_drip.sql Supabaseen (vaatii SUPABASE_SERVICE_ROLE_KEY + SUPABASE_URL).
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

for (const file of [".env.vercel.prod", ".env.vercel", ".env.local"]) {
  const p = resolve(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Puuttuu SUPABASE_URL tai SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const check = await fetch(`${url}/rest/v1/lead_drip_enrollments?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (check.ok) {
  console.log("lead_drip_enrollments on jo olemassa");
  process.exit(0);
}

const sql = readFileSync(resolve(root, "supabase/lead_drip.sql"), "utf8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--"));

// Supabase ei tue DDL:ää REST:llä — käytä pg via database URL jos saatavilla
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error(
    "Taulu puuttuu. Aja supabase/lead_drip.sql SQL Editorissa tai lisää DATABASE_URL env."
  );
  process.exit(1);
}

const { default: pg } = await import("pg");
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
await client.connect();
for (const stmt of statements) {
  await client.query(stmt);
}
await client.end();
console.log("Migraatio ajettu");
