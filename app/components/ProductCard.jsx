import { orderUrl, checkoutUrl } from "../config/site";
import { getProfessorById } from "../../lib/access";

export function BundleCard({ bundle, featured = false }) {
  const href = orderUrl(bundle.id);
  return (
    <article
      className={`relative flex flex-col rounded-card border p-7 md:p-8 ${
        featured
          ? "border-gold/50 bg-navy text-white shadow-glow"
          : "border-line bg-white shadow-card"
      }`}
    >
      {bundle.badge && (
        <span
          className={`mb-4 inline-flex w-fit rounded-pill px-3 py-1 text-xs font-bold uppercase ${
            featured ? "bg-gold/20 text-gold" : "bg-navy text-gold"
          }`}
        >
          {bundle.badge}
        </span>
      )}
      <h3 className={`font-heading text-2xl font-extrabold ${featured ? "text-white" : "text-navy"}`}>{bundle.name}</h3>
      <p className={`mt-2 text-sm ${featured ? "text-white/75" : "text-navy/65"}`}>{bundle.tagline}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className={`font-heading text-4xl font-extrabold ${featured ? "text-gold" : "text-navy"}`}>
          {bundle.priceEur} €
        </span>
        {bundle.compareAtEur && (
          <span className={`text-sm line-through ${featured ? "text-white/40" : "text-navy/40"}`}>
            {bundle.compareAtEur} €
          </span>
        )}
      </div>
      <ul className={`mt-6 flex-1 space-y-2.5 text-sm ${featured ? "text-white/85" : "text-navy/75"}`}>
        {bundle.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-gold" aria-hidden>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`mt-8 inline-flex justify-center rounded-pill px-6 py-3.5 font-heading text-sm font-bold transition ${
          featured ? "bg-gold text-navy hover:bg-gold-light" : "bg-navy text-white hover:bg-navy-light"
        }`}
      >
        Valitse {bundle.name}
      </a>
    </article>
  );
}

export function CourseCard({ course, groupTitle }) {
  const buyHref = checkoutUrl(course.id);
  const previewHref = getProfessorById(course.id) ? `/aine/${course.id}` : null;

  return (
    <article className="flex flex-col rounded-card border border-line bg-white p-5 shadow-card transition hover:shadow-glow">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">{groupTitle}</p>
      <h3 className="mt-1 font-heading text-lg font-bold text-navy">{course.name}</h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-heading text-2xl font-extrabold text-navy">{course.priceEur} €</span>
        {course.compareAtEur && <span className="text-sm text-navy/40 line-through">{course.compareAtEur} €</span>}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {previewHref && (
          <a
            href={previewHref}
            className="inline-flex items-center gap-1 font-heading text-sm font-bold text-gold-dark hover:text-navy"
          >
            Kokeile AI-professoria (3 kysymystä) <span aria-hidden>→</span>
          </a>
        )}
        <a href={buyHref} className="inline-flex items-center gap-1 font-heading text-sm font-bold text-navy hover:text-gold-dark">
          Tilaa kurssi <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
