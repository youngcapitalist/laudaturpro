"use client";

import { useMemo, useState } from "react";
import { checkoutUrl } from "../config/site";
import {
  YO_GOALS,
  YO_QUIZ_SUBJECTS,
  buildPersonalizedOffer,
  quizResult,
} from "../../lib/yo-quiz";
import { LAUDATUR_WTP_QUESTIONS } from "../../lib/wtp";
import { persistOffer } from "../../lib/wtp-persist";

const STEPS = ["subjects", "goal", "focus", "wtp", "result"];

export default function YoQuiz() {
  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [goal, setGoal] = useState(null);
  const [focusSubject, setFocusSubject] = useState(null);
  const [wtpStep, setWtpStep] = useState(0);
  const [wtpAnswers, setWtpAnswers] = useState({});
  const [offer, setOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState(null);

  const phase = STEPS[step];
  const wtpQuestion = LAUDATUR_WTP_QUESTIONS[wtpStep];

  const personalOffer = useMemo(
    () =>
      buildPersonalizedOffer({
        selectedSubjectIds: selectedSubjects,
        focusSubjectId: focusSubject,
        goal,
      }),
    [selectedSubjects, focusSubject, goal]
  );

  const recommendation = useMemo(() => {
    if (phase !== "result" || !personalOffer) return null;
    const product = quizResult(personalOffer.productId);
    const also = personalOffer.alsoConsider ? quizResult(personalOffer.alsoConsider) : null;
    const secondary = personalOffer.secondary?.product
      ? { ...quizResult(personalOffer.secondary.product.id), labels: personalOffer.secondary.labels }
      : null;
    return { ...personalOffer, product, also, secondary, offer };
  }, [phase, personalOffer, offer]);

  const progress =
    phase === "wtp"
      ? ((3 + (wtpStep + 1) / LAUDATUR_WTP_QUESTIONS.length) / STEPS.length) * 100
      : ((step + 1) / STEPS.length) * 100;

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

  async function createOffer(nextAnswers) {
    setOfferLoading(true);
    setOfferError(null);
    try {
      const res = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: personalOffer.productId,
          wtpAnswers: nextAnswers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "offer_failed");
      persistOffer(data);
      setOffer(data);
      setStep(4);
    } catch {
      setOfferError("Tarjouksen luonti epäonnistui. Yritä uudelleen.");
    } finally {
      setOfferLoading(false);
    }
  }

  function answerWtp(opt) {
    if (offerLoading) return;
    const nextAnswers = { ...wtpAnswers, [wtpQuestion.id]: opt.points };
    setWtpAnswers(nextAnswers);
    if (wtpStep + 1 >= LAUDATUR_WTP_QUESTIONS.length) {
      void createOffer(nextAnswers);
    } else {
      setWtpStep((s) => s + 1);
    }
  }

  function restart() {
    setStep(0);
    setSelectedSubjects([]);
    setGoal(null);
    setFocusSubject(null);
    setWtpStep(0);
    setWtpAnswers({});
    setOffer(null);
    setOfferError(null);
  }

  const focusOptions = selectedSubjects.filter((s) => s !== "unknown");
  const displayPrice = offer?.priceEur ?? recommendation?.product?.priceEur;
  const listPrice = offer?.listPriceEur ?? recommendation?.product?.priceEur;
  const compareAt = recommendation?.compareAtEur;
  const showOfferDiscount = displayPrice != null && listPrice != null && displayPrice < listPrice;
  const showCompareAt = compareAt != null && compareAt > (displayPrice ?? 0);

  return (
    <div className="mx-auto max-w-xl">
      {phase !== "result" && (
        <div className="mb-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-navy/50">
            {phase === "wtp"
              ? `Henkilökohtainen tarjous · ${wtpStep + 1} / ${LAUDATUR_WTP_QUESTIONS.length}`
              : `${step + 1} / ${STEPS.length}`}
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

      {phase === "wtp" && wtpQuestion && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <span className="inline-flex rounded-pill bg-gold/15 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-navy ring-1 ring-gold/40">
            Henkilökohtainen tarjous
          </span>
          <h2 className="mt-6 font-heading text-xl font-extrabold leading-snug text-navy md:text-2xl">
            {wtpQuestion.q}
          </h2>
          <p className="mt-2 text-sm text-navy/60">
            Vastaustesi perusteella räätälöimme hinnan — kuinka tärkeää unelmiesi opiskelupaikka on sinulle.
          </p>

          {offerError && <p className="mt-4 text-sm font-semibold text-red-600">{offerError}</p>}

          <div className="mt-6 space-y-3">
            {wtpQuestion.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => answerWtp(opt)}
                disabled={offerLoading}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 text-left transition hover:border-navy hover:bg-mist disabled:opacity-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-navy">{opt.label}</span>
                  {opt.hint && (
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-navy/65">{opt.hint}</span>
                  )}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mist text-navy/40 transition-colors group-hover:bg-navy group-hover:text-gold">
                  →
                </span>
              </button>
            ))}
          </div>

          {offerLoading && (
            <p className="mt-6 text-center text-sm font-semibold text-navy/60">Lasketaan sinulle sopivaa hintaa…</p>
          )}
        </div>
      )}

      {phase === "result" && recommendation?.product && (
        <div className="rounded-card border border-gold/40 bg-white p-6 shadow-glow md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-pill bg-navy px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-gold">
              Vain sinulle
            </span>
            <span className="text-xs font-semibold text-navy/45">Räätälöity {new Date().toLocaleDateString("fi-FI")}</span>
          </div>

          <h2 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-navy md:text-3xl">
            {recommendation.personalTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/75">{recommendation.headline}</p>

          {recommendation.consistencyLine && (
            <p className="mt-4 rounded-xl border border-line bg-mist px-4 py-3 text-sm text-navy/80">
              {recommendation.consistencyLine}
            </p>
          )}

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Pakettiin kuuluu juuri sinun valintasi</p>
            <ul className="mt-3 space-y-2">
              {recommendation.components.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3"
                >
                  <span className="mt-0.5 text-gold" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{item.label}</span>
                    <span className="text-xs text-navy/55">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-xl border border-gold/30 bg-navy/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Henkilökohtainen hinta</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <p className="font-heading text-4xl font-extrabold text-navy">{displayPrice} €</p>
              {showOfferDiscount && (
                <p className="text-lg font-semibold text-navy/40 line-through">{listPrice} €</p>
              )}
              {showCompareAt && compareAt !== listPrice && (
                <p className="text-sm font-semibold text-navy/45 line-through">{compareAt} € erikseen</p>
              )}
            </div>
            {offer && (
              <p className="mt-2 text-sm font-semibold text-gold-dark">
                Hintasi perustuu vastauksiisi — ei yleinen listahinta.
              </p>
            )}
            {recommendation.savingsVsIndividual != null && recommendation.savingsVsIndividual > 0 && (
              <p className="mt-2 text-sm font-semibold text-navy">
                Säästät {recommendation.savingsVsIndividual} € verrattuna erillisiin kursseihin.
              </p>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-navy/75">{recommendation.reason}</p>

          <a
            href={
              offer?.checkoutUrl ||
              checkoutUrl(recommendation.productId, { utm_source: "laudaturpro", utm_medium: "quiz" })
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-gold px-6 py-3.5 font-heading text-sm font-bold text-navy hover:bg-gold-light"
          >
            Lunasta tarjouksesi — {displayPrice} €
          </a>
          <p className="mt-2 text-center text-xs text-navy/45">
            Tarjous sidottu valintoihisi — voimassa 7 päivää.
          </p>

          {recommendation.also && (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-mist/50 p-4 text-center">
              <p className="text-sm text-navy/65">
                Kirjoitat enemmän aineita?{" "}
                <a href={checkoutUrl(recommendation.also.productId)} className="font-bold text-navy underline">
                  {recommendation.also.name}
                </a>{" "}
                kattaa laajemmin — {recommendation.also.priceEur} €
              </p>
            </div>
          )}

          {recommendation.secondary && (
            <div className="mt-4 rounded-xl border border-dashed border-line bg-mist/50 p-4 text-center">
              <p className="text-sm text-navy/65">
                Toinen valintasi ({recommendation.secondary.labels?.join(", ")}):{" "}
                <a
                  href={checkoutUrl(recommendation.secondary.productId)}
                  className="font-bold text-navy underline"
                >
                  {recommendation.secondary.name}
                </a>
              </p>
            </div>
          )}

          <button type="button" onClick={restart} className="mt-6 w-full text-sm font-semibold text-navy/50 hover:text-navy">
            Aloita alusta
          </button>
        </div>
      )}
    </div>
  );
}
