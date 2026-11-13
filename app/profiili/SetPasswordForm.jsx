"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function SetPasswordForm({ autoOpen = false }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const valid = password.length >= 6 && password === confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setPassword("");
      setConfirm("");
      setSaved(true);
    } catch {
      setError("Salasanan asetus epäonnistui. Yritä uudelleen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-card border border-line bg-white p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Salasana</p>
      <p className="mt-2 text-sm text-navy/70">
        {autoOpen
          ? "Aseta salasana, jotta voit kirjautua jatkossa ilman sähköpostilinkkiä."
          : "Aseta tai vaihda salasana. Kirjautuminen salasanalla toimii kaikissa kursseissasi."}
      </p>
      <div className="mt-5">
        <label htmlFor="new-password" className="block text-sm font-semibold text-navy">
          Uusi salasana
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Vähintään 6 merkkiä"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="confirm-password" className="block text-sm font-semibold text-navy">
          Vahvista salasana
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Sama salasana uudelleen"
        />
      </div>
      {password && password.length < 6 && (
        <p className="mt-2 text-xs text-navy/50">Salasanan tulee olla vähintään 6 merkkiä.</p>
      )}
      {confirm && password !== confirm && (
        <p className="mt-2 text-xs text-red-700">Salasanat eivät täsmää.</p>
      )}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {saved && <p className="mt-3 text-sm text-green-800">Salasana tallennettu. Voit nyt kirjautua salasanalla.</p>}
      <button
        type="submit"
        disabled={!valid || saving}
        className="mt-6 rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold disabled:opacity-50"
      >
        {saving ? "Tallennetaan…" : "Tallenna salasana"}
      </button>
    </form>
  );
}
