"use client";

import { useMemo, useState } from "react";
import { BUNDLES, getProduct, SUBJECT_GROUPS } from "../../lib/products";

export default function CheckoutForm({ initialProductId = "" }) {
  const [productId, setProductId] = useState(initialProductId);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const product = useMemo(() => (productId ? getProduct(productId) : null), [productId]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailValid || !product || submitting) return;
    setSubmitting(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          productId: product.id,
          utm: {
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            utm_campaign: params.get("utm_campaign"),
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "checkout_failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err.message === "checkout_failed" ? "Maksun käynnistys epäonnistui." : String(err.message));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
      {!product && (
        <div className="mb-6">
          <label htmlFor="product-select" className="block text-sm font-semibold text-navy">
            Valitse tuote *
          </label>
          <select
            id="product-select"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="">— Valitse —</option>
            <optgroup label="Paketit">
              {BUNDLES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.priceEur} €
                </option>
              ))}
            </optgroup>
            {SUBJECT_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.title}>
                {g.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.priceEur} €
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {product && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-navy/5 p-4">
          <p className="text-xs font-semibold uppercase text-navy-muted">Valittu tuote</p>
          <p className="mt-1 font-heading text-lg font-bold text-navy">{product.name}</p>
          {product.tagline && <p className="text-sm text-navy/65">{product.tagline}</p>}
          <p className="mt-2 font-heading text-3xl font-extrabold text-navy">{product.priceEur} €</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="order-email" className="block text-sm font-semibold text-navy">
            Sähköposti *
          </label>
          <input
            id="order-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
            placeholder="sinä@esimerkki.fi"
          />
        </div>
        <div>
          <label htmlFor="order-name" className="block text-sm font-semibold text-navy">
            Nimi (valinnainen)
          </label>
          <input
            id="order-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!emailValid || !product || submitting}
        className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Siirrytään maksuun…" : product ? `Maksa turvallisesti — ${product.priceEur} €` : "Valitse tuote"}
      </button>
      <p className="mt-4 text-center text-xs text-navy/50">Stripe Checkout · 14 pv peruutusoikeus ennen kurssin alkua</p>
    </form>
  );
}
