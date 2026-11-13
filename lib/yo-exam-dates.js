/**
 * Syksyn 2026 yo-koepäivät (YTL, vahvistettu).
 * Lähde: ylioppilastutkinto.fi — kokeet alkavat klo 9.00.
 */

export const EXAM_SEASON_LABEL = "Syksy 2026";

/** subjectId → koepäivä(t) ISO-muodossa. */
export const SUBJECT_EXAM_DATES = {
  aidinkieli: [
    { date: "2026-09-14", label: "Lukutaidon koe" },
    { date: "2026-09-25", label: "Kirjoitustaidon koe" },
  ],
  yhteiskuntaoppi: [{ date: "2026-09-16", label: "Reaalikoe" }],
  kemia: [{ date: "2026-09-16", label: "Reaalikoe" }],
  terveystieto: [{ date: "2026-09-16", label: "Reaalikoe" }],
  englanti: [{ date: "2026-09-18", label: "Pitkä oppimäärä" }],
  ruotsi: [{ date: "2026-09-21", label: "Keskipitkä/pitkä oppimäärä" }],
  psykologia: [{ date: "2026-09-22", label: "Reaalikoe" }],
  historia: [{ date: "2026-09-22", label: "Reaalikoe" }],
  fysiikka: [{ date: "2026-09-22", label: "Reaalikoe" }],
  biologia: [{ date: "2026-09-22", label: "Reaalikoe" }],
  "matikka-pitka": [{ date: "2026-09-24", label: "Pitkä oppimäärä" }],
  "matikka-lyhyt": [{ date: "2026-09-24", label: "Lyhyt oppimäärä" }],
};

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Seuraava (tai ensimmäinen tuleva) koepäivä aineelle. */
export function nextExamForSubject(subjectId, now = new Date()) {
  const exams = SUBJECT_EXAM_DATES[subjectId];
  if (!exams?.length) return null;

  const today = startOfDay(now);
  const upcoming = exams
    .map((e) => ({ ...e, dateObj: startOfDay(new Date(`${e.date}T09:00:00+03:00`)) }))
    .filter((e) => e.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj);

  return upcoming[0] ?? null;
}

/** Päiviä koepäivään (0 = tänään). Null jos kaikki menneet. */
export function daysUntilExam(subjectId, now = new Date()) {
  const exam = nextExamForSubject(subjectId, now);
  if (!exam) return null;
  const diff = exam.dateObj - startOfDay(now);
  return Math.round(diff / 86400000);
}

export function formatExamDate(isoDate) {
  return new Date(`${isoDate}T09:00:00+03:00`).toLocaleDateString("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
}

/** Kaikki käyttäjän aineiden tulevat kokeet aikajärjestyksessä. */
export function upcomingExamsForSubjects(subjectIds, now = new Date()) {
  const today = startOfDay(now);
  const list = [];
  for (const id of subjectIds) {
    for (const e of SUBJECT_EXAM_DATES[id] ?? []) {
      const dateObj = startOfDay(new Date(`${e.date}T09:00:00+03:00`));
      if (dateObj >= today) {
        list.push({
          subjectId: id,
          date: e.date,
          label: e.label,
          daysLeft: Math.round((dateObj - today) / 86400000),
        });
      }
    }
  }
  return list.sort((a, b) => a.daysLeft - b.daysLeft);
}
