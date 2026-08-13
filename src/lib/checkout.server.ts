/**
 * Server-side checkout: price resolution, order creation, Stripe session.
 */
import { brand } from "@/config/brand";
import { createPendingOrder, attachCheckoutSession, resolveOrderLines } from "@/lib/orders.server";
import { stripeRequest } from "@/lib/stripe.server";
import type { CartLine } from "@/lib/pricing";

type StripeSession = { id: string; url: string | null };

export async function startCheckout(input: {
  email: string;
  lines: { id: string; kind: "album" | "bundle" }[];
  origin: string;
}) {
  const cartLines: CartLine[] = input.lines.map((l) => ({ ...l, quantity: 1 }));
  const resolved = resolveOrderLines(cartLines);

  if (resolved.length === 0) {
    throw new Error("Your bag no longer matches anything in the catalogue.");
  }

  const amountCents = resolved.reduce((sum, line) => sum + line.priceCents, 0);
  const currency = brand.currency.toLowerCase();

  const order = await createPendingOrder({
    email: input.email,
    lines: resolved,
    amountCents,
    currency,
  });

  const session = await stripeRequest<StripeSession>("/checkout/sessions", {
    idempotencyKey: `order-${order.id}`,
    body: {
      mode: "payment",
      customer_email: input.email,
      client_reference_id: order.id,
      // Digital goods: no shipping, links delivered instantly.
      success_url: `${input.origin}/thank-you?order=${order.accessToken}`,
      cancel_url: `${input.origin}/checkout?cancelled=1`,
      metadata: { order_id: order.id },
      payment_intent_data: { metadata: { order_id: order.id } },
      line_items: resolved.map((line) => ({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: line.priceCents,
          product_data: {
            name: line.title,
            metadata: { product_id: line.productId, kind: line.kind },
          },
        },
      })),
      after_expiration: { recovery: { enabled: true, allow_promotion_codes: false } },
    },
  });

  await attachCheckoutSession(order.id, session.id);

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: session.url };
}
