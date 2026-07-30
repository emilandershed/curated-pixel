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

      <div className="mt-10 flex items-center justify-between gap-4 border-y border-border py-4">
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

      {/* Bundle card */}
      {BUNDLE_AVAILABLE && (
      <Reveal className="mt-12">
        <div className="grid items-center gap-8 border border-border bg-secondary/40 p-6 sm:grid-cols-[1fr_1.1fr] sm:p-8">
          <div>
            <p className="eyebrow">Best value</p>
            <h2 className="font-display mt-2 text-3xl">{bundle.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bundle.blurb}</p>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl tabular-nums">
                {formatPrice(bundle.priceCents)}
              </span>
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Save {bundleSavingsPercent}%
              </span>
            </div>
            <Button asChild className="mt-6">
              <Link to="/bundle">View the bundle</Link>
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {albums.slice(0, 8).map((album) => (
              <div key={album.id} className="overflow-hidden shadow-frame">
                <PreviewTile gradient={album.gradient} previewSrc={album.coverSrc ?? null} alt={album.title} ratio="square" watermark={false} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      )}

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((album, i) => (
          <Reveal key={album.id} delay={(i % 3) * 70}>
            <AlbumCard album={album} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
