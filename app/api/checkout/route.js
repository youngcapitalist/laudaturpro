import { getProduct } from "../../../lib/products";
import { stripePriceIdFor } from "../../../lib/stripe-products";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function siteOrigin(request) {
  const host = request.headers.get("host") || "laudaturpro.fi";
  const proto = host.includes("localhost") ? "http" : "https";
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || `${proto}://${host}`;
}

export async function POST(request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return Response.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = typeof data?.email === "string" ? data.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const productId = typeof data?.productId === "string" ? data.productId : "";
  const product = getProduct(productId);
  if (!product) return Response.json({ error: "invalid_product" }, { status: 400 });

  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const utm = data?.utm && typeof data.utm === "object" ? data.utm : {};
  const origin = siteOrigin(request);

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
  const priceId = stripePriceIdFor(productId);

  const lineItems = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "eur",
            unit_amount: product.priceEur * 100,
            product_data: {
              name: product.name,
              description: product.tagline || "LaudaturPro yo-valmennus",
              metadata: { product_id: productId, platform: "laudaturpro" },
            },
          },
          quantity: 1,
        },
      ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: lineItems,
    success_url: `${origin}/kiitos?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tilaa?paketti=${encodeURIComponent(productId)}`,
    allow_promotion_codes: true,
    metadata: {
      product_id: productId,
      product_name: product.name,
      price_eur: String(product.priceEur),
      customer_name: name,
      source: "laudaturpro",
      utm_source: utm.utm_source || "",
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
    },
    payment_intent_data: {
      metadata: {
        product_id: productId,
        source: "laudaturpro",
      },
    },
  });

  return Response.json({ url: session.url });
}
