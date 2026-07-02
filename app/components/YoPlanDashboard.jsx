"use client";

function GaugeBar({ value, target, label, zone }) {
  const pct = Math.min(100, Math.max(0, value));
  const targetPct = Math.min(100, Math.max(0, target));

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-xs font-semibold text-navy/50">{label}</p>
      <p className="mt-1 font-heading text-2xl font-extrabold text-navy">
        {value}
        <span className="text-base font-bold text-navy/40"> / 100</span>
      </p>
      <div className="relative mt-3 h-2.5 overflow-visible rounded-full bg-gradient-to-r from-red-400 via-gold to-emerald-500">
        <div
          className="absolute top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy shadow"
          style={{ left: `${pct}%` }}
          title="Nyt"
        />
        <div
          className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 bg-gold-dark"
          style={{ left: `${targetPct}%` }}
          title="Tavoite"
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-navy/45">
        <span>{zone}</span>
        <span className="text-gold-dark">Tavoite {target}</span>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, badge }) {
  return (
    <div className="relative rounded-xl border border-line bg-white p-4">
      {badge && (
        <span className="absolute right-3 top-3 rounded-md border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
          {badge}
        </span>
      )}
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      <p className="mt-2 text-xs font-semibold text-navy/50">{label}</p>
      <p className="mt-0.5 font-heading text-xl font-extrabold text-navy">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-navy/45">{sub}</p>}
    </div>
  );
}

function HoursBar({ current, target, label }) {
  const pct = Math.min(100, (current / 12) * 100);
  const targetPct = Math.min(100, (target / 12) * 100);

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-xs font-semibold text-navy/50">Viikkorytmi</p>
      <p className="mt-1 font-heading text-xl font-extrabold text-navy">
        {current} h<span className="text-sm font-bold text-navy/40"> / viikko</span>
      </p>
      <p className="text-[11px] text-navy/45">{label}</p>
      <div className="relative mt-3 h-2 rounded-full bg-line">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pct}%` }} />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy shadow"
          style={{ left: `${targetPct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-navy/40">
        <span>0 h</span>
        <span>Suunnitelman rytmi {target} h</span>
        <span>12 h</span>
      </div>
    </div>
  );
}

export default function YoPlanDashboard({ visual }) {
  if (!visual) return null;

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-navy/10 bg-navy p-5 text-white md:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Sinun yhteenvetosi</p>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Tarkastuksen perusteella rakennettu juuri sinulle
          {visual.destination ? (
            <>
              {" "}
              — reitti kohti <span className="font-bold text-gold">{visual.destination}</span>
            </>
          ) : (
            " — ei yleinen malli"
          )}
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {visual.goalLabel && (
            <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold">{visual.goalLabel}</span>
          )}
          {visual.focusLabel && (
            <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold">
              Painopiste: {visual.focusLabel}
            </span>
          )}
          <span className="rounded-pill bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
            +{visual.readinessGain} pistettä valmiutta
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <GaugeBar
          value={visual.readinessNow}
          target={visual.readinessTarget}
          label="Valmius nyt"
          zone={visual.readinessZone}
        />
        <HoursBar
          current={visual.weeklyHours}
          target={visual.weeklyHoursTarget}
          label={visual.weeklyHoursLabel}
        />
        <MetricCard
          icon="📅"
          label="Aikaa kokeeseen"
          value={`${visual.daysLeft} pv`}
          sub={visual.timelineLabel}
          badge="sinulle"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Henkilökohtainen viikkorytmi</p>
          <p className="text-[11px] font-semibold text-navy/45">Painopiste: {visual.blockerLabel}</p>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-slate-wash/60 p-3">
          <div className="min-w-[520px]">
            <div className="mb-2 grid grid-cols-8 gap-1.5">
              <div />
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="text-center text-[10px] font-bold uppercase text-navy/40">
                  Päivä {i + 1}
                </div>
              ))}
            </div>
            {visual.weekGrid.map((week) => (
              <div key={week.label} className="mb-2 grid grid-cols-8 gap-1.5 last:mb-0">
                <div className="flex items-center text-[10px] font-bold uppercase text-navy/50">{week.label}</div>
                {week.days.map((day) => (
                  <div
                    key={`${week.label}-${day.day}`}
                    className={`rounded-lg px-1.5 py-2 text-center ${day.tone}`}
                  >
                    <p className="text-[10px] font-bold leading-tight">{day.label}</p>
                    {day.sub && <p className="mt-0.5 text-[9px] opacity-70">{day.sub}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-navy/45">
          Esimerkkirytmi {visual.subjectCount} aineelle — tarkennetaan kurssilla henkilökohtaisesti.
        </p>
      </div>
    </div>
  );
}

export function YoPlanOfferCard({
  visual,
  displayPrice,
  listPrice,
  compareAt,
  showOfferDiscount,
  showCompareAt,
  offerLoading,
  savingsVsIndividual,
  checkoutUrl,
  email,
  offerEmailSent = false,
}) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-gold bg-gradient-to-br from-navy via-navy to-navy-light p-6 text-white shadow-glow md:p-8">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-pill bg-gold px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-navy">
            Henkilökohtainen tarjous
          </span>
          {visual?.offerBadge && (
            <span className="rounded-pill border border-white/25 bg-white/10 px-3 py-1 font-heading text-[11px] font-bold uppercase text-gold">
              {visual.offerBadge}
            </span>
          )}
          <span className="ml-auto text-xs font-semibold text-white/50">Voimassa 7 päivää</span>
        </div>

        <p className="mt-4 text-sm text-white/75">Hinta sidottu tarkastukseesi — ei julkinen listahinta.</p>

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <p className="font-heading text-5xl font-extrabold text-gold">
            {offerLoading ? "…" : displayPrice}
            <span className="text-2xl"> €</span>
          </p>
          {!offerLoading && showOfferDiscount && (
            <p className="text-xl font-semibold text-white/35 line-through">{listPrice} €</p>
          )}
          {!offerLoading && visual?.dailyPrice && (
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-center">
              <p className="font-heading text-lg font-bold text-white">{visual.dailyPrice} €</p>
              <p className="text-[10px] font-semibold uppercase text-white/45">/ päivä</p>
            </div>
          )}
        </div>

        {!offerLoading && showCompareAt && compareAt !== listPrice && (
          <p className="mt-2 text-sm text-white/45 line-through">{compareAt} € erikseen</p>
        )}

        {!offerLoading && savingsVsIndividual != null && savingsVsIndividual > 0 && (
          <p className="mt-3 inline-flex rounded-lg bg-gold/15 px-3 py-1.5 text-sm font-bold text-gold">
            Säästät {savingsVsIndividual} € verrattuna erillisiin kursseihin
          </p>
        )}

        <a
          href={checkoutUrl}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-gold px-6 py-4 font-heading text-base font-bold text-navy shadow-lg transition hover:bg-gold-light ${
            offerLoading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {offerLoading ? "Päivitetään…" : `Hae minun suunnitelmani — ${displayPrice} €`}
        </a>
        <p className="mt-2 text-center text-xs text-white/45">
          {offerEmailSent
            ? `Henkilökohtainen suunnitelma · tarjous lähetetty myös ${email?.trim()}`
            : `Henkilökohtainen suunnitelma · sidottu osoitteeseen ${email?.trim()}`}
        </p>
      </div>
    </div>
  );
}
