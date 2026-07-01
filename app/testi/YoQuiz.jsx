"use client";

import { useMemo, useState } from "react";
import { checkoutUrl } from "../config/site";
import {
  YO_GOALS,
  YO_QUIZ_SUBJECTS,
  quizResult,
  recommendProduct,
} from "../../lib/yo-quiz";

const STEPS = ["subjects", "goal", "focus", "result"];

export default function YoQuiz() {
  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [goal, setGoal] = useState(null);
  const [focusSubject, setFocusSubject] = useState(null);

  const phase = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const recommendation = useMemo(() => {
    if (phase !== "result") return null;
    const rec = recommendProduct(selectedSubjects, focusSubject);
    const product = quizResult(rec.productId);
    const secondary = rec.secondaryId ? quizResult(rec.secondaryId) : null;
    const also = rec.alsoConsider ? quizResult(rec.alsoConsider) : null;
    return { ...rec, product, secondary, also };
  }, [phase, selectedSubjects, focusSubject]);

  function toggleSubject(id) {
    if (id === "unknown") {
      setSelectedSubjects(["unknown"]);
      return;
    }
    setSelectedSubjects((prev) => {
      const without = prev.filter((s) => s !== "unknown");
      if (without.includes(id)) return without.filter((s) => s !== id);
      return [...without, id];
    });
  }

  function continueFromSubjects() {
    if (selectedSubjects.length === 0) return;
    setStep(1);
  }

  function pickGoal(g) {
    setGoal(g);
    const real = selectedSubjects.filter((s) => s !== "unknown");
    if (real.length <= 1) {
      setFocusSubject(real[0] || null);
      setStep(3);
    } else {
      setStep(2);
    }
  }

  function pickFocus(id) {
    setFocusSubject(id);
    setStep(3);
  }

  function restart() {
    setStep(0);
    setSelectedSubjects([]);
    setGoal(null);
    setFocusSubject(null);
  }

  const focusOptions = selectedSubjects.filter((s) => s !== "unknown");

  return (
    <div className="mx-auto max-w-xl">
      {phase !== "result" && (
        <div className="mb-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-navy/50">
            {step + 1} / {STEPS.length}
          </p>
        </div>
      )}

      {phase === "subjects" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <h1 className="font-heading text-2xl font-extrabold text-navy md:text-3xl">
            Mitä aiot kirjoittaa syksyn 2026 yo-kokeissa?
          </h1>
          <p className="mt-3 text-sm text-navy/70">Valitse yksi tai useampi — suositus perustuu valintoihisi.</p>
          <ul className="mt-6 space-y-2">
            {YO_QUIZ_SUBJECTS.map((s) => {
              const on = selectedSubjects.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => toggleSubject(s.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      on ? "border-navy bg-navy text-gold" : "border-line bg-white text-navy hover:border-navy/40"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => toggleSubject("unknown")}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  selectedSubjects.includes("unknown")
                    ? "border-navy bg-navy text-gold"
                    : "border-line text-navy/70 hover:border-navy/40"
                }`}
              >
                En tiedä vielä / useampaa kuin listalla
              </button>
            </li>
          </ul>
          <button
            type="button"
            disabled={selectedSubjects.length === 0}
            onClick={continueFromSubjects}
            className="mt-8 w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Jatka
          </button>
        </div>
      )}

      {phase === "goal" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-extrabold text-navy">Mikä on tärkein tavoitteesi?</h2>
          <p className="mt-3 text-sm text-navy/70">Syksyn 2026 kokeisiin valmistautuessa.</p>
          <ul className="mt-6 space-y-2">
            {YO_GOALS.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => pickGoal(g)}
                  className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-semibold text-navy transition hover:border-navy hover:bg-mist"
                >
                  {g.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "focus" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-extrabold text-navy">Missä aineessa tarvitset eniten apua?</h2>
          <p className="mt-3 text-sm text-navy/70">Aloitetaan siitä, joka painaa eniten.</p>
          <ul className="mt-6 space-y-2">
            {focusOptions.map((id) => {
              const label = YO_QUIZ_SUBJECTS.find((s) => s.id === id)?.label || id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => pickFocus(id)}
                    className="w-full rounded-xl border border-line px-4 py-3 text-left text-sm font-semibold text-navy transition hover:border-navy hover:bg-mist"
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {phase === "result" && recommendation?.product && (
        <div className="rounded-card border border-gold/40 bg-white p-6 shadow-glow md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Suositus syksyn 2026 kokeisiin</p>
          {goal && (
            <p className="mt-2 text-sm text-navy/60">
              Tavoite: <span className="font-semibold text-navy">{goal.label}</span>
            </p>
          )}
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy">{recommendation.product.name}</h2>
          {recommendation.product.tagline && (
            <p className="mt-1 text-sm text-navy/65">{recommendation.product.tagline}</p>
          )}
          <p className="mt-4 font-heading text-4xl font-extrabold text-navy">{recommendation.product.priceEur} €</p>
          <p className="mt-4 text-sm leading-relaxed text-navy/75">{recommendation.reason}</p>

          <a
            href={checkoutUrl(recommendation.productId, { utm_source: "laudaturpro", utm_medium: "quiz" })}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-pill bg-gold px-6 py-3.5 font-heading text-sm font-bold text-navy hover:bg-gold-light"
          >
            Siirry kassalle — {recommendation.product.priceEur} €
          </a>

          {recommendation.also && (
            <p className="mt-6 text-center text-sm text-navy/60">
              Kirjoitat paljon aineita?{" "}
              <a href={checkoutUrl(recommendation.also.productId)} className="font-bold text-navy underline">
                {recommendation.also.name} — {recommendation.also.priceEur} €
              </a>
            </p>
          )}

          {recommendation.secondary && (
            <p className="mt-4 text-center text-sm text-navy/60">
              Myös toinen valintasi:{" "}
              <a href={checkoutUrl(recommendation.secondary.productId)} className="font-bold text-navy underline">
                {recommendation.secondary.name}
              </a>
            </p>
          )}

          <button type="button" onClick={restart} className="mt-6 w-full text-sm font-semibold text-navy/50 hover:text-navy">
            Aloita alusta
          </button>
        </div>
      )}
    </div>
  );
}
