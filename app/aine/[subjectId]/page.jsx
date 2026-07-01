import { notFound } from "next/navigation";
import Link from "next/link";
import { LaudaturNav, LaudaturFooter } from "../../components/LaudaturChrome";
import ProfessorChat from "../../components/course/ProfessorChat";
import { getProfessorById } from "../../../lib/access";
import { getSubjectContent } from "../../../lib/subject-content";
import { checkoutUrl } from "../../config/site";
import { PROFESSOR_GROUPS } from "../../../lib/professors";
import { SubjectModules, SubjectIncludes } from "../../components/course/SubjectModules";

export function generateStaticParams() {
  return PROFESSOR_GROUPS.flatMap((g) => g.professors.map((p) => ({ subjectId: p.id })));
}

export async function generateMetadata({ params }) {
  const professor = getProfessorById(params.subjectId);
  if (!professor) return {};
  return {
    title: `${professor.role} — Kokeile AI-professoria | LaudaturPro`,
    description: `Kokeile ${professor.role} AI-professoria ilmaiseksi. 3 kysymystä — näe millaista yo-valmennus on.`,
  };
}

export default function AinePreviewPage({ params }) {
  const professor = getProfessorById(params.subjectId);
  if (!professor) notFound();

  const content = getSubjectContent(params.subjectId);

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-site px-5 py-10 md:px-8">
          <Link href="/#kurssit" className="text-xs font-semibold text-navy-muted hover:text-navy">
            ← Kaikki aineet
          </Link>
          <div className="mt-4 flex flex-wrap items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${professor.accent} font-heading text-lg font-bold text-white shadow-md`}
            >
              {professor.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">AI-professori</p>
              <h1 className="font-heading text-3xl font-extrabold text-navy md:text-4xl">{professor.role}</h1>
              <p className="mt-2 max-w-2xl text-navy/75">{content?.intro || professor.bio}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={checkoutUrl(params.subjectId)}
              className="inline-flex rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold"
            >
              Tilaa kurssi
            </a>
            <Link
              href={`/kirjaudu?next=${encodeURIComponent(`/kurssi/${params.subjectId}`)}`}
              className="inline-flex rounded-pill border border-line px-5 py-2.5 text-sm font-bold text-navy hover:bg-mist"
            >
              Kirjaudu
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-site px-5 py-10 md:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy">Kokeile ilmaiseksi</h2>
            <p className="mt-2 text-sm text-navy/70">
              3 kysymystä AI-professorille — näet heti millaista tuki on.
            </p>
            <div className="mt-4 overflow-hidden rounded-card border border-line bg-white shadow-card">
              <ProfessorChat professor={professor} preview embedded />
            </div>
          </div>
          <div>
            {content && (
              <div className="space-y-8">
                <SubjectModules content={content} />
                {content.topics && (
                  <>
                    <h2 className="font-heading text-xl font-bold text-navy">Keskeiset teemat</h2>
                    <ul className="space-y-3">
                      {content.topics.map((t) => (
                        <li key={t.title} className="rounded-xl border border-line bg-white p-4">
                          <p className="font-semibold text-navy">{t.title}</p>
                          <p className="mt-1 text-sm text-navy/65">{t.body}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <SubjectIncludes />
              </div>
            )}
          </div>
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
