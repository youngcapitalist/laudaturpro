export function LaudaturLogo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="10" fill="#0A2540" />
      <path d="M20 8c-5.5 0-9 3.5-9 8.5 0 4 2.8 7 7 8.2L20 32l2-7.3c4.2-1.2 7-4.2 7-8.2C29 11.5 25.5 8 20 8z" fill="#D4AF37" />
      <text x="20" y="20.5" textAnchor="middle" dominantBaseline="central" fill="#0A2540" fontFamily="system-ui,sans-serif" fontWeight="800" fontSize="13">
        L
      </text>
    </svg>
  );
}

export function LaudaturNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-site items-center gap-6 px-5 md:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="LaudaturPro.fi">
          <LaudaturLogo />
          <span className="font-heading text-lg font-extrabold tracking-tight text-white">
            Laudatur<span className="text-gold">Pro</span>
          </span>
        </a>
        <nav className="hidden flex-1 items-center gap-6 md:flex" aria-label="Päävalikko">
          {[
            { label: "Professorit", href: "/#professorit" },
            { label: "Paketit", href: "/#paketit" },
            { label: "Kurssit", href: "/#kurssit" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-semibold text-white/75 transition hover:text-gold">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="/tilaa?paketti=laudatur-pro"
          className="ml-auto rounded-pill bg-gold px-5 py-2.5 font-heading text-sm font-bold text-navy shadow-glow transition hover:bg-gold-light"
        >
          Aloita nyt
        </a>
      </div>
    </header>
  );
}

export function LaudaturFooter() {
  return (
    <footer className="border-t border-line bg-navy-dark text-white">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <LaudaturLogo />
            <span className="font-heading text-lg font-extrabold">LaudaturPro</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Yo-valmennus laudatur-tavoitteella. Oma alusta — erillään valintakokeista, sama luotettava infra.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Tuotteet</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href="/#paketit" className="hover:text-gold">Laudatur Pro</a></li>
            <li><a href="/#kurssit" className="hover:text-gold">Ainekurssit</a></li>
            <li><a href="/tilaa" className="hover:text-gold">Tilaus</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Linkit</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><a href="https://paasykoe.fi/todistusvalinta/laskuri" className="hover:text-gold">Todistusvalintalaskuri</a></li>
            <li><a href="https://paasykoe.fi" className="hover:text-gold">Pääsykoe.fi</a></li>
            <li><a href="mailto:info@laudaturpro.fi" className="hover:text-gold">Yhteystiedot</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LaudaturPro.fi · Maksu Stripe · Kevään 2026 yo-kokeisiin
      </div>
    </footer>
  );
}
