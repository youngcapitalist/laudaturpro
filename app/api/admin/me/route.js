import { createClient } from "../../../../lib/supabase/server";
import { isAdminEmail } from "../../../../lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return Response.json({ admin: false });
  }

  return Response.json({ admin: isAdminEmail(user.email) });
}
