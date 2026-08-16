import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AlbumCard } from "@/components/album-card";
import { PreviewTile } from "@/components/preview-tile";
import { Reveal, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brand, formatPrice } from "@/config/brand";
import { BUNDLE_AVAILABLE, albums, bundle, totalWallpaperCount } from "@/config/products";
import { bundleSavingsPercent } from "@/lib/pricing";

const title = `Shop all wallpaper albums — ${brand.name}`;
const description = `Browse ${albums.length} curated wallpaper ${albums.length === 1 ? "album" : "albums"} and ${totalWallpaperCount} frames, each delivered in iPhone 9:16 and MacBook 16:9 format.`;

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Shop,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

function Shop() {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...albums];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.priceCents - b.priceCents);
      case "price-desc":
        return list.sort((a, b) => b.priceCents - a.priceCents);
      case "newest":
        return list.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
      default:
        return list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title),
        );
    }
  }, [sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="The collection"
        title={albums.length === 1 ? "The collection." : "Every album."}
        intro={`${albums.length} ${albums.length === 1 ? "album" : "albums"}, ${totalWallpaperCount} wallpapers. Each purchase includes both the iPhone and MacBook format.`}
      />

      {/* Lead offer — the complete pack */}
      {BUNDLE_AVAILABLE && (
        <Reveal className="mt-12">
          <div className="border border-foreground/15 bg-secondary/50 p-6 shadow-frame sm:p-10">
            <p className="eyebrow">Best value</p>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] sm:text-5xl">
              {bundle.title}
            </h2>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-display text-4xl tabular-nums sm:text-5xl">
                {formatPrice(bundle.priceCents)}
              </span>
              <span className="text-sm tabular-nums text-muted-foreground line-through">
                {formatPrice(catalogueTotalCents)}
              </span>
              <span className="bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
                Save {formatPrice(bundleSavingsCents)} · {bundleSavingsPercent}%
              </span>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              All {albums.length} albums · {totalWallpaperCount} wallpapers · every frame in both
              iPhone and MacBook format.
            </p>

            <Button asChild size="lg" className="mt-7 w-full sm:w-auto">
              <Link to="/bundle">Get the complete pack</Link>
            </Button>

            <div className="mt-8 grid grid-cols-4 gap-2">
              {albums.slice(0, 8).map((album) => (
                <div key={album.id} className="overflow-hidden shadow-frame">
                  <PreviewTile
                    gradient={album.gradient}
                    previewSrc={album.coverSrc ?? null}
                    alt={album.title}
                    ratio="square"
                    watermark={false}
                    eager
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-14 flex items-center justify-between gap-4 border-y border-border py-4">
        <p className="text-sm text-muted-foreground">
          {albums.length} {albums.length === 1 ? "album" : "albums"}
        </p>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-[190px]" aria-label="Sort albums">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((album, i) => (
          <Reveal key={album.id} delay={(i % 3) * 70}>
            <AlbumCard album={album} index={i} />
          </Reveal>
        ))}
      </div>

    </div>
  );
}
