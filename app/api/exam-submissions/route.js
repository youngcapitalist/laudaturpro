import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject } from "../../../lib/access";
import { getHarkkakoeTask } from "../../../lib/exam-content";
import { createExamSubmission, listSubmissionsForUser } from "../../../lib/exam-submissions";

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
  const taskId = searchParams.get("taskId");

  try {
    const submissions = await listSubmissionsForUser(user.email, {
      subjectId: subjectId || undefined,
      taskId: taskId || undefined,
    });
    return Response.json({ ok: true, submissions });
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
  const taskId = typeof body?.taskId === "string" ? body.taskId.trim() : "";
  const answerText = typeof body?.answerText === "string" ? body.answerText.trim() : "";

  if (!subjectId || !taskId || answerText.length < 50) {
    return Response.json({ error: "answer_too_short" }, { status: 400 });
  }

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  const task = getHarkkakoeTask(subjectId, taskId);
  if (!task) return Response.json({ error: "task_not_found" }, { status: 404 });

  try {
    const submission = await createExamSubmission({
      userId: user.id,
      email: user.email,
      subjectId,
      taskId,
      taskTitle: task.title,
      taskType: task.type,
      maxPoints: task.maxPoints,
      answerText,
    });
    return Response.json({ ok: true, submission });
  } catch {
    return Response.json({ error: "submit_failed" }, { status: 500 });
  }
}
