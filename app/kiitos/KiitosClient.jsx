"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LaudaturNav, LaudaturFooter } from "../components/LaudaturChrome";

export default function KiitosClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const [state, setState] = useState("loading");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setState("missing");
      return;
    }
    fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "verify_failed");
        setInfo(data);
        setState("ok");
      })
      .catch(() => setState("error"));
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-slate-wash">
      <LaudaturNav />
      <section className="mx-auto max-w-lg px-5 py-20 md:px-8">
        {state === "loading" && (
          <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
            <p className="font-heading text-xl font-bold text-navy">Vahvistetaan maksua…</p>
          </div>
        )}
        {state === "ok" && (
          <div className="rounded-card border border-gold/40 bg-white p-8 text-center shadow-glow">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy font-heading text-2xl text-gold">
              ✓
            </div>
            <h1 className="mt-5 font-heading text-2xl font-extrabold text-navy">Maksu onnistui!</h1>
            <p className="mt-3 text-sm text-navy/70">
              {info?.productName ? (
                <>
                  <strong>{info.productName}</strong> — pääsy aktivoitu sähköpostiin{" "}
                  <strong>{info.email}</strong>.
                </>
              ) : (
                <>Lähetämme kirjautumisohjeet sähköpostiisi pian.</>
              )}
            </p>
            <a href="/" className="mt-8 inline-flex rounded-pill bg-navy px-6 py-3 font-heading text-sm font-bold text-gold">
              Takaisin etusivulle
            </a>
          </div>
        )}
        {state === "error" && (
          <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
            <p className="font-heading text-xl font-bold text-navy">Maksun vahvistus epäonnistui</p>
            <p className="mt-2 text-sm text-navy/70">
              Jos maksu meni läpi, ota yhteyttä info@laudaturpro.fi — tilaus löytyy Stripesstä.
            </p>
          </div>
        )}
        {state === "missing" && (
          <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
            <p className="text-sm text-navy/70">Puuttuva maksutunniste.</p>
            <a href="/" className="mt-4 inline-block text-sm font-bold text-navy underline">
              Etusivulle
            </a>
          </div>
        )}
      </section>
      <LaudaturFooter />
    </main>
  );
}
