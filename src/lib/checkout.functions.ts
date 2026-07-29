/**
 * Checkout entry point.
 *
 * The browser sends only product ids. Titles, prices and the order total are
 * resolved here from `src/config/products.ts` — a tampered cart can never
 * change what is charged.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CheckoutInput = z.object({
  email: z.string().email().max(255),
  lines: z
    .array(
      z.object({
        id: z.string().min(1).max(120),
        kind: z.enum(["album", "bundle"]),
      }),
    )
    .min(1)
    .max(20),
  origin: z.string().url().max(300),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CheckoutInput.parse(data))
  .handler(async ({ data }) => {
    const { startCheckout } = await import("@/lib/checkout.server");
    return startCheckout(data);
  });
