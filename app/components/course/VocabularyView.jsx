"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  VOCAB_SESSION_SIZE,
  pickVocabSession,
  shuffledOptions,
  contextWithBlank,
  isConceptCard,
} from "../../../lib/vocabulary-shared";
import { getVocabulary, getSubjectCardMeta } from "../../../lib/vocabulary-registry";

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

function ThemeBar({ theme: t }) {
  const pct = t.total > 0 ? Math.round((t.learned / t.total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="w-40 shrink-0 truncate text-xs font-semibold text-navy/75">{t.theme}</p>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-mist">
        <div className="h-full rounded-pill bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="w-14 shrink-0 text-right text-xs text-navy/60">
        {t.learned}/{t.total}
      </p>
    </div>
  );
}

function FlashCard({ card, onRate, disabled }) {
  const [flipped, setFlipped] = useState(false);
  const concept = isConceptCard(card);

  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-pill bg-navy/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/55">
          {card.theme}
        </span>
        {card.partOfSpeech && (
          <span className="text-[11px] font-semibold text-navy/40">{card.partOfSpeech}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-5 w-full rounded-xl border border-line bg-mist/40 px-6 py-10 text-center transition hover:border-navy/25"
      >
        {!flipped ? (
          <>
            <p className={`font-heading font-extrabold text-navy ${concept ? "text-2xl" : "text-3xl"}`}>
              {card.word}
            </p>
            <p className="mt-3 text-xs font-semibold text-navy/45">
              {concept ? "Klikkaa nähdäksesi selityksen" : "Klikkaa kääntääksesi"}
            </p>
          </>
        ) : (
          <>
            <p className="font-heading text-xl font-bold text-navy">{card.definitionFi}</p>
            {card.example && (
              <p className="mt-4 text-sm italic leading-relaxed text-navy/75">
                {concept ? card.example : `“${card.example}”`}
              </p>
            )}
            {card.contextFi && (
              <p className="mt-3 text-xs leading-relaxed text-navy/50">{card.contextFi}</p>
            )}
          </>
        )}
      </button>

      {flipped && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRate(true)}
            className="flex-1 rounded-pill bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Osasin ✓
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRate(false)}
            className="flex-1 rounded-pill border border-red-300 bg-red-50 py-3 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            En osannut ✗
          </button>
        </div>
      )}
    </article>
  );
}

function LanguageQuizCard({ card, subjectId, onAnswered, disabled }) {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const options = useMemo(() => shuffledOptions(card), [card]);

  useEffect(() => {
    setChosen(null);
    setRevealed(false);
  }, [card.id]);

  async function pick(originalIndex) {
    if (revealed || disabled) return;
    setChosen(originalIndex);
    setRevealed(true);
    const correct = originalIndex === card.correctIndex;
    try {
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, wordId: card.id, mode: "quiz", correct }),
      });
    } catch {
      /* näytetään palaute silti */
    }
    onAnswered?.(card.id, correct);
  }

  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-pill bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
          Yo-tyyli
        </span>
        <span className="rounded-pill bg-navy/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/55">
          {card.theme}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-navy/90">{contextWithBlank(card.context)}</p>
      {card.contextFi && <p className="mt-2 text-xs text-navy/50">{card.contextFi}</p>}

      <div className="mt-4 grid gap-2">
        {options.map(({ text, originalIndex }) => {
          const isChosen = chosen === originalIndex;
          const isCorrect = originalIndex === card.correctIndex;
          let cls = "border-line bg-white hover:border-navy/40";
          if (revealed) {
            if (isCorrect) cls = "border-emerald-500 bg-emerald-50";
            else if (isChosen) cls = "border-red-400 bg-red-50";
            else cls = "border-line opacity-60";
          }
          return (
            <button
              key={originalIndex}
              type="button"
              disabled={revealed}
              onClick={() => pick(originalIndex)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium text-navy transition ${cls}`}
            >
              {text}
              {revealed && isCorrect && <span className="ml-2 font-bold text-emerald-700">✓</span>}
              {revealed && isChosen && !isCorrect && <span className="ml-2 font-bold text-red-600">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-xl border border-line bg-slate-wash/60 p-4 text-sm text-navy/85">
          <p className="font-bold text-navy">{card.word}</p>
          <p className="mt-1">{card.definitionFi}</p>
          {card.example && <p className="mt-2 italic">“{card.example}”</p>}
        </div>
      )}
    </article>
  );
}

function ConceptQuizCard({ card, subjectId, onAnswered, disabled }) {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const options = useMemo(() => shuffledOptions(card), [card]);

  useEffect(() => {
    setChosen(null);
    setRevealed(false);
  }, [card.id]);

  async function pick(originalIndex) {
    if (revealed || disabled) return;
    setChosen(originalIndex);
    setRevealed(true);
    const correct = originalIndex === card.correctIndex;
    try {
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, wordId: card.id, mode: "quiz", correct }),
      });
    } catch {
      /* ignore */
    }
    onAnswered?.(card.id, correct);
  }

  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-pill bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
          Kertaus
        </span>
        <span className="rounded-pill bg-navy/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy/55">
          {card.theme}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-navy">
        Mikä on oikea määritelmä käsitteelle{" "}
        <span className="font-heading text-lg font-bold">{card.word}</span>?
      </p>

      <div className="mt-4 grid gap-2">
        {options.map(({ text, originalIndex }) => {
          const isChosen = chosen === originalIndex;
          const isCorrect = originalIndex === card.correctIndex;
          let cls = "border-line bg-white hover:border-navy/40";
          if (revealed) {
            if (isCorrect) cls = "border-emerald-500 bg-emerald-50";
            else if (isChosen) cls = "border-red-400 bg-red-50";
            else cls = "border-line opacity-60";
          }
          return (
            <button
              key={originalIndex}
              type="button"
              disabled={revealed}
              onClick={() => pick(originalIndex)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium text-navy transition ${cls}`}
            >
              {text}
              {revealed && isCorrect && <span className="ml-2 font-bold text-emerald-700">✓</span>}
              {revealed && isChosen && !isCorrect && <span className="ml-2 font-bold text-red-600">✗</span>}
            </button>
          );
        })}
      </div>

      {revealed && card.example && (
        <div className="mt-4 rounded-xl border border-line bg-slate-wash/60 p-4 text-sm text-navy/85">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/50">Esimerkki</p>
          <p className="mt-1">{card.example}</p>
        </div>
      )}
    </article>
  );
}

