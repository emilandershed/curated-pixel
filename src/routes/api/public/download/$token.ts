/**
 * Download endpoint.
 *
 * The token is the credential: it is unguessable, tied to one album of one
 * paid order, and expires after 90 days. The full-resolution archive itself
 * lives in a private bucket and is only ever handed out as a short-lived
 * signed URL, so the storage path is never guessable or shareable long-term.
 */
import { createFileRoute } from "@tanstack/react-router";

import { redeemDownloadToken } from "@/lib/orders.server";

const BUCKET = "album-downloads";

export const Route = createFileRoute("/api/public/download/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const token = params.token;
        if (!token || token.length > 200) {
          return new Response("Invalid link", { status: 400 });
        }

        const result = await redeemDownloadToken(token);

        if (!result.ok) {
          const message =
            result.reason === "expired"
              ? "This download link has expired. Request a fresh one from the contact page."
              : "This download link is not valid.";
          return new Response(message, { status: result.reason === "expired" ? 410 : 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(result.storageKey, 300, { download: `${result.albumId}.zip` });

        if (error || !data?.signedUrl) {
          console.error("[download] signing failed", result.storageKey, error?.message);
          return new Response(
            "This album's files are not available yet. Your link stays valid — please try again shortly.",
            { status: 503 },
          );
        }

        return Response.redirect(data.signedUrl, 302);
      },
    },
  },
});
