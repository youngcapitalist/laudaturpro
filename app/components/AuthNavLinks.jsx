"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export function AuthNavLinks() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data?.admin)))
      .catch(() => setIsAdmin(false));
  }, [user]);

  if (user) {
    return (
      <>
        <Link href="/profiili" className="font-heading text-[15px] font-semibold text-gold hover:text-gold-light">
          Profiili
        </Link>
        {isAdmin && (
          <Link
            href="/admin/harkkakokeet"
            className="font-heading text-[15px] font-semibold text-white/70 hover:text-gold"
          >
            Harkkakokeet
          </Link>
        )}
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
