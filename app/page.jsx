import { LaudaturNav, LaudaturFooter } from "./components/LaudaturChrome";
import { BundleCard, CourseCard } from "./components/ProductCard";
import { BUNDLES, SUBJECT_GROUPS } from "../lib/products";
import { orderUrl } from "./config/site";

const FAQ = [
  {
    q: "Kenelle LaudaturPro sopii?",
    a: "Kurssit on suunnattu lukiolaisille ja uusijoille, jotka haluavat parantaa yo-arvosanoja todistusvalintaa tai seuraavaa hakukautta varten.",
  },
  {
    q: "Mitä eroa on Laudatur Prolla ja yksittäisillä kursseilla?",
    a: "Laudatur Pro sisältää kaikki aineet yhdellä hinnalla. Boost-paketissa valitset 3 ainetta. Yksittäiset kurssit sopivat, kun haluat kohdentaa valmennuksen tiettyyn heikkouteen.",
  },
  {
    q: "Milloin kurssit alkavat?",
    a: "Pääset opiskelemaan heti tilauksen jälkeen. Sisältö on avoinna kevään 2026 yo-kokeisiin asti.",
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
            Yo-valmennus 2026
          </span>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-navy md:text-5xl">
            Kaikki yo-aineet samassa paikassa — nosta arvosanoja ja todistuspisteitä
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/85">
            LaudaturPro on yo-valmennusalusta lukiolaisille. Teoria, harjoitukset ja koesimulaatiot kaikissa
            tärkeimmissä aineissa. Jos todistusvalintalaskuri näyttää, ettei pisteet riitä — tästä aloitat
            korottamisen.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={orderUrl("laudatur-pro")}
              className="inline-flex rounded-pill bg-navy px-6 py-3.5 font-heading text-sm font-bold text-gold hover:bg-navy-light"
            >
              Laudatur Pro — 399 €
            </a>
            <a
              href="#kurssit"
              className="inline-flex rounded-pill border-2 border-navy px-6 py-3.5 font-heading text-sm font-bold text-navy hover:bg-mist"
            >
              Selaa aineita
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy/60">
            <li>30+ yo-ainetta</li>
            <li>Rajaton opettajatuki</li>
            <li>Kevään 2026 kokeisiin</li>
          </ul>
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
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            Laske pisteet ilmaisella todistusvalintalaskurilla ja palaa tänne parantamaan juuri ne aineet, jotka
            painavat eniten.
          </p>
          <a
            href="https://paasykoe.fi/todistusvalinta/laskuri?utm_source=laudaturpro&utm_medium=cta"
            className="mt-6 inline-flex rounded-pill bg-gold px-6 py-3 font-heading text-sm font-bold text-navy hover:opacity-90"
          >
            Avaa todistusvalintalaskuri
          </a>
        </div>
      </section>

      <section id="faq" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-site px-6 md:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-navy">Usein kysyttyä</h2>
          <dl className="mt-8 divide-y divide-line">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="font-heading text-lg font-bold text-navy">{item.q}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-navy/80">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <LaudaturFooter />
    </main>
  );
}
