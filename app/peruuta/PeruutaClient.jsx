"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";

export default function PeruutaClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/drip/unsubscribe?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.valid) {
          setStatus("invalid");
          return;
        }
        setBrand(d.brand || d.stream);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  async function confirmUnsubscribe() {
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch(`/api/drip/unsubscribe?token=${encodeURIComponent(token)}`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "failed");
      setStatus("done");
    } catch {
      setError("Peruutus epäonnistui. Yritä uudelleen.");
      setStatus("ready");
    }
  }

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 shadow-card">
          {status === "loading" && <p className="text-navy/70">Ladataan…</p>}
          {status === "invalid" && (
            <>
              <h1 className="font-heading text-xl font-bold text-navy">Linkki ei ole voimassa</h1>
              <p className="mt-3 text-sm text-navy/70">Peruutuslinkki on vanhentunut tai virheellinen.</p>
            </>
          )}
          {status === "ready" && (
            <>
              <h1 className="font-heading text-xl font-bold text-navy">Peru markkinointi</h1>
              <p className="mt-3 text-sm text-navy/70">
                Haluatko lopettaa <strong>{brand}</strong> -markkinointiviestit? Et saa enää follow-up -tarjouksia
                tähän tuotteeseen. Muut palvelut eivät muutu.
              </p>
              {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
              <button
                type="button"
                onClick={confirmUnsubscribe}
                className="mt-6 w-full rounded-pill bg-navy py-3 font-heading text-sm font-bold text-gold"
              >
                Kyllä, peru markkinointi
              </button>
            </>
          )}
          {status === "submitting" && <p className="text-navy/70">Käsitellään…</p>}
          {status === "done" && (
            <>
              <h1 className="font-heading text-xl font-bold text-navy">Valmis</h1>
              <p className="mt-3 text-sm text-navy/70">
                Markkinointiviestit on peruttu. Jos olet jo asiakas, kurssisi ja tiliisi pysyvät ennallaan.
              </p>
            </>
          )}
        </div>
      </section>
      <LaudaturFooter />
    </main>
  );
}
