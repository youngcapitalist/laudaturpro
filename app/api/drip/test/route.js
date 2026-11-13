import { sendDripEmail } from "../../../../lib/drip/send.js";
import { sendQuizOfferEmail } from "../../../../lib/quiz-offer-email.js";
import { enrollInDrip } from "../../../../lib/drip/enroll.js";
import { canSendDrip } from "../../../../lib/drip/eligibility.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request) {
  const secret = process.env.CRON_SECRET || process.env.OFFER_SIGNING_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

/** Testaa drip + ensimmäinen tarjousposti. Vaatii CRON_SECRET tai OFFER_SIGNING_SECRET. */
export async function POST(request) {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const stream = data?.stream === "laudaturpro" ? "laudaturpro" : "laudaturpro";
  const payload = {
    personalTitle: "Henkilökohtainen yo-pakettisi (testi)",
    priceEur: 149,
    listPriceEur: 249,
    checkoutUrl: "https://laudaturpro.fi/tilaa?product=laudatur-pro",
    selectedLabels: ["Pitkä matematiikka", "Fysiikka", "Äidinkieli"],
    goalLabel: "Laudatur",
  };

  const eligible = await canSendDrip(email, stream);
  if (!eligible.ok) {
    return Response.json({ error: "not_eligible", reason: eligible.reason }, { status: 403 });
  }

  const results = { email, stream, firstOffer: null, drip: [], enroll: null };

  if (data?.includeFirstOffer !== false) {
    results.firstOffer = await sendQuizOfferEmail({
      email,
      personalTitle: payload.personalTitle,
      priceEur: payload.priceEur,
      listPriceEur: payload.listPriceEur,
      checkoutUrl: payload.checkoutUrl,
      selectedLabels: payload.selectedLabels,
      goalLabel: payload.goalLabel,
    });
  }

  for (let step = 1; step <= 4; step++) {
    results.drip.push({ step, ...(await sendDripEmail({ email, stream, stepIndex: step, payload })) });
  }

  if (data?.enroll !== false) {
    const enroll = await enrollInDrip({ email, stream, payload });
    results.enroll = enroll;
  }

  return Response.json({ ok: true, ...results });
}
