/**
 * Lähettää LaudaturPro drip-testit Resend-jonon kautta (Supabase edge).
 * Käyttö: node scripts/send-drip-via-queue.mjs hannesnikkinen1@gmail.com
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

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
  console.error("Anna sähköposti");
  process.exit(1);
}

const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
if (!base || !key) {
  console.error("Puuttuu Supabase-asetukset");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const FROM = "LaudaturPro <onboarding@resend.dev>";

const steps = [
  {
    label: "laudatur_first_offer",
    subject: "Sinun yo-suunnitelmasi on valmis — 149 € 🎯",
    headline: "Sinun yo-suunnitelmasi on valmis",
    body: "Henkilökohtainen tarjouksesi valintojesi perusteella.",
    cta: "Avaa minun suunnitelmani",
  },
  {
    label: "laudatur_drip_1",
    subject: "Ensimmäinen viikkosi yo-valmennuksessa",
    headline: "Näin ensimmäinen viikkosi näyttää",
    body: "Kirjoitat: Pitkä matematiikka, Fysiikka. Aloita prioriteettiaineestasi.",
    cta: "Avaa minun suunnitelmani",
  },
  {
    label: "laudatur_drip_2",
    subject: "Suunnitelmasi poistetaan pian — varmista paikkasi",
    headline: "Suunnitelmasi poistetaan pian",
    body: "Henkilökohtainen hintasi on sidottu valintoihisi — tarjous ei ole ikuisesti voimassa.",
    cta: "Lunasta tarjoukseni",
  },
  {
    label: "laudatur_drip_3",
    subject: "Miksi muut valitsevat henkilökohtaisen yo-paketin?",
    headline: "Et ole yksin valmistautumassa",
    body: "LaudaturPro yhdistää teorian, AI-harjoittelun ja harkkakokeet.",
    cta: "Katso minun tarjoukseni",
  },
  {
    label: "laudatur_drip_4",
    subject: "Viimeinen muistutus — 149 € tarjouksesi",
    headline: "Viimeinen mahdollisuus",
    body: "Henkilökohtainen hintasi 149 € on voimassa vielä hetken.",
    cta: "Siirry kassalle nyt",
  },
];

function html(step) {
  const checkout = "https://laudaturpro.fi/tilaa?product=laudatur-pro";
  return `<!DOCTYPE html><html lang="fi"><body style="margin:0;background:#f4f6f8;font-family:system-ui,sans-serif;color:#0A2540">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#0A2540;color:#fff;border-radius:16px 16px 0 0;padding:24px;text-align:center">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37">LaudaturPro</p>
<h1 style="margin:12px 0 0;font-size:22px">${step.headline}</h1>
</div>
<div style="background:#fff;border-radius:0 0 16px 16px;padding:24px;border:1px solid #e5e7eb;border-top:0">
<p style="margin:0 0 16px;line-height:1.6;color:#334155">${step.body}</p>
<p style="margin:0 0 16px;font-size:28px;font-weight:800">149 €</p>
<a href="${checkout}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:14px 24px;border-radius:999px">${step.cta}</a>
</div></div></body></html>`;
}

for (const step of steps) {
  const messageId = randomUUID();
  const res = await fetch(`${base}/rest/v1/rpc/enqueue_email`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: FROM,
        subject: step.subject,
        html: html(step),
        message_id: messageId,
        idempotency_key: messageId,
        label: step.label,
        queued_at: new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) {
    console.error("enqueue failed", step.label, await res.text());
    process.exit(1);
  }
  console.log("queued:", step.label);
}

const processRes = await fetch(`${base}/functions/v1/process-email-queue`, {
  method: "POST",
  headers: { Authorization: `Bearer ${key}` },
});
const processBody = await processRes.text();
console.log("process-email-queue:", processRes.status, processBody);

// Kirjaa drip-jonoon testiä varten (cron-testi myöhemmin)
const nextSendAt = new Date().toISOString();
const enrollRes = await fetch(`${base}/rest/v1/lead_drip_enrollments?on_conflict=email,stream`, {
  method: "POST",
  headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
  body: JSON.stringify({
    email,
    stream: "laudaturpro",
    step_index: 1,
    status: "active",
    payload: {
      personalTitle: "Henkilökohtainen yo-pakettisi",
      priceEur: 149,
      checkoutUrl: "https://laudaturpro.fi/tilaa?product=laudatur-pro",
    },
    next_send_at: nextSendAt,
    updated_at: new Date().toISOString(),
  }),
});
console.log("enrollment:", enrollRes.status, enrollRes.ok ? "ok" : await enrollRes.text());

console.log("Valmis — tarkista:", email);
