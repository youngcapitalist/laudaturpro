import { LaudaturNav, LaudaturFooter } from "./components/LaudaturChrome";
import { BundleCard, CourseCard } from "./components/ProductCard";
import { ProfessorSection } from "./components/ProfessorSection";
import { BUNDLES, SUBJECT_GROUPS } from "../lib/products";
import { orderUrl } from "./config/site";

const STEPS = [
  { n: "1", title: "Valitse paketti tai aine", text: "Laudatur Pro, Boost tai yksittäinen kurssi." },
  { n: "2", title: "Maksa Stripe Checkoutissa", text: "Turvallinen maksu — pääsy heti sähköpostiisi." },
  { n: "3", title: "Opiskele professorin kanssa", text: "Teoria, tehtävät ja AI-tuki kevään kokeisiin." },
];

const FAQ = [
  {
    q: "Eroavatko professorit valintakokeen professoreista?",
    a: "Kyllä. LaudaturPro on oma yo-alusta. Professorit on rakennettu yo-kokeisiin ja ainekohtaiseen opiskeluun — erillään valintakoe-imperiumista.",
  },
  {
    q: "Milloin pääsen kurssille?",
    a: "Heti maksun jälkeen. Saat kirjautumisohjeet sähköpostiisi.",
  },
  {
    q: "Auttaako tämä todistusvalinnassa?",
    a: "Kyllä — korkeammat yo-arvosanat nostavat todistuspisteitä. Laske vaikutus Pääsykoe.fi:n laskurilla.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LaudaturNav />

      {/* Hero */}
      <section className="hero-grid relative overflow-hidden bg-navy-dark text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-90" />
        <div className="relative mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
          <div className="inline-flex items-center gap-2 rounded-pill border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
            Yo-valmennus 2026 · Laudatur-tavoite
          </div>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
            Nosta yo-arvosanat.{" "}
            <span className="text-gold">Professori joka aineessa.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            LaudaturPro on yo-myyntialusta lukiolaisille — teoria, harjoitukset ja ainekohtaiset AI-professorit. Sama
            luotettava infra kuin valintakokeissa, mutta täysin oma tuote.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={orderUrl("laudatur-pro")}
              className="inline-flex rounded-pill bg-gold px-7 py-3.5 font-heading text-sm font-bold text-navy shadow-glow hover:bg-gold-light"
            >
              Laudatur Pro — 399 €
            </a>
            <a
              href="#professorit"
              className="inline-flex rounded-pill border border-white/25 px-7 py-3.5 font-heading text-sm font-bold text-white hover:bg-white/10"
            >
              Tutustu professoreihin
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 md:max-w-lg">
            {[
              { v: "30+", l: "yo-ainetta" },
              { v: "10", l: "AI-professoria" },
              { v: "2026", l: "kevään kokeet" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-heading text-2xl font-extrabold text-gold md:text-3xl">{s.v}</dt>
                <dd className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white/55">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProfessorSection />

      {/* How it works */}
      <section className="border-y border-line bg-slate-wash py-14">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <h2 className="font-heading text-2xl font-extrabold text-navy md:text-3xl">Näin se toimii</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-card border border-line bg-white p-6 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-heading text-sm font-bold text-gold">
                  {s.n}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-navy/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="paketit" className="bg-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">Paketit</h2>
          <p className="mt-3 max-w-xl text-white/70">Kattava Pro tai Boost kolmelle aineelle.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {BUNDLES.map((b, i) => (
              <BundleCard key={b.id} bundle={b} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="kurssit" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">Ainekohtaiset kurssit</h2>
          <p className="mt-3 max-w-xl text-navy/70">Kohdenna valmennus juuri heikkoihin aineisiin.</p>
          {SUBJECT_GROUPS.map((group) => (
            <div key={group.id} className="mt-12">
              <h3 className="font-heading text-xl font-bold text-navy">{group.title}</h3>
              <p className="mt-1 text-sm text-navy/60">{group.description}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.courses.map((course) => (
                  <CourseCard key={course.id} course={course} groupTitle={group.title} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-navy-dark py-14 text-center text-white">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Todistus ei riitä vielä?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/75">
            Laske pisteet ilmaisella laskurilla ja palaa parantamaan juuri ne aineet, jotka painavat eniten.
          </p>
          <a
            href="https://paasykoe.fi/todistusvalinta/laskuri?utm_source=laudaturpro&utm_medium=cta"
            className="mt-6 inline-flex rounded-pill bg-gold px-6 py-3 font-heading text-sm font-bold text-navy hover:bg-gold-light"
          >
            Avaa todistusvalintalaskuri
          </a>
        </div>
      </section>

      <section id="faq" className="bg-slate-wash py-16 md:py-20">
        <div className="mx-auto max-w-site px-5 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy">Usein kysyttyä</h2>
          <dl className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
            {FAQ.map((item) => (
              <div key={item.q} className="px-6 py-6">
                <dt className="font-heading text-lg font-bold text-navy">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-navy/75">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <LaudaturFooter />
    </main>
  );
}
