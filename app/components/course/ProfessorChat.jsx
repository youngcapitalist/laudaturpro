"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QUICK_ACTIONS } from "../../../lib/professor-prompts";

function parseQuestion(content) {
  const match = content.match(/\[QUESTION\]([\s\S]*?)\[\/QUESTION\]/);
  if (!match) return { text: content, question: null };
  const textBefore = content.slice(0, content.indexOf("[QUESTION]")).trim();
  try {
    const raw = match[1].trim().replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
    const parsed = JSON.parse(raw);
    if (!parsed?.question || !Array.isArray(parsed.options) || typeof parsed.correct !== "number") {
      return { text: textBefore, question: null };
    }
    return { text: textBefore, question: parsed };
  } catch {
    return { text: textBefore, question: null };
  }
}

function QuestionCard({ question, onAnswer }) {
  const [picked, setPicked] = useState(null);
  const correct = picked !== null && picked === question.correct;
  return (
    <div className="mt-3 rounded-xl border border-line bg-slate-wash p-4">
      <p className="font-semibold text-navy">{question.question}</p>
      <ul className="mt-3 space-y-2">
        {question.options.map((opt, i) => {
          const labels = ["A", "B", "C", "D"];
          const show = picked !== null;
          const isCorrect = i === question.correct;
          const isPicked = i === picked;
          let cls = "border-line bg-white hover:border-navy/30";
          if (show && isCorrect) cls = "border-green-500 bg-green-50";
          else if (show && isPicked && !isCorrect) cls = "border-red-400 bg-red-50";
          return (
            <li key={i}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => {
                  setPicked(i);
                  onAnswer?.(i === question.correct);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${cls}`}
              >
                <span className="font-bold text-navy-muted">{labels[i]}. </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <p className={`mt-3 text-sm ${correct ? "text-green-800" : "text-navy/75"}`}>{question.explanation}</p>
      )}
    </div>
  );
}

function MessageBubble({ role, content }) {
  const { text, question } = parseQuestion(content);
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[75%] ${
          isUser ? "bg-navy text-white" : "border border-line bg-white text-navy shadow-sm"
        }`}
      >
        {text && <p className="whitespace-pre-wrap">{text}</p>}
        {question && <QuestionCard question={question} />}
      </div>
    </div>
  );
}

export default function ProfessorChat({ professor }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hei! Olen ${professor.name}, ${professor.role.toLowerCase()}-professorisi. Kysy mitä tahansa tai valitse pikatoiminto alta.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/professor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId: professor.id, messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "chat_failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string") {
              assistant += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* partial json */
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Jotain meni pieleen. Yritä hetken päästä uudelleen." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-wash">
      <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
        <Link href="/kurssi" className="text-sm font-semibold text-navy-muted hover:text-navy">
          ← Kurssit
        </Link>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${professor.accent} text-sm font-bold text-white`}
        >
          {professor.initials}
        </div>
        <div>
          <p className="font-heading font-bold text-navy">{professor.name}</p>
          <p className="text-xs text-navy-muted">{professor.role}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && (
            <p className="text-sm text-navy-muted">Professori kirjoittaa…</p>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-line bg-white px-4 py-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex flex-wrap gap-2">
            {QUICK_ACTIONS.default.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => sendMessage(a.prompt)}
                disabled={loading}
                className="rounded-pill border border-line bg-slate-wash px-3 py-1.5 text-xs font-semibold text-navy hover:border-navy/30 disabled:opacity-50"
              >
                {a.label}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kirjoita kysymys…"
              disabled={loading}
              className="flex-1 rounded-xl border border-line px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-navy px-5 py-3 font-heading text-sm font-bold text-gold hover:bg-navy-light disabled:opacity-50"
            >
              Lähetä
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
