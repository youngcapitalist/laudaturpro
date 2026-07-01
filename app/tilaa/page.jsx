import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import OrderForm from "../components/OrderForm";
import { allProductIds } from "../../lib/products";

export const metadata = {
  title: "Tilaa — LaudaturPro.fi",
  description: "Tilaa yo-valmennuskurssi tai Laudatur Pro -paketti.",
};

export default function TilaaPage({ searchParams }) {
  const paketti = typeof searchParams?.paketti === "string" ? searchParams.paketti : "";
  const valid = allProductIds().includes(paketti) ? paketti : "";

  return (
    <main>
      <LaudaturNav />
      <section className="border-b border-line bg-mist py-14 md:py-20">
        <div className="mx-auto max-w-lg px-6 md:px-8">
          <h1 className="font-heading text-3xl font-extrabold text-navy">Tilaa kurssi</h1>
          <p className="mt-3 text-sm text-navy/70">
            Syötä sähköpostisi — ohjaamme maksuun tai lähetämme laskun sähköpostitse.
          </p>
          <div className="mt-8">
            <OrderForm initialProductId={valid} />
          </div>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
