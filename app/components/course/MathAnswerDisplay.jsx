"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function renderLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return katex.renderToString(trimmed, {
      displayMode: true,
      throwOnError: false,
      strict: "ignore",
      trust: true,
    });
  } catch {
    return null;
  }
}

export default function MathAnswerDisplay({ latex, fallbackText }) {
  const html = useMemo(() => {
    const source = (latex || fallbackText || "").trim();
    if (!source) return null;

    const lines = source.split(/\\\\|\n/);
    const rendered = lines
      .map((line) => {
        const block = renderLine(line);
        if (block) return block;
        return `<p class="math-answer-plain">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
      })
      .filter(Boolean);

    return rendered.join("");
  }, [latex, fallbackText]);

  if (!html) return <p className="text-sm text-navy/45">—</p>;

  return (
    <div
      className="math-answer-display text-sm leading-relaxed text-navy/90"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
