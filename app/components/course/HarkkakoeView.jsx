"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { EXAM_TYPE_LABELS } from "../../../lib/exam-content";
import { estimateGrade, GRADE_ESTIMATE_DISCLAIMER } from "../../../lib/yo-grades";

const NEEDS_TEACHER_REVIEW = new Set(["lukutaito", "kirjoitustaito", "esseevastaus"]);

function SubmissionStatus({ submission }) {
  if (!submission) return null;

  if (submission.status === "pending") {
    return (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-bold">Odottaa opettajan tarkastusta</p>
        <p className="mt-1 text-amber-900/80">
          Lähetetty {new Date(submission.createdAt).toLocaleString("fi-FI")}. Näet pisteet ja kommentin tällä sivulla, kun arvio on valmis.
        </p>
      </div>
    );
  }

  const estimate = estimateGrade(submission.score, submission.maxPoints);

  return (
    <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-navy">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-heading text-lg font-extrabold text-navy">
          Arvio: {submission.score} / {submission.maxPoints} pistettä
        </p>
        {estimate && (
          <span className="rounded-pill bg-navy px-3 py-1 font-heading text-sm font-extrabold text-gold" title={estimate.label}>
            ≈ {estimate.grade}
          </span>
        )}
      </div>
      {estimate?.nextGrade && estimate.pointsToNext > 0 && (
        <p className="mt-1 text-xs font-semibold text-navy/60">
          {estimate.pointsToNext} pistettä arvosanaan {estimate.nextGrade}. {GRADE_ESTIMATE_DISCLAIMER}
        </p>
      )}
      {submission.adminComment && (
        <p className="mt-2 whitespace-pre-wrap leading-relaxed text-navy/85">{submission.adminComment}</p>
      )}
      <p className="mt-2 text-xs text-navy/45">
        Arvioitu {new Date(submission.reviewedAt).toLocaleString("fi-FI")}
      </p>
    </div>
  );
}

