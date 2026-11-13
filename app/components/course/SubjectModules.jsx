import { DEFAULT_INCLUDES } from "../../../lib/platform-content";

export function SubjectModules({ content }) {
  if (!content?.modules?.length) return null;

  return (
    <section>
      <h2 className="font-heading text-lg font-bold text-navy">Osa-alueet</h2>
      <p className="mt-1 text-sm text-navy/60">
        {content.code ? `${content.code} · ` : ""}
        {content.modules.length} osa-aluetta — käy läpi järjestyksessä tai kohdenna heikkouksiin.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {content.modules.map((m) => (
          <li
            key={m}
            className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-medium text-navy/80"
          >
            {m}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SubjectIncludes() {
  return (
    <div className="rounded-card border border-gold/30 bg-navy/5 p-5">
      <p className="font-heading font-bold text-navy">Kurssilla mukana</p>
      <ul className="mt-3 space-y-2 text-sm text-navy/75">
        {DEFAULT_INCLUDES.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-gold" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
