"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export function AuthNavLinks() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <>
        <Link href="/profiili" className="font-heading text-[15px] font-semibold text-gold hover:text-gold-light">
          Profiili
        </Link>
        <Link href="/kurssi" className="font-heading text-[15px] font-semibold text-white/90 hover:text-gold">
          Kurssit
        </Link>
      </>
    );
  }

  return (
    <Link href="/kirjaudu" className="font-heading text-[15px] font-semibold text-gold hover:text-gold-light">
      Kirjaudu
    </Link>
  );
}
