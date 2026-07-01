/** LaudaturPro — yo-valmennustuotteet. */

export const YO_BUNDLE_PREFIX = "yo-yhteispaketti";

export const BUNDLES = [
  {
    id: "laudatur-pro",
    name: "Laudatur Pro",
    tagline: "Kaikki yo-aineet — yksi selkeä polku kohti tavoitearvosanaa",
    priceEur: 399,
    compareAtEur: 599,
    badge: "Suosituin",
    features: [
      "Kaikki 12 AI-professorin ainetta yhdessä paketissa",
      "1000+ harjoitustehtävää — AI luo uusia yo-tason tehtäviä rajattomasti",
      "Teoria osa-alueittain, rajaton chat ja harkkakoe",
      "Pääsy syksyn 2026 yo-kokeisiin asti",
    ],
  },
  {
    id: "laudatur-boost",
    name: "Laudatur Boost",
    tagline: "3 tärkeintä ainetta — paras hinta–hyöty-suhde",
    priceEur: 149,
    compareAtEur: 219,
    features: [
      "Valitse 3 yo-ainetta (esim. matikka + äidinkieli + kieli)",
      "1000+ harjoitustehtävää valituissa aineissa — rajaton AI-harjoittelu",
      "Sama sisältö kuin Pro: teoria, AI-professori, harkkakoe",
    ],
  },
];

export const SUBJECT_GROUPS = [
  {
    id: "matematiikka",
    title: "Matematiikka",
    description: "Pitkä ja lyhyt matematiikka — yo-kokeen ydinaineet ja arvosanan korottaminen.",
    courses: [
      { id: "matikka-pitka", name: "Matematiikka, pitkä oppimäärä", priceEur: 79 },
      { id: "matikka-lyhyt", name: "Matematiikka, lyhyt oppimäärä", priceEur: 69 },
      { id: "matikka-pakkaus", name: "Matematiikka — pitkä + lyhyt", priceEur: 119, compareAtEur: 148 },
    ],
  },
  {
    id: "kielet",
    title: "Kielet",
    description: "Äidinkieli, englanti, toinen kotimainen ja vieraan kieli.",
    courses: [
      { id: "aidinkieli", name: "Äidinkieli ja kirjallisuus", priceEur: 69 },
      { id: "englanti", name: "Englanti (pitkä tai lyhyt)", priceEur: 59 },
      { id: "kielet-pakkaus", name: "Kielipaketti — 3 ainetta", priceEur: 129, compareAtEur: 177 },
    ],
  },
  {
    id: "reaali",
    title: "Reaaliaineet",
    description: "Luonnontieteet, yhteiskunta ja humanistiset aineet.",
    courses: [
      { id: "fysiikka", name: "Fysiikka", priceEur: 59 },
      { id: "kemia", name: "Kemia", priceEur: 59 },
      { id: "biologia", name: "Biologia", priceEur: 59 },
      { id: "psykologia", name: "Psykologia", priceEur: 49 },
      { id: "historia", name: "Historia", priceEur: 49 },
      { id: "terveystieto", name: "Terveystieto", priceEur: 49 },
      { id: "yhteiskuntaoppi", name: "Yhteiskuntaoppi", priceEur: 49 },
      { id: "luonnontiede-pakkaus", name: "Luonnontiedepaketti (fys + kemia + bio)", priceEur: 139, compareAtEur: 177 },
    ],
  },
];

function roundBundlePrice(eur) {
  const n = Math.max(49, Math.round(eur));
  return Math.floor(n / 10) * 10 + 9;
}

export function individualCoursePriceEur(subjectId) {
  for (const group of SUBJECT_GROUPS) {
    const course = group.courses.find((c) => c.id === subjectId);
    if (course) return course.priceEur;
  }
  return 0;
}

export function sumIndividualCoursePrices(subjectIds) {
  return subjectIds.reduce((sum, id) => sum + individualCoursePriceEur(id), 0);
}

export function bundleProductIdFromSubjects(subjectIds) {
  const sorted = [...subjectIds].filter(Boolean).sort();
  return `${YO_BUNDLE_PREFIX}:${sorted.join(",")}`;
}

export function parseBundleSubjects(productId) {
  if (!productId?.startsWith(`${YO_BUNDLE_PREFIX}:`)) return null;
  return productId
    .slice(YO_BUNDLE_PREFIX.length + 1)
    .split(",")
    .filter(Boolean);
}

/** Räätälöity yo-yhteispaketti valituista aineista. */
export function buildYoBundle(subjectIds) {
  const ids = subjectIds.filter((id) => id && id !== "unknown");
  if (ids.length === 0) return null;

  const individualSum = sumIndividualCoursePrices(ids);
  const discount =
    ids.length >= 4 ? 0.78 : ids.length === 3 ? 0.84 : ids.length === 2 ? 0.9 : 1;
  const priceEur = roundBundlePrice(individualSum * discount);
  const labels = ids.map((id) => {
    for (const group of SUBJECT_GROUPS) {
      const course = group.courses.find((c) => c.id === id);
      if (course) return course.name.replace(/ \(.*\)$/, "").split(" — ")[0];
    }
    return id;
  });

  const shortLabels = ids.map((id) => {
    for (const group of SUBJECT_GROUPS) {
      const course = group.courses.find((c) => c.id === id);
      if (course) {
        if (id === "matikka-pitka") return "Matikka, pitkä";
        if (id === "matikka-lyhyt") return "Matikka, lyhyt";
        return course.name.split(" (")[0].split(" — ")[0];
      }
    }
    return id;
  });

  return {
    type: "bundle",
    id: bundleProductIdFromSubjects(ids),
    name: `Yo-yhteispaketti: ${shortLabels.join(" + ")}`,
    tagline: `${ids.length} ainetta samassa paketissa — teoria, AI-professori ja harkkakoe`,
    priceEur,
    compareAtEur: individualSum > priceEur ? individualSum : null,
    subjectIds: ids,
    shortLabels,
  };
}

export function getProduct(id) {
  const bundleSubjects = parseBundleSubjects(id);
  if (bundleSubjects?.length) {
    return buildYoBundle(bundleSubjects);
  }

  const bundle = BUNDLES.find((b) => b.id === id);
  if (bundle) return { type: "bundle", ...bundle };
  for (const group of SUBJECT_GROUPS) {
    const course = group.courses.find((c) => c.id === id);
    if (course) return { type: "course", group: group.title, ...course };
  }
  return null;
}

export function allProductIds() {
  return [
    ...BUNDLES.map((b) => b.id),
    ...SUBJECT_GROUPS.flatMap((g) => g.courses.map((c) => c.id)),
  ];
}