function BetweenCard({ title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary, tertiaryLabel, onTertiary }) {
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
        {tertiaryLabel && onTertiary && (
          <button
            type="button"
            onClick={onTertiary}
            className="rounded-pill border border-violet-300 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-800"
          >
            {tertiaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VocabularyView({ subjectId }) {
  const meta = useMemo(() => getSubjectCardMeta(subjectId), [subjectId]);
  const isConcept = meta.cardType === "concept";

  const [customCards, setCustomCards] = useState([]);
  const vocabulary = useMemo(() => getVocabulary(subjectId, customCards), [subjectId, customCards]);

  const [progress, setProgress] = useState(null);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [phase, setPhase] = useState("cards");
  const [sessionCards, setSessionCards] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [sessionResults, setSessionResults] = useState({});
  const [savedWrongSnapshot, setSavedWrongSnapshot] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  const loadProgress = useCallback(() => {
    fetch(`/api/vocabulary?subjectId=${encodeURIComponent(subjectId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.progress) setProgress(data.progress);
        if (Array.isArray(data?.customCards)) setCustomCards(data.customCards);
      })
      .catch(() => {});
  }, [subjectId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    if (vocabulary.length > 0 && sessionCards.length === 0 && phase === "cards") {
      setSessionCards(pickVocabSession(vocabulary));
    }
  }, [vocabulary, sessionCards.length, phase]);

  const activeCards = phase === "quiz" ? reviewCards : sessionCards;
  const cardIndex = activeCards.findIndex((c) => !sessionResults[c.id]);
  const currentCard = cardIndex >= 0 ? activeCards[cardIndex] : null;
  const sessionDone = activeCards.length > 0 && cardIndex < 0;

  const sessionAnswered = activeCards.filter((c) => sessionResults[c.id]).length;
  const sessionCorrect = activeCards.filter((c) => sessionResults[c.id]?.correct).length;

  const handleCardRate = useCallback(
    async (wordId, correct) => {
      setSessionResults((prev) => ({ ...prev, [wordId]: { correct } }));
      setProgress((prev) => {
        if (!prev) return prev;
        const reviewQueue = correct
          ? prev.reviewQueue.filter((id) => id !== wordId)
          : prev.reviewQueue.includes(wordId)
            ? prev.reviewQueue
            : [...prev.reviewQueue, wordId];
        return { ...prev, reviewQueue };
      });
      try {
        await fetch("/api/vocabulary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId, wordId, mode: "card", correct }),
        });
      } catch {
        /* ignore */
      }
    },
    [subjectId]
  );

  const handleQuizAnswered = useCallback((wordId, correct) => {
    setSessionResults((prev) => ({ ...prev, [wordId]: { correct } }));
    setProgress((prev) => {
      if (!prev) return prev;
      const reviewQueue = correct
        ? prev.reviewQueue.filter((id) => id !== wordId)
        : prev.reviewQueue.includes(wordId)
          ? prev.reviewQueue
          : [...prev.reviewQueue, wordId];
      return { ...prev, reviewQueue };
    });
  }, []);

  useEffect(() => {
    if (!sessionDone) return;
    if (phase === "cards") {
      const wrong = sessionCards.filter((c) => sessionResults[c.id] && !sessionResults[c.id].correct);
      setSavedWrongSnapshot(wrong);
      setPhase("between");
    } else if (phase === "quiz") {
      setPhase("between");
    }
  }, [sessionDone, phase, sessionCards, sessionResults]);

  function startNewSession(cards = vocabulary) {
    const pool = cards.length > 0 ? cards : vocabulary;
    const unseen = pool.filter((c) => !progress?.reviewQueue?.includes(c.id));
    const pickFrom = unseen.length >= VOCAB_SESSION_SIZE ? unseen : pool;
    setSessionCards(pickVocabSession(pickFrom));
    setReviewCards([]);
    setSessionResults({});
    setSavedWrongSnapshot([]);
    setPhase("cards");
    setSessionNumber((n) => n + 1);
  }

  function startQuizReview(cards) {
    setReviewCards(cards);
    setSessionResults({});
    setPhase("quiz");
  }

  async function generateMoreTerms() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/vocabulary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGenerateError(data.error || "generate_failed");
        return;
      }
      const newCards = data.cards || [];
      setCustomCards((prev) => [...prev, ...newCards]);
      loadProgress();
      startNewSession(newCards);
    } catch {
      setGenerateError("generate_failed");
    } finally {
      setGenerating(false);
    }
  }

  const reviewSet = useMemo(() => new Set(progress?.reviewQueue ?? []), [progress]);
  const globalReviewCards = useMemo(
    () => vocabulary.filter((c) => reviewSet.has(c.id)),
    [reviewSet, vocabulary]
  );

  const quizStillWrong = reviewCards.filter((c) => sessionResults[c.id] && !sessionResults[c.id].correct);
  const quizAllCorrect =
    phase === "quiz" && sessionDone && reviewCards.length > 0 && quizStillWrong.length === 0;

  const unit = meta.unit;
  const unitCap = meta.unitPlural;

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-line bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-navy">{meta.heading}</h2>
          <div className="flex flex-wrap gap-2">
            {progress && (
              <>
                <ProgressPill label="Hallussa" value={`${progress.learned}/${progress.total}`} />
                {progress.accuracy != null && (
                  <ProgressPill
                    label="Osumatarkkuus"
                    value={`${Math.round(progress.accuracy * 100)} %`}
                    tone={progress.accuracy >= 0.7 ? "good" : "warn"}
                  />
                )}
              </>
            )}
            {phase !== "between" && activeCards.length > 0 && (
              <ProgressPill
                label={phase === "quiz" ? "Kertaus" : `Setti ${sessionNumber}`}
                value={`${sessionAnswered}/${activeCards.length}`}
                tone="good"
              />
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-navy/65">{meta.intro}</p>
        {progress?.themes?.length > 0 && (
          <div className="mt-4 space-y-2">
            {progress.themes.map((t) => (
              <ThemeBar key={t.theme} theme={t} />
            ))}
          </div>
        )}
      </section>

      {generateError && (
        <div className="rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Käsitteiden generointi epäonnistui. Yritä hetken päästä uudelleen.
        </div>
      )}

      {reviewSet.size > 0 && phase === "cards" && sessionAnswered === 0 && cardIndex === 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Kertausjonossa {reviewSet.size} {unit} aiemmista yrityksistä.
          </p>
          <button
            type="button"
            onClick={() => startQuizReview(globalReviewCards.slice(0, VOCAB_SESSION_SIZE))}
            className="rounded-pill bg-navy px-4 py-2 text-xs font-bold text-gold"
          >
            Kertaa jonossa olevat
          </button>
        </div>
      )}

      {phase === "between" && savedWrongSnapshot.length > 0 && reviewCards.length === 0 && (
        <BetweenCard
          title={`Setti ${sessionNumber} valmis — ${sessionCorrect}/${sessionCards.length} osasin`}
          body={`${savedWrongSnapshot.length} ${unit} meni pieleen. Kertaa ne monivalinnalla, sitten uusi setti.`}
          primaryLabel={`Kertaa (${savedWrongSnapshot.length})`}
          onPrimary={() => startQuizReview(savedWrongSnapshot)}
          secondaryLabel={`Uusi setti (8 ${unit})`}
          onSecondary={() => startNewSession()}
          tertiaryLabel={isConcept ? (generating ? "Generoidaan…" : "AI: uudet käsitteet") : undefined}
          onTertiary={isConcept && !generating ? generateMoreTerms : undefined}
        />
      )}

      {phase === "between" && savedWrongSnapshot.length === 0 && sessionCards.length > 0 && (
        <BetweenCard
          title={`Erinomaista! ${sessionCorrect}/${sessionCards.length} ${unit} hallussa`}
          body={`Kaikki ${unitCap} tässä setissä osattu. Aloita uusi setti${isConcept ? " tai pyydä AI:lta lisää LOPS-mukaisia käsitteitä" : ""}.`}
          primaryLabel={`Uusi setti (8 ${unit})`}
          onPrimary={() => startNewSession()}
          secondaryLabel={isConcept ? (generating ? "Generoidaan…" : "AI: uudet käsitteet (8)") : undefined}
          onSecondary={isConcept && !generating ? generateMoreTerms : undefined}
        />
      )}

      {phase === "between" && quizAllCorrect && (
        <BetweenCard
          title="Kertaus valmis!"
          body={`Kertaus suoritettu. Jatka uudella setillä${isConcept ? " tai generoi uusia käsitteitä" : ""}.`}
          primaryLabel={`Uusi setti (8 ${unit})`}
          onPrimary={() => startNewSession()}
          secondaryLabel={isConcept ? (generating ? "Generoidaan…" : "AI: uudet käsitteet") : undefined}
          onSecondary={isConcept && !generating ? generateMoreTerms : undefined}
        />
      )}

      {phase === "between" && sessionDone && quizStillWrong.length > 0 && reviewCards.length > 0 && (
        <BetweenCard
          title={`${quizStillWrong.length} ${unit} vielä epävarmoja`}
          body={`Yritä uudelleen tai siirry uuteen settiin — epävarmat jäävät kertausjonoon.`}
          primaryLabel={`Jatka kertausta (${quizStillWrong.length})`}
          onPrimary={() => startQuizReview(quizStillWrong)}
          secondaryLabel={`Uusi setti`}
          onSecondary={() => startNewSession()}
        />
      )}

      {(phase === "cards" || phase === "quiz") && currentCard && (
        <>
          {phase === "quiz" && (
            <div className="rounded-card border border-gold/30 bg-gold/5 px-4 py-3 text-sm font-semibold text-navy">
              {isConcept ? "Valitse oikea määritelmä" : "Valitse oikea sana kontekstilauseeseen"} ·{" "}
              {sessionAnswered + 1}/{activeCards.length}
            </div>
          )}
          {phase === "cards" ? (
            <FlashCard
              key={`card-${sessionNumber}-${currentCard.id}`}
              card={currentCard}
              onRate={(correct) => handleCardRate(currentCard.id, correct)}
              disabled={false}
            />
          ) : isConceptCard(currentCard) ? (
            <ConceptQuizCard
              key={`quiz-${sessionNumber}-${currentCard.id}`}
              card={currentCard}
              subjectId={subjectId}
              onAnswered={handleQuizAnswered}
              disabled={false}
            />
          ) : (
            <LanguageQuizCard
              key={`quiz-${sessionNumber}-${currentCard.id}`}
              card={currentCard}
              subjectId={subjectId}
              onAnswered={handleQuizAnswered}
              disabled={false}
            />
          )}
        </>
      )}

      {phase === "cards" && !currentCard && sessionAnswered === 0 && (
        <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
          <p className="font-heading text-lg font-bold text-navy">
            Aloita {isConcept ? "käsite" : "sanasto"}setti
          </p>
          <p className="mt-2 text-sm text-navy/65">
            8 yo-tason {unit} kerrallaan — kortit ja kertaus.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => startNewSession()}
              className="rounded-pill bg-navy px-6 py-3 text-sm font-bold text-gold"
            >
              Aloita setti
            </button>
            {isConcept && (
              <button
                type="button"
                disabled={generating}
                onClick={generateMoreTerms}
                className="rounded-pill border border-violet-300 bg-violet-50 px-6 py-3 text-sm font-bold text-violet-800 disabled:opacity-50"
              >
                {generating ? "Generoidaan…" : "AI: uudet käsitteet"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
