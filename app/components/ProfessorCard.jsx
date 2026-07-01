export function ProfessorCard({ professor }) {
  return (
    <article className="group flex flex-col rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${professor.accent} font-heading text-lg font-extrabold text-white shadow-md`}
        >
          {professor.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">{professor.role}</p>
          <h3 className="font-heading text-lg font-bold text-navy">{professor.name}</h3>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-navy/70">{professor.bio}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
        AI-professori kurssilla — rajaton kysyminen
      </p>
    </article>
  );
}