function TaskSubmissionForm({ task, subjectId, submission, onSubmitted }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const needsReview = NEEDS_TEACHER_REVIEW.has(task.type);

  async function submit(e) {
    e.preventDefault();
    if (answer.trim().length < 50) {
      setError("Vastaus on liian lyhyt — kirjoita vähintään muutama virke.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exam-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, taskId: task.id, answerText: answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "failed");
      onSubmitted(data.submission);
      setAnswer("");
    } catch {
      setError("Lähetys epäonnistui. Yritä uudelleen.");
    } finally {
      setLoading(false);
    }
  }

  if (submission) {
    return (
      <div className="mt-6 border-t border-line pt-5">
        <SubmissionStatus submission={submission} />
        <p className="mt-3 text-xs text-navy/45">
          Voit lähettää uuden version myöhemmin — jokainen lähetys tulee arvioitavaksi erikseen.
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-navy/60 hover:text-navy">
            Lähetä uusi vastaus
          </summary>
          <form onSubmit={submit} className="mt-3 space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={10}
              placeholder="Kirjoita vastauksesi tähän…"
              className="w-full rounded-xl border border-line px-4 py-3 text-sm leading-relaxed focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold disabled:opacity-50"
            >
              {loading ? "Lähetetään…" : "Lähetä uudelleen arvioitavaksi"}
            </button>
          </form>
        </details>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 border-t border-line pt-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Lähetä vastaus</p>
      <p className="mt-2 text-sm text-navy/70">
        {needsReview
          ? "Kirjoita vastauksesi alle ja lähetä opettajan arvioitavaksi. Saat pisteet ja kirjallisen palautteen."
          : "Lähetä vastauksesi — voit myös harjoitella ensin AI-professorin kanssa."}
      </p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={12}
        placeholder="Kirjoita vastauksesi tähän…"
        className="mt-3 w-full rounded-xl border border-line px-4 py-3 text-sm leading-relaxed focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-pill bg-gold px-6 py-2.5 text-sm font-bold text-navy hover:bg-gold-light disabled:opacity-50"
        >
          {loading ? "Lähetetään…" : needsReview ? "Lähetä opettajalle arvioitavaksi" : "Lähetä vastaus"}
        </button>
        <Link href={`/kurssi/${subjectId}/chat`} className="text-sm font-semibold text-navy/55 underline hover:text-navy">
          Harjoittele ensin AI:n kanssa
        </Link>
      </div>
    </form>
  );
}

function TaskCard({ task, subjectId, expanded, onToggle, submission, onSubmitted }) {
  const typeLabel = EXAM_TYPE_LABELS[task.type] ?? task.type;
  const hasPending = submission?.status === "pending";
  const hasReviewed = submission?.status === "reviewed";

  return (
    <article className="rounded-xl border border-line bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-wash/80"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-navy/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/60">
              {typeLabel}
            </span>
            {task.timeMinutes && (
              <span className="text-[11px] font-semibold text-navy/45">{task.timeMinutes} min</span>
            )}
            <span className="text-[11px] font-semibold text-gold-dark">{task.maxPoints} p</span>
            {hasPending && (
              <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                Odottaa arviota
              </span>
            )}
            {hasReviewed && (
              <span className="rounded-pill bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-navy">
                {submission.score}/{submission.maxPoints} p
              </span>
            )}
          </div>
          <h3 className="mt-2 font-heading text-base font-bold leading-snug text-navy">{task.title}</h3>
        </div>
        <span className="mt-1 shrink-0 text-lg text-navy/30" aria-hidden>
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-line px-5 py-5">
          {task.sourceMaterial && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Aineisto</p>
              <div className="mt-3 whitespace-pre-wrap rounded-xl border border-line bg-slate-wash/60 p-4 text-sm leading-relaxed text-navy/85">
                {task.sourceMaterial}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Tehtävänanto</p>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/90">{task.assignment}</div>
          </div>
          <TaskSubmissionForm
            task={task}
            subjectId={subjectId}
            submission={submission}
            onSubmitted={onSubmitted}
          />
        </div>
      )}
    </article>
  );
}

export default function HarkkakoeView({ subjectId, professorRole, tasks }) {
  const [openId, setOpenId] = useState(tasks[0]?.id ?? null);
  const [submissionsByTask, setSubmissionsByTask] = useState({});

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/exam-submissions?subjectId=${encodeURIComponent(subjectId)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      const map = {};
      for (const s of data.submissions || []) {
        if (!map[s.taskId] || new Date(s.createdAt) > new Date(map[s.taskId].createdAt)) {
          map[s.taskId] = s;
        }
      }
      setSubmissionsByTask(map);
    } catch {
      /* ignore */
    }
  }, [subjectId]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const totalPoints = tasks.reduce((sum, t) => sum + t.maxPoints, 0);
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.timeMinutes ?? 0), 0);

  if (tasks.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-card border border-line bg-white p-8 text-center shadow-card">
        <h2 className="font-heading text-2xl font-extrabold text-navy">Harkkakoe tulossa</h2>
        <p className="mt-3 text-sm text-navy/70">
          {professorRole} — koesimulaatio valmistellaan. Käytä sillä välin AI-professoria.
        </p>
        <Link
          href={`/kurssi/${subjectId}/chat`}
          className="mt-6 inline-flex rounded-pill bg-navy px-6 py-3 text-sm font-bold text-gold"
        >
          Avaa AI-professori
        </Link>
      </div>
    );
  }

  function handleSubmitted(taskId, submission) {
    setSubmissionsByTask((prev) => ({ ...prev, [taskId]: submission }));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-card border border-gold/30 bg-white p-6 shadow-card md:p-8">
        <span className="inline-flex rounded-pill bg-gold/15 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy">
          Yo-koesimulaatio
        </span>
        <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy md:text-3xl">Harkkakoe — {professorRole}</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/75">
          Tee tehtävä, lähetä vastaus ja saat opettajan arvion pisteineen ja kommentteineen. Äidinkielen esseet ja
          analyysit arvioidaan henkilökohtaisesti — laskutehtävät samoin tarvittaessa.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-navy/70">
          <span>{tasks.length} tehtävää</span>
          {totalMinutes > 0 && <span>~{totalMinutes} min yhteensä</span>}
          <span>{totalPoints} pistettä</span>
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              subjectId={subjectId}
              expanded={openId === task.id}
              onToggle={() => setOpenId((id) => (id === task.id ? null : task.id))}
              submission={submissionsByTask[task.id]}
              onSubmitted={(s) => handleSubmitted(task.id, s)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
