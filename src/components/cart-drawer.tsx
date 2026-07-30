import { Link } from "@tanstack/react-router";
import { Minus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/config/brand";
import { bundle } from "@/config/products";
import { useCart } from "@/lib/cart";
import { resolveLinePriceCents, resolveLineTitle, bundleSavingsCents } from "@/lib/pricing";

export function CartDrawer() {
  const { lines, isOpen, setOpen, remove, totalCents, has } = useCart();
  const showBundleNudge = lines.length >= 2 && !has(bundle.id);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display text-2xl">Your bag</SheetTitle>
          <SheetDescription>
            Digital downloads. No shipping, no account needed.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" strokeWidth={1.25} />
              <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/shop">Browse albums</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex items-start justify-between gap-4 border-b border-border pb-4"
                >
                  <div>
                    <p className="font-display text-lg leading-tight">
                      {resolveLineTitle(line)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      iPhone 9:16 + MacBook 16:9
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      <Minus className="h-3 w-3" /> Remove
                    </button>
                  </div>
                  <span className="text-sm tabular-nums">
                    {formatPrice(resolveLinePriceCents(line) ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {showBundleNudge && (
            <div className="mt-6 border border-border bg-secondary/60 p-4">
              <p className="text-sm text-foreground">
                Take everything instead — {bundle.title} is {formatPrice(bundle.priceCents)}{" "}
                and saves {formatPrice(bundleSavingsCents)}.
              </p>
              <Button asChild variant="link" className="mt-1 h-auto px-0">
                <Link to="/bundle" onClick={() => setOpen(false)}>
                  See the bundle
                </Link>
              </Button>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border px-4 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl tabular-nums">
                {formatPrice(totalCents)}
              </span>
            </div>
            <Button asChild className="mt-4 w-full" size="lg">
              <Link to="/checkout" search={{}} onClick={() => setOpen(false)}>
                Checkout
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Instant download after payment.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
