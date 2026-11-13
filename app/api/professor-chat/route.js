import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject, getProfessorById } from "../../../lib/access";
import { getSystemPrompt } from "../../../lib/professor-prompts";
import { FREE_PREVIEW_LIMIT } from "../../../lib/free-preview";
import { adminFetch } from "../../../lib/drip/supabase-admin.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

function countUserMessages(messages) {
  return messages.filter((m) => m?.role === "user").length;
}

function lastUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m?.role === "user" && typeof m.content === "string") return m.content.slice(0, 4000);
  }
  return null;
}

/** Tee SSE: client gets bytes; background accumulates assistant reply for logging. */
function teeAndLog(body, meta) {
  const [clientStream, logStream] = body.tee();
  (async () => {
    try {
      const reader = logStream.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let full = "";
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
            if (typeof delta === "string") full += delta;
          } catch {
            /* ignore partial JSON */
          }
        }
      }
      await adminFetch("professor_chat_logs", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          user_id: meta.userId,
          is_anonymous: meta.isAnonymous,
          user_message: meta.userMessage,
          assistant_message: full || null,
          message_count: meta.messageCount,
          model: meta.model,
          product: "laudatur",
          exam: null,
          subject_id: meta.subjectId,
        }),
      });
    } catch (e) {
      console.error("[professor-chat] laudatur logging failed", e);
    }
  })();
  return clientStream;
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

  if (!openaiRes.body) {
    return Response.json({ error: "ai_error" }, { status: 502 });
  }

  const logged = teeAndLog(openaiRes.body, {
    userId: user?.id || null,
    isAnonymous: !user || preview,
    userMessage: lastUserMessage(sanitized),
    messageCount: sanitized.length,
    model: CHAT_MODEL,
    subjectId,
  });

  return new Response(logged, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
