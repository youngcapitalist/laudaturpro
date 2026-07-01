import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export async function CourseNav() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-navy-dark px-4 md:px-6">
      <Link href="/kurssi" className="font-heading text-lg font-extrabold text-white">
        Laudatur<span className="text-gold">Pro</span>
        <span className="ml-2 text-xs font-semibold text-white/50">Kurssit</span>
      </Link>
      <div className="flex items-center gap-4">
        {user?.email && <span className="hidden text-xs text-white/60 sm:inline">{user.email}</span>}
        <LogoutButton />
      </div>
    </header>
  );
}
