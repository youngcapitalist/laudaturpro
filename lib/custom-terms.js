import { adminFetch } from "./drip/supabase-admin.js";

/** @param {object} row */
export function rowToVocabCard(row) {
  return {
    id: row.id,
    cardType: "concept",
    word: row.term,
    theme: row.theme || "AI-generoitu",
    partOfSpeech: "",
    definitionFi: row.definition_fi,
    example: row.example || "",
    context: "",
    contextFi: "",
    options: Array.isArray(row.options) ? row.options : [],
    correctIndex: row.correct_index ?? 0,
  };
}

export async function listCustomTermCards(email, subjectId) {
  const q = `custom_term_cards?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&subject_id=eq.${encodeURIComponent(subjectId)}&order=created_at.asc`;
  const { data, error } = await adminFetch(q);
  if (error) throw new Error(error.message);
  return (data || []).map(rowToVocabCard);
}

export async function insertCustomTermCards(email, subjectId, cards) {
  const rows = cards.map((c) => ({
    id: c.id,
    email: email.trim().toLowerCase(),
    subject_id: subjectId,
    term: c.word,
    definition_fi: c.definitionFi,
    example: c.example || "",
    theme: c.theme || "AI-generoitu",
    options: c.options,
    correct_index: c.correctIndex ?? 0,
  }));

  const { error, status } = await adminFetch("custom_term_cards", {
    method: "POST",
    body: JSON.stringify(rows),
  });
  if (error || status >= 400) throw new Error(error?.message || "custom_term_insert_failed");
  return cards;
}

export async function listExistingTerms(email, subjectId, staticTerms) {
  const custom = await listCustomTermCards(email, subjectId);
  return [...staticTerms.map((c) => c.word), ...custom.map((c) => c.word)];
}
