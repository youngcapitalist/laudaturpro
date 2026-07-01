export function LaudaturLogo({ className = "h-11 w-11" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="4" y="4" width="40" height="40" rx="10" fill="#064e3b" />
      <path
        d="M24 10c-6.5 0-11 4.2-11 10.5 0 5.2 3.4 8.8 8.5 10.2L24 38l2.5-7.3c5.1-1.4 8.5-5 8.5-10.2C35 14.2 30.5 10 24 10z"
        fill="#6ee7b7"
      />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#064e3b"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="14"
      >
        L
      </text>
    </svg>
  );
}

export function LaudaturNav() {
  const links = [
    { label: "Kurssit", href: "/#kurssit" },
    { label: "Paketit", href: "/#paketit" },
    { label: "Usein kysyttyä", href: "/#faq" },
  ];

  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex h-[88px] max-w-site items-center gap-8 px-6 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label="LaudaturPro.fi">
          <LaudaturLogo />
          <span className="hidden font-heading text-lg font-extrabold text-white sm:inline">LaudaturPro</span>
        </a>
        <nav className="hidden flex-1 items-center gap-7 md:flex" aria-label="Päävalikko">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-heading text-[15px] font-semibold text-white/90 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="/tilaa?paketti=laudatur-pro"
          className="ml-auto rounded-pill bg-gold px-5 py-2.5 font-heading text-sm font-bold text-navy transition-opacity hover:opacity-90"
        >
          Tilaa nyt
        </a>
      </div>
    </header>
  );
}

export function LaudaturFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-site gap-10 px-6 py-14 md:grid-cols-3 md:px-8">
        <div>
          <LaudaturLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Yo-valmennus kaikissa aineissa — paranna arvosanoja ja nosta todistusvalinnan pisteitä.
          </p>
        </div>
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Kurssit</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <a href="/#paketit" className="hover:text-gold">
                Laudatur Pro
              </a>
            </li>
            <li>
              <a href="/#kurssit" className="hover:text-gold">
                Yksittäiset aineet
              </a>
            </li>
            <li>
              <a href="/tilaa" className="hover:text-gold">
                Tilaus
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-gold">Linkit</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <a href="https://paasykoe.fi/todistusvalinta/laskuri" className="hover:text-gold">
                Todistusvalintalaskuri
              </a>
            </li>
            <li>
              <a href="https://paasykoe.fi" className="hover:text-gold">
                Pääsykoe.fi
              </a>
            </li>
            <li>
              <a href="mailto:info@laudaturpro.fi" className="hover:text-gold">
                Yhteystiedot
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} LaudaturPro.fi
      </div>
    </footer>
  );
}
