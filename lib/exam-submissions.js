import { adminFetch } from "./drip/supabase-admin.js";

function rowToSubmission(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    subjectId: row.subject_id,
    taskId: row.task_id,
    taskTitle: row.task_title,
    taskType: row.task_type,
    maxPoints: row.max_points,
    answerText: row.answer_text,
    status: row.status,
    score: row.score,
    adminComment: row.admin_comment,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createExamSubmission({
  userId,
  email,
  subjectId,
  taskId,
  taskTitle,
  taskType,
  maxPoints,
  answerText,
}) {
  const { data, error, status } = await adminFetch("exam_submissions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: userId || null,
      email: email.trim().toLowerCase(),
      subject_id: subjectId,
      task_id: taskId,
      task_title: taskTitle,
      task_type: taskType,
      max_points: maxPoints,
      answer_text: answerText.trim(),
      status: "pending",
    }),
  });

  if (error || status >= 400) {
    throw new Error(error?.message || "submission_failed");
  }

  const row = Array.isArray(data) ? data[0] : data;
  return rowToSubmission(row);
}

export async function listSubmissionsForUser(email, { subjectId, taskId } = {}) {
  let q = `exam_submissions?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&order=created_at.desc`;
  if (subjectId) q += `&subject_id=eq.${encodeURIComponent(subjectId)}`;
  if (taskId) q += `&task_id=eq.${encodeURIComponent(taskId)}`;

  const { data, error } = await adminFetch(q);
  if (error) throw new Error(error.message);
  return (data || []).map(rowToSubmission);
}

export async function listSubmissionsForAdmin({ status = "pending" } = {}) {
  let q = "exam_submissions?order=created_at.asc";
  if (status && status !== "all") q += `&status=eq.${encodeURIComponent(status)}`;

  const { data, error } = await adminFetch(q);
  if (error) throw new Error(error.message);
  return (data || []).map(rowToSubmission);
}

export async function reviewExamSubmission(id, { score, adminComment, reviewedBy }) {
  const { data, error, status } = await adminFetch(`exam_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status: "reviewed",
      score: Math.round(score),
      admin_comment: adminComment?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      updated_at: new Date().toISOString(),
    }),
  });

  if (error || status >= 400) throw new Error(error?.message || "review_failed");
  const row = Array.isArray(data) ? data[0] : data;
  return rowToSubmission(row);
}
