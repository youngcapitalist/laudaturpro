"use client";

import { useCallback, useEffect, useState } from "react";
import { EXAM_TYPE_LABELS } from "../../../lib/exam-content";

function ReviewForm({ submission, onReviewed }) {
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const n = Number(score);
    if (Number.isNaN(n) || n < 0 || n > submission.maxPoints) {
      setError(`Anna pisteet välillä 0–${submission.maxPoints}.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/exam-submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submission.id, score: n, adminComment: comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "failed");
      onReviewed(data.submission);
    } catch {
      setError("Tallennus epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-line pt-4">
      <div className="flex flex-wrap gap-3">
        <label className="text-sm font-semibold text-navy">
          Pisteet (max {submission.maxPoints})
          <input
            type="number"
            min={0}
            max={submission.maxPoints}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="mt-1 block w-28 rounded-lg border border-line px-3 py-2 text-sm"
            required
          />
        </label>
      </div>
      <label className="block text-sm font-semibold text-navy">
        Kommentti opiskelijalle
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Vahvuudet, kehityskohteet, yo-kokeen vinkit…"
          className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm leading-relaxed"
        />
      </label>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-pill bg-navy px-5 py-2.5 text-sm font-bold text-gold disabled:opacity-50"
      >
        {loading ? "Tallennetaan…" : "Lähetä arvio"}
      </button>
    </form>
  );
}

function SubmissionCard({ submission, onReviewed }) {
  const typeLabel = EXAM_TYPE_LABELS[submission.taskType] ?? submission.taskType;
  const reviewed = submission.status === "reviewed";

  return (
    <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{typeLabel}</p>
          <h3 className="mt-1 font-heading text-lg font-bold text-navy">{submission.taskTitle}</h3>
          <p className="mt-1 text-sm text-navy/60">
            {submission.email} · {submission.subjectId} ·{" "}
            {new Date(submission.createdAt).toLocaleString("fi-FI")}
          </p>
        </div>
        <span
          className={`rounded-pill px-3 py-1 text-xs font-bold ${
            reviewed ? "bg-gold/20 text-navy" : "bg-amber-100 text-amber-900"
          }`}
        >
          {reviewed ? `Arvioitu ${submission.score}/${submission.maxPoints} p` : "Odottaa tarkastusta"}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-slate-wash/60 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-navy/45">Opiskelijan vastaus</p>
        <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy/90">{submission.answerText}</div>
      </div>

      {reviewed ? (
        <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-navy/85">
          <p className="font-bold text-navy">Kommentti ({submission.reviewedBy})</p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">
            {submission.adminComment || "—"}
          </p>
        </div>
      ) : (
        <ReviewForm submission={submission} onReviewed={onReviewed} />
      )}
    </article>
  );
}

export default function AdminHarkkakokeetClient() {
  const [filter, setFilter] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/exam-submissions?status=${filter}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "failed");
      setSubmissions(data.submissions || []);
    } catch {
      setError("Lataus epäonnistui.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  function handleReviewed(updated) {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (filter === "pending") {
      setSubmissions((prev) => prev.filter((s) => s.id !== updated.id));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[
          { id: "pending", label: "Odottaa" },
          { id: "reviewed", label: "Arvioidut" },
          { id: "all", label: "Kaikki" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`rounded-pill px-4 py-2 text-sm font-semibold ${
              filter === t.id ? "bg-navy text-gold" : "border border-line text-navy hover:bg-slate-wash"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6 text-sm text-navy/60">Ladataan…</p>}
      {error && <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>}

      {!loading && !error && submissions.length === 0 && (
        <p className="mt-6 text-sm text-navy/60">Ei vastauksia tässä jonossa.</p>
      )}

      <ul className="mt-6 space-y-4">
        {submissions.map((s) => (
          <li key={s.id}>
            <SubmissionCard submission={s} onReviewed={handleReviewed} />
          </li>
        ))}
      </ul>
    </div>
  );
}
