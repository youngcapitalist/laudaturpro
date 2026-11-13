import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject } from "../../../lib/access";
import { getVocabCard, subjectHasVocabulary, getVocabulary } from "../../../lib/vocabulary-registry";
import {
  recordVocabAttempt,
  listVocabAttempts,
  computeVocabProgress,
} from "../../../lib/vocabulary-progress";
import { listCustomTermCards } from "../../../lib/custom-terms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId")?.trim() || "";
  if (!subjectHasVocabulary(subjectId)) {
    return Response.json({ error: "invalid_subject" }, { status: 400 });
  }

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  try {
    const [attempts, customCards] = await Promise.all([
      listVocabAttempts(user.email, subjectId),
      listCustomTermCards(user.email, subjectId),
    ]);
    const cards = getVocabulary(subjectId, customCards);
    const progress = computeVocabProgress(subjectId, attempts, cards);
    return Response.json({ ok: true, progress, customCards });
  } catch {
    return Response.json({ error: "fetch_failed" }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const subjectId = typeof body?.subjectId === "string" ? body.subjectId.trim() : "";
  const wordId = typeof body?.wordId === "string" ? body.wordId.trim() : "";
  const mode = body?.mode === "quiz" ? "quiz" : "card";
  const correct = body?.correct === true;

  if (!subjectHasVocabulary(subjectId) || !wordId) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  const customCards = await listCustomTermCards(user.email, subjectId);
  const card = getVocabCard(subjectId, wordId, customCards);
  if (!card) return Response.json({ error: "word_not_found" }, { status: 404 });

  try {
    await recordVocabAttempt({
      userId: user.id,
      email: user.email,
      subjectId,
      wordId,
      mode,
      correct,
    });
    return Response.json({ ok: true, correct });
  } catch {
    return Response.json({ error: "save_failed" }, { status: 500 });
  }
}
