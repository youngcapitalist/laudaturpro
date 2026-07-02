import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { getAccessibleSubjectIds } from "../../lib/access";
import { PROFESSOR_GROUPS } from "../../lib/professors";
import { upcomingExamsForSubjects, EXAM_SEASON_LABEL } from "../../lib/yo-exam-dates";
import { progressSummaryForSubjects } from "../../lib/practice-progress";

export const dynamic = "force-dynamic";

function ExamCountdownStrip({ exams, roleById }) {
  if (exams.length === 0) return null;
  return (
    <section className="mt-8 rounded-card border border-gold/40 bg-navy p-6 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-lg font-bold text-gold">Koepäivälaskuri — {EXAM_SEASON_LABEL}</h2>
        <p className="text-xs text-white/60">Kokeet alkavat klo 9.00 (YTL)</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {exams.slice(0, 4).map((e) => (
          <div key={`${e.subjectId}-${e.date}`} className="rounded-xl bg-white/5 p-4">
            <p className="font-heading text-3xl font-extrabold text-gold">{e.daysLeft} pv</p>
            <p className="mt-1 text-sm font-semibold text-white">{roleById[e.subjectId] ?? e.subjectId}</p>
            <p className="text-xs text-white/60">
              {e.label} ·{" "}
              {new Date(`${e.date}T09:00:00+03:00`).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgressBadge({ progress }) {
  if (!progress || progress.answered === 0) {
    return <span className="rounded-pill bg-mist px-2.5 py-1 text-navy/60">Aloita harjoittelu</span>;
  }
  const pct = Math.round((progress.correct / progress.answered) * 100);
  const tone = pct >= 70 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800";
  return (
    <span className={`rounded-pill px-2.5 py-1 ${tone}`}>
      {progress.answered}/{progress.total} tehtävää · {pct} %
      {progress.reviewQueue.length > 0 && ` · ${progress.reviewQueue.length} kerrattavaa`}
    </span>
  );
}

export default async function KurssiDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const allowedIds = await getAccessibleSubjectIds(user.email);
  const allowedSet = new Set(allowedIds);

  const upcomingExams = upcomingExamsForSubjects(allowedIds);
  let progressBySubject = {};
  try {
    progressBySubject = await progressSummaryForSubjects(user.email, allowedIds);
  } catch {
    // Edistymistiedot eivät saa kaataa dashboardia.
  }

  const roleById = {};
  for (const group of PROFESSOR_GROUPS) {
    for (const p of group.professors) roleById[p.id] = p.role;
  }

  return (
    <main className="mx-auto max-w-site px-4 py-10 md:px-8">
      <h1 className="font-heading text-3xl font-extrabold text-navy">Omat kurssit</h1>
      <p className="mt-2 text-navy/70">
        Teoria, harjoittelu, AI-professorit ja harkkakokeet syksyn 2026 yo-kokeisiin. Valitse aine alta.
      </p>

      {allowedIds.length > 0 && <ExamCountdownStrip exams={upcomingExams} roleById={roleById} />}

      {allowedIds.length === 0 ? (
        <div className="mt-10 rounded-card border border-line bg-white p-8 text-center shadow-card">
          <p className="font-heading text-lg font-bold text-navy">Ei aktiivista kurssipääsyä</p>
          <p className="mt-2 text-sm text-navy/65">
            Varmista että kirjaudut samalla sähköpostilla kuin maksussa. Jos maksoit juuri, odota hetki ja päivitä sivu.
          </p>
          <Link href="/tilaa?paketti=laudatur-pro" className="mt-6 inline-flex rounded-pill bg-navy px-6 py-3 text-sm font-bold text-gold">
            Tilaa kurssi
          </Link>
        </div>
      ) : (
        PROFESSOR_GROUPS.map((group) => {
          const profs = group.professors.filter((p) => allowedSet.has(p.id));
          if (profs.length === 0) return null;
          return (
            <section key={group.id} className="mt-10">
              <h2 className="font-heading text-xl font-bold text-navy">{group.title}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profs.map((p) => (
                  <Link
                    key={p.id}
                    href={`/kurssi/${p.id}`}
                    className="group flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} font-heading text-sm font-bold text-white`}
                    >
                      {p.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-bold text-navy group-hover:text-navy-light">{p.role}</p>
                      <p className="mt-1 text-sm text-navy-muted line-clamp-2">{p.bio}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <ProgressBadge progress={progressBySubject[p.id]} />
                        <span className="rounded-pill bg-gold/15 px-2.5 py-1 text-navy/70">Harkkakoe</span>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-gold-dark">Avaa kurssi →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
