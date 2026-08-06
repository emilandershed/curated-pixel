/**
 * Self-service resend of an existing order's download links.
 *
 * Tokens are never rotated: previously delivered links must keep working.
 * Only tokens that have actually expired are reissued, and only for the album
 * they belong to.
 */
import { DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";
import { getOrderByAccessToken, randomToken } from "@/lib/orders.server";
import { recordEmailResult, sendDownloadEmail } from "@/lib/order-email.server";

export async function resendDownloadsForEmail(input: {
  email: string;
  origin: string;
}): Promise<{ orders: number; sent: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id, access_token")
    .eq("status", "paid")
    .ilike("email", input.email);

  let sent = 0;

  for (const row of orders ?? []) {
    await refreshExpiredTokens(row.id);

    const order = await getOrderByAccessToken(row.access_token);
    if (!order || order.downloads.length === 0) continue;

    const result = await sendDownloadEmail({
      origin: input.origin,
      order,
      accessToken: row.access_token,
      // A resend is a new logical send, so it must not dedupe against the
      // original delivery.
      idempotencyKey: `resend-${order.id}-${Date.now()}`,
    });

    await recordEmailResult(order.id, result);
    if (result.sent) sent += 1;
  }

  return { orders: (orders ?? []).length, sent };
}

async function refreshExpiredTokens(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const nowIso = new Date().toISOString();
  const { data: expired } = await supabaseAdmin
    .from("download_tokens")
    .select("id")
    .eq("order_id", orderId)
    .lt("expires_at", nowIso);

  if (!expired || expired.length === 0) return;

  const expiresAt = new Date(
    Date.now() + DOWNLOAD_TOKEN_VALID_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  for (const row of expired) {
    await supabaseAdmin
      .from("download_tokens")
      .update({ token: randomToken(), expires_at: expiresAt })
      .eq("id", row.id);
  }
}
