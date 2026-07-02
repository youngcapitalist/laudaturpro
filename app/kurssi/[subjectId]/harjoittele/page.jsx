import { requireSubjectAccess } from "../../../../lib/subject-guard";
import { getPracticeQuestions } from "../../../../lib/practice-questions";
import { PracticeView } from "../../../components/course/PracticeView";
import { nextExamForSubject, formatExamDate, daysUntilExam } from "../../../../lib/yo-exam-dates";

export const metadata = { title: "Harjoittelu" };

export default async function PracticePage({ params }) {
  await requireSubjectAccess(params.subjectId);
  const questions = getPracticeQuestions(params.subjectId);
  const exam = nextExamForSubject(params.subjectId);
  const daysLeft = daysUntilExam(params.subjectId);

  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-navy">Harjoittelu</h1>
          <p className="mt-1 text-sm text-navy/70">
            Vastaa, saat heti selittävän palautteen — väärin menneet siirtyvät kertausjonoon.
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
        {questions.length === 0 ? (
          <p className="rounded-card border border-line bg-white p-6 text-sm text-navy/70 shadow-card">
            Tähän aineeseen ei ole vielä harjoitustehtäviä — AI-professori luo niitä chatissa rajattomasti.
          </p>
        ) : (
          <PracticeView subjectId={params.subjectId} questions={questions} />
        )}
      </div>
    </main>
  );
}
