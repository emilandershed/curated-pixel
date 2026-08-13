/**
 * Waitlist signups for designs that are still being validated.
 *
 * A duplicate address is a success, not an error: the visitor asked to be told
 * and they already are on the list. The confirmation email outcome is persisted
 * on the row so a delivery problem is visible after the fact — the same
 * guarantee the order emails have.
 */
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

export type WaitlistResult = { ok: true } | { ok: false };

export async function registerWaitlistSignup(input: {
  email: string;
  source: string | null;
  variant: string | null;
}): Promise<WaitlistResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = input.email.toLowerCase();

  const { data: existing } = await supabaseAdmin
    .from("waitlist_signups")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (existing) return { ok: true };

  const { data: inserted, error } = await supabaseAdmin
    .from("waitlist_signups")
    .insert({ email, source: input.source, variant: input.variant })
    .select("id")
    .maybeSingle();

  if (error) {
    // Unique index race: the address is on the list, which is all that matters.
    if (error.code === "23505") return { ok: true };
    console.error("[waitlist] insert failed", error);
    return { ok: false };
  }

  if (inserted) await sendConfirmation(inserted.id, email);

  return { ok: true };
}

async function sendConfirmation(id: string, email: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  let sent = false;
  let reason: string | undefined;

  try {
    const result = await sendTemplateEmail("waitlist-confirmation", email, {
      idempotencyKey: `waitlist-${id}`,
    });
    sent = result.sent;
    if (!result.sent) reason = result.reason;
  } catch (error) {
    reason = error instanceof Error ? error.message.slice(0, 500) : "send_failed";
  }

  if (!sent) console.error("[waitlist] confirmation not sent", id, reason);

  await supabaseAdmin
    .from("waitlist_signups")
    .update(
      sent
        ? { email_sent_at: new Date().toISOString(), email_error: null }
        : { email_sent_at: null, email_error: reason ?? "send_failed" },
    )
    .eq("id", id);
}
