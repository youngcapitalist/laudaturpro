/** Lähettää yhden drip-viestin jonon kautta (ei vaadi signing secretia). */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getStream } from "../lib/drip/streams.js";
import { offerBoxHtml, bulletsHtml, urgencyHtml } from "../lib/drip/email-blocks.js";

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
const stepIndex = Number(process.argv[3] || 2);
const stream = "laudaturpro";
const payload = {
  personalTitle: "Henkilökohtainen yo-pakettisi",
  priceEur: 149,
  listPriceEur: 249,
  checkoutUrl: "https://laudaturpro.fi/tilaa?product=laudatur-pro",
  selectedLabels: ["Pitkä matematiikka", "Fysiikka", "Äidinkieli"],
  goalLabel: "Laudatur",
};

const config = getStream(stream);
const step = config.steps[stepIndex - 1];
const resolveField = (f) => (typeof f === "function" ? f(payload) : f);
const checkout = payload.checkoutUrl;
const headline = resolveField(step.headline);
const body = resolveField(step.body);
const subject = resolveField(step.subject);
const bullets = resolveField(step.bullets);
const urgency = resolveField(step.urgency);

const html = `<!DOCTYPE html><html lang="fi"><body style="margin:0;background:#f4f6f8;font-family:system-ui,sans-serif;color:#0A2540">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#0A2540;color:#fff;border-radius:16px 16px 0 0;padding:24px;text-align:center">
<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37">LaudaturPro</p>
<h1 style="margin:12px 0 0;font-size:22px;line-height:1.25">${headline}</h1>
</div>
<div style="background:#fff;border-radius:0 0 16px 16px;padding:24px;border:1px solid #e5e7eb;border-top:0">
<p style="margin:0 0 16px;line-height:1.65;color:#334155;font-size:15px">${body}</p>
${offerBoxHtml(payload, checkout)}
${bulletsHtml(bullets)}
${urgencyHtml(urgency)}
<a href="${checkout}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:16px 24px;border-radius:999px;font-size:15px">${step.cta}</a>
</div></div></body></html>`;

const { sendEmailViaQueue } = await import("../lib/drip/email-queue.js");
const result = await sendEmailViaQueue({
  to: email,
  from: "LaudaturPro <onboarding@resend.dev>",
  subject,
  html,
  label: `laudatur_drip_test_${stepIndex}`,
});
console.log("Lähetetty:", email, "step", stepIndex, result);
