"use client";

const GROUPS = [
  {
    label: "Kaavat",
    symbols: [
      { label: "√", latex: "\\sqrt{#0}", title: "Neliöjuuri" },
      { label: "xⁿ", latex: "^{#0}", title: "Eksponentti" },
      { label: "a/b", latex: "\\frac{#0}{#0}", title: "Murtoluku" },
      { label: "∫", latex: "\\int_{#0}^{#0}", title: "Integraali" },
      { label: "∑", latex: "\\sum_{#0}^{#0}", title: "Summa" },
      { label: "lim", latex: "\\lim_{#0}", title: "Raja-arvo" },
      { label: "|x|", latex: "\\left|#0\\right|", title: "Itseisarvo" },
      { label: "( )", latex: "\\left(#0\\right)", title: "Sulut" },
      { label: "sin", latex: "\\sin\\left(#0\\right)", title: "Sini" },
      { label: "cos", latex: "\\cos\\left(#0\\right)", title: "Kosini" },
      { label: "tan", latex: "\\tan\\left(#0\\right)", title: "Tangentti" },
      { label: "→", latex: "\\vec{#0}", title: "Vektori" },
      { label: "T", latex: "\\text{#0}", title: "Teksti (selitys)" },
      { label: "↵", latex: "\\\\", title: "Rivinvaihto" },
    ],
  },
  {
    label: "Perus",
    symbols: [
      { label: "°", latex: "^{\\circ}", title: "Aste" },
      { label: "·", latex: "\\cdot", title: "Kertolasku" },
      { label: "±", latex: "\\pm", title: "Plus miinus" },
      { label: "∞", latex: "\\infty", title: "Ääretön" },
      { label: "x²", latex: "^{2}", title: "Neliö" },
      { label: "x³", latex: "^{3}", title: "Kuutio" },
      { label: "½", latex: "\\frac{1}{2}", title: "Puolikas" },
    ],
  },
  {
    label: "Algebra",
    symbols: [
      { label: "≠", latex: "\\neq", title: "Eri suuri" },
      { label: "≈", latex: "\\approx", title: "Noin" },
      { label: "≤", latex: "\\leq", title: "Pienempi tai yhtä suuri" },
      { label: "≥", latex: "\\geq", title: "Suurempi tai yhtä suuri" },
      { label: "<", latex: "<", title: "Pienempi" },
      { label: ">", latex: ">", title: "Suurempi" },
    ],
  },
  {
    label: "Kreikka",
    symbols: [
      { label: "π", latex: "\\pi", title: "Pii" },
      { label: "α", latex: "\\alpha", title: "Alpha" },
      { label: "β", latex: "\\beta", title: "Beta" },
      { label: "γ", latex: "\\gamma", title: "Gamma" },
      { label: "Δ", latex: "\\Delta", title: "Delta" },
      { label: "δ", latex: "\\delta", title: "Delta pieni" },
      { label: "θ", latex: "\\theta", title: "Theta" },
      { label: "λ", latex: "\\lambda", title: "Lambda" },
      { label: "μ", latex: "\\mu", title: "My" },
      { label: "σ", latex: "\\sigma", title: "Sigma" },
      { label: "ω", latex: "\\omega", title: "Omega" },
    ],
  },
  {
    label: "Geo & fys",
    symbols: [
      { label: "∠", latex: "\\angle", title: "Kulma" },
      { label: "∥", latex: "\\parallel", title: "Yhdensuoraiset" },
      { label: "⊥", latex: "\\perp", title: "Kohtisuora" },
      { label: "→", latex: "\\rightarrow", title: "Nuoli" },
      { label: "⇌", latex: "\\rightleftharpoons", title: "Tasapaino (kemia)" },
      { label: "H₂O", latex: "\\mathrm{H_2O}", title: "Kemiallinen kaava" },
    ],
  },
];

export default function MathSymbolToolbar({ onInsert, onOpenKeyboard, disabled }) {
  return (
    <div className="rounded-t-xl border border-b-0 border-line bg-mist/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-navy/45">Symbolit</p>
        <button
          type="button"
          disabled={disabled}
          onClick={onOpenKeyboard}
          className="rounded-pill border border-line bg-white px-3 py-1 text-[11px] font-semibold text-navy hover:border-navy/30 disabled:opacity-50"
        >
          Näppäimistö
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-navy/40">{group.label}</p>
            <div className="flex flex-wrap gap-1">
              {group.symbols.map((sym) => (
                <button
                  key={`${group.label}-${sym.label}`}
                  type="button"
                  disabled={disabled}
                  title={sym.title}
                  onClick={() => onInsert(sym.latex)}
                  className="min-w-[2rem] rounded-lg border border-line bg-white px-2 py-1.5 text-sm font-medium text-navy transition hover:border-navy/30 hover:bg-white disabled:opacity-50"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
