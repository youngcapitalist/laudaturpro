"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubjectHeader({ subjectId, professor }) {
  const pathname = usePathname();
  const base = `/kurssi/${subjectId}`;

  const tabs = [
    { href: base, label: "Teoria", active: pathname === base },
    { href: `${base}/chat`, label: "AI-professori", active: pathname.endsWith("/chat") },
    { href: `${base}/harkkakoe`, label: "Harkkakoe", active: pathname.endsWith("/harkkakoe") },
  ];

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto max-w-site px-4 py-4 md:px-8">
        <Link href="/kurssi" className="text-xs font-semibold text-navy-muted hover:text-navy">
          ← Omat kurssit
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${professor.accent} font-heading text-sm font-bold text-white`}
          >
            {professor.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-xl font-extrabold text-navy md:text-2xl">{professor.role}</h1>
            <p className="text-sm text-navy-muted">{professor.bio}</p>
          </div>
        </div>
        <nav className="mt-5 flex gap-1 overflow-x-auto" aria-label="Kurssin osiot">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 rounded-pill px-4 py-2 text-sm font-semibold transition ${
                tab.active ? "bg-navy text-gold" : "text-navy/70 hover:bg-mist hover:text-navy"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
