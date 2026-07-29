/**
 * Read a completed order for the thank-you page.
 *
 * The access token is the buyer's only credential (guest checkout, no
 * accounts). It is returned exactly once — in the Stripe success URL — and is
 * unguessable, so it is safe to look up unauthenticated.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OrderInput = z.object({ accessToken: z.string().min(20).max(200) });

export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => OrderInput.parse(data))
  .handler(async ({ data }) => {
    const { getOrderByAccessToken } = await import("@/lib/orders.server");
    const order = await getOrderByAccessToken(data.accessToken);
    if (!order) return null;

    // Never leak the full address back to the page.
    return {
      status: order.status,
      amountCents: order.amountCents,
      maskedEmail: maskEmail(order.email),
      items: order.items,
      downloads: order.downloads.map((d) => ({
        albumId: d.albumId,
        albumTitle: d.albumTitle,
        url: `/api/public/download/${d.token}`,
        expiresAt: d.expiresAt,
      })),
    };
  });

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return "your email";
  const head = user.slice(0, 2);
  return `${head}${"•".repeat(Math.max(1, user.length - 2))}@${domain}`;
}
