import Stripe from "stripe";
import { markDripConverted } from "../../../lib/drip/enroll.js";
import { canonicalEmailKey, normalizeEmail } from "../../../lib/drip/email-normalize.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Syksyn 2026 yo-kokeiden jälkeen */
const ACCESS_UNTIL = "2026-10-05T21:00:00.000Z";

async function saveAccess(record) {
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supaUrl || !supaKey) {
    console.log("[LAUDATUR ACCESS]", JSON.stringify(record));
    return { ok: true, stored: "log" };
  }

  const base = supaUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const res = await fetch(`${base}/rest/v1/laudatur_access?on_conflict=stripe_session_id`, {
    method: "POST",
    headers: {
      apikey: supaKey,
      Authorization: `Bearer ${supaKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[LAUDATUR ACCESS] supabase failed", res.status, txt);
    return { ok: false };
  }
  return { ok: true, stored: "supabase" };
}

export async function POST(request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return Response.json({ error: "stripe_not_configured" }, { status: 503 });

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const sessionId = typeof data?.sessionId === "string" ? data.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) {
    return Response.json({ error: "invalid_session" }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return Response.json({ error: "not_paid", status: session.payment_status }, { status: 402 });
  }

  const meta = session.metadata || {};
  const email = normalizeEmail(session.customer_details?.email || session.customer_email || "");
  const record = {
    email,
    email_key: canonicalEmailKey(email),
    name: meta.customer_name || session.customer_details?.name || null,
    product_id: meta.product_id || null,
    product_name: meta.product_name || null,
    price_eur: meta.price_eur ? Number(meta.price_eur) : session.amount_total ? Math.round(session.amount_total / 100) : null,
    stripe_session_id: session.id,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
    access_until: ACCESS_UNTIL,
    utm_source: meta.utm_source || null,
    utm_medium: meta.utm_medium || null,
  };

  const result = await saveAccess(record);

  if (result.ok && email) {
    await markDripConverted(email, "laudaturpro").catch((err) =>
      console.error("[DRIP] mark converted failed", err)
    );
  }

  return Response.json({
    ok: true,
    email,
    productName: record.product_name,
    stored: result.stored,
  });
}
