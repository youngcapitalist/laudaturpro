/** Aineet, joissa harkkakokeen laskutehtävissä käytetään matikkaeditoria. */
export const STEM_CALCULATION_SUBJECTS = new Set([
  "matikka-pitka",
  "matikka-lyhyt",
  "fysiikka",
  "kemia",
]);

/** @param {string} subjectId @param {string} taskType */
export function usesMathAnswerEditor(subjectId, taskType) {
  return taskType === "laskutehtava" && STEM_CALCULATION_SUBJECTS.has(subjectId);
}

/** @param {string} answerText @param {{ usesMathEditor?: boolean }} [opts] */
export function isAnswerTooShort(answerText, opts = {}) {
  const len = answerText.trim().length;
  if (opts.usesMathEditor) return len < 12;
  return len < 50;
}

/** @param {string} answerText */
export function answerTooShortMessage(answerText, opts = {}) {
  if (isAnswerTooShort(answerText, opts)) {
    return opts.usesMathEditor
      ? "Ratkaisu on liian lyhyt — kirjoita vähintään muutama välivaihe."
      : "Vastaus on liian lyhyt — kirjoita vähintään muutama virke.";
  }
  return null;
}
