import { adminFetch } from "./drip/supabase-admin.js";
import { getVocabulary } from "./vocabulary-registry.js";
import { listCustomTermCards } from "./custom-terms.js";

export async function recordVocabAttempt({ userId, email, subjectId, wordId, mode, correct }) {
  const { error, status } = await adminFetch("vocabulary_attempts", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId || null,
      email: email.trim().toLowerCase(),
      subject_id: subjectId,
      word_id: wordId,
      mode: mode || "card",
      correct,
    }),
  });
  if (error || status >= 400) throw new Error(error?.message || "vocab_attempt_failed");
}

export async function listVocabAttempts(email, subjectId) {
  let q = `vocabulary_attempts?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&order=created_at.desc&limit=2000`;
  if (subjectId) q += `&subject_id=eq.${encodeURIComponent(subjectId)}`;
  const { data, error } = await adminFetch(q);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function loadVocabularyWithCustom(email, subjectId) {
  const customCards = await listCustomTermCards(email, subjectId);
  return getVocabulary(subjectId, customCards);
}

export function computeVocabProgress(subjectId, attempts, cards) {
  const latestByWord = new Map();
  for (const a of attempts) {
    if (!latestByWord.has(a.word_id)) latestByWord.set(a.word_id, a);
  }

  const themeStats = new Map();
  for (const card of cards) {
    if (!themeStats.has(card.theme)) {
      themeStats.set(card.theme, { theme: card.theme, total: 0, learned: 0, needsReview: 0 });
    }
    themeStats.get(card.theme).total += 1;
  }

  let learned = 0;
  const reviewQueue = [];

  for (const card of cards) {
    const latest = latestByWord.get(card.id);
    if (!latest) continue;

    const stat = themeStats.get(card.theme);
    if (latest.correct) {
      learned += 1;
      if (stat) stat.learned += 1;
    } else {
      reviewQueue.push(card.id);
      if (stat) stat.needsReview += 1;
    }
  }

  return {
    total: cards.length,
    learned,
    unseen: cards.length - latestByWord.size,
    accuracy: latestByWord.size > 0 ? learned / latestByWord.size : null,
    themes: [...themeStats.values()],
    reviewQueue,
  };
}
