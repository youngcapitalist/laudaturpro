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
];

export const YO_GOALS = [
  { id: "grades", label: "Nostaa arvosanaa todistusvalintaan" },
  { id: "pass", label: "Varmistaa läpäisyn" },
  { id: "best", label: "Parantaa arvosanaa mahdollisimman paljon" },
];

/** Yksittäinen kurssi tai paketti valituista aineista. */
function productIdForSubject(subjectId) {
  if (subjectId === "ruotsi") return "kielet-pakkaus";
  return subjectId;
}

export function recommendProduct(selectedSubjectIds, focusSubjectId = null) {
  const subjects = selectedSubjectIds.filter((id) => id !== "unknown");
  const count = subjects.length;

  if (count === 0) {
    return {
      productId: "laudatur-pro",
      reason: "Et valinnut vielä aineita — Laudatur Pro kattaa kaikki yo-aineet yhdellä paketilla.",
    };
  }

  if (count >= 5) {
    return {
      productId: "laudatur-pro",
      reason: `Kirjoitat ${count} ainetta syksyllä — kattava Pro-paketti on edullisin tapa valmistautua kaikkeen.`,
    };
  }

  if (count === 3) {
    const names = subjects.map((id) => YO_QUIZ_SUBJECTS.find((s) => s.id === id)?.label).filter(Boolean);
    return {
      productId: "laudatur-boost",
      reason: `Valitsit ${names.join(", ")} — Boost-paketti on täsmälleen kolmelle aineelle.`,
      alsoConsider: "laudatur-pro",
    };
  }

  if (count === 2) {
    const hasMatikka = subjects.some((id) => id.startsWith("matikka"));
    if (hasMatikka && subjects.includes("matikka-pitka") && subjects.includes("matikka-lyhyt")) {
      return {
        productId: "matikka-pakkaus",
        reason: "Kirjoitat sekä pitkän että lyhyen matematiikan — paketti säästää verrattuna kahteen erilliseen kurssiin.",
      };
    }
    const focus = focusSubjectId && subjects.includes(focusSubjectId) ? focusSubjectId : subjects[0];
    const focusProduct = productIdForSubject(focus);
    const other = subjects.find((id) => id !== focus);
    return {
      productId: focusProduct,
      reason: "Kaksi ainetta — aloita siitä, jossa tarvitset eniten apua. Voit lisätä toisen aineen myöhemmin.",
      secondaryId: other ? productIdForSubject(other) : null,
    };
  }

  const single = focusSubjectId && subjects.includes(focusSubjectId) ? focusSubjectId : subjects[0];
  const productId = productIdForSubject(single);
  const label = YO_QUIZ_SUBJECTS.find((s) => s.id === single)?.label || "valitsemasi aine";
  const extra =
    single === "ruotsi"
      ? " Kielipaketti kattaa äidinkielen, englannin ja ruotsin."
      : "";
  return {
    productId,
    reason: `${label} syksyn kokeissa — täsmäkurssi antaa teorian, tehtävät ja AI-tuen juuri tähän aineeseen.${extra}`,
  };
}

export function quizResult(productId) {
  const product = getProduct(productId);
  if (!product) return null;
  return {
    productId,
    name: product.name,
    priceEur: product.priceEur,
    tagline: product.tagline || null,
  };
}
