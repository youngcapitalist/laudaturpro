/** LaudaturPro — yo-valmennustuotteet. */

export const BUNDLES = [
  {
    id: "laudatur-pro",
    name: "Laudatur Pro",
    tagline: "Kaikki yo-aineet yhdessä paketissa",
    priceEur: 399,
    compareAtEur: 599,
    badge: "Suosituin",
    features: [
      "Kaikki 30+ yo-aineen valmennuskurssit",
      "Teoria, tehtävät ja koesimulaatiot",
      "Henkilökohtainen opiskelusuunnitelma",
      "Kysy opettajalta — rajaton tuki kevään kokeisiin",
    ],
  },
  {
    id: "laudatur-boost",
    name: "Laudatur Boost",
    tagline: "3 ainetta — valitse tärkeimmät",
    priceEur: 149,
    compareAtEur: 219,
    features: [
      "Valitse 3 yo-ainetta (esim. matikka + äidinkieli + kieli)",
      "Sama sisältö kuin Pro, rajattu ainevalikoimaan",
      "Ihanteellinen korottamaan juuri heikkoja aineita",
    ],
  },
];

export const SUBJECT_GROUPS = [
  {
    id: "matematiikka",
    title: "Matematiikka",
    description: "Pitkä ja lyhyt matematiikka — todistusvalinnan kynnysehto ja pisteet.",
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
      { id: "luonnontiede-pakkaus", name: "Luonnontiedepaketti (fys + kemia + bio)", priceEur: 139, compareAtEur: 177 },
    ],
  },
];

export function getProduct(id) {
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
