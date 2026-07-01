import { Suspense } from "react";
import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import CheckoutForm from "../components/CheckoutForm";
import { allProductIds } from "../../lib/products";

export const metadata = {
  title: "Tilaa — LaudaturPro.fi",
  description: "Tilaa yo-valmennus ja aloita heti.",
};

export default function TilaaPage({ searchParams }) {
  const paketti = typeof searchParams?.paketti === "string" ? searchParams.paketti : "";
  const valid = allProductIds().includes(paketti) ? paketti : "";

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-lg px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Ilmainen · 2 min</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Laske sinulle sopiva hinta</h1>
          <p className="mt-3 text-sm leading-relaxed text-navy/70">
            Valitse tuote suoraan — tai tee ensin{" "}
            <a href="/testi" className="font-semibold text-navy underline">
              ilmainen testi
            </a>{" "}
            ja saat henkilökohtaisen hinnan valintojesi perusteella.
          </p>
          <div className="mt-8">
            <Suspense
              fallback={
                <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
                  <p className="font-heading text-lg font-bold text-navy">Siirrytään kassalle…</p>
                </div>
              }
            >
              <CheckoutForm initialProductId={valid} />
            </Suspense>
          </div>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
