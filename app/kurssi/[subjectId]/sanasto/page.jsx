import { requireSubjectAccess } from "../../../../lib/subject-guard";
import VocabularyView from "../../../components/course/VocabularyView";
import { notFound } from "next/navigation";
import { nextExamForSubject, formatExamDate, daysUntilExam } from "../../../../lib/yo-exam-dates";
import { subjectHasVocabulary, getSubjectCardMeta } from "../../../../lib/vocabulary-registry";

export const metadata = { title: "Sanasto" };

export default async function VocabularyPage({ params }) {
  if (!subjectHasVocabulary(params.subjectId)) {
    notFound();
  }

  await requireSubjectAccess(params.subjectId);
  const exam = nextExamForSubject(params.subjectId);
  const daysLeft = daysUntilExam(params.subjectId);
  const meta = getSubjectCardMeta(params.subjectId);
  const title = meta.pageTitle;

  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-navy">{title}</h1>
          <p className="mt-1 text-sm text-navy/70">
            {meta.cardType === "concept"
              ? "Termi ja selitys — harjoittele, kertaa pieleen menneet ja pyydä AI:lta lisää LOPS-mukaisia käsitteitä."
              : "Yo-kokeen tyyliset sanakortit — harjoittele, kertaa pieleen menneet ja jatka uudella setillä."}
          </p>
        </div>
        {exam && daysLeft != null && (
          <div className="rounded-card border border-gold/40 bg-navy px-5 py-3 text-center">
            <p className="font-heading text-2xl font-extrabold text-gold">{daysLeft} pv</p>
            <p className="text-xs font-semibold text-white/80">
              {exam.label} {formatExamDate(exam.date)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <VocabularyView subjectId={params.subjectId} />
      </div>
    </main>
  );
}
