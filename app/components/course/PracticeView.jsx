"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** Deterministinen sekoitus tehtävän id:n pohjalta — sama järjestys joka latauksella. */
function shuffledOrder(questionId, length) {
  let seed = 0;
  for (let i = 0; i < questionId.length; i++) seed = (seed * 31 + questionId.charCodeAt(i)) >>> 0;
  const order = [...Array(length).keys()];
  for (let i = length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function ProgressPill({ label, value, tone = "default" }) {
  const tones = {
    default: "bg-mist text-navy/75",
    good: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}: {value}
    </span>
  );
}

function ModuleBar({ module: mod }) {
  const pct = mod.answered > 0 ? Math.round((mod.correct / mod.answered) * 100) : null;
  return (
    <div className="flex items-center gap-3">
      <p className="w-44 shrink-0 truncate text-xs font-semibold text-navy/75">{mod.module}</p>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-mist">
        <div
          className={`h-full rounded-pill transition-all ${pct == null ? "" : pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400"}`}
          style={{ width: `${pct ?? 0}%` }}
        />
      </div>
      <p className="w-16 shrink-0 text-right text-xs text-navy/60">
        {mod.answered === 0 ? "—" : `${mod.correct}/${mod.answered}`}
      </p>
    </div>
  );
}

function QuestionCard({ question, onAnswered, initialState }) {
  const [chosen, setChosen] = useState(initialState?.chosenIndex ?? null);
  const [revealed, setRevealed] = useState(initialState != null);
  const [saving, setSaving] = useState(false);

  const order = useMemo(() => shuffledOrder(question.id, question.options.length), [question]);

  const answer = useCallback(
    async (originalIndex) => {
      if (revealed || saving) return;
      setSaving(true);
      setChosen(originalIndex);
      setRevealed(true);

      try {
        await fetch("/api/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId: question.subject, questionId: question.id, chosenIndex: originalIndex }),
        });
      } catch {
        // Vastaus näytetään silti — tallennus voi epäonnistua hiljaisesti.
      }
      setSaving(false);
      onAnswered?.(question.id, originalIndex === question.correctIndex, originalIndex);
    },
    [question, revealed, saving, onAnswered]
  );

  const isCorrect = chosen === question.correctIndex;

  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{question.module}</p>
      <h3 className="mt-2 font-heading text-lg font-bold text-navy">{question.question}</h3>

      <div className="mt-4 grid gap-2">
        {order.map((originalIndex) => {
          const isChosenOpt = chosen === originalIndex;
          const isCorrectOpt = originalIndex === question.correctIndex;
          let cls = "border-line bg-white hover:border-navy/40";
          if (revealed) {
            if (isCorrectOpt) cls = "border-emerald-500 bg-emerald-50";
            else if (isChosenOpt) cls = "border-red-400 bg-red-50";
            else cls = "border-line bg-white opacity-60";
          }
          return (
            <button
              key={originalIndex}
              type="button"
              disabled={revealed}
              onClick={() => answer(originalIndex)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium text-navy transition ${cls}`}
            >
              {question.options[originalIndex]}
              {revealed && isCorrectOpt && <span className="ml-2 font-bold text-emerald-700">✓</span>}
              {revealed && isChosenOpt && !isCorrectOpt && <span className="ml-2 font-bold text-red-600">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <p className="font-bold">{isCorrect ? "Oikein!" : "Ei aivan — katso selitys:"}</p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}
    </article>
  );
}

export function PracticeView({ subjectId, questions }) {
  const [progress, setProgress] = useState(null);
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState("all");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/practice?subjectId=${encodeURIComponent(subjectId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.progress) setProgress(data.progress);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  const handleAnswered = useCallback((questionId, correct, chosenIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { correct, chosenIndex } }));
    setProgress((prev) => {
      if (!prev) return prev;
      const wasInQueue = prev.reviewQueue.includes(questionId);
      const reviewQueue = correct ? prev.reviewQueue.filter((id) => id !== questionId) : wasInQueue ? prev.reviewQueue : [...prev.reviewQueue, questionId];
      return { ...prev, reviewQueue };
    });
  }, []);

  const reviewSet = useMemo(() => new Set(progress?.reviewQueue ?? []), [progress]);
  const visibleQuestions = mode === "review" ? questions.filter((q) => reviewSet.has(q.id) && !answers[q.id]) : questions;

  const sessionAnswered = Object.keys(answers).length;
  const sessionCorrect = Object.values(answers).filter((a) => a.correct).length;

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-line bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-navy">Edistymisesi</h2>
          <div className="flex flex-wrap gap-2">
            {progress && (
              <>
                <ProgressPill label="Vastattu" value={`${progress.answered}/${progress.total}`} />
                {progress.accuracy != null && (
                  <ProgressPill
                    label="Osumatarkkuus"
                    value={`${Math.round(progress.accuracy * 100)} %`}
                    tone={progress.accuracy >= 0.7 ? "good" : "warn"}
                  />
                )}
              </>
            )}
            {sessionAnswered > 0 && <ProgressPill label="Tämä sessio" value={`${sessionCorrect}/${sessionAnswered}`} tone="good" />}
          </div>
        </div>

        {progress?.modules?.length > 0 && (
          <div className="mt-4 space-y-2">
            {progress.modules.map((m) => (
              <ModuleBar key={m.module} module={m} />
            ))}
          </div>
        )}
      </section>

      {reviewSet.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Kertausjonossa {reviewSet.size} tehtävää — kertaa väärin menneet, kunnes ne sujuvat.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "review" ? "all" : "review");
                setAnswers({});
              }}
              className="rounded-pill bg-navy px-4 py-2 text-xs font-bold text-gold"
            >
              {mode === "review" ? "Näytä kaikki tehtävät" : "Aloita kertaus"}
            </button>
          </div>
        </div>
      )}

      {visibleQuestions.length === 0 ? (
        <div className="rounded-card border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-heading font-bold text-emerald-900">Kertausjono tyhjä — hienoa työtä!</p>
          <button type="button" onClick={() => { setMode("all"); setAnswers({}); }} className="mt-3 rounded-pill bg-navy px-4 py-2 text-xs font-bold text-gold">
            Takaisin kaikkiin tehtäviin
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleQuestions.map((q) => (
            <QuestionCard key={`${mode}-${q.id}`} question={q} onAnswered={handleAnswered} initialState={answers[q.id] ?? null} />
          ))}
        </div>
      )}

      <div className="rounded-card border border-line bg-mist/50 p-5 text-sm text-navy/75">
        Haluatko lisää tehtäviä juuri heikoimmista aiheistasi?{" "}
        <Link href={`/kurssi/${subjectId}/chat`} className="font-bold text-navy underline">
          AI-professori luo rajattomasti uusia harjoituksia →
        </Link>
      </div>
    </div>
  );
}
