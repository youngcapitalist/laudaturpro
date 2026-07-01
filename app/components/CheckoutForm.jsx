"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BUNDLES, getProduct, SUBJECT_GROUPS } from "../../lib/products";
import { checkoutUrl } from "../config/site";
import { loadOffer } from "../../lib/wtp-persist";

function CheckoutRedirect({ productId }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("paketti", productId);
    const stored = loadOffer();
    if (stored?.token && stored.productId === productId) {
      params.set("offer", stored.token);
    }
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "offer"]) {
      const v = searchParams.get(key);
      if (v) params.set(key, v);
    }
    window.location.href = `/api/checkout?${params.toString()}`;
  }, [productId, searchParams]);

  return (
    <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
      <p className="font-heading text-lg font-bold text-navy">Siirrytään kassalle…</p>
    </div>
  );
}

export default function CheckoutForm({ initialProductId = "" }) {
  const product = initialProductId ? getProduct(initialProductId) : null;

  if (product) {
    return <CheckoutRedirect productId={product.id} />;
  }

  return (
    <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
      <p className="text-sm text-navy/70">Valitse tuote — siirryt suoraan kassalle.</p>
      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Paketit</p>
          <ul className="mt-3 space-y-2">
            {BUNDLES.map((b) => (
              <li key={b.id}>
                <a
                  href={checkoutUrl(b.id)}
                  className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-navy hover:bg-mist"
                >
                  <span>{b.name}</span>
                  <span className="font-heading text-navy">{b.priceEur} €</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {SUBJECT_GROUPS.map((g) => (
          <div key={g.id}>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{g.title}</p>
            <ul className="mt-3 space-y-2">
              {g.courses.map((c) => (
                <li key={c.id}>
                  <a
                    href={checkoutUrl(c.id)}
                    className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-semibold text-navy transition hover:border-navy hover:bg-mist"
                  >
                    <span>{c.name}</span>
                    <span className="font-heading text-navy">{c.priceEur} €</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
