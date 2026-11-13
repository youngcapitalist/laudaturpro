import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isAdminEmail } from "./admin";

export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/kirjaudu?next=/admin/harkkakokeet");
  if (!isAdminEmail(user.email)) redirect("/kurssi");

  return { user };
}
