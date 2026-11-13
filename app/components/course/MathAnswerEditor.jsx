"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MathSymbolToolbar from "./MathSymbolToolbar";

import "mathlive/static.css";

export default function MathAnswerEditor({ value, onChange, placeholder, disabled }) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mf = null;
    let cancelled = false;

    async function init() {
      const { MathfieldElement } = await import("mathlive");
      if (cancelled || !hostRef.current) return;

      mf = new MathfieldElement();
      mf.className = "math-answer-field";
      mf.defaultMode = "math";
      mf.mathVirtualKeyboardPolicy = "manual";
      mf.placeholder = placeholder || "Kirjoita ratkaisu ja välivaiheet…";
      mf.setValue(value || "", { silenceNotifications: true });

      mf.addEventListener("input", () => {
        onChange?.(mf.getValue("latex"));
      });

      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(mf);
      mfRef.current = mf;
      setReady(true);
    }

    init();

    return () => {
      cancelled = true;
      mf?.remove();
      mfRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf || !ready) return;
    const current = mf.getValue("latex");
    if (current !== (value || "")) {
      mf.setValue(value || "", { silenceNotifications: true });
    }
  }, [value, ready]);

  const insert = useCallback((latex) => {
    const mf = mfRef.current;
    if (!mf || disabled) return;
    mf.focus();
    mf.insert(latex, { focus: true, feedback: true, mode: "math" });
    onChange?.(mf.getValue("latex"));
  }, [disabled, onChange]);

  const openKeyboard = useCallback(() => {
    if (typeof window !== "undefined" && window.mathVirtualKeyboard) {
      window.mathVirtualKeyboard.show({ animate: true });
    }
    mfRef.current?.focus();
  }, []);

  return (
    <div className={`math-answer-editor ${disabled ? "opacity-60" : ""}`}>
      <MathSymbolToolbar onInsert={insert} onOpenKeyboard={openKeyboard} disabled={disabled || !ready} />
      <div
        ref={hostRef}
        className="rounded-b-xl border border-line bg-white px-1 py-1 focus-within:border-navy focus-within:ring-2 focus-within:ring-gold/30"
        aria-busy={!ready}
      />
      {!ready && (
        <p className="mt-2 text-xs text-navy/45">Ladataan editoria…</p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-navy/50">
        Kirjoita välivaiheet ja kaavat. Käytä <strong>T</strong>-painiketta suomenkielisille selityksille (esim. a) ja b)).
      </p>
    </div>
  );
}
