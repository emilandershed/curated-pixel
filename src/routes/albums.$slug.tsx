import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DeviceMockups } from "@/components/device-mockups";
import { PreviewTile } from "@/components/preview-tile";
import { Reveal } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brand, formatPrice } from "@/config/brand";
import { BUNDLE_AVAILABLE, albums, bundle, getAlbumBySlug, totalWallpaperCount, type Album, type Wallpaper } from "@/config/products";
import { useCart } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { bundleSavingsPercent } from "@/lib/pricing";

export const Route = createFileRoute("/albums/$slug")({
  loader: ({ params }) => {
    const album = getAlbumBySlug(params.slug);
    if (!album) throw notFound();
    return { album };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Album not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { album } = loaderData;
    const title = `${album.title} — wallpaper album | ${brand.name}`;
    const description = `${album.blurb} ${album.wallpaperCount} wallpapers, delivered in iPhone 9:16 and MacBook 16:9.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AlbumPage,
});

const savingPercent = (album: Album) =>
  album.compareAtCents && album.compareAtCents > album.priceCents
    ? Math.round(((album.compareAtCents - album.priceCents) / album.compareAtCents) * 100)
    : null;

/** Price row + email + consent + Buy now. Payment logic mirrors /checkout exactly. */
function PurchaseBlock({
  album,
  emailRef,
}: {
  album: Album;
  emailRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { add, has } = useCart();
  const inCart = has(album.slug);
  const startCheckout = useServerFn(createCheckoutSession);
  const [email, setEmail] = useState("");
  const [consented, setConsented] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const saving = savingPercent(album);

  const onBuyNow = async () => {
    if (!emailLooksValid) {
      toast.error("Enter the email address your download links should go to.");
      emailRef.current?.focus();
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
          lines: [{ id: album.slug, kind: "album" as const }],
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

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-display text-3xl tabular-nums">{formatPrice(album.priceCents)}</span>
        {album.compareAtCents && saving !== null && (
          <>
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              {formatPrice(album.compareAtCents)}
            </span>
            <span className="bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
              Save {saving}%
            </span>
          </>
        )}
      </div>

      <div className="mt-6 max-w-md">
        <Label htmlFor="buy-email">Email for your download links</Label>
        <Input
          id="buy-email"
          ref={emailRef}
          type="email"
          autoComplete="email"
          maxLength={255}
          placeholder="you@example.com"
          className="mt-2 h-12"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="mt-5 flex max-w-md items-start gap-3">
        <Checkbox
          id={`withdrawal-consent-${album.slug}`}
          checked={consented}
          onCheckedChange={(value) => setConsented(value === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor={`withdrawal-consent-${album.slug}`}
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          className="min-h-[48px] flex-1 sm:flex-none"
          onClick={onBuyNow}
          disabled={submitting || !consented}
        >
          {submitting
            ? "Opening secure payment…"
            : `Buy now — ${formatPrice(album.priceCents)}`}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="min-h-[48px] text-muted-foreground"
          disabled={inCart}
          onClick={() => {
            add({ id: album.slug, kind: "album", quantity: 1 });
            toast.success(`${album.title} added to your bag`);
          }}
        >
          {inCart ? "In your bag" : "Add to bag"}
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        You'll be taken to Stripe's secure payment page. Instant download after payment.
      </p>
    </div>
  );
}

function AlbumPage() {
  const { album } = Route.useLoaderData();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const purchaseRef = useRef<HTMLDivElement | null>(null);
  const [showBar, setShowBar] = useState(false);
  const heroWallpaper = album.wallpapers[0];

  useEffect(() => {
    const node = purchaseRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goToPurchase = () => {
    purchaseRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 600);
  };

  const details = [
    `${album.wallpaperCount} wallpapers`,
    "iPhone 9:16 + MacBook 16:9 included",
    "Instant download after payment",
    "Personal-use licence",
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-8 sm:px-8 sm:py-16 lg:pb-16">
      <Button asChild variant="link" className="mb-4 px-0 text-muted-foreground sm:mb-8">
        <Link to="/shop">
          <ArrowLeft className="mr-1 h-4 w-4" /> All albums
        </Link>
      </Button>

      {/* Mobile: title → hero → buy → prose. Desktop: two columns. */}
      <div className="lg:grid lg:gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div className="lg:hidden">
          <p className="eyebrow">{album.theme}</p>
          <h1 className="font-display mt-3 text-4xl leading-none">{album.title}</h1>
        </div>

        <div className="mt-6 self-start overflow-hidden shadow-lift lg:mt-0">
          <div className="lg:hidden">
            <PreviewTile
              gradient={album.gradient}
              previewSrc={heroWallpaper?.previewSrc ?? album.coverSrc ?? null}
              alt={album.title}
              ratio="mobile"
              eager
            />
          </div>
          <div className="hidden lg:block">
            <PreviewTile
              gradient={album.gradient}
              previewSrc={album.coverSrc ?? null}
              alt={album.title}
              ratio="auto"
              eager
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="hidden lg:block">
            <p className="eyebrow">{album.theme}</p>
            <h1 className="font-display mt-3 text-4xl leading-none sm:text-5xl">{album.title}</h1>
          </div>

          <div ref={purchaseRef} className="mt-8 lg:mt-8">
            <PurchaseBlock album={album} emailRef={emailRef} />
          </div>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {album.description}
          </p>

          <ul className="mt-7 space-y-2 text-sm">
            {details.map((item) => (
              <li key={item} className="flex items-center gap-2 text-foreground">
                <Check className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> {item}
              </li>
            ))}
          </ul>

          {BUNDLE_AVAILABLE && (
            <div className="mt-8 border border-border bg-secondary/50 p-5">
              <p className="text-sm text-foreground">
                Get all {albums.length} albums instead — {totalWallpaperCount} wallpapers for{" "}
                {formatPrice(bundle.priceCents)}, {bundleSavingsPercent}% off buying them one by
                one.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/bundle">See the bundle</Link>
              </Button>
            </div>
          )}

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Previews on this page are low-resolution and watermarked. Full-resolution files are
            released only through your download link after purchase.
          </p>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="eyebrow">Inside the album</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          All ten wallpapers below, shown at low resolution with a watermark.
          Full-resolution files unlock the moment you buy.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {album.wallpapers.map((wallpaper: Wallpaper, i: number) => (
            <Reveal key={wallpaper.id} delay={(i % 4) * 60}>
              <div className="relative overflow-hidden shadow-frame">
                <PreviewTile
                  gradient={wallpaper.gradient}
                  previewSrc={wallpaper.previewSrc}
                  alt={`${album.title} ${wallpaper.name}`}
                  ratio="mobile"
                />
                <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {wallpaper.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-display text-3xl">Both formats, one purchase.</h2>
        <DeviceMockups
          gradient={album.gradient}
          previewSrc={album.coverSrc ?? album.wallpapers[0]?.previewSrc ?? null}
          alt={`${album.title} shown on MacBook and iPhone`}
          className="mt-12"
        />
      </section>

      {/* Sticky mobile buy bar — scrolls to the purchase block, never bypasses consent. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-all duration-300 lg:hidden ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <span className="font-display text-xl tabular-nums">
            {formatPrice(album.priceCents)}
          </span>
          <Button className="min-h-[44px] px-6" onClick={goToPurchase}>
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}
