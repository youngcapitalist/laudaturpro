import { LaudaturNav, LaudaturFooter } from "./components/LaudaturChrome";
import { BundleCard, CourseCard } from "./components/ProductCard";
import { BUNDLES, SUBJECT_GROUPS } from "../lib/products";
import { PROFESSOR_GROUPS } from "../lib/professors";
import { orderUrl } from "./config/site";
import { PLATFORM_FEATURES, PLATFORM_STATS, PLATFORM_STEPS } from "../lib/platform-content";

const FAQ = [
  {
    q: "Kenelle LaudaturPro sopii?",
    a: "Kurssit on suunnattu lukiolaisille ja uusijoille, jotka haluavat parantaa yo-arvosanoja todistusvalintaa tai seuraavaa hakukautta varten.",
  },
  {
    q: "Miten LaudaturPro eroaa tavallisesta harjoittelusta?",
    a: "Et vain tee satunnaisia tehtäviä — AI-professori auttaa tunnistamaan kehityskohteet, kertaat teoriaa osa-alueittain ja harjoittelet harkkakoetta ennen oikeaa yo-päivää.",
  },
  {
    q: "Onko 1000+ harjoitustehtävää oikeasti?",
    a: "Kyllä. Jokaisessa aineessa on useita osa-alueita, ja AI-professori luo uusia yo-tason tehtäviä rajattomasti — monivalintoja, laskuja, esseitä ja kertauskysymyksiä. Et käy samaa kiinteää listaa läpi, vaan pyydät aina uuden tehtävän.",
  },
  {
    q: "Voinko kokeilla ennen ostoa?",
    a: "Kyllä — 3 ilmaista kysymystä AI-professorille per aine osoitteessa /aine/... Tai tee /testi ja saat kurssisuosituksen.",
  },
  {
    q: "Mitä eroa on Laudatur Prolla ja yksittäisillä kursseilla?",
    a: "Laudatur Pro sisältää kaikki aineet yhdellä hinnalla. Boost-paketissa valitset 3 ainetta. Yksittäiset kurssit sopivat, kun haluat kohdentaa valmennuksen tiettyyn heikkouteen.",
  },
  {
    q: "Milloin kurssit alkavat?",
    a: "Pääset opiskelemaan heti tilauksen jälkeen. Sisältö on avoinna syksyn 2026 yo-kokeisiin asti.",
  },
  {
    q: "Auttaako tämä todistusvalinnassa?",
    a: "Kyllä. Korkeammat yo-arvosanat nostavat todistuspisteitä suoraan. Käytä Pääsykoe.fi:n todistusvalintalaskuria nähdäksesi, paljonko parannus vaikuttaa hakukohteisiisi.",
  },
];

export default function HomePage() {
  return (
    <main>
      <LaudaturNav />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-6 py-16 md:px-8 md:py-24">
          <span className="inline-flex rounded-pill bg-navy px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-gold">
            Laudatur Pro · syksy 2026
          </span>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-navy md:text-5xl">
            Kaikki yo-aineet samassa paikassa — nosta arvosanoja ja todistuspisteitä
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/85">
            Yli 1000 harjoitustehtävää kaikissa aineissa — AI-professori luo uusia yo-tason tehtäviä rajattomasti.
            Teoria osa-alueittain, harkkakokeet ja selkeä polku kohti syksyn 2026 yo-koetta.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={orderUrl("laudatur-pro")}
              className="inline-flex rounded-pill bg-navy px-6 py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light"
            >
              Laudatur Pro — 399 €
            </a>
            <a
              href="/aine/matikka-pitka"
              className="inline-flex rounded-pill border-2 border-navy px-6 py-3.5 font-heading text-sm font-bold text-navy hover:bg-mist"
            >
              Kokeile AI-professoria
            </a>
            <a
              href="#kurssit"
              className="inline-flex rounded-pill border-2 border-navy/30 px-6 py-3.5 font-heading text-sm font-bold text-navy/80 hover:bg-mist"
            >
              Selaa aineita
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy/60">
            {PLATFORM_STATS.map((s) => (
              <li key={s.label}>
                {s.value} {s.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line bg-mist py-12">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {PLATFORM_FEATURES.map((f) => (
              <article key={f.title} className="rounded-card border border-line bg-white p-5 shadow-card">
                <h2 className="font-heading text-base font-bold text-navy">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-14 md:py-16">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy">Näin se toimii</h2>
          <p className="mt-3 max-w-2xl text-navy/75">
            Selkeä polku kohti tavoitearvosanaa — aloita kokeilemalla tai testillä jo tänään.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {PLATFORM_STEPS.map((s) => (
              <li key={s.n} className="rounded-card border border-line bg-mist p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-heading text-sm font-bold text-gold">
                  {s.n}
                </span>
                <h3 className="mt-4 font-heading text-sm font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-navy/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="professorit" className="border-b border-line bg-white py-14 md:py-20">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">AI-professori joka aineessa</h2>
          <p className="mt-3 max-w-2xl text-navy/75">
            Kokeile ilmaiseksi — 3 kysymystä per aine. Näet heti millaista yo-valmennus on.
          </p>
          {PROFESSOR_GROUPS.map((group) => (
            <div key={group.id} className="mt-10">
              <h3 className="font-heading text-lg font-bold text-navy">{group.title}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.professors.map((p) => (
                  <a
                    key={p.id}
                    href={`/aine/${p.id}`}
                    className="flex items-center gap-3 rounded-card border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-xs font-bold text-white`}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-navy">{p.role}</p>
                      <p className="text-xs text-gold-dark">3 ilmaista kysymystä →</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="paketit" className="bg-mist py-14 md:py-20">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">Paketit</h2>
          <p className="mt-3 max-w-2xl text-navy/75">
            Valitse kattava Pro-paketti tai Boost kolmelle tärkeimmälle aineelle.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {BUNDLES.map((b, i) => (
              <BundleCard key={b.id} bundle={b} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="kurssit" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">Ainekohtaiset kurssit</h2>
          <p className="mt-3 max-w-2xl text-navy/75">
            Kohdenna valmennus juuri niihin aineisiin, joissa tarvitset eniten nostoa.
          </p>
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

      <section className="border-y border-line bg-navy py-14 text-white md:py-16">
        <div className="mx-auto max-w-site px-6 text-center md:px-8">
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Todistus ei riitä vielä?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
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

      <section id="faq" className="bg-mist py-14 md:py-20">
        <div className="mx-auto max-w-site px-6 md:px-8">
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
