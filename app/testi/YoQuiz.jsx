"use client";

import { useCallback, useMemo, useState } from "react";
import { checkoutUrl } from "../config/site";
import {
  YO_GOALS,
  YO_QUIZ_SUBJECTS,
  buildPersonalizedOffer,
  quizResult,
} from "../../lib/yo-quiz";
import { YO_CHECKUP_STEPS } from "../../lib/yo-checkup";
import { LAUDATUR_WTP_QUESTIONS } from "../../lib/wtp";
import { persistOffer } from "../../lib/wtp-persist";

const STEPS = [
  "subjects",
  "checkup_timeline",
  "checkup_hours",
  "checkup_feeling",
  "checkup_blocker",
  "goal",
  "focus",
  "wtp",
  "email",
  "result",
];

const CHECKUP_STEP_MAP = {
  checkup_timeline: 0,
  checkup_hours: 1,
  checkup_feeling: 2,
  checkup_blocker: 3,
};

export default function YoQuiz() {
  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [checkupAnswers, setCheckupAnswers] = useState({});
  const [goal, setGoal] = useState(null);
  const [focusSubject, setFocusSubject] = useState(null);
  const [wtpStep, setWtpStep] = useState(0);
  const [wtpAnswers, setWtpAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState(null);
  const [bundleSubjectIds, setBundleSubjectIds] = useState(null);

  const phase = STEPS[step];
  const wtpQuestion = LAUDATUR_WTP_QUESTIONS[wtpStep];
  const checkupIndex = CHECKUP_STEP_MAP[phase];
  const checkupStep = checkupIndex != null ? YO_CHECKUP_STEPS[checkupIndex] : null;

  const personalOffer = useMemo(
    () =>
      buildPersonalizedOffer({
        selectedSubjectIds: selectedSubjects,
        focusSubjectId: focusSubject,
        goal,
        bundleSubjectIds,
        checkupAnswers,
      }),
    [selectedSubjects, focusSubject, goal, bundleSubjectIds, checkupAnswers]
  );

  const recommendation = useMemo(() => {
    if (phase !== "result" || !personalOffer) return null;
    const product = quizResult(personalOffer.productId);
    const also = personalOffer.alsoConsider ? quizResult(personalOffer.alsoConsider) : null;
    return { ...personalOffer, product, also, offer };
  }, [phase, personalOffer, offer]);

  const progress =
    phase === "wtp"
      ? ((7 + (wtpStep + 1) / LAUDATUR_WTP_QUESTIONS.length) / STEPS.length) * 100
      : phase === "email"
        ? ((STEPS.length - 1) / STEPS.length) * 100
        : ((step + 1) / STEPS.length) * 100;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const focusOptions = selectedSubjects.filter((s) => s !== "unknown");
  const displayPrice = offer?.priceEur ?? recommendation?.product?.priceEur;
  const listPrice = offer?.listPriceEur ?? recommendation?.product?.priceEur;
  const compareAt = recommendation?.compareAtEur;
  const showOfferDiscount = displayPrice != null && listPrice != null && displayPrice < listPrice;
  const showCompareAt = compareAt != null && compareAt > (displayPrice ?? 0);

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

  function answerCheckup(optionId) {
    if (!checkupStep) return;
    const nextAnswers = { ...checkupAnswers, [checkupStep.id]: optionId };
    setCheckupAnswers(nextAnswers);
    setStep((s) => s + 1);
  }

  function pickGoal(g) {
    setGoal(g);
    const real = selectedSubjects.filter((s) => s !== "unknown");
    if (real.length <= 1) {
      setFocusSubject(real[0] || null);
      setStep(7);
    } else {
      setStep(6);
    }
  }

  function pickFocus(id) {
    setFocusSubject(id);
    setStep(7);
  }

  const fetchOffer = useCallback(
    async (productId, subjectsForBundle = null) => {
      const res = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          wtpAnswers,
          subjectIds: subjectsForBundle,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "offer_failed");
      persistOffer(data);
      setOffer(data);
      return data;
    },
    [wtpAnswers]
  );

  async function finalizeWithEmail(e) {
    e?.preventDefault?.();
    if (!emailValid || offerLoading || !personalOffer) return;
    setOfferLoading(true);
    setOfferError(null);
    try {
      const activeSubjects =
        bundleSubjectIds ?? personalOffer.coveredIds ?? selectedSubjects.filter((s) => s !== "unknown");
      const offerData = await fetchOffer(personalOffer.productId, activeSubjects);

      const leadRes = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          productId: offerData.productId,
          productName: offerData.productName,
          personalTitle: personalOffer.personalTitle,
          priceEur: offerData.priceEur,
          listPriceEur: offerData.listPriceEur,
          wtpScore: offerData.wtpScore,
          checkoutUrl: offerData.checkoutUrl,
          selectedLabels: personalOffer.selectedLabels,
          goalLabel: personalOffer.goalLabel,
        }),
      });
      if (!leadRes.ok) throw new Error("lead_failed");

      setStep(9);
    } catch {
      setOfferError("Lähetys ei onnistunut. Tarkista sähköposti ja yritä uudelleen.");
    } finally {
      setOfferLoading(false);
    }
  }

  async function removeFromBundle(subjectId) {
    if (!personalOffer?.canCustomizeBundle || offerLoading) return;
    const current =
      bundleSubjectIds ??
      personalOffer.coveredIds ??
      selectedSubjects.filter((s) => s !== "unknown");
    const next = current.filter((id) => id !== subjectId);
    if (next.length === 0) return;

    setBundleSubjectIds(next);
    setOfferLoading(true);
    setOfferError(null);

    try {
      const nextOffer = buildPersonalizedOffer({
        selectedSubjectIds: selectedSubjects,
        focusSubjectId: focusSubject,
        goal,
        bundleSubjectIds: next,
        checkupAnswers,
      });
      if (!nextOffer) return;
      await fetchOffer(nextOffer.productId, next);
    } catch {
      setOfferError("Paketin päivitys ei onnistunut. Yritä uudelleen.");
      setBundleSubjectIds(current);
    } finally {
      setOfferLoading(false);
    }
  }

  function answerWtp(opt) {
    if (offerLoading) return;
    const nextAnswers = { ...wtpAnswers, [wtpQuestion.id]: opt.points };
    setWtpAnswers(nextAnswers);
    if (wtpStep + 1 >= LAUDATUR_WTP_QUESTIONS.length) {
      setStep(8);
    } else {
      setWtpStep((s) => s + 1);
    }
  }

  function restart() {
    setStep(0);
    setSelectedSubjects([]);
    setCheckupAnswers({});
    setGoal(null);
    setFocusSubject(null);
    setWtpStep(0);
    setWtpAnswers({});
    setEmail("");
    setOffer(null);
    setOfferError(null);
    setBundleSubjectIds(null);
  }

  return (
    <div className="mx-auto max-w-xl">
      {phase !== "result" && (
        <div className="mb-8">
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-navy/50">
            {phase.startsWith("checkup_")
              ? `Yo-tarkastus · ${checkupIndex + 1} / ${YO_CHECKUP_STEPS.length}`
              : phase === "wtp"
                ? `Tarkastus · ${wtpStep + 1} / ${LAUDATUR_WTP_QUESTIONS.length}`
                : `${step + 1} / ${STEPS.length}`}
          </p>
        </div>
      )}

      {phase === "subjects" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <span className="inline-flex rounded-pill bg-navy/5 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy/60">
            Yo-tarkastus · aloitus
          </span>
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-navy md:text-3xl">
            Mitä aiot kirjoittaa syksyn 2026 yo-kokeissa?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-navy/70">
            Aloitamme kartoittamalla aineet. Tämä on ilmainen tarkastus, ei myyntipuhelu — saat
            henkilökohtaisen suunnitelman vastaustesi perusteella.
          </p>
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
            Jatka tarkastusta
          </button>
        </div>
      )}

      {checkupStep && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <span className="inline-flex rounded-pill bg-navy/5 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy/60">
            {checkupStep.badge}
          </span>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy">{checkupStep.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/70">{checkupStep.subtitle}</p>
          <ul className="mt-6 space-y-2">
            {checkupStep.options.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => answerCheckup(opt.id)}
                  className="w-full rounded-xl border border-line px-4 py-3 text-left transition hover:border-navy hover:bg-mist"
                >
                  <span className="block text-sm font-semibold text-navy">{opt.label}</span>
                  {opt.hint && (
                    <span className="mt-1 block text-xs leading-relaxed text-navy/60">{opt.hint}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "goal" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <span className="inline-flex rounded-pill bg-navy/5 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy/60">
            Tavoite
          </span>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy">Mikä on tärkein tavoitteesi?</h2>
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
          <span className="inline-flex rounded-pill bg-navy/5 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy/60">
            Painopiste
          </span>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy">
            Missä aineessa tarvitset eniten apua?
          </h2>
          <p className="mt-3 text-sm text-navy/70">
            Tämä auttaa järjestämään suunnitelman — yhteispaketti kattaa silti kaikki valitsemasi aineet.
          </p>
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
          <span className="inline-flex rounded-pill bg-navy/5 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy/60">
            Tarkastus · viimeiset kysymykset
          </span>
          <h2 className="mt-4 font-heading text-xl font-extrabold leading-snug text-navy md:text-2xl">
            {wtpQuestion.q}
          </h2>
          <p className="mt-2 text-sm text-navy/60">
            Vastauksia käytetään vain suunnitelman ja hinnan räätälöintiin — ei markkinointiin.
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
        </div>
      )}

      {phase === "email" && (
        <div className="rounded-card border border-line bg-white p-6 shadow-card md:p-8">
          <span className="inline-flex rounded-pill bg-gold/15 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-navy ring-1 ring-gold/40">
            Tarkastus valmis
          </span>
          <h2 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-navy md:text-3xl">
            Henkilökohtainen yo-suunnitelmasi on valmis
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/75">
            Kirjoita sähköpostisi, niin näet suunnitelman ja hinnan heti. Lähetämme kopion myös postiisi.
          </p>
          {offerError && <p className="mt-4 text-sm font-semibold text-red-600">{offerError}</p>}
          <form onSubmit={finalizeWithEmail} className="mt-6 space-y-4">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="sähköposti@example.com"
              className="w-full rounded-xl border border-line px-4 py-3.5 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="submit"
              disabled={!emailValid || offerLoading}
              className="w-full rounded-pill bg-navy py-3.5 font-heading text-sm font-bold text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {offerLoading ? "Laaditaan suunnitelmaa…" : "Näytä minun suunnitelmani"}
            </button>
          </form>
        </div>
      )}

      {phase === "result" && recommendation?.product && (
        <div className="rounded-card border border-gold/40 bg-white p-6 shadow-glow md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-pill bg-navy px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-gold">
              Henkilökohtainen suunnitelma
            </span>
            <span className="text-xs font-semibold text-navy/45">
              Tarkastus {new Date().toLocaleDateString("fi-FI")}
            </span>
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

          {recommendation.checkupLine && (
            <p className="mt-3 rounded-xl border border-line bg-white px-4 py-3 text-xs text-navy/65">
              {recommendation.checkupLine}
            </p>
          )}

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              {recommendation.canCustomizeBundle
                ? "Yhteispaketti — voit poistaa aineita"
                : "Suunnitelmaan kuuluu"}
            </p>
            <ul className="mt-3 space-y-2">
              {recommendation.components.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3"
                >
                  <span className="mt-0.5 text-gold" aria-hidden>
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">{item.label}</span>
                    <span className="text-xs text-navy/55">{item.detail}</span>
                  </span>
                  {item.removable && (
                    <button
                      type="button"
                      onClick={() => removeFromBundle(item.id)}
                      disabled={offerLoading}
                      className="shrink-0 text-xs font-semibold text-navy/45 underline hover:text-navy disabled:opacity-40"
                    >
                      Poista
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {recommendation.canCustomizeBundle && (
              <p className="mt-2 text-xs text-navy/50">
                Voit jättää pois aineen, jos et tarvitse sitä. Hinta päivittyy automaattisesti.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-xl border border-gold/30 bg-navy/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Henkilökohtainen hinta</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <p className="font-heading text-4xl font-extrabold text-navy">
                {offerLoading ? "…" : displayPrice} €
              </p>
              {!offerLoading && showOfferDiscount && (
                <p className="text-lg font-semibold text-navy/40 line-through">{listPrice} €</p>
              )}
              {!offerLoading && showCompareAt && compareAt !== listPrice && (
                <p className="text-sm font-semibold text-navy/45 line-through">{compareAt} € erikseen</p>
              )}
            </div>
            {offer && (
              <p className="mt-2 text-sm font-semibold text-gold-dark">
                Hinta perustuu tarkastukseen — ei yleinen listahinta.
              </p>
            )}
            {!offerLoading && recommendation.savingsVsIndividual != null && recommendation.savingsVsIndividual > 0 && (
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
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-gold px-6 py-3.5 font-heading text-sm font-bold text-navy hover:bg-gold-light ${
              offerLoading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {offerLoading ? "Päivitetään…" : `Aloita suunnitelmalla — ${displayPrice} €`}
          </a>
          <p className="mt-2 text-center text-xs text-navy/45">
            Suunnitelma sidottu tarkastukseen · voimassa 7 päivää · kopio lähetetty {email.trim()}
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

          <button type="button" onClick={restart} className="mt-6 w-full text-sm font-semibold text-navy/50 hover:text-navy">
            Aloita tarkastus alusta
          </button>
        </div>
      )}
    </div>
  );
}
