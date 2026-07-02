import { LaudaturLogo } from "./LaudaturChrome";

/** Minimaalinen yläpalkki — ei vie pois quizistä. */
export function QuizFirstHeader({ sourceLabel = null }) {
  return (
    <header className="border-b border-line/80 bg-white">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-5 md:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="LaudaturPro.fi">
          <LaudaturLogo className="h-9 w-9" />
          <span className="font-heading text-base font-extrabold text-navy">
            Laudatur<span className="text-gold">Pro</span>
          </span>
        </a>
        {sourceLabel ? (
          <span className="hidden text-xs font-semibold text-navy/45 sm:inline">{sourceLabel}</span>
        ) : null}
      </div>
    </header>
  );
}
