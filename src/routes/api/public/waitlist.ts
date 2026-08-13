/**
 * Waitlist signup endpoint.
 *
 * Public by necessity, so the email is validated server-side and throttled per
 * IP and per address. The response is the same for a new and an existing
 * address, so the endpoint cannot be used to discover who has signed up.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { checkRateLimit, clientIp } from "@/lib/rate-limit.server";
import { registerWaitlistSignup } from "@/lib/waitlist.server";

const waitlistSchema = z.object({
  email: z.string().trim().email().max(255),
});

export const Route = createFileRoute("/api/public/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Malformed request" }, { status: 400 });
        }

        const parsed = waitlistSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Enter a valid email address." },
            { status: 400 },
          );
        }

        const email = parsed.data.email.toLowerCase();
        const ip = clientIp(request);

        for (const limit of [
          { bucket: "waitlist:ip", key: ip },
          { bucket: "waitlist:email", key: email },
        ]) {
          const { allowed } = await checkRateLimit({ ...limit, limit: 5 });
          if (!allowed) {
            return Response.json(
              { error: "Too many requests — please try again later." },
              { status: 429 },
            );
          }
        }

        const url = new URL(request.url);
        const source = url.searchParams.get("utm_source")?.slice(0, 100) ?? null;
        const variant = url.searchParams.get("v")?.slice(0, 100) ?? null;

        const result = await registerWaitlistSignup({ email, source, variant });
        if (!result.ok) {
          return Response.json(
            { error: "We could not save your email right now. Please try again." },
            { status: 502 },
          );
        }

        return Response.json({ ok: true }, { status: 200 });
      },
    },
  },
});
