"use client";

import { useState } from "react";
import { LogoutButton } from "../components/course/LogoutButton";

export default function ProfileForm({ email, initialName }) {
  const [firstName, setFirstName] = useState(initialName || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName }),
      });
      if (!res.ok) throw new Error("save_failed");
      setSaved(true);
    } catch {
      setError("Tallennus epäonnistui.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-white p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Tili</p>
      <p className="mt-2 text-sm text-navy/60">{email}</p>
      <div className="mt-5">
        <label htmlFor="first-name" className="block text-sm font-semibold text-navy">
          Etunimi
        </label>
        <input
          id="first-name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          placeholder="Etunimi"
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {saved && <p className="mt-3 text-sm text-green-800">Profiili tallennettu.</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold disabled:opacity-50"
        >
          {saving ? "Tallennetaan…" : "Tallenna"}
        </button>
        <LogoutButton />
      </div>
    </form>
  );
}
