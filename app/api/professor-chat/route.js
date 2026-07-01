import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject, getProfessorById } from "../../../lib/access";
import { getSystemPrompt } from "../../../lib/professor-prompts";
import { FREE_PREVIEW_LIMIT } from "../../../lib/free-preview";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

function countUserMessages(messages) {
  return messages.filter((m) => m?.role === "user").length;
}

export async function POST(request) {
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_CHAT_KEY;
  if (!openaiKey) return Response.json({ error: "ai_not_configured" }, { status: 503 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const subjectId = typeof body?.subjectId === "string" ? body.subjectId : "";
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const preview = body?.preview === true;

  if (!subjectId || messages.length === 0) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!getProfessorById(subjectId)) {
    return Response.json({ error: "invalid_subject" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullAccess = false;
  if (user?.email) {
    fullAccess = await canAccessSubject(user.email, subjectId);
  }

  if (!fullAccess) {
    if (!preview) {
      return Response.json({ error: user ? "forbidden" : "unauthorized" }, { status: user ? 403 : 401 });
    }
    const userMsgs = countUserMessages(messages);
    if (userMsgs > FREE_PREVIEW_LIMIT) {
      return Response.json({ error: "preview_limit", limit: FREE_PREVIEW_LIMIT }, { status: 403 });
    }
  }

  const systemPrompt = getSystemPrompt(subjectId);
  const sanitized = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...sanitized],
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.text().catch(() => "");
    console.error("[professor-chat]", openaiRes.status, err);
    return Response.json({ error: "ai_error" }, { status: 502 });
  }

  return new Response(openaiRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
