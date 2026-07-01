import { hasLaudaturAccess } from "../../../../lib/access";

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

  const allowed = await hasLaudaturAccess(email);
  if (!allowed) {
    return Response.json(
      { error: "no_access", message: "Sähköpostilla ei löydy aktiivista kurssitilausta. Osta ensin tai käytä samaa osoitetta kuin maksussa." },
      { status: 403 }
    );
  }

  return Response.json({ ok: true });
}
