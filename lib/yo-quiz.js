import { buildYoBundle, getProduct } from "./products";
import { checkupInsightLine } from "./yo-checkup";

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
  {
    id: "grades",
    label: "Nostaa todistuspisteitä",
    hint: "Parempi arvosana tuo enemmän pisteitä yliopistoon — esim. C → M tai M → E.",
  },
  {
    id: "pass",
    label: "Päästä varmasti läpi",
    hint: "Riittävä tulos, ettei koe kaada suunnitelmiasi.",
  },
  {
    id: "best",
    label: "Paras mahdollinen yo-tulos",
    hint: "Maksimoi arvosana ja pisteet — tavoitteena E tai L.",
  },
];

/** Yo-arvosanat korotusvalintaan (heikoimmasta parhaaseen). */
export const YO_EXAM_GRADES = ["I", "A", "B", "C", "M", "E", "L"];

/** Lukiokurssien keskiarvo kirjoitettavissa aineissa — lähtötason arvio. */
export const YO_GRADE_LEVELS = [
  { id: "9to10", label: "9–10", hint: "Vahva pohja — hiotaan huipputulokseen." },
  { id: "8to9", label: "8–9", hint: "Hyvä taso — E tai L on realistinen tavoite." },
  { id: "7to8", label: "7–8", hint: "Kohtuullinen pohja — oikealla harjoittelulla reilusti nousuvaraa." },
  { id: "6to7", label: "6–7", hint: "Perusteissa on aukkoja — rakennetaan varma pohja ensin." },
  { id: "under6", label: "Alle 6", hint: "Aloitetaan ytimestä — selkeä polku tuo nopeita edistysaskelia." },
  { id: "unknown", label: "En osaa sanoa", hint: "Ei haittaa — suunnitelma tarkentuu harjoittelun myötä." },
];

const LANGUAGE_IDS = new Set(["aidinkieli", "englanti", "ruotsi"]);
const LUONNONTIEDE_IDS = new Set(["fysiikka", "kemia", "biologia"]);

function subjectLabel(subjectId) {
  return YO_QUIZ_SUBJECTS.find((s) => s.id === subjectId)?.label || subjectId;
}

function sumIndividualPrices(subjectIds) {
  return subjectIds.reduce((sum, id) => {
    const course = getProduct(id);
    return sum + (course?.priceEur ?? 0);
  }, 0);
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
    const names = combo.covers.map(subjectLabel).join(" ja ");
    return {
      productId: combo.productId,
      reason: `Tarkastuksessa nousi esiin ${names}. Tämä yhdistelmäpaketti kattaa molemmat kerralla.`,
      coveredSubjects: combo.covers,
      isCustomBundle: false,
    };
  }

  if (count >= 5) {
    return {
      productId: "laudatur-pro",
      reason: `Kirjoitat ${count} ainetta syksyllä — kattava Pro-paketti on tehokkain tapa valmistautua kaikkeen.`,
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
    const names = subjects.map(subjectLabel).join(", ");
    return {
      productId: "laudatur-boost",
      reason: `Tarkastuksessa nousi esiin kolme ainetta (${names}). Boost kattaa ne kaikki yhdessä paketissa.`,
      coveredSubjects: subjects,
      alsoConsider: "laudatur-pro",
    };
  }

  if (count === 2) {
    const bundle = buildYoBundle(subjects);
    const names = subjects.map(subjectLabel).join(" ja ");
    const focus =
      focusSubjectId && subjects.includes(focusSubjectId) ? subjectLabel(focusSubjectId) : null;
    return {
      productId: bundle.id,
      reason: focus
        ? `Tarkastuksessa nousi esiin kaksi ainetta (${names}). Suosittelemme yhteispakettia, jossa ${focus} on painopiste mutta molemmat aineet kuuluvat mukaan.`
        : `Tarkastuksessa nousi esiin kaksi ainetta (${names}). Yhteispaketti kattaa molemmat kerralla ja on edullisempi kuin erikseen ostettuna.`,
      coveredSubjects: subjects,
      isCustomBundle: true,
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

/** Henkilökohtainen suunnitelma valintojen yhdistelmänä. */
export function buildPersonalizedOffer({
  selectedSubjectIds,
  focusSubjectId = null,
  goal = null,
  bundleSubjectIds = null,
  checkupAnswers = {},
  gradeLevel = null,
  retakeGrades = {},
}) {
  const subjects = selectedSubjectIds.filter((id) => id !== "unknown");
  const activeSubjects = (bundleSubjectIds ?? subjects).filter((id) => id !== "unknown");
  const rec = recommendProduct(activeSubjects, focusSubjectId);
  const product = getProduct(rec.productId);
  if (!product) return null;

  const coveredIds = rec.coveredSubjects || activeSubjects;
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
        ? `Sinun ${subjects.length} aineen Pro-suunnitelmasi`
        : "Sinun täysi yo-valmennussuunnitelmasi";
  } else if (rec.productId === "laudatur-boost") {
    personalTitle = `Sinun Boost-suunnitelmasi: ${coveredLabels.join(" + ")}`;
  } else if (rec.isCustomBundle && coveredLabels.length >= 2) {
    personalTitle = `Sinun yhteispakettisi: ${coveredLabels.join(" + ")}`;
  } else if (coveredLabels.length <= 3) {
    personalTitle = `Sinun suunnitelmasi: ${coveredLabels.join(" + ")}`;
  } else {
    personalTitle = "Sinun räätälöity suunnitelmasi";
  }

  const headline = "Tarkastuksen perusteella laadimme sinulle henkilökohtaisen yo-suunnitelman.";

  const checkupLine = checkupInsightLine(checkupAnswers);

  const retakeLabels = Object.entries(retakeGrades || {})
    .filter(([id]) => subjects.includes(id))
    .map(([id, grade]) => `${subjectLabel(id)} (${grade})`);

  const consistencyLine = [
    subjects.length > 0 && `Kirjoitat: ${subjects.map(subjectLabel).join(", ")}`,
    retakeLabels.length > 0 && `Korotat: ${retakeLabels.join(", ")}`,
    gradeLevel && gradeLevel.id !== "unknown" && `Kurssikeskiarvo: ${gradeLevel.label}`,
    focusLabel && `Painopiste: ${focusLabel}`,
    goal?.label && `Tavoite: ${goal.label}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const components = coveredIds.map((id) => ({
    id,
    label: subjectLabel(id),
    detail: "Teoria + AI-professori + harkkakoe",
    removable: rec.isCustomBundle && coveredIds.length > 1,
  }));

  return {
    ...rec,
    product,
    personalTitle,
    headline,
    consistencyLine,
    checkupLine,
    components,
    coveredLabels,
    coveredIds,
    selectedLabels: subjects.map(subjectLabel),
    retakeLabels,
    focusLabel,
    goalLabel: goal?.label ?? null,
    compareAtEur: compareAt,
    savingsVsIndividual,
    individualSum: individualSum || null,
    secondary: null,
    canCustomizeBundle: rec.isCustomBundle && coveredIds.length > 1,
  };
}
