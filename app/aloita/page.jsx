import { QuizFirstHeader } from "../components/QuizFirstChrome";
import YoQuiz from "../testi/YoQuiz";

export const metadata = {
  title: "Aloita yo-tarkastus — ilmainen | LaudaturPro.fi",
  description:
    "Vastaa ensimmäiseen kysymykseen ja saat henkilökohtaisen yo-suunnitelman sekä hinnan. Ilmainen, ei sitoumusta.",
  robots: { index: true, follow: true },
};

export default function AloitaPage() {
  return (
    <main className="min-h-screen bg-slate-wash">
      <QuizFirstHeader sourceLabel="Ilmainen yo-tarkastus" />
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-xl px-5 md:px-8">
          <YoQuiz quizFirst />
          <p className="mx-auto mt-8 text-center text-xs text-navy/45">
            Maksuton tarkastus · Ei sitoumusta · Maksu vain jos jatkat kassalle
          </p>
        </div>
      </section>
    </main>
  );
}
