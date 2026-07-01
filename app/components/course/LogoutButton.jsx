"use client";

import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button type="button" onClick={handleLogout} className="text-xs font-semibold text-white/70 hover:text-gold">
      Kirjaudu ulos
    </button>
  );
}
