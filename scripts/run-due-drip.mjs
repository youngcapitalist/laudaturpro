/**
 * Aja erääntyneet drip-viestit heti (dev/ops).
 * node scripts/run-due-drip.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { adminFetch } from "../lib/drip/supabase-admin.js";
import { canSendDrip } from "../lib/drip/eligibility.js";
import { sendDripEmail } from "../lib/drip/send.js";
import { getStream } from "../lib/drip/streams.js";

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

const now = new Date().toISOString();
const { data: due, error } = await adminFetch(
  `lead_drip_enrollments?status=eq.active&next_send_at=lte.${encodeURIComponent(now)}&select=*&order=next_send_at.asc&limit=40`
);
if (error) {
  console.error("query failed", error);
  process.exit(1);
}

const results = { processed: 0, sent: 0, skipped: 0, errors: 0 };

for (const row of due || []) {
  results.processed++;
  const { email, stream, step_index: stepIndex, payload, id } = row;
  const config = getStream(stream);
  if (!config) continue;

  const eligibility = await canSendDrip(email, stream);
  if (!eligibility.ok) {
    const status = eligibility.reason === "customer" ? "converted" : "cancelled";
    await adminFetch(`lead_drip_enrollments?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, updated_at: now }),
    });
    continue;
  }

  const send = await sendDripEmail({ email, stream, stepIndex, payload });
  if (send.error) {
    results.errors++;
    console.error("send failed", email, stream, stepIndex);
    continue;
  }
  if (send.skipped) {
    results.skipped++;
    continue;
  }

  results.sent++;
  const nextStepIndex = stepIndex + 1;
  const nextStep = config.steps[nextStepIndex - 1];
  if (!nextStep) {
    await adminFetch(`lead_drip_enrollments?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "completed",
        step_index: stepIndex,
        last_sent_at: now,
        updated_at: now,
      }),
    });
  } else {
    const delayMs = nextStep.delayHours * 60 * 60 * 1000;
    const nextSendAt = new Date(Date.now() + delayMs).toISOString();
    await adminFetch(`lead_drip_enrollments?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        step_index: nextStepIndex,
        next_send_at: nextSendAt,
        last_sent_at: now,
        updated_at: now,
      }),
    });
  }
  console.log("sent", email, stream, "step", stepIndex);
}

console.log(JSON.stringify(results, null, 2));
