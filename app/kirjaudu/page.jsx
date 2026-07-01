import { Suspense } from "react";
import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";
import LoginForm from "../components/course/LoginForm";

export const metadata = {
  title: "Kirjaudu — LaudaturPro Kurssit",
  robots: { index: false },
};

export default function KirjauduPage({ searchParams }) {
  const next = typeof searchParams?.next === "string" ? searchParams.next : "/kurssi";
  const error = searchParams?.error === "auth";

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="mx-auto max-w-md px-5 py-16 md:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Kurssialue</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Kirjaudu sisään</h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            Kirjautuminen epäonnistui. Yritä uudelleen.
          </p>
        )}
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm next={next} />
          </Suspense>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
