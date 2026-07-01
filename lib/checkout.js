import { getProduct } from "./products";
import { stripePriceIdFor } from "./stripe-products";
import { verifyOfferToken } from "./offer-token";
import Stripe from "stripe";

export function siteOrigin(request) {
  const host = request.headers.get("host") || "laudaturpro.fi";
  const proto = host.includes("localhost") ? "http" : "https";
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || `${proto}://${host}`;
}

export async function createCheckoutSession({
  request,
  productId,
  email = null,
  name = null,
  utm = {},
  offerToken = null,
}) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { error: "stripe_not_configured", status: 503 };
  }

  const product = getProduct(productId);
  if (!product) {
    return { error: "invalid_product", status: 400 };
  }

  const origin = siteOrigin(request);
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  let priceEur = product.priceEur;
  let offerMeta = {};

  if (offerToken) {
    const secret = process.env.OFFER_SIGNING_SECRET;
    const offer = verifyOfferToken(offerToken, secret);
    if (!offer || offer.productId !== productId) {
      return { error: "invalid_offer", status: 400 };
    }
    priceEur = offer.priceEur;
    offerMeta = {
      offer_type: offer.offer_type || "wtp",
      wtp_score: String(offer.wtpScore ?? ""),
      list_price_eur: String(offer.listPriceEur ?? product.priceEur),
    };
  }

  const priceId = offerToken ? null : stripePriceIdFor(productId);

  const lineItems = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "eur",
            unit_amount: priceEur * 100,
            product_data: {
              name: product.name,
              description: product.tagline || "LaudaturPro yo-valmennus",
              metadata: { product_id: productId, platform: "laudaturpro" },
            },
          },
          quantity: 1,
        },
      ];

  const sessionParams = {
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/kiitos?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tilaa?paketti=${encodeURIComponent(productId)}`,
    allow_promotion_codes: true,
    metadata: {
      product_id: productId,
      product_name: product.name,
      price_eur: String(priceEur),
      customer_name: name || "",
      source: "laudaturpro",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      ...offerMeta,
    },
    payment_intent_data: {
      metadata: {
        product_id: productId,
        source: "laudaturpro",
        ...offerMeta,
      },
    },
  };

  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    sessionParams.customer_email = email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return { url: session.url };
}
