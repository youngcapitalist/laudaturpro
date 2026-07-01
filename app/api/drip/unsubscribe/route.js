import { verifyUnsubscribeToken } from "../../../../lib/drip/unsubscribe-token.js";
import { recordStreamUnsubscribe } from "../../../../lib/drip/enroll.js";
import { getStream } from "../../../../lib/drip/streams.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const verified = token ? verifyUnsubscribeToken(token) : null;
  if (!verified) {
    return Response.json({ valid: false }, { status: 400 });
  }
  const config = getStream(verified.stream);
  return Response.json({
    valid: true,
    stream: verified.stream,
    brand: config?.brand || verified.stream,
  });
}

export async function POST(request) {
  let token = new URL(request.url).searchParams.get("token");
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.text();
    const params = new URLSearchParams(form);
    if (!params.get("List-Unsubscribe") && params.get("token")) token = params.get("token");
  } else {
    try {
      const body = await request.json();
      if (body?.token) token = body.token;
    } catch {
      /* query token */
    }
  }

  const verified = token ? verifyUnsubscribeToken(token) : null;
  if (!verified) {
    return Response.json({ error: "invalid_token" }, { status: 400 });
  }

  await recordStreamUnsubscribe(verified.email, verified.stream);
  return Response.json({ success: true, stream: verified.stream });
}

/** One-click unsubscribe (RFC 8058) */
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
