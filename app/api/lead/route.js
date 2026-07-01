export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
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

  const productId = typeof data?.productId === "string" ? data.productId.trim() || null : null;
  const productName = typeof data?.productName === "string" ? data.productName.trim() || null : null;
  const priceEur =
    typeof data?.priceEur === "number" && data.priceEur >= 29 && data.priceEur <= 2000
      ? Math.round(data.priceEur)
      : null;

  const lead = {
    email,
    name: typeof data?.name === "string" ? data.name.trim() || null : null,
    productId,
    productName,
    priceEur,
    source: "laudaturpro",
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
          preferred_field: productName,
          pain_key: productId,
          offered_price_eur: priceEur,
          source: lead.source,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("[LEAD] supabase failed", res.status, txt);
        return Response.json({ error: "supabase_failed" }, { status: 502 });
      }
      return Response.json({ ok: true });
    } catch (err) {
      console.error("[LEAD] supabase error", err);
      return Response.json({ error: "supabase_error" }, { status: 502 });
    }
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) return Response.json({ error: "webhook_failed" }, { status: 502 });
    } catch {
      return Response.json({ error: "webhook_error" }, { status: 502 });
    }
  } else {
    console.log("[LEAD]", JSON.stringify(lead));
  }

  return Response.json({ ok: true });
}
