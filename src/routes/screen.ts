import { createFileRoute } from "@tanstack/react-router";

import { vanityRedirect } from "@/lib/vanity-redirects";

export const Route = createFileRoute("/screen")({
  server: {
    handlers: {
      GET: async () => vanityRedirect("while-they-sleep", "screen"),
    },
  },
});
