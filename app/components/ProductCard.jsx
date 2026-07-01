import { orderUrl } from "../config/site";

export function BundleCard({ bundle, featured = false }) {
  const href = orderUrl(bundle.id);
  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 md:p-8 ${
        featured ? "border-gold bg-navy text-white shadow-lg" : "border-line bg-white"
      }`}
    >
      {bundle.badge && (
        <span
          className={`mb-4 inline-flex w-fit rounded-pill px-3 py-1 font-heading text-xs font-bold uppercase ${
            featured ? "bg-gold/20 text-gold" : "bg-navy text-gold"
          }`}
        >
          {bundle.badge}
        </span>
      )}
      <h3 className={`font-heading text-2xl font-extrabold ${featured ? "text-white" : "text-navy"}`}>
        {bundle.name}
      </h3>
      <p className={`mt-2 text-sm ${featured ? "text-white/80" : "text-navy/65"}`}>{bundle.tagline}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className={`font-heading text-4xl font-extrabold ${featured ? "text-gold" : "text-navy"}`}>
          {bundle.priceEur} €
        </span>
        {bundle.compareAtEur && (
          <span className={`text-sm line-through ${featured ? "text-white/45" : "text-navy/40"}`}>
            {bundle.compareAtEur} €
          </span>
        )}
      </div>
      <ul className={`mt-6 flex-1 space-y-2.5 text-sm ${featured ? "text-white/85" : "text-navy/75"}`}>
        {bundle.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={featured ? "text-gold" : "text-gold-dark"} aria-hidden>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`mt-8 inline-flex justify-center rounded-pill px-6 py-3.5 font-heading text-sm font-bold transition-opacity hover:opacity-90 ${
          featured ? "bg-gold text-navy" : "bg-navy text-gold hover:bg-navy-light"
        }`}
      >
        Valitse {bundle.name}
      </a>
    </article>
  );
}

export function CourseCard({ course, groupTitle }) {
  const href = orderUrl(course.id);
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(6,78,59,0.15)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy/45">{groupTitle}</p>
      <h3 className="mt-1 font-heading text-lg font-bold text-navy">{course.name}</h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-heading text-2xl font-extrabold text-navy">{course.priceEur} €</span>
        {course.compareAtEur && (
          <span className="text-sm text-navy/40 line-through">{course.compareAtEur} €</span>
        )}
      </div>
      <a
        href={href}
        className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-bold text-navy hover:text-navy-light"
      >
        Tilaa kurssi
        <span aria-hidden>→</span>
      </a>
    </article>
  );
}
