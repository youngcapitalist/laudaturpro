import { sendQuizOfferEmail } from "../../../lib/quiz-offer-email";
import { enrollInDrip } from "../../../lib/drip/enroll.js";
import { canSendDrip } from "../../../lib/drip/eligibility.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
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

  const productId = typeof data?.productId === "string" ? data.productId.trim() || null : null;
  const productName = typeof data?.productName === "string" ? data.productName.trim() || null : null;
  const personalTitle = typeof data?.personalTitle === "string" ? data.personalTitle.trim() || null : null;
  const checkoutUrl = typeof data?.checkoutUrl === "string" ? data.checkoutUrl : null;
  const priceEur =
    typeof data?.priceEur === "number" && data.priceEur >= 29 && data.priceEur <= 2000
      ? Math.round(data.priceEur)
      : null;
  const listPriceEur =
    typeof data?.listPriceEur === "number" && data.listPriceEur >= 29 && data.listPriceEur <= 2000
      ? Math.round(data.listPriceEur)
      : null;

  const wtpScore =
    typeof data?.wtpScore === "number" && data.wtpScore >= 0 && data.wtpScore <= 1000
      ? Math.round(data.wtpScore)
      : null;

  const selectedLabels = Array.isArray(data?.selectedLabels)
    ? data.selectedLabels.filter((s) => typeof s === "string")
    : [];
  const goalLabel = typeof data?.goalLabel === "string" ? data.goalLabel : null;
  const gradeLabel = typeof data?.gradeLabel === "string" ? data.gradeLabel.trim() || null : null;
  const retakeLabels = Array.isArray(data?.retakeLabels)
    ? data.retakeLabels.filter((s) => typeof s === "string").slice(0, 12)
    : [];

  const lead = {
    email,
    name: typeof data?.name === "string" ? data.name.trim() || null : null,
    productId,
    productName,
    personalTitle,
    priceEur,
    listPriceEur,
    wtpScore,
    checkoutUrl,
    selectedLabels,
    retakeLabels,
    goalLabel,
    gradeLabel,
    source: "laudaturpro_quiz",
    utm: data?.utm && typeof data.utm === "object" ? data.utm : null,
    receivedAt: new Date().toISOString(),
  };

  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supaUrl && supaKey) {
    const base = supaUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
    try {
      const res = await fetch(`${base}/rest/v1/valintakoe_hub_leads`, {
        method: "POST",
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name,
          preferred_field: personalTitle || productName,
          pain_key: productId,
          offered_price_eur: priceEur,
          wtp_score: wtpScore,
          source: lead.source,
          scores: {
            selectedLabels,
            retakeLabels,
            goalLabel,
            gradeLabel,
            listPriceEur,
            checkoutUrl,
          },
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("[LEAD] supabase failed", res.status, txt);
        return Response.json({ error: "supabase_failed" }, { status: 502 });
      }
    } catch (err) {
      console.error("[LEAD] supabase error", err);
      return Response.json({ error: "supabase_error" }, { status: 502 });
    }
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch {
      /* webhook optional */
    }
  }

  let emailSent = false;
  if (checkoutUrl && priceEur) {
    const mail = await sendQuizOfferEmail({
      email,
      personalTitle: personalTitle || productName,
      priceEur,
      listPriceEur: listPriceEur || priceEur,
      checkoutUrl,
      selectedLabels,
      goalLabel,
    });
    emailSent = !!mail.ok;
  }

  const dripEligible = await canSendDrip(email, "laudaturpro");
  if (dripEligible.ok && checkoutUrl && priceEur) {
    await enrollInDrip({
      email,
      stream: "laudaturpro",
      payload: {
        personalTitle: personalTitle || productName,
        productId,
        priceEur,
        listPriceEur: listPriceEur || priceEur,
        wtpScore,
        checkoutUrl,
        selectedLabels,
        retakeLabels,
        goalLabel,
        gradeLabel,
      },
    }).catch((err) => console.error("[DRIP] enroll failed", err));
  }

  return Response.json({ ok: true, emailSent });
}
