import { getProduct } from "./products";

/** Syksyn 2026 yo-kokeisiin — quiz-valinnat → tuote-ID. */
export const YO_QUIZ_SUBJECTS = [
  { id: "matikka-pitka", label: "Matematiikka, pitkä" },
  { id: "matikka-lyhyt", label: "Matematiikka, lyhyt" },
  { id: "aidinkieli", label: "Äidinkieli" },
  { id: "englanti", label: "Englanti" },
  { id: "ruotsi", label: "Ruotsi" },
  { id: "fysiikka", label: "Fysiikka" },
  { id: "kemia", label: "Kemia" },
  { id: "biologia", label: "Biologia" },
  { id: "historia", label: "Historia" },
  { id: "psykologia", label: "Psykologia" },
  { id: "terveystieto", label: "Terveystieto" },
  { id: "yhteiskuntaoppi", label: "Yhteiskuntaoppi" },
];

export const YO_GOALS = [
  { id: "grades", label: "Nostaa yo-arvosanaa" },
  { id: "pass", label: "Varmistaa läpäisyn" },
  { id: "best", label: "Parantaa arvosanaa mahdollisimman paljon" },
];

const LANGUAGE_IDS = new Set(["aidinkieli", "englanti", "ruotsi"]);
const LUONNONTIEDE_IDS = new Set(["fysiikka", "kemia", "biologia"]);

function subjectLabel(subjectId) {
  return YO_QUIZ_SUBJECTS.find((s) => s.id === subjectId)?.label || subjectId;
}

function individualPriceForSubject(subjectId) {
  const course = getProduct(subjectId);
  return course?.priceEur ?? 0;
}

function sumIndividualPrices(subjectIds) {
  return subjectIds.reduce((sum, id) => sum + individualPriceForSubject(id), 0);
}

/** Yksittäinen kurssi tai paketti valituista aineista. */
function productIdForSubject(subjectId) {
  if (subjectId === "ruotsi") return "kielet-pakkaus";
  return subjectId;
}

function detectPackageCombo(subjectIds) {
  const hasPitka = subjectIds.includes("matikka-pitka");
  const hasLyhyt = subjectIds.includes("matikka-lyhyt");
  const langCount = subjectIds.filter((id) => LANGUAGE_IDS.has(id)).length;
  const luoCount = subjectIds.filter((id) => LUONNONTIEDE_IDS.has(id)).length;

  if (hasPitka && hasLyhyt && subjectIds.length === 2) {
    return { productId: "matikka-pakkaus", covers: ["matikka-pitka", "matikka-lyhyt"] };
  }
  if (langCount >= 2 && subjectIds.every((id) => LANGUAGE_IDS.has(id))) {
    return { productId: "kielet-pakkaus", covers: subjectIds.filter((id) => LANGUAGE_IDS.has(id)) };
  }
  if (luoCount === 3 && subjectIds.every((id) => LUONNONTIEDE_IDS.has(id))) {
    return { productId: "luonnontiede-pakkaus", covers: ["fysiikka", "kemia", "biologia"] };
  }
  return null;
}

export function recommendProduct(selectedSubjectIds, focusSubjectId = null) {
  const subjects = selectedSubjectIds.filter((id) => id !== "unknown");
  const count = subjects.length;

  if (count === 0) {
    return {
      productId: "laudatur-pro",
      reason: "Et valinnut vielä aineita — Laudatur Pro kattaa kaikki yo-aineet yhdellä paketilla.",
      coveredSubjects: YO_QUIZ_SUBJECTS.map((s) => s.id),
    };
  }

  const combo = detectPackageCombo(subjects);
  if (combo) {
    const names = combo.covers.map(subjectLabel).join(", ");
    return {
      productId: combo.productId,
      reason: `Valitsit ${names} — tämä yhdistelmäpaketti on räätälöity juuri näihin aineisiin.`,
      coveredSubjects: combo.covers,
    };
  }

  if (count >= 5) {
    return {
      productId: "laudatur-pro",
      reason: `Kirjoitat ${count} ainetta syksyllä — kattava Pro-paketti on edullisin tapa valmistautua kaikkeen.`,
      coveredSubjects: subjects,
    };
  }

  if (count === 4) {
    return {
      productId: "laudatur-pro",
      reason: `Neljä ainetta on paljon — Pro-paketti kattaa kaikki valintasi yhdellä hinnalla.`,
      coveredSubjects: subjects,
      alsoConsider: "laudatur-boost",
    };
  }

  if (count === 3) {
    const names = subjects.map(subjectLabel);
    return {
      productId: "laudatur-boost",
      reason: `Valitsit ${names.join(", ")} — Boost on räätälöity tähän kolmikkoon.`,
      coveredSubjects: subjects,
      alsoConsider: "laudatur-pro",
    };
  }

  if (count === 2) {
    const focus = focusSubjectId && subjects.includes(focusSubjectId) ? focusSubjectId : subjects[0];
    const other = subjects.find((id) => id !== focus);
    const focusProduct = productIdForSubject(focus);
    return {
      productId: focusProduct,
      reason: `Kaksi ainetta — aloitetaan ${subjectLabel(focus)}-kurssilla, jossa tarvitset eniten apua.`,
      coveredSubjects: [focus],
      secondaryId: other ? productIdForSubject(other) : null,
      secondarySubjects: other ? [other] : [],
    };
  }

  const single = focusSubjectId && subjects.includes(focusSubjectId) ? focusSubjectId : subjects[0];
  const productId = productIdForSubject(single);
  const label = subjectLabel(single);
  const extra =
    single === "ruotsi"
      ? " Kielipaketti kattaa äidinkielen, englannin ja ruotsin."
      : productId === "kielet-pakkaus"
        ? " Kielipaketti kattaa useamman kielen kerralla."
        : "";
  return {
    productId,
    reason: `${label} syksyn kokeissa — täsmäkurssi juuri tähän aineeseen.${extra}`,
    coveredSubjects:
      productId === "kielet-pakkaus" ? ["aidinkieli", "englanti", "ruotsi"] : [single],
  };
}

