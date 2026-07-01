"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

export default function LoginForm({ next = "/kurssi" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailValid || state === "loading") return;
    setState("loading");
    setError(null);

    try {
      const check = await fetch("/api/access/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const checkData = await check.json().catch(() => ({}));
      if (!check.ok) {
        setError(checkData.message || "Kurssitilausta ei löydy tällä sähköpostilla.");
        setState("idle");
        return;
      }

      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (authError) throw authError;
      setState("sent");
    } catch {
      setError("Kirjautumislinkin lähetys epäonnistui. Yritä uudelleen.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-card border border-gold/40 bg-white p-8 text-center shadow-glow">
        <p className="font-heading text-xl font-bold text-navy">Tarkista sähköpostisi</p>
        <p className="mt-3 text-sm text-navy/70">
          Lähetimme kirjautumislinkin osoitteeseen <strong>{email}</strong>. Klikkaa linkkiä päästäksesi
          kurssialueelle.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
      <p className="text-sm text-navy/70">
        Käytä <strong>samaa sähköpostia</strong> kuin Stripe-maksussa. Lähetämme kertakäyttöisen kirjautumislinkin.
      </p>
      <div className="mt-5">
        <label htmlFor="login-email" className="block text-sm font-semibold text-navy">
          Sähköposti
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="sinä@esimerkki.fi"
        />
      </div>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={!emailValid || state === "loading"}
        className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light disabled:opacity-50"
      >
        {state === "loading" ? "Lähetetään…" : "Lähetä kirjautumislinkki"}
      </button>
      <p className="mt-4 text-center text-xs text-navy/50">
        Ei tiliä? <a href="/tilaa?paketti=laudatur-pro" className="font-semibold text-navy underline">Tilaa kurssi</a>
      </p>
    </form>
  );
}
