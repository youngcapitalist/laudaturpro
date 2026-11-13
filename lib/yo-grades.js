/**
 * Yo-arvosanaestimaatti pisteosuudesta.
 * Oikeat rajat vaihtelevat kokeittain (suhteellinen arvostelu) —
 * tämä on suuntaa-antava estimaatti tyypillisten rajojen pohjalta.
 */

const GRADE_BANDS = [
  { grade: "L", min: 0.88, label: "Laudatur" },
  { grade: "E", min: 0.76, label: "Eximia cum laude approbatur" },
  { grade: "M", min: 0.6, label: "Magna cum laude approbatur" },
  { grade: "C", min: 0.45, label: "Cum laude approbatur" },
  { grade: "B", min: 0.32, label: "Lubenter approbatur" },
  { grade: "A", min: 0.2, label: "Approbatur" },
  { grade: "I", min: 0, label: "Improbatur" },
];

/** @returns {{grade: string, label: string, ratio: number, nextGrade: string|null, pointsToNext: number|null}} */
export function estimateGrade(points, maxPoints) {
  if (!maxPoints || maxPoints <= 0 || points == null) return null;
  const ratio = Math.max(0, Math.min(1, points / maxPoints));

  const idx = GRADE_BANDS.findIndex((b) => ratio >= b.min);
  const band = GRADE_BANDS[idx] ?? GRADE_BANDS[GRADE_BANDS.length - 1];
  const next = idx > 0 ? GRADE_BANDS[idx - 1] : null;

  return {
    grade: band.grade,
    label: band.label,
    ratio,
    nextGrade: next?.grade ?? null,
    pointsToNext: next ? Math.max(0, Math.ceil(next.min * maxPoints - points)) : null,
  };
}

export const GRADE_ESTIMATE_DISCLAIMER =
  "Estimaatti perustuu tyypillisiin pisterajoihin — viralliset rajat vaihtelevat kokeittain.";
