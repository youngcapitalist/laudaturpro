/**
 * Lähettää kaikki 4 drip-vaihetta testiosoitteeseen heti.
 * Käyttö: node scripts/send-drip-test.mjs hannesnikkinen1@gmail.com
 * Vaatii: RESEND_API_KEY, OFFER_SIGNING_SECRET (tai DRIP_SIGNING_SECRET)
 */
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

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Anna sähköposti: node scripts/send-drip-test.mjs user@example.com");
  process.exit(1);
}

const payload = {
  personalTitle: "Henkilökohtainen yo-pakettisi",
  priceEur: 149,
  listPriceEur: 249,
  checkoutUrl: "/tilaa?product=laudatur-pro",
  selectedLabels: ["Pitkä matematiikka", "Fysiikka", "Äidinkieli"],
  goalLabel: "Laudatur",
};

const { sendDripEmail } = await import("../lib/drip/send.js");

for (let step = 1; step <= 4; step++) {
  const result = await sendDripEmail({ email, stream: "laudaturpro", stepIndex: step, payload });
  console.log(`Step ${step}:`, result);
  await new Promise((r) => setTimeout(r, 1500));
}

console.log("Valmis — tarkista postilaatikko:", email);
