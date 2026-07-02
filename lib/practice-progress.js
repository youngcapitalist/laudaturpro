import { adminFetch } from "./drip/supabase-admin.js";
import { getPracticeQuestions } from "./practice-questions.js";

export async function recordPracticeAttempt({ userId, email, subjectId, questionId, module, correct, chosenIndex }) {
  const { error, status } = await adminFetch("practice_attempts", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId || null,
      email: email.trim().toLowerCase(),
      subject_id: subjectId,
      question_id: questionId,
      module: module || null,
      correct,
      chosen_index: chosenIndex ?? null,
    }),
  });
  if (error || status >= 400) throw new Error(error?.message || "attempt_failed");
}

/** Kaikki käyttäjän vastaukset aineeseen (uusin ensin). */
export async function listAttempts(email, subjectId) {
  let q = `practice_attempts?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&order=created_at.desc&limit=1000`;
  if (subjectId) q += `&subject_id=eq.${encodeURIComponent(subjectId)}`;
  const { data, error } = await adminFetch(q);
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Edistyminen aineessa: per tehtävä viimeisin tulos, osa-aluekohtaiset
 * osuudet ja kertausjono (viimeisin vastaus väärin).
 */
export function computeProgress(subjectId, attempts) {
  const questions = getPracticeQuestions(subjectId);
  const latestByQuestion = new Map();
  for (const a of attempts) {
    if (!latestByQuestion.has(a.question_id)) latestByQuestion.set(a.question_id, a);
  }

  const moduleStats = new Map();
  let answered = 0;
  let correct = 0;
  const reviewQueue = [];

  for (const q of questions) {
    if (!moduleStats.has(q.module)) moduleStats.set(q.module, { module: q.module, total: 0, answered: 0, correct: 0 });
    const m = moduleStats.get(q.module);
    m.total += 1;

    const latest = latestByQuestion.get(q.id);
    if (latest) {
      answered += 1;
      m.answered += 1;
      if (latest.correct) {
        correct += 1;
        m.correct += 1;
      } else {
        reviewQueue.push(q.id);
      }
    }
  }

  return {
    total: questions.length,
    answered,
    correct,
    accuracy: answered > 0 ? correct / answered : null,
    modules: [...moduleStats.values()],
    reviewQueue,
  };
}

/** Yhteenveto kaikista aineista dashboardia varten. */
export async function progressSummaryForSubjects(email, subjectIds) {
  const attempts = await listAttempts(email);
  const bySubject = new Map();
  for (const a of attempts) {
    if (!bySubject.has(a.subject_id)) bySubject.set(a.subject_id, []);
    bySubject.get(a.subject_id).push(a);
  }

  const summary = {};
  for (const id of subjectIds) {
    summary[id] = computeProgress(id, bySubject.get(id) || []);
  }
  return summary;
}
