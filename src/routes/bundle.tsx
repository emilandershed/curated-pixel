import { createFileRoute, redirect } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { AlbumCard } from "@/components/album-card";
import { PreviewTile } from "@/components/preview-tile";
import { Reveal, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { brand, formatPrice } from "@/config/brand";
import { BUNDLE_AVAILABLE, albums, bundle, totalWallpaperCount } from "@/config/products";
import { useCart } from "@/lib/cart";
import { bundleSavingsCents, bundleSavingsPercent, catalogueTotalCents } from "@/lib/pricing";

const title = `${bundle.title} — both albums, one price | ${brand.name}`;
const description = `Both albums and all ${totalWallpaperCount} wallpapers in iPhone and MacBook format for ${formatPrice(bundle.priceCents)}.`;

export const Route = createFileRoute("/bundle")({
  // The pack is only purchasable while more than one album is available.
  beforeLoad: () => {
    if (!BUNDLE_AVAILABLE || albums.length < 2) throw redirect({ to: "/shop" });
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BundlePage,
});

function BundlePage() {
  const { add, has } = useCart();
  const inCart = has(bundle.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">Best value</p>
          <h1 className="font-display mt-3 text-5xl leading-[1] sm:text-6xl">{bundle.title}</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {bundle.description}
          </p>

          <ul className="mt-8 space-y-2 text-sm">
            {[
              `Both albums · ${totalWallpaperCount} wallpapers`,
              "Both formats for every single frame",
              "Cheaper than buying the two albums separately",
              "Instant download, links valid for 90 days",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-baseline gap-4">
            <span className="font-display text-5xl tabular-nums">
              {formatPrice(bundle.priceCents)}
            </span>
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              {formatPrice(catalogueTotalCents)}
            </span>
            <span className="bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
              Save {formatPrice(bundleSavingsCents)} · {bundleSavingsPercent}%
            </span>
          </div>

          <Button
            size="lg"
            className="mt-8"
            disabled={inCart}
            onClick={() => {
              add({ id: bundle.id, kind: "bundle", quantity: 1 });
              toast.success("Bundle added to your bag");
            }}
          >
            {inCart ? "In your bag" : "Add the bundle"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {albums.map((album) => (
            <div key={album.id} className="overflow-hidden shadow-frame">
              <PreviewTile gradient={album.gradient} ratio="mobile" watermark={false} />
            </div>
          ))}
        </div>
      </div>

      <section className="mt-24">
        <Reveal>
          <SectionHeading eyebrow="Included" title="Everything in the library." />
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album, i) => (
            <Reveal key={album.id} delay={(i % 3) * 70}>
              <AlbumCard album={album} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
