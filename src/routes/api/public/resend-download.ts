/**
 * Resend an existing order's download links.
 *
 * The response is deliberately identical whether or not an order exists, so
 * the endpoint cannot be used to discover which addresses have purchased.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { checkRateLimit, clientIp } from "@/lib/rate-limit.server";
import { resendDownloadsForEmail } from "@/lib/resend-download.server";

const resendSchema = z.object({
  email: z.string().trim().email().max(255),
});

export const Route = createFileRoute("/api/public/resend-download")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Malformed request" }, { status: 400 });
        }

        const parsed = resendSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid submission" }, { status: 400 });
        }

        const email = parsed.data.email.toLowerCase();
        const ip = clientIp(request);

        for (const limit of [
          { bucket: "resend:ip", key: ip },
          { bucket: "resend:email", key: email },
        ]) {
          const { allowed } = await checkRateLimit({ ...limit, limit: 3 });
          if (!allowed) {
            return Response.json(
              { error: "Too many requests — please try again later." },
              { status: 429 },
            );
          }
        }

        try {
          const origin = new URL(request.url).origin;
          const result = await resendDownloadsForEmail({ email, origin });
          console.log("[resend] orders matched", result.orders, "emails sent", result.sent);
        } catch (error) {
          // Never leak whether the address exists, but do surface the failure
          // in the logs.
          console.error("[resend] failed", error);
        }

        return Response.json({ ok: true }, { status: 200 });
      },
    },
  },
});
