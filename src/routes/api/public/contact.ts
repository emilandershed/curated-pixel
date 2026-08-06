/**
 * Contact form endpoint.
 *
 * Public by necessity — anyone must be able to reach support — so everything
 * is validated server-side and throttled per IP. The message is emailed to the
 * store owner using the fixed recipient baked into the template registry; the
 * browser never gets to choose a recipient or a template.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { checkRateLimit, clientIp } from "@/lib/rate-limit.server";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(1000),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Malformed request" }, { status: 400 });
        }

        const parsed = contactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid submission" }, { status: 400 });
        }

        const ip = clientIp(request);
        const { allowed } = await checkRateLimit({
          bucket: "contact:ip",
          key: ip,
          limit: 5,
        });
        if (!allowed) {
          return Response.json(
            { error: "Too many messages — please try again later." },
            { status: 429 },
          );
        }

        const { name, email, message } = parsed.data;

        try {
          await sendTemplateEmail("contact-message", "", {
            templateData: { name, email, message },
            replyTo: email,
          });
        } catch (error) {
          console.error("[contact] send failed", error);
          return Response.json({ error: "Could not send message" }, { status: 502 });
        }

        return Response.json({ ok: true }, { status: 200 });
      },
    },
  },
});
