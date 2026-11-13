"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { randomSocialProofEvent } from "../../lib/social-proof";

const INTERVAL_MS = 60_000;
const VISIBLE_MS = 6_000;
const INITIAL_DELAY_MIN = 8_000;
const INITIAL_DELAY_MAX = 20_000;

export default function SocialProofToast() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState(null);
  const hideTimer = useRef(null);
  const intervalRef = useRef(null);

  const showNext = useCallback(() => {
    setEvent(randomSocialProofEvent());
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/social-proof/eligible")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.show) setEnabled(true);
      })
      .catch(() => {
        if (!cancelled) setEnabled(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const initialDelay =
      INITIAL_DELAY_MIN + Math.floor(Math.random() * (INITIAL_DELAY_MAX - INITIAL_DELAY_MIN));

    const startTimer = setTimeout(() => {
      showNext();
      intervalRef.current = setInterval(showNext, INTERVAL_MS);
    }, initialDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalRef.current);
      clearTimeout(hideTimer.current);
    };
  }, [enabled, showNext]);

  if (!enabled || !event) return null;

  const initial = event.name.charAt(0).toUpperCase();

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 max-w-[min(100vw-2rem,22rem)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-card border border-line bg-white p-3.5 shadow-card transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        role="status"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-heading text-sm font-bold text-gold"
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/45">Juuri nyt</p>
          <p className="mt-0.5 text-sm leading-snug text-navy">
            <span className="font-semibold">{event.name}</span> {event.action}
          </p>
        </div>
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden title="Aktiivinen" />
      </div>
    </div>
  );
}
