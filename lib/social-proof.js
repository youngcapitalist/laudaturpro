/** Satunnaiset “juuri nyt” -ilmoitukset ei-maksaville kävijöille. */

export const SOCIAL_PROOF_NAMES = [
  "Eeli",
  "Aino",
  "Onni",
  "Sofia",
  "Leo",
  "Emma",
  "Oliver",
  "Helmi",
  "Eino",
  "Venla",
  "Väinö",
  "Lilja",
  "Lauri",
  "Elli",
  "Aatos",
  "Aada",
  "Elias",
  "Olivia",
  "Niilo",
  "Iida",
];

const SUBJECTS = [
  { label: "Pitkä matematiikka", genitive: "Pitkän matematiikan", partitive: "pitkää matematiikkaa" },
  { label: "Lyhyt matematiikka", genitive: "Lyhyen matematiikan", partitive: "lyhyttä matematiikkaa" },
  { label: "Äidinkieli", genitive: "Äidinkielen", partitive: "äidinkieltä" },
  { label: "Englanti", genitive: "Englannin", partitive: "englantia" },
  { label: "Ruotsi", genitive: "Ruotsin", partitive: "ruotsia" },
  { label: "Fysiikka", genitive: "Fysiikan", partitive: "fysiikkaa" },
  { label: "Kemia", genitive: "Kemian", partitive: "kemiaa" },
  { label: "Biologia", genitive: "Biologian", partitive: "biologiaa" },
  { label: "Historia", genitive: "Historian", partitive: "historiaa" },
  { label: "Psykologia", genitive: "Psykologian", partitive: "psykologiaa" },
  { label: "Terveystieto", genitive: "Terveystiedon", partitive: "terveystietoa" },
  { label: "Yhteiskuntaoppi", genitive: "Yhteiskuntaopin", partitive: "yhteiskuntaoppia" },
];

const ACTIONS = [
  (s) => `suoritti ${s.genitive} tehtävän`,
  (s) => `harjoitteli ${s.partitive}`,
  (s) => `sai palautetta AI-professorilta — ${s.label}`,
  (s) => `aloitti harkkakokeen — ${s.label}`,
  (s) => `teki 20 minuuttia ${s.partitive}`,
  (s) => `läpäisi ${s.genitive} osion`,
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomSocialProofEvent() {
  const name = pick(SOCIAL_PROOF_NAMES);
  const subject = pick(SUBJECTS);
  const action = pick(ACTIONS)(subject);
  return { name, action, text: `${name} ${action}` };
}
