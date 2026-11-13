import { createOfferToken } from "../../../lib/offer-token";
import { getProduct } from "../../../lib/products";
import { computeWtpScore, wtpScoreToPriceEur, WTP_MIN_EUR, WTP_MAX_EUR } from "../../../lib/wtp";
import { checkoutUrl } from "../../config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const productId = typeof data?.productId === "string" ? data.productId.trim() : "";
  const product = getProduct(productId);
  if (!product) {
    return Response.json({ error: "invalid_product" }, { status: 400 });
  }

  const wtpAnswers = data?.wtpAnswers && typeof data.wtpAnswers === "object" ? data.wtpAnswers : {};
  const wtpScore =
    typeof data?.wtpScore === "number" && data.wtpScore >= 0 && data.wtpScore <= 1000
      ? Math.round(data.wtpScore)
      : computeWtpScore(wtpAnswers);

  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) {
    console.error("[OFFER] OFFER_SIGNING_SECRET not configured");
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const priceEur = wtpScoreToPriceEur(wtpScore, productId);
  if (priceEur == null || priceEur < WTP_MIN_EUR || priceEur > WTP_MAX_EUR) {
    return Response.json({ error: "invalid_price" }, { status: 400 });
  }

  const token = createOfferToken(
    {
      productId,
      amountCents: priceEur * 100,
      priceEur,
      listPriceEur: product.priceEur,
      wtpScore,
      offer_type: "wtp",
    },
    secret
  );

  return Response.json({
    ok: true,
    token,
    productId,
    productName: product.name,
    priceEur,
    listPriceEur: product.priceEur,
    wtpScore,
    checkoutUrl: checkoutUrl(productId, { offer: token, utm_source: "laudaturpro", utm_medium: "wtp" }),
  });
}
