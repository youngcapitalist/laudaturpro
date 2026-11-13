/**
 * Kirjaa viimeaikaiset hub-quiz-liidit drip-jonoon (service role).
 * Käyttö: node scripts/backfill-hub-drip.mjs [--since=2026-08-23] [--dry-run]
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

for (const file of [".env.vercel.prod", ".env.vercel", ".env.local"]) {
  const p = resolve(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const EXAM_SITES = {
  A: "https://valintakoea.fi",
  B: "https://valintakoeb.fi",
  C: "https://valintakoec.fi",
  E: "https://valintakoee.fi",
  F: "https://valintakoefpro.com",
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sinceArg = args.find((a) => a.startsWith("--since="));
const since = sinceArg ? sinceArg.split("=")[1] : "2026-08-23";

async function fetchJson(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function enroll(row) {
  const body = JSON.stringify(row);
  if (dryRun) {
    console.log("[dry-run]", row.email, row.stream, row.next_send_at);
    return { ok: true };
  }
  const res = await fetch(`${url}/rest/v1/lead_drip_enrollments?on_conflict=email_key,stream`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("enroll failed", row.email, row.stream, res.status, txt.slice(0, 120));
    return { error: txt };
  }
  return { ok: true };
}

function emailKey(email) {
  return email.trim().toLowerCase();
}

function nextSendForLead(createdAt, delayHours = 24) {
  const enrolled = new Date(createdAt).getTime();
  const due = enrolled + delayHours * 60 * 60 * 1000;
  // Jos ensimmäinen viesti olisi jo erääntynyt, lähetä heti cronin seuraavalla kierroksella.
  return new Date(Math.min(due, Date.now())).toISOString();
}

const leads = await fetchJson(
  `valintakoe_hub_leads?created_at=gte.${since}T00:00:00Z&order=created_at.asc&select=email,source,offer_exam,recommended_code,offered_price_eur,wtp_score,pain_key,pain_label,preferred_field,recommended_field,scores,created_at`
);

const existing = await fetchJson(`lead_drip_enrollments?select=email,stream,status`);
const enrolledSet = new Set(existing.map((e) => `${emailKey(e.email)}:${e.stream}`));

let queued = 0;
let skipped = 0;

for (const lead of leads) {
  const email = emailKey(lead.email);
  if (!email.includes("@")) continue;

  if (lead.source === "laudaturpro_quiz") {
    const stream = "laudaturpro";
    if (enrolledSet.has(`${email}:${stream}`)) {
      skipped++;
      continue;
    }
    const checkoutUrl =
      (lead.scores && typeof lead.scores.checkoutUrl === "string" && lead.scores.checkoutUrl) ||
      "https://laudaturpro.fi/tilaa";
    const priceEur = lead.offered_price_eur || 109;
    const ok = await enroll({
      email,
      email_key: email,
      stream,
      step_index: 1,
      status: "active",
      payload: {
        personalTitle: lead.preferred_field || "Henkilökohtainen yo-pakettisi",
        priceEur,
        listPriceEur: (lead.scores && lead.scores.listPriceEur) || priceEur,
        checkoutUrl,
        wtpScore: lead.wtp_score,
        selectedLabels: (lead.scores && lead.scores.selectedLabels) || [],
        goalLabel: (lead.scores && lead.scores.goalLabel) || null,
      },
      next_send_at: nextSendForLead(lead.created_at, 24),
      updated_at: new Date().toISOString(),
    });
    if (ok.ok) {
      queued++;
      enrolledSet.add(`${email}:${stream}`);
    }
    continue;
  }

  if (lead.source !== "tasotesti") continue;

  const exam = (lead.offer_exam || lead.recommended_code || "").toUpperCase();
  if (!EXAM_SITES[exam]) {
    skipped++;
    continue;
  }
  const stream = `valintakoe_${exam.toLowerCase()}`;
  if (enrolledSet.has(`${email}:${stream}`)) {
    skipped++;
    continue;
  }
  const priceEur = lead.offered_price_eur || 99;
  const site = EXAM_SITES[exam];
  const ok = await enroll({
    email,
    email_key: email,
    stream,
    step_index: 1,
    status: "active",
    payload: {
      personalTitle: `Valintakoe ${exam} — henkilökohtainen tarjous`,
      priceEur,
      checkoutUrl: `${site}/#pricing`,
      examCode: exam,
      painKey: lead.pain_key,
      painLabel: lead.pain_label,
      wtpScore: lead.wtp_score,
      recommendedField: lead.recommended_field,
      preferredField: lead.preferred_field,
    },
    next_send_at: nextSendForLead(lead.created_at, 24),
    updated_at: new Date().toISOString(),
  });
  if (ok.ok) {
    queued++;
    enrolledSet.add(`${email}:${stream}`);
  }
}

console.log(JSON.stringify({ since, dryRun, leads: leads.length, queued, skipped }, null, 2));
