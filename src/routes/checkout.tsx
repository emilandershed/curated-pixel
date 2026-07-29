import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand, formatPrice } from "@/config/brand";
import { useCart } from "@/lib/cart";
import { resolveLinePriceCents, resolveLineTitle } from "@/lib/pricing";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Checkout — ${brand.name}` },
      {
        name: "description",
        content: "Guest checkout for your wallpaper albums. Instant download after payment.",
      },
      { property: "og:title", content: `Checkout — ${brand.name}` },
      { property: "og:description", content: "Guest checkout. Instant download after payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, totalCents, hydrated } = useCart();

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-4xl">Your bag is empty.</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse albums</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Guest checkout — no account required. Your download links are emailed and shown
        immediately after payment.
      </p>

      <ul className="mt-10 border-t border-border">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex items-baseline justify-between border-b border-border py-4"
          >
            <span className="font-display text-lg">{resolveLineTitle(line)}</span>
            <span className="text-sm tabular-nums">
              {formatPrice(resolveLinePriceCents(line) ?? 0)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-display text-3xl tabular-nums">{formatPrice(totalCents)}</span>
      </div>

      <div className="mt-10 max-w-md">
        <Label htmlFor="purchase-email">Email for your download links</Label>
        <Input
          id="purchase-email"
          type="email"
          maxLength={255}
          placeholder="you@example.com"
          className="mt-2"
        />
      </div>

      <Button size="lg" className="mt-8" disabled>
        Pay securely
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Payment provider is being connected. Prices are always confirmed on the server at
        checkout, never taken from the browser.
      </p>
    </div>
  );
}
