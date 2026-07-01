import { getProduct } from "./products";

export const WTP_MIN_EUR = 49;
export const WTP_MAX_EUR = 999;
export const WTP_ANCHORS = [90, 220, 520, 820, 1000];

const ANCHOR_FRACTION = {
  90: 0.72,
  220: 0.82,
  520: 0.9,
  820: 0.97,
  1000: 1,
};

export const LAUDATUR_WTP_QUESTIONS = [
  {
    id: "budget",
    q: "Millaisen investoinnin olet valmis tekemään varmistaaksesi unelmiesi opiskelupaikan yo-arvosanoilla?",
    options: [
      {
        label: "Alle 100 €",
        hint: "Haen tehokkaita työkaluja yhteen tai kahteen aineeseen — luotan omaan työhöni.",
        points: 90,
      },
      {
        label: "100–200 €",
        hint: "Olen valmis sijoittamaan laadukkaaseen valmennukseen säästääkseni aikaa.",
        points: 220,
      },
      {
        label: "200–350 €",
        hint: "Haluan kattavan tuen useaan aineeseen ja selkeän polun kohti tavoitearvosanaa.",
        points: 520,
      },
      {
        label: "350–500 €",
        hint: "En halua jättää mitään sattuman varaan — haluan parhaat työkalut.",
        points: 820,
      },
      {
        label: "Yli 400 €",
        hint: "Olen valmis panostamaan täysillä — haluan kaiken mitä tarjotaan.",
        points: 1000,
      },
    ],
  },
  {
    id: "dream",
    q: "Kuinka tärkeää sinulle on varmistaa unelmiesi opiskelupaikka?",
    options: [
      { label: "Mukava bonus, mutta ei ratkaise kaikkea", points: 30 },
      { label: "Tärkeää — haluan parantaa yo-arvosanoja", points: 100 },
      { label: "Erittäin tärkeää — teen mitä tarvitaan", points: 180 },
      { label: "Tämä on unelmani — haluan varmuuden", points: 280 },
    ],
  },
  {
    id: "commitment",
    q: "Mikä kuvaa tilannettasi parhaiten?",
    options: [
      { label: "Tutkin vaihtoehtoja, en ole vielä varma", points: 40 },
      { label: "Valmistaudun syksyn 2026 yo-kokeisiin", points: 120 },
      { label: "Yritän uudelleen — haluan paremmat arvosanat", points: 200 },
      { label: "Panostan täysillä — en jätä mitään sattuman varaan", points: 280 },
    ],
  },
];

export function roundToNine(eur, minEur = WTP_MIN_EUR) {
  const n = Math.max(minEur, Math.min(WTP_MAX_EUR, Math.round(eur)));
  return Math.floor(n / 10) * 10 + 9;
}

function snapAnchor(wtpScore) {
  const score = Math.min(1000, Math.max(0, Math.round(wtpScore)));
  return WTP_ANCHORS.reduce((best, anchor) =>
    Math.abs(anchor - score) < Math.abs(best - score) ? anchor : best
  );
}

/** Budjetti painaa eniten; tunnekysymykset nostavat tai laskevat hintaa. */
export function computeWtpScore(wtpAnswers) {
  const budget = wtpAnswers.budget ?? 0;
  const dream = wtpAnswers.dream ?? 0;
  const commitment = wtpAnswers.commitment ?? 0;
  const blended = budget * 0.55 + dream * 0.3 + commitment * 0.15;
  return Math.min(1000, Math.max(0, Math.round(blended)));
}

export function wtpScoreToPriceEur(wtpScore, productId) {
  const product = getProduct(productId);
  if (!product) return null;

  const list = product.priceEur;
  const anchor = snapAnchor(wtpScore);
  const fraction = ANCHOR_FRACTION[anchor] ?? 0.9;
  const min = roundToNine(Math.max(WTP_MIN_EUR, list * 0.65), WTP_MIN_EUR);
  return roundToNine(list * fraction, Math.min(min, list));
}

export function formatPriceEur(eur) {
  return `${eur} €`;
}
