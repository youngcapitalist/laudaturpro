/** Ensimmäinen MadMuscles-tyylinen tarjousposti quiz-liidille (Resend). */

import { unsubscribeUrl } from "./drip/unsubscribe-token.js";
import { sendEmailViaQueue } from "./drip/email-queue.js";
import { offerBoxHtml, bulletsHtml, urgencyHtml } from "./drip/email-blocks.js";

export async function sendQuizOfferEmail({
  email,
  personalTitle,
  priceEur,
  listPriceEur,
  checkoutUrl,
  selectedLabels = [],
  goalLabel,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "LaudaturPro <onboarding@resend.dev>";
  if (!email) return { skipped: true };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://laudaturpro.fi";
  const cta = checkoutUrl.startsWith("http") ? checkoutUrl : `${siteUrl}${checkoutUrl}`;
  const unsub = unsubscribeUrl(email, "laudaturpro", siteUrl);
  const payload = { personalTitle, priceEur, listPriceEur, selectedLabels, goalLabel };

  const bullets = [
    "Teoria osa-alueittain — ei satunnaista selaamista",
    "AI-professori jokaisessa aineessa, rajattomasti",
    "1000+ harjoitustehtävää ja harkkakoe ennen yo-koetta",
    "3 ilmaista kysymystä ennen sitoutumista",
  ];

  const html = `<!DOCTYPE html>
<html lang="fi">
<body style="margin:0;background:#f4f6f8;font-family:system-ui,sans-serif;color:#0A2540">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#0A2540;color:#fff;border-radius:16px 16px 0 0;padding:28px 24px;text-align:center">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37">Vain sinulle</p>
      <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2">Sinun yo-suunnitelmasi on valmis</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #e5e7eb;border-top:0">
      <p style="margin:0 0 16px;line-height:1.65;color:#334155;font-size:15px">
        Tiedämme, että uuden valmennuksen tilaaminen tuntuu isolta päätökseltä — varsinkin ennen kuin olet kokeillut.
        Siksi rakensimme sinulle <strong>henkilökohtaisen tarjouksen</strong> testissä tekemiesi valintojen perusteella.
        Et saa tätä hintaa julkisesti — se on sidottu juuri sinun aineisiisi ja tavoitteeseen.
      </p>
      ${offerBoxHtml(payload, cta)}
      ${bulletsHtml(bullets)}
      ${urgencyHtml(`Tarjous voimassa 7 päivää. Sen jälkeen henkilökohtaista hintaa ei voi lunastaa samoilla valinnoilla.`)}
      <a href="${cta}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:16px 24px;border-radius:999px;font-size:15px">Avaa minun suunnitelmani</a>
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;text-align:center">
        <a href="${unsub}" style="color:#64748b">Peru markkinointi (LaudaturPro)</a>
        · Jos olet jo asiakas, voit jättää tämän huomiotta
      </p>
    </div>
    <p style="text-align:center;font-size:11px;color:#94a3b8;margin:16px 0 0">LaudaturPro.fi · syksyn 2026 yo-kokeisiin</p>
  </div>
</body>
</html>`;

  const subject = `Sinun yo-suunnitelmasi on valmis — ${priceEur} € 🎯`;

  if (!apiKey) {
    return sendEmailViaQueue({
      to: email,
      from,
      subject,
      html,
      label: "laudatur_first_offer",
      unsubscribeUrl: unsub,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html,
      headers: {
        "List-Unsubscribe": `<${unsub}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[EMAIL] resend failed", res.status, err.slice(0, 200));
    return { error: "send_failed" };
  }
  return { ok: true };
}
