import Link from "next/link";
import { requireSubjectAccess } from "../../../../lib/subject-guard";
import { harkkakoeOpensLabel, isHarkkakoeOpen } from "../../../../lib/subject-content";

export default async function HarkkakoePage({ params }) {
  const { professor } = await requireSubjectAccess(params.subjectId);
  const open = isHarkkakoeOpen();
  const opensLabel = harkkakoeOpensLabel();

  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-lg rounded-card border border-line bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 font-heading text-2xl text-navy">
          {open ? "✓" : "⏳"}
        </div>
        <h2 className="mt-5 font-heading text-2xl font-extrabold text-navy">
          {open ? "Harkkakoe" : "Harkkakoe tulossa"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/70">
          {open ? (
            <>
              <strong>{professor.role}</strong> — koesimulaatio on avautumassa. Tarkista sivu pian uudelleen.
            </>
          ) : (
            <>
              <strong>{professor.role}</strong> — ajastettu harkkakoe avautuu <strong>{opensLabel}</strong>, lähempänä syksyn
              2026 yo-koetta. Siihen asti opiskele teoriaa ja käytä AI-professoria.
            </>
          )}
        </p>
        {!open && (
          <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs text-navy/60">
            Harkkakokeessa aikaraja, yo-tyyppiset tehtävät ja pisteytys — kuten oikeassa kokeessa.
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/kurssi/${params.subjectId}/chat`}
            className="inline-flex justify-center rounded-pill bg-navy px-6 py-3 text-sm font-bold text-gold"
          >
            Avaa AI-professori
          </Link>
          <Link
            href={`/kurssi/${params.subjectId}`}
            className="inline-flex justify-center rounded-pill border border-line px-6 py-3 text-sm font-bold text-navy hover:bg-mist"
          >
            Takaisin teoriaan
          </Link>
        </div>
      </div>
    </main>
  );
}
