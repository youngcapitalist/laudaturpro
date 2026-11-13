import { hasLaudaturAccess } from "../../../../lib/access";
import { createClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Näytetäänkö “juuri nyt” -ilmoitus — ei maksaville. */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email && (await hasLaudaturAccess(user.email))) {
      return Response.json({ show: false, reason: "paid" });
    }

    return Response.json({ show: true });
  } catch {
    return Response.json({ show: true });
  }
}
