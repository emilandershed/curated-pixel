import { Link, createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: `Your downloads — ${brand.name}` },
      { name: "description", content: "Your wallpaper downloads are ready." },
      { property: "og:title", content: `Your downloads — ${brand.name}` },
      { property: "og:description", content: "Your wallpaper downloads are ready." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <p className="eyebrow">Order confirmed</p>
      <h1 className="font-display mt-3 text-5xl leading-[1]">Thank you.</h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Your download links are ready below and have also been emailed to you. They stay valid
        for {DOWNLOAD_TOKEN_VALID_DAYS} days and can be used as many times as you need.
      </p>

      <div className="mt-10 border border-border bg-secondary/50 p-6">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5" strokeWidth={1.25} />
          <p className="text-sm text-muted-foreground">
            Download buttons appear here once your order is loaded.
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Lost your link later on?{" "}
        <Link to="/contact" hash="resend" className="text-foreground underline underline-offset-4">
          Have it resent
        </Link>{" "}
        at any time.
      </p>

      <Button asChild variant="outline" className="mt-10">
        <Link to="/shop">Back to the shop</Link>
      </Button>
    </div>
  );
}
