import { getSubjectContent } from "./subject-content.js";
import { VOCAB_SESSION_SIZE } from "./vocabulary-shared.js";

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

/**
 * @param {object} p
 * @param {string} p.subjectId
 * @param {string} p.subjectLabel
 * @param {string[]} p.existingTerms
 * @param {number} [p.count]
 */
export async function generateTermCards({ subjectId, subjectLabel, existingTerms, count = VOCAB_SESSION_SIZE }) {
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_CHAT_KEY;
  if (!openaiKey) throw new Error("ai_not_configured");

  const content = getSubjectContent(subjectId);
  const modules = content?.modules?.join("; ") || "";
  const topics = content?.topics?.map((t) => t.title).join("; ") || "";
  const avoid = existingTerms.slice(0, 120).join(", ");

  const system = `Olet suomalaisen lukion yo-valmentaja. Generoit tarkasti LOPS2019 / lukion oppimäärän mukaisia käsitteitä aineeseen ${subjectLabel}.
Jokainen käsite: term (suomeksi), definitionFi (1–2 lausetta), example (lyhyt esimerkki), theme (moduulista), options (4 erilaista määritelmää — oikea ensin), correctIndex aina 0.
Älä toista näitä termejä: ${avoid || "(ei vielä)"}.
Vastaa vain validina JSON: { "cards": [ ... ] }`;

  const user = `Generoi ${count} uutta yo-tason käsitettä.
Oppimäärän osa-alueet: ${modules}
Keskeiset aiheet: ${topics}
Korttien id-kenttä jätä tyhjäksi — se lisätään myöhemmin.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[term-generator]", res.status, err);
    throw new Error("ai_error");
  }

  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("ai_empty");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("ai_parse_error");
  }

  const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
  const { randomUUID } = await import("crypto");

  return cards
    .filter((c) => c?.word && c?.definitionFi && Array.isArray(c?.options) && c.options.length >= 4)
    .slice(0, count)
    .map((c) => ({
      id: `ai-${randomUUID()}`,
      cardType: "concept",
      word: String(c.word).trim(),
      theme: String(c.theme || "AI-generoitu").trim(),
      partOfSpeech: "",
      definitionFi: String(c.definitionFi).trim(),
      example: String(c.example || "").trim(),
      context: "",
      contextFi: "",
      options: c.options.slice(0, 4).map((o) => String(o).trim()),
      correctIndex: 0,
    }));
}
