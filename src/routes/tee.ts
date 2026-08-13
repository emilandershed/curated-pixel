import { createFileRoute } from "@tanstack/react-router";

import { campaignRedirect } from "@/lib/vanity-redirects";

export const Route = createFileRoute("/tee")({
  server: {
    handlers: {
      GET: async () =>
        campaignRedirect("/coming-soon", {
          utm_source: "tiktok",
          utm_medium: "social",
          utm_campaign: "tee1",
        }),
    },
  },
});
