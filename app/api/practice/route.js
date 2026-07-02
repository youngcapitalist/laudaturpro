import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject } from "../../../lib/access";
import { getPracticeQuestion } from "../../../lib/practice-questions";
import { recordPracticeAttempt, listAttempts, computeProgress } from "../../../lib/practice-progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId");
  if (!subjectId) return Response.json({ error: "missing_subject" }, { status: 400 });

  try {
    const attempts = await listAttempts(user.email, subjectId);
    const progress = computeProgress(subjectId, attempts);
    return Response.json({ ok: true, progress });
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
  const questionId = typeof body?.questionId === "string" ? body.questionId.trim() : "";
  const chosenIndex = Number.isInteger(body?.chosenIndex) ? body.chosenIndex : null;

  if (!subjectId || !questionId || chosenIndex == null || chosenIndex < 0 || chosenIndex > 3) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  const question = getPracticeQuestion(subjectId, questionId);
  if (!question) return Response.json({ error: "question_not_found" }, { status: 404 });

  const correct = chosenIndex === question.correctIndex;

  try {
    await recordPracticeAttempt({
      userId: user.id,
      email: user.email,
      subjectId,
      questionId,
      module: question.module,
      correct,
      chosenIndex,
    });
    return Response.json({ ok: true, correct });
  } catch {
    return Response.json({ error: "save_failed" }, { status: 500 });
  }
}
