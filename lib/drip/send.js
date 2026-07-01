import { getStream } from "./streams.js";
import { unsubscribeUrl } from "./unsubscribe-token.js";
import { sendEmailViaQueue } from "./email-queue.js";
import { offerBoxHtml, bulletsHtml, urgencyHtml } from "./email-blocks.js";

function siteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://laudaturpro.fi";
}

function dripUnsubscribeOrigin() {
  return (
    process.env.DRIP_UNSUBSCRIBE_ORIGIN?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://laudaturpro.fi"
  );
}

function absoluteCheckout(payload, streamConfig) {
  const url = payload.checkoutUrl || payload.checkout_url;
  if (!url) return streamConfig.siteUrl;
  if (url.startsWith("http")) return url;
  const base = streamConfig.id === "laudaturpro" ? siteOrigin() : streamConfig.siteUrl;
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

function resolveStepField(field, payload) {
  if (typeof field === "function") return field(payload);
  return field ?? null;
}

export async function sendDripEmail({ email, stream, stepIndex, payload }) {
  const apiKey = process.env.RESEND_API_KEY;
  const streamConfig = getStream(stream);
  if (!streamConfig) return { skipped: true, reason: "not_configured" };

  const step = streamConfig.steps[stepIndex - 1];
  if (!step) return { skipped: true, reason: "no_step" };

  const p = payload || {};
  const checkout = absoluteCheckout(p, streamConfig);
  const unsub = unsubscribeUrl(email, stream, dripUnsubscribeOrigin());
  const from =
    process.env.RESEND_FROM ||
    `${streamConfig.fromName} <onboarding@resend.dev>`;

  const headline = resolveStepField(step.headline, p);
  const body = resolveStepField(step.body, p);
  const subject = resolveStepField(step.subject, p);
  const bullets = resolveStepField(step.bullets, p);
  const urgency = resolveStepField(step.urgency, p);

  const html = `<!DOCTYPE html>
<html lang="fi">
<body style="margin:0;background:#f4f6f8;font-family:system-ui,sans-serif;color:#0A2540">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#0A2540;color:#fff;border-radius:16px 16px 0 0;padding:24px;text-align:center">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37">${streamConfig.brand}</p>
      <h1 style="margin:12px 0 0;font-size:22px;line-height:1.25">${headline}</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:24px;border:1px solid #e5e7eb;border-top:0">
      <p style="margin:0 0 16px;line-height:1.65;color:#334155;font-size:15px">${body}</p>
      ${offerBoxHtml(p, checkout)}
      ${bulletsHtml(bullets)}
      ${urgencyHtml(urgency)}
      <a href="${checkout}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:16px 24px;border-radius:999px;font-size:15px">${step.cta}</a>
      <p style="margin:16px 0 0;font-size:12px;color:#64748b;text-align:center;line-height:1.5">
        Tarjous sidottu valintoihisi · voimassa rajoitetun ajan
      </p>
      <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.5">
        <a href="${unsub}" style="color:#64748b">Peru markkinointi (${streamConfig.brand})</a>
        · Jos olet jo asiakas, voit jättää tämän huomiotta
      </p>
    </div>
  </div>
</body>
</html>`;

  if (!apiKey) {
    return sendEmailViaQueue({
      to: email,
      from,
      subject,
      html,
      label: `laudatur_drip_${stream}_${stepIndex}`,
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
    console.error("[DRIP] send failed", stream, stepIndex, err.slice(0, 200));
    return { error: "send_failed" };
  }
  return { ok: true };
}
