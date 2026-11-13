import { createClient } from "../../../../lib/supabase/server";
import { canAccessSubject, getProfessorById } from "../../../../lib/access";
import { getStaticTerms } from "../../../../lib/subject-terms";
import { listExistingTerms, insertCustomTermCards } from "../../../../lib/custom-terms";
import { generateTermCards } from "../../../../lib/term-generator";
import { isLanguageSubject } from "../../../../lib/vocabulary-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  if (!subjectId || isLanguageSubject(subjectId)) {
    return Response.json({ error: "invalid_subject" }, { status: 400 });
  }

  const professor = getProfessorById(subjectId);
  if (!professor) return Response.json({ error: "invalid_subject" }, { status: 400 });

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  try {
    const existing = await listExistingTerms(user.email, subjectId, getStaticTerms(subjectId));
    const generated = await generateTermCards({
      subjectId,
      subjectLabel: professor.role,
      existingTerms: existing,
    });

    if (generated.length === 0) {
      return Response.json({ error: "no_cards_generated" }, { status: 502 });
    }

    const saved = await insertCustomTermCards(user.email, subjectId, generated);
    return Response.json({ ok: true, cards: saved, count: saved.length });
  } catch (e) {
    const msg = e?.message || "generate_failed";
    if (msg === "ai_not_configured") return Response.json({ error: msg }, { status: 503 });
    if (msg.startsWith("ai_")) return Response.json({ error: msg }, { status: 502 });
    console.error("[vocabulary/generate]", e);
    return Response.json({ error: "generate_failed" }, { status: 500 });
  }
}
