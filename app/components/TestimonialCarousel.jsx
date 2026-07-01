"use client";

import { useState } from "react";
import { TESTIMONIAL_COUNT, TESTIMONIALS, testimonialPages } from "../../lib/testimonials";

const PAGES = testimonialPages();

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 tähteä">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-gold" aria-hidden>
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.77l-4.94 2.94.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 5.28l-4.5 4.5a.75.75 0 01-1.06 0l-2-2a.75.75 0 111.06-1.06l1.47 1.47 3.97-3.97a.75.75 0 111.06 1.06z" />
      </svg>
      Vahvistettu
    </span>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm md:p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.accent} text-xs font-bold text-white`}
          aria-hidden
        >
          {item.initials}
        </div>
        <p className="font-heading text-sm font-bold text-white">{item.name}</p>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{item.text}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <Stars />
        <VerifiedBadge />
      </div>
    </article>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      {direction === "left" ? <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {direction === "right" ? <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
}

export default function TestimonialCarousel() {
  const [page, setPage] = useState(0);
  const total = PAGES.length;

  function goPrev() {
    setPage((p) => (p - 1 + total) % total);
  }

  function goNext() {
    setPage((p) => (p + 1) % total);
  }

  const visible = PAGES[page] || PAGES[0];

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-navy-dark py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,58,92,0.5)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-site px-6 md:px-8">
        <header className="text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-white/50">
            Olemme auttaneet jo
          </p>
          <p className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            {TESTIMONIAL_COUNT}+ opiskelijaa
          </p>
          <p className="mt-3 text-sm text-white/55 md:text-base">
            valmistautumaan syksyn 2026 yo-kokeisiin
          </p>
        </header>

        <div className="relative mt-12">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Edelliset arviot"
            className="absolute -left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:-left-5 md:h-12 md:w-12"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="mx-8 grid gap-4 md:grid-cols-3 md:gap-5 lg:mx-10">
            {visible.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Seuraavat arviot"
            className="absolute -right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:-right-5 md:h-12 md:w-12"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Arvostelusivut">
          {PAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Sivu ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-6 bg-gold" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
