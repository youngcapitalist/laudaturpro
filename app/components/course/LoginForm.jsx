"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ next = "/kurssi" }) {
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 6;
  const canSubmitPassword = emailValid && passwordValid && state !== "loading";
  const canSubmitLink = emailValid && state !== "loading";

  function authRedirectTo(customNext = next) {
    const params = new URLSearchParams({
      next: customNext,
      brand: "laudaturpro",
    });
    return `${window.location.origin}/auth/callback?${params.toString()}`;
  }

  const otpOptions = {
    emailRedirectTo: authRedirectTo(),
    data: { auth_brand: "laudaturpro", auth_origin: "laudaturpro.fi" },
  };

  async function handlePasswordLogin(e) {
    e.preventDefault();
    if (!canSubmitPassword) return;
    setState("loading");
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Virheellinen sähköposti tai salasana. Voit pyytää kirjautumislinkin tai asettaa salasanan profiilissa.");
        } else {
          setError("Kirjautuminen epäonnistui. Yritä uudelleen.");
        }
        setState("idle");
        return;
      }
      window.location.href = next;
    } catch {
      setError("Kirjautuminen epäonnistui. Yritä uudelleen.");
      setState("idle");
    }
  }

  async function handleMagicLink(e) {
    e.preventDefault();
    if (!canSubmitLink) return;
    setState("loading");
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: otpOptions,
      });
      if (authError) throw authError;
      setState("sent");
    } catch {
      setError("Kirjautumislinkin lähetys epäonnistui. Yritä uudelleen.");
      setState("idle");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (!canSubmitLink) return;
    setState("loading");
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: authRedirectTo("/profiili?aseta-salasana=1"),
      });
      if (authError) throw authError;
      setState("reset-sent");
    } catch {
      setError("Salasanan palautus epäonnistui. Yritä uudelleen.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-card border border-gold/40 bg-white p-8 text-center shadow-glow">
        <p className="font-heading text-xl font-bold text-navy">Tarkista sähköpostisi</p>
        <p className="mt-3 text-sm text-navy/70">
          Lähetimme kirjautumislinkin osoitteeseen <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  if (state === "reset-sent") {
    return (
      <div className="rounded-card border border-gold/40 bg-white p-8 text-center shadow-glow">
        <p className="font-heading text-xl font-bold text-navy">Tarkista sähköpostisi</p>
        <p className="mt-3 text-sm text-navy/70">
          Lähetimme salasanan vaihtolinkin osoitteeseen <strong>{email}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setMode("password");
          }}
          className="mt-6 text-sm font-semibold text-navy underline"
        >
          Takaisin kirjautumiseen
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
      <div className="flex gap-2 rounded-pill bg-mist p-1">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError(null);
          }}
          className={`flex-1 rounded-pill px-3 py-2 text-xs font-bold transition ${
            mode === "password" ? "bg-navy text-gold" : "text-navy/60 hover:text-navy"
          }`}
        >
          Salasana
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("link");
            setError(null);
          }}
          className={`flex-1 rounded-pill px-3 py-2 text-xs font-bold transition ${
            mode === "link" ? "bg-navy text-gold" : "text-navy/60 hover:text-navy"
          }`}
        >
          Sähköpostilinkki
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="mt-6">
          <p className="text-sm text-navy/70">
            Kirjaudu sähköpostilla ja salasanalla. Jos olet kirjautunut aiemmin linkillä, aseta salasana profiilissa.
          </p>
          <div className="mt-5">
            <label htmlFor="login-email" className="block text-sm font-semibold text-navy">
              Sähköposti
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="sinä@esimerkki.fi"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="login-password" className="block text-sm font-semibold text-navy">
              Salasana
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmitPassword}
            className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light disabled:opacity-50"
          >
            {state === "loading" ? "Kirjaudutaan…" : "Kirjaudu sisään"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("reset");
              setError(null);
              setPassword("");
            }}
            className="mt-4 w-full text-center text-xs font-semibold text-navy/60 underline hover:text-navy"
          >
            Unohditko salasanan?
          </button>
        </form>
      ) : mode === "reset" ? (
        <form onSubmit={handleResetPassword} className="mt-6">
          <p className="text-sm text-navy/70">Lähetämme linkin, jolla voit asettaa uuden salasanan.</p>
          <div className="mt-5">
            <label htmlFor="reset-email" className="block text-sm font-semibold text-navy">
              Sähköposti
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="sinä@esimerkki.fi"
            />
          </div>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmitLink}
            className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light disabled:opacity-50"
          >
            {state === "loading" ? "Lähetetään…" : "Lähetä vaihtolinkki"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setError(null);
            }}
            className="mt-4 w-full text-center text-xs font-semibold text-navy/60 underline hover:text-navy"
          >
            Takaisin kirjautumiseen
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="mt-6">
          <p className="text-sm text-navy/70">
            Lähetämme kertakäyttöisen linkin sähköpostiisi. Sama tili toimii kaikissa kursseissasi.
          </p>
          <div className="mt-5">
            <label htmlFor="link-email" className="block text-sm font-semibold text-navy">
              Sähköposti
            </label>
            <input
              id="link-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="sinä@esimerkki.fi"
            />
          </div>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmitLink}
            className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light disabled:opacity-50"
          >
            {state === "loading" ? "Lähetetään…" : "Lähetä kirjautumislinkki"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-xs text-navy/50">
        Ei tiliä?{" "}
        <a href="/#kurssit" className="font-semibold text-navy underline">
          Kokeile AI-professoria
        </a>{" "}
        tai{" "}
        <a href="/tilaa?paketti=laudatur-pro" className="font-semibold text-navy underline">
          tilaa kurssi
        </a>
      </p>
    </div>
  );
}
