import Link from "next/link";
import { requireSubjectAccess } from "../../../lib/subject-guard";
import { getSubjectContent } from "../../../lib/subject-content";
import { SubjectModules } from "../../components/course/SubjectModules";

export default async function SubjectTheoryPage({ params }) {
  const { professor } = await requireSubjectAccess(params.subjectId);
  const content = getSubjectContent(params.subjectId);

  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-8 md:px-8">
      <p className="text-sm leading-relaxed text-navy/75">{content?.intro || professor.bio}</p>

      {content && <div className="mt-8"><SubjectModules content={content} /></div>}

      {content?.topics && (
        <section className="mt-8">
          <h2 className="font-heading text-lg font-bold text-navy">Keskeiset teemat</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {content.topics.map((topic) => (
              <article key={topic.title} className="rounded-card border border-line bg-white p-5 shadow-card">
                <h3 className="font-heading font-bold text-navy">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">{topic.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {content?.tips && (
        <section className="mt-8 rounded-card border border-gold/30 bg-navy/5 p-6">
          <h2 className="font-heading text-lg font-bold text-navy">Vinkit kokeeseen</h2>
          <ul className="mt-3 space-y-2">
            {content.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-navy/75">
                <span className="text-gold" aria-hidden>
                  ✓
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href={`/kurssi/${params.subjectId}/harjoittele`}
          className="rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Harjoittelu</p>
          <p className="mt-2 font-heading font-bold text-navy">Yo-tehtäviä selittävällä palautteella</p>
          <p className="mt-1 text-sm text-navy/65">Vastaa, näe heti miksi ratkaisu on oikea — väärät siirtyvät kertausjonoon.</p>
          <p className="mt-3 text-sm font-bold text-navy">Aloita harjoittelu →</p>
        </Link>
        <Link
          href={`/kurssi/${params.subjectId}/chat`}
          className="rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">AI-professori</p>
          <p className="mt-2 font-heading font-bold text-navy">Kysy, harjoittele, tarkista vastaukset</p>
          <p className="mt-1 text-sm text-navy/65">Rajaton chat — pyydä uusia yo-tason tehtäviä niin monta kuin tarvitset.</p>
          <p className="mt-3 text-sm font-bold text-navy">Avaa chat →</p>
        </Link>
        <Link
          href={`/kurssi/${params.subjectId}/harkkakoe`}
          className="rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Harkkakoe</p>
          <p className="mt-2 font-heading font-bold text-navy">Koesimulaatio syksyn yo-kokeeseen</p>
          <p className="mt-1 text-sm text-navy/65">Yo-tyyliset tehtävät aikarajoineen — harjoittele koe ennen varsinaista päivää.</p>
          <p className="mt-3 text-sm font-bold text-navy">Avaa harkkakoe →</p>
        </Link>
      </section>
    </main>
  );
}
