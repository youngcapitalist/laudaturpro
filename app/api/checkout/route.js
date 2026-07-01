import { createCheckoutSession } from "../../../lib/checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseUtm(searchParams) {
  return {
    utm_source: searchParams.get("utm_source") || "",
    utm_medium: searchParams.get("utm_medium") || "",
    utm_campaign: searchParams.get("utm_campaign") || "",
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("paketti") || searchParams.get("productId") || "";
  const offerToken = searchParams.get("offer") || "";

  const result = await createCheckoutSession({
    request,
    productId,
    offerToken: offerToken || null,
    utm: parseUtm(searchParams),
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.redirect(result.url, 303);
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const productId = typeof data?.productId === "string" ? data.productId : "";
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const utm = data?.utm && typeof data.utm === "object" ? data.utm : {};
  const offerToken = typeof data?.offerToken === "string" ? data.offerToken : null;

  const result = await createCheckoutSession({
    request,
    productId,
    email: email || null,
    name: name || null,
    utm,
    offerToken,
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({ url: result.url });
}
