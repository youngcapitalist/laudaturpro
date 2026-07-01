import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import CheckoutForm from "../components/CheckoutForm";
import { allProductIds } from "../../lib/products";

export const metadata = {
  title: "Tilaa — LaudaturPro.fi",
  description: "Maksa turvallisesti Stripe Checkoutissa ja aloita yo-valmennus heti.",
};

export default function TilaaPage({ searchParams }) {
  const paketti = typeof searchParams?.paketti === "string" ? searchParams.paketti : "";
  const valid = allProductIds().includes(paketti) ? paketti : "";

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-lg px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Tilaus</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Aloita LaudaturPro</h1>
          <p className="mt-3 text-sm text-navy/70">
            Syötä sähköpostisi — siirryt Stripe-maksuun. Pääsy kurssille heti maksun jälkeen.
          </p>
          <div className="mt-8">
            <CheckoutForm initialProductId={valid} />
          </div>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
