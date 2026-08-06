import { createFileRoute } from "@tanstack/react-router";

import { vanityRedirect } from "@/lib/vanity-redirects";

export const Route = createFileRoute("/neon")({
  server: {
    handlers: {
      GET: async () => vanityRedirect("west-coast-night", "neon"),
    },
  },
});
