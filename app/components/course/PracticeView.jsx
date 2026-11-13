"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const SESSION_SIZE = 8;

/** Fisher–Yates-sekoitus. */
function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickSessionQuestions(questions) {
  return shuffleArray(questions).slice(0, Math.min(SESSION_SIZE, questions.length));
}

/** Deterministinen sekoitus vaihtoehdoille — sama järjestys joka latauksella. */
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

function SessionCompleteCard({ title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary }) {
  return (
    <div className="rounded-card border border-emerald-200 bg-emerald-50 p-6 text-center">
      <p className="font-heading text-lg font-bold text-emerald-900">{title}</p>
      {body && <p className="mt-2 text-sm leading-relaxed text-emerald-800">{body}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onPrimary} className="rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold">
          {primaryLabel}
        </button>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="rounded-pill border border-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-navy"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function PracticeView({ subjectId, questions }) {
  const [progress, setProgress] = useState(null);
  const [sessionNumber, setSessionNumber] = useState(1);
  /** @type {"practice"|"review"|"between"} */
  const [phase, setPhase] = useState("practice");
  const [sessionQuestions, setSessionQuestions] = useState(() => pickSessionQuestions(questions));
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [sessionAnswers, setSessionAnswers] = useState({});

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
    setSessionAnswers((prev) => ({ ...prev, [questionId]: { correct, chosenIndex } }));
    setProgress((prev) => {
      if (!prev) return prev;
      const wasInQueue = prev.reviewQueue.includes(questionId);
      const reviewQueue = correct
        ? prev.reviewQueue.filter((id) => id !== questionId)
        : wasInQueue
          ? prev.reviewQueue
          : [...prev.reviewQueue, questionId];
      return { ...prev, reviewQueue };
    });
  }, []);

  const activeQuestions = phase === "review" ? reviewQuestions : sessionQuestions;
  const sessionTotal = activeQuestions.length;
  const sessionAnswered = activeQuestions.filter((q) => sessionAnswers[q.id]).length;
  const sessionCorrect = activeQuestions.filter((q) => sessionAnswers[q.id]?.correct).length;
  const sessionComplete = sessionTotal > 0 && sessionAnswered === sessionTotal;

  const practiceWrong = useMemo(
    () => sessionQuestions.filter((q) => sessionAnswers[q.id] && !sessionAnswers[q.id].correct),
    [sessionQuestions, sessionAnswers]
  );

  const reviewStillWrong = useMemo(
    () => reviewQuestions.filter((q) => sessionAnswers[q.id] && !sessionAnswers[q.id].correct),
    [reviewQuestions, sessionAnswers]
  );

  const reviewAllCorrect = phase === "review" && sessionComplete && reviewStillWrong.length === 0;

  useEffect(() => {
    if (!sessionComplete) return;
    if (phase === "practice" || phase === "review") {
      setPhase("between");
    }
  }, [sessionComplete, phase]);

  function startNewSession() {
    setSessionQuestions(pickSessionQuestions(questions));
    setReviewQuestions([]);
    setSessionAnswers({});
    setPhase("practice");
    setSessionNumber((n) => n + 1);
  }

  function startReview(wrongList) {
    setReviewQuestions(wrongList);
    setSessionAnswers({});
    setPhase("review");
  }

  const reviewSet = useMemo(() => new Set(progress?.reviewQueue ?? []), [progress]);
  const showGlobalReviewBanner = reviewSet.size > 0 && phase === "practice" && sessionAnswered === 0;

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
            {phase !== "between" && sessionTotal > 0 && (
              <ProgressPill
                label={phase === "review" ? "Kertaus" : `Setti ${sessionNumber}`}
                value={`${sessionAnswered}/${sessionTotal}`}
                tone="good"
              />
            )}
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

      {showGlobalReviewBanner && (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Kertausjonossa {reviewSet.size} tehtävää aiemmista yrityksistä.
          </p>
          <button
            type="button"
            onClick={() => {
              const toReview = questions.filter((q) => reviewSet.has(q.id));
              startReview(toReview);
            }}
            className="rounded-pill bg-navy px-4 py-2 text-xs font-bold text-gold"
          >
            Kertaa jonossa olevat
          </button>
        </div>
      )}

      {phase === "between" && practiceWrong.length > 0 && sessionComplete && reviewQuestions.length === 0 && (
        <SessionCompleteCard
          title={`Setti ${sessionNumber} valmis — ${sessionCorrect}/${sessionTotal} oikein`}
          body={`${practiceWrong.length} tehtävää meni väärin. Kertaa ne ensin, sitten voit aloittaa uuden setin.`}
          primaryLabel={`Kertaa väärät (${practiceWrong.length})`}
          onPrimary={() => startReview(practiceWrong)}
          secondaryLabel="Ohita kertaus → uusi setti"
          onSecondary={startNewSession}
        />
      )}

      {phase === "between" && reviewAllCorrect && (
        <SessionCompleteCard
          title="Kertaus valmis — hienoa!"
          body="Kaikki väärin menneet on nyt kierretty oikein. Haluatko uuden setin?"
          primaryLabel="Uusi setti (8 tehtävää)"
          onPrimary={startNewSession}
        />
      )}

      {phase === "between" && practiceWrong.length === 0 && reviewQuestions.length === 0 && sessionComplete && (
        <SessionCompleteCard
          title={`Loistavaa! ${sessionCorrect}/${sessionTotal} oikein`}
          body="Kaikki oikein tässä setissä. Aloita uusi setti ja jatka harjoittelua."
          primaryLabel="Uusi setti (8 tehtävää)"
          onPrimary={startNewSession}
        />
      )}

      {phase === "between" && sessionComplete && reviewStillWrong.length > 0 && reviewQuestions.length > 0 && (
        <SessionCompleteCard
          title={`Kertauksessa ${reviewStillWrong.length} vielä väärin`}
          body="Yritä uudelleen tai aloita silti uusi setti — väärät jäävät kertausjonoon."
          primaryLabel={`Jatka kertausta (${reviewStillWrong.length})`}
          onPrimary={() => startReview(reviewStillWrong)}
          secondaryLabel="Uusi setti"
          onSecondary={startNewSession}
        />
      )}

      {(phase === "practice" || phase === "review") && (
        <>
          {phase === "review" && (
            <div className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              Kertaustila — {sessionCorrect}/{sessionAnswered} oikein · {sessionTotal - sessionAnswered} jäljellä
            </div>
          )}

          <div className="space-y-4">
            {activeQuestions.map((q) => (
              <QuestionCard
                key={`${phase}-${sessionNumber}-${q.id}`}
                question={q}
                onAnswered={handleAnswered}
                initialState={sessionAnswers[q.id] ?? null}
              />
            ))}
          </div>
        </>
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
