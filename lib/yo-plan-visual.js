import { YO_CHECKUP_STEPS } from "./yo-checkup";
import { YO_QUIZ_SUBJECTS } from "./yo-quiz";

const FEELING_SCORE = {
  ok: 68,
  unsure: 48,
  stressed: 34,
  overwhelmed: 22,
};

/** Lukiokurssien keskiarvo → lähtötasopisteet. */
const GRADE_SCORE = {
  "9to10": 82,
  "8to9": 68,
  "7to8": 54,
  "6to7": 40,
  under6: 28,
};

const GOAL_TARGET = {
  grades: 78,
  pass: 62,
  best: 92,
};

const HOURS_META = {
  under3: { label: "Alle 3 h", hours: 2.5, target: 4 },
  "3to6": { label: "3–6 h", hours: 4.5, target: 6 },
  "6to10": { label: "6–10 h", hours: 8, target: 8 },
  over10: { label: "Yli 10 h", hours: 12, target: 10 },
};

const TIMELINE_DAYS = {
  fall2026: 95,
  spring2027: 280,
  retake: 120,
  unsure: 150,
};

const BLOCKER_FOCUS = {
  theory: "Teoria + kokonaisuus",
  practice: "Yo-tyyliset tehtävät",
  motivation: "Viikkorytmi + seuranta",
  time: "Tehokas tiivistelmäpolku",
};

const DAY_TYPES = {
  theory: { short: "Teoria", tone: "bg-navy/10 text-navy" },
  practice: { short: "Harjoitus", tone: "bg-gold/20 text-navy" },
  exam: { short: "Harkkakoe", tone: "bg-navy text-gold" },
  rest: { short: "Lepo", tone: "bg-slate-wash text-navy/45" },
  focus: { short: "Painopiste", tone: "bg-gold/35 text-navy font-bold" },
};

function subjectLabel(id) {
  return YO_QUIZ_SUBJECTS.find((s) => s.id === id)?.label?.split(",")[0]?.trim() || id;
}

function shortSubject(id) {
  const full = subjectLabel(id);
  return full.length > 8 ? full.slice(0, 7) + "." : full;
}

/** 2 viikkoa × 7 päivää — henkilökohtainen rytmi valituille aineille. */
function buildWeekGrid(coveredIds, focusSubjectId) {
  const ids = coveredIds.length ? coveredIds : ["englanti"];
  const focus = focusSubjectId && ids.includes(focusSubjectId) ? focusSubjectId : ids[0];
  const pattern = [
    ["theory", "practice", "theory", "rest", "practice", "exam", "rest"],
    ["focus", "theory", "practice", "rest", "focus", "exam", "rest"],
  ];

  return pattern.map((week, wi) => ({
    label: `Viikko ${wi + 1}`,
    days: week.map((type, di) => {
      const subjectId = type === "focus" ? focus : ids[(wi * 7 + di) % ids.length];
      const meta = DAY_TYPES[type];
      const subj = type === "rest" ? null : shortSubject(subjectId);
      return {
        day: di + 1,
        type,
        label: type === "rest" ? meta.short : `${subj}`,
        sub: type === "rest" ? "" : meta.short,
        tone: meta.tone,
      };
    }),
  }));
}

function checkupLabel(stepId, answerId) {
  const step = YO_CHECKUP_STEPS.find((s) => s.id === stepId);
  return step?.options.find((o) => o.id === answerId)?.label ?? null;
}

/** MadGym-tyylinen henkilökohtainen dashboard-data quiz-vastauksista. */
export function buildPlanVisual({
  checkupAnswers = {},
  goal = null,
  focusSubjectId = null,
  coveredIds = [],
  coveredLabels = [],
  destination = null,
  displayPrice = null,
  listPrice = null,
  gradeLevelId = null,
}) {
  const feelingId = checkupAnswers.current_feeling;
  const hoursId = checkupAnswers.weekly_hours;
  const blockerId = checkupAnswers.biggest_blocker;
  const timelineId = checkupAnswers.timeline;

  const feelingScore = FEELING_SCORE[feelingId] ?? 45;
  const gradeScore = GRADE_SCORE[gradeLevelId] ?? null;
  // Lähtötaso painottaa kurssikeskiarvoa (osaaminen) enemmän kuin tuntemusta.
  const readinessNow =
    gradeScore != null ? Math.round(gradeScore * 0.6 + feelingScore * 0.4) : feelingScore;
  const readinessTarget = GOAL_TARGET[goal?.id] ?? 75;
  const hours = HOURS_META[hoursId] ?? { label: "4–6 h", hours: 5, target: 6 };
  const daysLeft = TIMELINE_DAYS[timelineId] ?? 120;
  const blockerLabel = BLOCKER_FOCUS[blockerId] ?? "Rakennettu eteneminen";
  const focusLabel = focusSubjectId ? subjectLabel(focusSubjectId) : coveredLabels[0] ?? null;

  const discountPct =
    displayPrice != null && listPrice != null && listPrice > displayPrice
      ? Math.round((1 - displayPrice / listPrice) * 100)
      : null;

  const dailyPrice =
    displayPrice != null ? (displayPrice / Math.max(daysLeft, 30)).toFixed(2).replace(".", ",") : null;

  const readinessZone =
    readinessNow >= 60 ? "Hyvä pohja" : readinessNow >= 40 ? "Parannettavaa" : "Tarvitsee tuen";

  return {
    destination,
    readinessNow,
    readinessTarget,
    readinessZone,
    readinessGain: Math.max(readinessTarget - readinessNow, 8),
    weeklyHours: hours.hours,
    weeklyHoursLabel: hours.label,
    weeklyHoursTarget: hours.target,
    daysLeft,
    timelineLabel: checkupLabel("timeline", timelineId) ?? "Syksy 2026",
    blockerLabel,
    focusLabel,
    goalLabel: goal?.label ?? null,
    subjectCount: coveredIds.length,
    weekGrid: buildWeekGrid(coveredIds, focusSubjectId),
    discountPct,
    dailyPrice,
    offerBadge: discountPct != null && discountPct >= 5 ? `-${discountPct}%` : "Vain sinulle",
  };
}
