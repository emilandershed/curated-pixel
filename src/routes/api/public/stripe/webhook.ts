/**
 * Stripe webhook.
 *
 * Public by necessity — Stripe calls it — so the signature check is the only
 * thing standing between this endpoint and a forged "payment succeeded".
 * Nothing in the body is trusted before `verifyStripeSignature` passes.
 */
import { createFileRoute } from "@tanstack/react-router";

import { sendDownloadEmail } from "@/lib/order-email.server";
import { fulfilOrder, recordEventOnce } from "@/lib/orders.server";
import { stripeWebhookSecret, verifyStripeSignature } from "@/lib/stripe.server";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_intent?: string | null;
      customer_details?: { email?: string | null } | null;
      customer_email?: string | null;
    };
  };
};

export const Route = createFileRoute("/api/public/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = stripeWebhookSecret();
        if (!secret) {
          console.error("[webhook] STRIPE_WEBHOOK_SECRET is not configured");
          return new Response("Not configured", { status: 500 });
        }

        // Must be the raw body — re-serialised JSON breaks the HMAC.
        const rawBody = await request.text();
        const valid = await verifyStripeSignature(
          rawBody,
          request.headers.get("stripe-signature"),
          secret,
        );

        if (!valid) return new Response("Invalid signature", { status: 401 });

        let event: StripeEvent;
        try {
          event = JSON.parse(rawBody) as StripeEvent;
        } catch {
          return new Response("Malformed payload", { status: 400 });
        }

        if (event.type !== "checkout.session.completed") {
          return new Response("Ignored", { status: 200 });
        }

        // Stripe retries on any non-2xx; this makes replays a no-op.
        const isNew = await recordEventOnce(event.id, event.type);
        if (!isNew) return new Response("Already processed", { status: 200 });

        const session = event.data.object;
        const order = await fulfilOrder({
          sessionId: session.id,
          paymentId: session.payment_intent ?? null,
          email: session.customer_details?.email ?? session.customer_email ?? null,
        });

        if (!order) return new Response("Unknown order", { status: 200 });

        const origin = new URL(request.url).origin;
        await sendDownloadEmail({
          origin,
          order,
          accessToken: await accessTokenFor(order.id),
        });

        return new Response("ok", { status: 200 });
      },
    },
  },
});

async function accessTokenFor(orderId: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("orders")
    .select("access_token")
    .eq("id", orderId)
    .maybeSingle();
  return data?.access_token ?? "";
}
