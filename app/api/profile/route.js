import { createClient } from "../../../lib/supabase/server";
import { getProfile, updateProfileName } from "../../../lib/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const profile = await getProfile(user.id);
  return Response.json({
    email: user.email,
    firstName: profile?.first_name || null,
  });
}

export async function PATCH(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const firstName = typeof body?.firstName === "string" ? body.firstName : "";
  await updateProfileName(user.id, firstName);
  return Response.json({ ok: true });
}
