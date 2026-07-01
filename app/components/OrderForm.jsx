"use client";

import { useMemo, useState } from "react";
import { BUNDLES, getProduct, SUBJECT_GROUPS } from "../../lib/products";

const STRIPE_LINKS = {
  "laudatur-pro": process.env.NEXT_PUBLIC_LAUDATUR_STRIPE_LINK_PRO,
  "laudatur-boost": process.env.NEXT_PUBLIC_LAUDATUR_STRIPE_LINK_BOOST,
};

export default function OrderForm({ initialProductId = "" }) {
  const [productId, setProductId] = useState(initialProductId);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const product = useMemo(() => (productId ? getProduct(productId) : null), [productId]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailValid || !product || submitting) return;
    setSubmitting(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          source: "laudaturpro",
          productId: product.id,
          productName: product.name,
          priceEur: product.priceEur,
          utm,
        }),
      });
      if (!res.ok) throw new Error("request_failed");

      const stripeUrl = STRIPE_LINKS[product.id];
      if (stripeUrl) {
        const url = new URL(stripeUrl);
        url.searchParams.set("prefilled_email", email.trim());
        window.location.href = url.toString();
        return;
      }

      setDone(true);
    } catch {
      setError("Tilauksen lähetys epäonnistui. Yritä uudelleen tai ota yhteyttä info@laudaturpro.fi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="font-heading text-2xl font-extrabold text-navy">Kiitos tilauksesta!</p>
        <p className="mt-3 text-sm text-navy/70">
          Lähetämme sähköpostiisi ({email}) ohjeet maksamiseen ja kurssipääsyyn pian.
        </p>
        <a href="/" className="mt-6 inline-flex rounded-pill bg-navy px-6 py-3 font-heading text-sm font-bold text-gold">
          Takaisin etusivulle
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 md:p-8">
      {!product && (
        <div className="mb-6">
          <label htmlFor="product-select" className="block text-sm font-semibold text-navy">
            Valitse tuote *
          </label>
          <select
            id="product-select"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold text-navy focus:border-navy focus:outline-none"
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
        <div className="mb-6 rounded-xl bg-mist p-4">
          <p className="text-xs font-semibold uppercase text-navy/50">Valittu tuote</p>
          <p className="mt-1 font-heading text-lg font-bold text-navy">{product.name}</p>
          {product.tagline && <p className="text-sm text-navy/65">{product.tagline}</p>}
          <p className="mt-2 font-heading text-2xl font-extrabold text-navy">{product.priceEur} €</p>
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
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
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
            className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm text-navy focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!emailValid || !product || submitting}
        className="mt-6 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Lähetetään…" : product ? `Jatka — ${product.priceEur} €` : "Valitse tuote ensin"}
      </button>

      <p className="mt-4 text-center text-xs text-navy/50">
        Maksu Stripe-kautta. 14 päivän peruutusoikeus ennen kurssin alkua.
      </p>
    </form>
  );
}
