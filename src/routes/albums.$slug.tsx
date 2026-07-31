import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

import { DeviceMockups } from "@/components/device-mockups";
import { PreviewTile } from "@/components/preview-tile";
import { Reveal } from "@/components/section";
import { Button } from "@/components/ui/button";
import { brand, formatPrice } from "@/config/brand";
import { BUNDLE_AVAILABLE, bundle, getAlbumBySlug, type Wallpaper } from "@/config/products";
import { useCart } from "@/lib/cart";
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

function AlbumPage() {
  const { album } = Route.useLoaderData();
  const { add, has } = useCart();
  const inCart = has(album.slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <Button asChild variant="link" className="mb-8 px-0 text-muted-foreground">
        <Link to="/shop">
          <ArrowLeft className="mr-1 h-4 w-4" /> All albums
        </Link>
      </Button>

      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div className="overflow-hidden shadow-lift">
          <PreviewTile gradient={album.gradient} previewSrc={album.coverSrc ?? null} alt={album.title} ratio="auto" eager />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{album.theme}</p>
          <h1 className="font-display mt-3 text-4xl leading-none sm:text-5xl">{album.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {album.description}
          </p>

          <ul className="mt-7 space-y-2 text-sm">
            {[
              `${album.wallpaperCount} wallpapers`,
              "iPhone 9:16 + MacBook 16:9 included",
              "Instant download after payment",
              "Personal-use licence",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-foreground">
                <Check className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl tabular-nums">
              {formatPrice(album.priceCents)}
            </span>
            {album.compareAtCents && album.compareAtCents > album.priceCents && (
              <>
                <span className="text-sm tabular-nums text-muted-foreground line-through">
                  {formatPrice(album.compareAtCents)}
                </span>
                <span className="bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
                  Save{" "}
                  {Math.round(
                    ((album.compareAtCents - album.priceCents) / album.compareAtCents) * 100,
                  )}
                  %
                </span>
              </>
            )}
            <Button
              size="lg"
              disabled={inCart}
              onClick={() => {
                add({ id: album.slug, kind: "album", quantity: 1 });
                toast.success(`${album.title} added to your bag`);
              }}
            >
              {inCart ? "In your bag" : "Add to bag"}
            </Button>
          </div>

          {BUNDLE_AVAILABLE && (
          <div className="mt-8 border border-border bg-secondary/50 p-5">
            <p className="text-sm text-foreground">
              Or take all {bundle.title.toLowerCase()} for {formatPrice(bundle.priceCents)} —{" "}
              {bundleSavingsPercent}% off buying albums one by one.
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
          Ten motifs, shown here as cropped fragments only — texture, colour and mood. The
          full compositions stay unreleased until you own them.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {album.wallpapers.map((wallpaper: Wallpaper, i: number) => (
            <Reveal key={wallpaper.id} delay={(i % 4) * 60}>
              <div className="relative overflow-hidden shadow-frame">
                <PreviewTile
                  gradient={wallpaper.gradient}
                  previewSrc={wallpaper.previewSrc}
                  alt={`${album.title} fragment ${wallpaper.name}`}
                  ratio="mobile"
                  teaser
                  teaserIndex={i}
                />
                <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {wallpaper.name} · fragment
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      <section className="mt-24">
        <h2 className="font-display text-3xl">Both formats, one purchase.</h2>
        <DeviceMockups gradient={album.gradient} className="mt-12" />
      </section>
    </div>
  );
}
