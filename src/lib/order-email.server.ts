/**
 * Delivery of the post-purchase download email.
 *
 * Sending is intentionally isolated behind this one function: the webhook does
 * not care how the mail goes out, only that it was attempted. A mail failure
 * must never roll back a paid order, because the buyer can always reach their
 * downloads via the thank-you page — but the outcome IS persisted so delivery
 * problems are visible after the fact.
 */
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import type { OrderSummary } from "@/lib/orders.server";

export type EmailResult = { sent: boolean; reason?: string };

export function downloadUrl(origin: string, token: string) {
  return `${origin}/api/public/download/${token}`;
}

export function orderUrl(origin: string, accessToken: string) {
  return `${origin}/thank-you?order=${accessToken}`;
}

export async function sendDownloadEmail(input: {
  origin: string;
  order: OrderSummary;
  accessToken: string;
  idempotencyKey?: string;
}): Promise<EmailResult> {
  const { origin, order, accessToken } = input;

  const links = order.downloads.map((d) => ({
    title: d.albumTitle,
    url: downloadUrl(origin, d.token),
  }));

  try {
    const result = await sendTemplateEmail("download-ready", order.email, {
      templateData: {
        orderUrl: orderUrl(origin, accessToken),
        validDays: DOWNLOAD_TOKEN_VALID_DAYS,
        links,
      },
      idempotencyKey: input.idempotencyKey ?? `download-email-${order.id}`,
    });

    if (result.sent) {
      return { sent: true };
    }

    console.error("[email] not sent for order", order.id, "reason", result.reason);
    return { sent: false, reason: result.reason };
  } catch (error) {
    // A mail failure must never fail the webhook: the order is already paid.
    console.error("[email] send failed", error);
    return {
      sent: false,
      reason: error instanceof Error ? error.message.slice(0, 500) : "send_failed",
    };
  }
}

/**
 * Persist the outcome of a download-email attempt on the order row. Errors
 * here are swallowed on purpose: observability must never break fulfilment.
 */
export async function recordEmailResult(orderId: string, result: EmailResult) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("orders")
      .update(
        result.sent
          ? { email_sent_at: new Date().toISOString(), email_error: null }
          : { email_error: result.reason ?? "unknown" },
      )
      .eq("id", orderId);
  } catch (error) {
    console.error("[email] could not persist delivery result", error);
  }
}

// Kept for callers that display the store name alongside delivery copy.
export const senderName = brand.name;
