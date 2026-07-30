import { Link, createFileRoute, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand, formatPrice } from "@/config/brand";
import { useCart } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { resolveLinePriceCents, resolveLineTitle } from "@/lib/pricing";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    cancelled: search.cancelled === "1" || search.cancelled === 1 ? true : undefined,
  }),
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
  const { cancelled } = useSearch({ from: "/checkout" });
  const startCheckout = useServerFn(createCheckoutSession);
  const [email, setEmail] = useState("");
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onPay = async () => {
    if (!emailLooksValid) {
      toast.error("Enter the email address your download links should go to.");
      return;
    }
    if (!consented) {
      toast.error("Please confirm immediate delivery to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const { url } = await startCheckout({
        data: {
          email,
          lines: lines.map((l) => ({ id: l.id, kind: l.kind })),
          origin: window.location.origin,
        },
      });
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("We couldn't start the payment. Please try again in a moment.");
      setSubmitting(false);
    }
  };


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

      {cancelled ? (
        <p className="mt-6 border border-border bg-secondary/50 px-4 py-3 text-sm">
          Payment was cancelled. Nothing has been charged — your bag is still here.
        </p>
      ) : null}

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
          autoComplete="email"
          maxLength={255}
          placeholder="you@example.com"
          className="mt-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="mt-8 flex max-w-md items-start gap-3">
        <Checkbox
          id="withdrawal-consent"
          checked={consented}
          onCheckedChange={(value) => setConsented(value === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="withdrawal-consent"
          className="text-xs font-normal leading-relaxed text-muted-foreground"
        >
          I request immediate delivery of these digital files and acknowledge that I
          thereby lose my 14-day right of withdrawal, as described in the{" "}
          <Link to="/legal/refunds" className="underline hover:text-foreground">
            refund policy
          </Link>{" "}
          and{" "}
          <Link to="/legal/terms" className="underline hover:text-foreground">
            terms
          </Link>
          .
        </Label>
      </div>

      <Button
        size="lg"
        className="mt-8"
        onClick={onPay}
        disabled={submitting || !consented}
      >
        {submitting ? "Opening secure payment…" : "Pay securely"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        You'll be taken to Stripe's secure payment page. Prices are always confirmed on the
        server at checkout, never taken from the browser.
      </p>

    </div>
  );
}
