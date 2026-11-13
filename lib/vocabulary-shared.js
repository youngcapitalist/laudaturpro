/** Jaetut sanasto-/käsitekorttityypit ja apufunktiot. */

export const VOCAB_SESSION_SIZE = 8;

/** @typedef {Object} VocabCard
 * @property {string} id
 * @property {"language"|"concept"} [cardType]
 * @property {string} word
 * @property {string} theme
 * @property {string} partOfSpeech
 * @property {string} definitionFi
 * @property {string} context
 * @property {string} contextFi
 * @property {string[]} options
 * @property {number} correctIndex
 * @property {string} example
 */

/** @param {VocabCard} card */
export function isConceptCard(card) {
  return card.cardType === "concept" || (!card.context && card.options?.length >= 4);
}

/** Fisher–Yates */
export function pickVocabSession(cards, size = VOCAB_SESSION_SIZE) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(size, arr.length));
}

export function shuffledOptions(card) {
  let seed = 0;
  for (let i = 0; i < card.id.length; i++) seed = (seed * 31 + card.id.charCodeAt(i)) >>> 0;
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.map((i) => ({ text: card.options[i], originalIndex: i }));
}

export function contextWithBlank(context) {
  return context.replace("___", "______");
}

export function vocabThemes(cards) {
  return [...new Set(cards.map((c) => c.theme))];
}
