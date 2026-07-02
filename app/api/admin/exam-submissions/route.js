import { createClient } from "../../../../lib/supabase/server";
import { isAdminEmail } from "../../../../lib/admin";
import { listSubmissionsForAdmin, reviewExamSubmission } from "../../../../lib/exam-submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAdminEmail(user.email)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending";

  try {
    const submissions = await listSubmissionsForAdmin({ status });
    return Response.json({ ok: true, submissions });
  } catch {
    return Response.json({ error: "fetch_failed" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAdminEmail(user.email)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body?.id === "string" ? body.id.trim() : "";
  const score = typeof body?.score === "number" ? body.score : Number(body?.score);
  const adminComment = typeof body?.adminComment === "string" ? body.adminComment : "";

  if (!id || Number.isNaN(score)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const submission = await reviewExamSubmission(id, {
      score,
      adminComment,
      reviewedBy: user.email,
    });
    return Response.json({ ok: true, submission });
  } catch {
    return Response.json({ error: "review_failed" }, { status: 500 });
  }
}
