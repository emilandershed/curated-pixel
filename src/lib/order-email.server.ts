/**
 * Delivery of the post-purchase download email.
 *
 * Sending is intentionally isolated behind this one function: the webhook does
 * not care how the mail goes out, only that it was attempted. Until a verified
 * sender domain exists for this project, this no-ops with a logged reason
 * instead of throwing — a mail failure must never roll back a paid order,
 * because the buyer can always reach their downloads via the thank-you page.
 */
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";
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
}): Promise<EmailResult> {
  const { origin, order, accessToken } = input;

  const links = order.downloads.map((d) => ({
    title: d.albumTitle,
    url: downloadUrl(origin, d.token),
  }));

  const payload = {
    to: order.email,
    subject: `Your ${brand.name} downloads`,
    orderUrl: orderUrl(origin, accessToken),
    validDays: DOWNLOAD_TOKEN_VALID_DAYS,
    links,
  };

  if (!sender) {
    console.warn(
      `[email] no sender configured — download links for order ${order.id} remain available at ${payload.orderUrl}`,
    );
    return { sent: false, reason: "email_not_configured" };
  }

  try {
    return await sender(payload);
  } catch (error) {
    // A mail failure must never fail the webhook: the order is already paid.
    console.error("[email] send failed", error);
    return { sent: false, reason: "send_failed" };
  }
}

export type DownloadEmailPayload = {
  to: string;
  subject: string;
  orderUrl: string;
  validDays: number;
  links: { title: string; url: string }[];
};

type Sender = (payload: DownloadEmailPayload) => Promise<EmailResult>;

let sender: Sender | null = null;

/**
 * Register the concrete mail transport. Called once from the email-template
 * module that the managed sender setup generates, so the rest of the codebase
 * stays independent of the provider.
 */
export function registerDownloadEmailSender(next: Sender) {
  sender = next;
}

