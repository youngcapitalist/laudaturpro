/** Tervetuloposti maksun jälkeen (transactional). */

import { sendEmailViaQueue } from "./drip/email-queue.js";
import { bulletsHtml } from "./drip/email-blocks.js";
import { subjectsForProduct } from "./access.js";
import { getProduct } from "./products.js";

const FROM = process.env.RESEND_FROM || "LaudaturPro <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://laudaturpro.fi";

function firstNameFromFull(name) {
  if (!name || typeof name !== "string") return null;
  const part = name.trim().split(/\s+/)[0];
  return part || null;
}

function loginUrl() {
  return `${SITE_URL}/kirjaudu?next=${encodeURIComponent("/kurssi")}`;
}

function productBullets(productId, productName) {
  const product = getProduct(productId);
  if (product?.features?.length) return product.features.slice(0, 4);

  const subjects = subjectsForProduct(productId);
  if (subjects.length === 1) {
    return [
      "Teoria osa-alueittain yo-kokeen rakenteen mukaan",
      "Harjoittelu seteittäin + kertaus väärin menneistä",
      "AI-professori valitussa aineessa, rajattomasti",
      "Harkkakoe ja käsitekortit ennen oikeaa koetta",
    ];
  }

  if (subjects.length > 0 && subjects.length < 12) {
    return [
      `Pääsy ${subjects.length} valitsemaasi yo-aineeseen`,
      "Harjoittelu seteittäin ja AI-professori jokaisessa",
      "Käsitteet/sanasto ja harkkakoe mukana",
      "Pääsy syksyn 2026 yo-kokeisiin asti",
    ];
  }

  return [
    "Kaikki 12 yo-ainetta samassa paikassa",
    "1000+ harjoitustehtävää + rajaton AI-professori",
    "Harjoittelu, käsitteet ja harkkakoe ennen koetta",
    "Pääsy syksyn 2026 yo-kokeisiin asti",
  ];
}

/**
 * @param {object} p
 * @param {string} p.email
 * @param {string} [p.name]
 * @param {string} [p.productId]
 * @param {string} [p.productName]
 * @param {string} p.sessionId — Stripe checkout session (idempotency)
 */
export async function sendWelcomeEmail({ email, name, productId, productName, sessionId }) {
  if (!email) return { skipped: true, reason: "no_email" };
  if (!sessionId) return { skipped: true, reason: "no_session" };

  const firstName = firstNameFromFull(name);
  const displayProduct = productName || getProduct(productId)?.name || "LaudaturPro";
  const bullets = productBullets(productId, displayProduct);
  const login = loginUrl();
  const greeting = firstName ? `Hei ${firstName}!` : "Hei!";

  const html = `<!DOCTYPE html>
<html lang="fi">
<body style="margin:0;background:#f4f6f8;font-family:system-ui,sans-serif;color:#0A2540">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#0A2540;color:#fff;border-radius:16px 16px 0 0;padding:28px 24px;text-align:center">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37">Tervetuloa</p>
      <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2">Maksusi on vahvistettu ✓</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #e5e7eb;border-top:0">
      <p style="margin:0 0 16px;line-height:1.65;color:#334155;font-size:15px">
        ${greeting} Kiitos tilauksestasi. <strong>${displayProduct}</strong> on nyt aktiivinen sähköpostilla
        <strong>${email}</strong>. Pääset alkuun heti alla olevasta painikkeesta.
      </p>
      <div style="margin:0 0 20px;padding:16px;border:2px solid #D4AF37;border-radius:12px;background:#FFFBEB">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#92400e">Pakettisi</p>
        <p style="margin:0;font-weight:700;color:#0A2540;font-size:18px">${displayProduct}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#64748b">Pääsy syksyn 2026 yo-kokeisiin asti</p>
      </div>
      ${bulletsHtml(bullets)}
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0A2540">Aloita näin:</p>
      <ol style="margin:0 0 20px;padding-left:20px;line-height:1.55;color:#475569;font-size:14px">
        <li style="margin:0 0 8px">Kirjaudu sisään sähköpostilinkillä (ei salasanaa)</li>
        <li style="margin:0 0 8px">Valitse yo-aine ja lue lyhyt teoria</li>
        <li style="margin:0 0 8px">Tee harjoitussetti tai kysy AI-professorilta</li>
        <li style="margin:0 0 8px">Kokeile harkkakoetta lähempänä yo-päivää</li>
      </ol>
      <a href="${login}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:16px 24px;border-radius:999px;font-size:15px">Kirjaudu kurssille →</a>
      <p style="margin:16px 0 0;font-size:12px;color:#64748b;line-height:1.5;text-align:center">
        Linkki vie kirjautumissivulle. Saat uuden magic linkin sähköpostiisi yhdellä klikkauksella.
      </p>
      <p style="margin:20px 0 0;font-size:13px;color:#64748b;line-height:1.5">
        Tarvitsetko apua? Vastaa tähän viestiin tai kirjoita
        <a href="mailto:info@laudaturpro.fi" style="color:#0A2540">info@laudaturpro.fi</a>.
      </p>
    </div>
    <p style="text-align:center;font-size:11px;color:#94a3b8;margin:16px 0 0">LaudaturPro.fi · yo-valmennus</p>
  </div>
</body>
</html>`;

  const subject = firstName
    ? `${firstName}, tervetuloa LaudaturProhon! 🎯`
    : "Tervetuloa LaudaturProhon — pääsy aktivoitu 🎯";

  const apiKey = process.env.RESEND_API_KEY;
  const idempotencyKey = `laudatur-welcome-${sessionId}`;
  const messageId = idempotencyKey;

  if (!apiKey) {
    return sendEmailViaQueue({
      to: email,
      from: FROM,
      subject,
      html,
      label: "laudatur_welcome",
      idempotencyKey,
      messageId,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: FROM, to: [email], subject, html }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[WELCOME EMAIL] resend failed", res.status, err.slice(0, 200));
    return sendEmailViaQueue({
      to: email,
      from: FROM,
      subject,
      html,
      label: "laudatur_welcome",
      idempotencyKey,
      messageId,
    });
  }

  return { ok: true, via: "resend" };
}
