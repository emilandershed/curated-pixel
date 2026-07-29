import { Link, createFileRoute, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { brand, DOWNLOAD_TOKEN_VALID_DAYS, formatPrice } from "@/config/brand";
import { useCart } from "@/lib/cart";
import { getOrder } from "@/lib/order.functions";

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : undefined,
  }),
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
  const { order: accessToken } = useSearch({ from: "/thank-you" });
  const fetchOrder = useServerFn(getOrder);
  const { clear } = useCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", accessToken],
    queryFn: () => fetchOrder({ data: { accessToken: accessToken! } }),
    enabled: Boolean(accessToken),
    // The webhook may land a beat after the redirect.
    refetchInterval: (query) => (query.state.data?.status === "paid" ? false : 2000),
  });

  const paid = data?.status === "paid";

  useEffect(() => {
    if (paid) clear();
  }, [paid, clear]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <p className="eyebrow">Order confirmed</p>
      <h1 className="font-display mt-3 text-5xl leading-[1]">Thank you.</h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Your download links are ready below
        {data?.maskedEmail ? ` and have also been emailed to ${data.maskedEmail}` : ""}. They stay
        valid for {DOWNLOAD_TOKEN_VALID_DAYS} days and can be used as many times as you need.
      </p>

      <div className="mt-10 border border-border bg-secondary/50 p-6">
        {!accessToken ? (
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">
              This page needs the link from your confirmation email to show your downloads.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Loading your order…</p>
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">
            We couldn't find that order. If you've just paid, refresh in a few seconds — otherwise{" "}
            <Link to="/contact" className="text-foreground underline underline-offset-4">
              get in touch
            </Link>
            .
          </p>
        ) : !paid ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">
              Confirming your payment — your links will appear here automatically.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {data.downloads.map((download) => (
              <li key={download.albumId} className="flex items-center justify-between gap-4">
                <span className="font-display text-lg">{download.albumTitle}</span>
                <Button asChild size="sm" variant="outline">
                  <a href={download.url} download>
                    <Download className="mr-2 h-4 w-4" strokeWidth={1.25} />
                    Download
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {paid && data ? (
        <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {data.items.length} {data.items.length === 1 ? "item" : "items"}
          </span>
          <span className="text-sm tabular-nums">{formatPrice(data.amountCents)}</span>
        </div>
      ) : null}

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
