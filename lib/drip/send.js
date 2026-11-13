import { getStream } from "./streams.js";
import { createOfferToken } from "../offer-token.js";
import { roundToNine, WTP_MIN_EUR } from "../wtp.js";
import { examSampleForCode } from "./exam-samples.js";
import { unsubscribeUrl } from "./unsubscribe-token.js";
import { sendEmailViaQueue } from "./email-queue.js";
import { offerBoxHtml, bulletsHtml, urgencyHtml, sampleBoxHtml, compactOfferLinkHtml } from "./email-blocks.js";

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

function productIdFromPayload(payload) {
  if (payload.productId) return payload.productId;
  const url = payload.checkoutUrl || payload.checkout_url || "";
  const match = url.match(/[?&]paketti=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function offerCheckoutPath(productId, token, medium) {
  return `/api/checkout?paketti=${encodeURIComponent(productId)}&offer=${encodeURIComponent(
    token
  )}&utm_source=laudaturpro&utm_medium=${encodeURIComponent(medium)}`;
}

/**
 * Uusi tarjoustoken joka lähetykselle (alkuperäinen vanhenee 7 vrk:ssa),
 * ja rescueDiscount-askeleelle alennettu hinta niukkuustarjouksena.
 */
function valintakoeMinEur(examCode) {
  return examCode === "B" ? 149 : 99;
}

function valintakoeCheckoutUrl(siteUrl, token, streamId, medium) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/?offer=${encodeURIComponent(token)}&utm_source=${encodeURIComponent(
    streamId
  )}&utm_medium=${encodeURIComponent(medium)}#pricing`;
}

function refreshValintakoeOffer(payload, step, streamConfig) {
  const secret = process.env.OFFER_SIGNING_SECRET;
  const examCode = payload.examCode;
  const priceEur = typeof payload.priceEur === "number" ? payload.priceEur : null;
  if (!secret || !examCode || !priceEur) return payload;

  const minEur = valintakoeMinEur(examCode);
  const wtpScore = payload.wtpScore ?? null;
  const liveMasterclasses = payload.liveMasterclasses ?? false;
  const email = typeof payload.email === "string" ? payload.email : undefined;

  try {
    if (step.rescueDiscount) {
      const rescuePrice = roundToNine(priceEur * (1 - step.rescueDiscount), minEur);
      if (rescuePrice < priceEur) {
        const vipPriceEur = rescuePrice + 400;
        const token = createOfferToken(
          {
            exam: examCode,
            amountCents: rescuePrice * 100,
            priceEur: rescuePrice,
            vipAmountCents: vipPriceEur * 100,
            vipPriceEur,
            wtpScore,
            email,
            liveMasterclasses,
            offer_type: "drip_rescue_33",
          },
          secret
        );
        return {
          ...payload,
          originalPriceEur: priceEur,
          rescuePriceEur: rescuePrice,
          rescuePct: Math.round((1 - rescuePrice / priceEur) * 100),
          priceEur: rescuePrice,
          listPriceEur: priceEur,
          checkoutUrl: valintakoeCheckoutUrl(streamConfig.siteUrl, token, streamConfig.id, "drip_rescue"),
        };
      }
    }

    const vipPriceEur = priceEur + 400;
    const token = createOfferToken(
      {
        exam: examCode,
        amountCents: priceEur * 100,
        priceEur,
        vipAmountCents: vipPriceEur * 100,
        vipPriceEur,
        wtpScore,
        email,
        liveMasterclasses,
        offer_type: "drip",
      },
      secret
    );
    return {
      ...payload,
      checkoutUrl: valintakoeCheckoutUrl(streamConfig.siteUrl, token, streamConfig.id, "drip"),
    };
  } catch {
    return payload;
  }
}

function refreshLaudaturOffer(payload, step) {
  const secret = process.env.OFFER_SIGNING_SECRET;
  const productId = productIdFromPayload(payload);
  const priceEur = typeof payload.priceEur === "number" ? payload.priceEur : null;
  if (!secret || !productId || !priceEur) return payload;

  try {
    if (step.rescueDiscount) {
      const rescuePrice = Math.max(WTP_MIN_EUR, roundToNine(priceEur * (1 - step.rescueDiscount)));
      if (rescuePrice < priceEur) {
        const token = createOfferToken(
          {
            productId,
            amountCents: rescuePrice * 100,
            priceEur: rescuePrice,
            listPriceEur: priceEur,
            wtpScore: payload.wtpScore ?? null,
            offer_type: "drip_rescue_33",
          },
          secret
        );
        return {
          ...payload,
          originalPriceEur: priceEur,
          rescuePriceEur: rescuePrice,
          rescuePct: Math.round((1 - rescuePrice / priceEur) * 100),
          priceEur: rescuePrice,
          listPriceEur: priceEur,
          checkoutUrl: offerCheckoutPath(productId, token, "drip_rescue"),
        };
      }
    }

    const token = createOfferToken(
      {
        productId,
        amountCents: priceEur * 100,
        priceEur,
        listPriceEur: payload.listPriceEur ?? priceEur,
        wtpScore: payload.wtpScore ?? null,
        offer_type: "wtp",
      },
      secret
    );
    return { ...payload, checkoutUrl: offerCheckoutPath(productId, token, "drip") };
  } catch {
    return payload;
  }
}

function refreshOfferPayload(payload, step, streamConfig) {
  if (streamConfig.id === "laudaturpro") return refreshLaudaturOffer(payload, step);
  if (streamConfig.id.startsWith("valintakoe_")) return refreshValintakoeOffer(payload, step, streamConfig);
  return payload;
}

export async function sendDripEmail({ email, stream, stepIndex, payload }) {
  const apiKey = process.env.RESEND_API_KEY;
  const streamConfig = getStream(stream);
  if (!streamConfig) return { skipped: true, reason: "not_configured" };

  const step = streamConfig.steps[stepIndex - 1];
  if (!step) return { skipped: true, reason: "no_step" };

  const p = refreshOfferPayload({ ...(payload || {}), email: (payload || {}).email || email }, step, streamConfig);
  const checkout = absoluteCheckout(p, streamConfig);
  const examCode =
    p.examCode || streamConfig.id.replace(/^valintakoe_/, "").toUpperCase() || null;
  const sample = step.sampleOnly ? examSampleForCode(examCode) : null;
  const primaryUrl = sample?.url || checkout;
  const unsubOrigin =
    streamConfig.id === "laudaturpro"
      ? siteOrigin()
      : (streamConfig.siteUrl || dripUnsubscribeOrigin());
  const unsub = unsubscribeUrl(email, stream, unsubOrigin);
  const from =
    process.env.RESEND_FROM ||
    `${streamConfig.fromName} <onboarding@resend.dev>`;

  const headline = resolveStepField(step.headline, p);
  const body = resolveStepField(step.body, p);
  const subject = resolveStepField(step.subject, p);
  const bullets = resolveStepField(step.bullets, p);
  const urgency = resolveStepField(step.urgency, p);
  const cta = resolveStepField(step.cta, p) || sample?.cta || "Avaa tarjoukseni";

  const offerSection = step.sampleOnly
    ? `${sample ? sampleBoxHtml(sample) : ""}${compactOfferLinkHtml(p, checkout)}`
    : offerBoxHtml(p, checkout);

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
      ${offerSection}
      ${bulletsHtml(bullets)}
      ${urgencyHtml(urgency)}
      <a href="${primaryUrl}" style="display:block;text-align:center;background:#D4AF37;color:#0A2540;font-weight:800;text-decoration:none;padding:16px 24px;border-radius:999px;font-size:15px">${cta}</a>
      <p style="margin:16px 0 0;font-size:12px;color:#64748b;text-align:center;line-height:1.5">
        ${step.sampleOnly ? "Ilmainen näyte · tarjous sidottu testiin" : "Tarjous sidottu valintoihisi · voimassa rajoitetun ajan"}
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
