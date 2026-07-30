import { Link } from "@tanstack/react-router";

import { brand } from "@/config/brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-foreground">{brand.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {brand.tagline}
            </p>
          </div>

          <nav aria-label="Shop">
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-foreground">
                  All albums
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <p className="eyebrow">Support</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  hash="resend"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Resend download link
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="eyebrow">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/legal/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & licence
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/refunds"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Refunds
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.legal.entity}. All artwork licensed for
            personal use.
          </p>
          <p className="flex items-center gap-3">
            <span>Secure checkout</span>
            <span aria-hidden>·</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple&nbsp;Pay</span>
            <span>Google&nbsp;Pay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