export function quizResult(productId) {
  const product = getProduct(productId);
  if (!product) return null;
  return {
    productId,
    name: product.name,
    priceEur: product.priceEur,
    compareAtEur: product.compareAtEur ?? null,
    tagline: product.tagline || null,
  };
}

/** Cialdini-tyylinen henkilökohtainen tarjous valintojen yhdistelmänä. */
export function buildPersonalizedOffer({
  selectedSubjectIds,
  focusSubjectId = null,
  goal = null,
}) {
  const subjects = selectedSubjectIds.filter((id) => id !== "unknown");
  const rec = recommendProduct(selectedSubjectIds, focusSubjectId);
  const product = getProduct(rec.productId);
  if (!product) return null;

  const coveredIds = rec.coveredSubjects || subjects;
  const coveredLabels = coveredIds.map(subjectLabel);
  const focusLabel = focusSubjectId ? subjectLabel(focusSubjectId) : null;

  const individualSum = sumIndividualPrices(
    rec.productId === "laudatur-pro" ? subjects : coveredIds
  );
  const listPrice = product.priceEur;
  const compareAt =
    product.compareAtEur ??
    (individualSum > listPrice ? individualSum : null);
  const savingsVsIndividual =
    individualSum > listPrice ? individualSum - listPrice : null;

  let personalTitle;
  if (rec.productId === "laudatur-pro") {
    personalTitle =
      subjects.length > 0
        ? `Sinun ${subjects.length} aineen Pro-pakettisi`
        : "Sinun täysi yo-valmennuspakettisi";
  } else if (rec.productId === "laudatur-boost") {
    personalTitle = `Sinun Boost-pakettisi: ${coveredLabels.join(" + ")}`;
  } else if (coveredLabels.length <= 3) {
    personalTitle = `Sinun pakettisi: ${coveredLabels.join(" + ")}`;
  } else {
    personalTitle = `Sinun räätälöity pakettisi`;
  }

  const headline =
    subjects.length > 0
      ? `Rakensimme tämän tarjouksen valintojesi perusteella — juuri sinulle.`
      : `Rakensimme tämän tarjouksen juuri sinulle.`;

  const consistencyLine = [
    subjects.length > 0 && `Kirjoitat: ${subjects.map(subjectLabel).join(", ")}`,
    focusLabel && `Prioriteetti: ${focusLabel}`,
    goal?.label && `Tavoite: ${goal.label}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const components = coveredLabels.map((label) => ({
    label,
    detail: "Teoria + AI-professori + harkkakoe",
  }));

  const secondary =
    rec.secondaryId && rec.secondarySubjects?.length
      ? {
          product: getProduct(rec.secondaryId),
          labels: rec.secondarySubjects.map(subjectLabel),
        }
      : null;

  return {
    ...rec,
    product,
    personalTitle,
    headline,
    consistencyLine,
    components,
    coveredLabels,
    selectedLabels: subjects.map(subjectLabel),
    focusLabel,
    goalLabel: goal?.label ?? null,
    compareAtEur: compareAt,
    savingsVsIndividual,
    individualSum: individualSum || null,
    secondary,
  };
}
