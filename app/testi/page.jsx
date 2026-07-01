import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import YoQuiz from "./YoQuiz";

export const metadata = {
  title: "Yo-tarkastus — henkilökohtainen suunnitelma | LaudaturPro.fi",
  description:
    "Ilmainen yo-tarkastus: kartoitamme aineet, tilanteen ja tavoitteen — saat henkilökohtaisen suunnitelman ja hinnan postiisi.",
};

export default function TestiPage() {
  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <YoQuiz />
          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-navy/45">
            Tarkastus on maksuton. Maksu vain jos jatkat kassalle.
          </p>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
