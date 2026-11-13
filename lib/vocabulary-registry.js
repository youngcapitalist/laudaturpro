import { ENGLISH_VOCABULARY } from "./english-vocabulary.js";
import { SWEDISH_VOCABULARY } from "./swedish-vocabulary.js";
import { getStaticTerms, TERM_SUBJECTS } from "./subject-terms.js";
import { VOCAB_SESSION_SIZE, pickVocabSession, vocabThemes } from "./vocabulary-shared.js";

const LANGUAGE_BANKS = {
  englanti: ENGLISH_VOCABULARY,
  ruotsi: SWEDISH_VOCABULARY,
};

export { VOCAB_SESSION_SIZE, pickVocabSession };

/** @param {import("./vocabulary-shared.js").VocabCard[]} customCards */
export function getVocabulary(subjectId, customCards = []) {
  const staticCards = LANGUAGE_BANKS[subjectId] ?? getStaticTerms(subjectId);
  return [...staticCards, ...customCards];
}

export function subjectHasVocabulary(subjectId) {
  return (
    (LANGUAGE_BANKS[subjectId]?.length ?? 0) > 0 ||
    TERM_SUBJECTS.has(subjectId)
  );
}

export function getSubjectCardMeta(subjectId) {
  if (subjectId === "englanti" || subjectId === "ruotsi") {
    return {
      cardType: "language",
      tabLabel: "Sanasto",
      pageTitle: subjectId === "ruotsi" ? "Ruotsin sanasto" : "Englannin sanasto",
      heading: "Sanastosi",
      unit: "sanaa",
      unitPlural: "sanat",
      quizStyle: "context",
      intro:
        "Yo-kokeen tyylisiä sanoja kontekstissa — käännä kortti, arvioi osaaminen, kertaa väärät yo-tyylisellä monivalinnalla.",
    };
  }

  const pageTitles = {
    "matikka-pitka": "Pitkän matematiikan käsitteet",
    "matikka-lyhyt": "Lyhyen matematiikan käsitteet",
    aidinkieli: "Äidinkielen käsitteet",
    fysiikka: "Fysiikan käsitteet",
    kemia: "Kemian käsitteet",
    biologia: "Biologian käsitteet",
    historia: "Historian käsitteet",
    psykologia: "Psykologian käsitteet",
    terveystieto: "Terveystiedon käsitteet",
    yhteiskuntaoppi: "Yhteiskuntaopin käsitteet",
  };

  return {
    cardType: "concept",
    tabLabel: "Käsitteet",
    pageTitle: pageTitles[subjectId] ?? "Käsitteet",
    heading: "Käsitteet",
    unit: "käsitettä",
    unitPlural: "käsitteet",
    quizStyle: "definition",
    intro:
      "Lukion yo-tason käsitteitä terminä ja selityksenä — kertaa väärät monivalinnalla ja pyydä AI:lta uusia LOPS-mukaisia käsitteitä.",
  };
}

export function isLanguageSubject(subjectId) {
  return subjectId === "englanti" || subjectId === "ruotsi";
}

/** @param {string} subjectId @param {string} wordId @param {import("./vocabulary-shared.js").VocabCard[]} [customCards] */
export function getVocabCard(subjectId, wordId, customCards = []) {
  return getVocabulary(subjectId, customCards).find((c) => c.id === wordId) ?? null;
}

export function getVocabThemes(subjectId, customCards = []) {
  return vocabThemes(getVocabulary(subjectId, customCards));
}
