import { adminFetch } from "../../../../lib/drip/supabase-admin.js";
import { canSendDrip } from "../../../../lib/drip/eligibility.js";
import { sendDripEmail } from "../../../../lib/drip/send.js";
import { getStream } from "../../../../lib/drip/streams.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const { data: due, error } = await adminFetch(
    `lead_drip_enrollments?status=eq.active&next_send_at=lte.${encodeURIComponent(now)}&select=*&order=next_send_at.asc&limit=40`
  );

  if (error) {
    return Response.json({ error: "query_failed" }, { status: 502 });
  }

  const results = { processed: 0, sent: 0, skipped: 0, converted: 0, cancelled: 0, errors: 0 };

  for (const row of due || []) {
    results.processed++;
    const { email, stream, step_index: stepIndex, payload, id } = row;
    const config = getStream(stream);
    if (!config) {
      await adminFetch(`lead_drip_enrollments?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled", updated_at: now }),
      });
      results.cancelled++;
      continue;
    }

    const eligibility = await canSendDrip(email, stream);
    if (!eligibility.ok) {
      const status = eligibility.reason === "customer" ? "converted" : "cancelled";
      await adminFetch(`lead_drip_enrollments?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, updated_at: now }),
      });
      if (status === "converted") results.converted++;
      else results.cancelled++;
      continue;
    }

    const send = await sendDripEmail({ email, stream, stepIndex, payload });
    if (send.error) {
      results.errors++;
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
  }

  return Response.json({ ok: true, ...results });
}
