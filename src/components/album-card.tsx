import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { PreviewTile } from "@/components/preview-tile";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/config/brand";
import type { Album } from "@/config/products";
import { useCart } from "@/lib/cart";

export function AlbumCard({ album, index = 0 }: { album: Album; index?: number }) {
  const hoverSrc = album.wallpapers[1]?.previewSrc ?? null;
  const { add, has } = useCart();
  const navigate = useNavigate();
  const inCart = has(album.slug);
  const onSale = Boolean(album.compareAtCents && album.compareAtCents > album.priceCents);

  const addToBag = () => {
    if (!inCart) {
      add({ id: album.slug, kind: "album", quantity: 1 });
      toast.success(`${album.title} added to your bag`);
    }
  };

  return (
    <div style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}>
      <Link to="/albums/$slug" params={{ slug: album.slug }} className="group block">
        <div className="relative overflow-hidden bg-muted shadow-frame transition-shadow duration-500 group-hover:shadow-lift">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <PreviewTile gradient={album.gradient} previewSrc={album.coverSrc ?? null} alt={album.title} ratio="desktop" watermark={false} />
          </div>
          {hoverSrc && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <PreviewTile
                gradient={album.gradient}
                previewSrc={hoverSrc}
                alt={album.title}
                ratio="desktop"
                watermark={false}
              />
            </div>
          )}
          <span className="absolute left-3 top-3 bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur">
            {album.theme}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl leading-none text-foreground">{album.title}</h3>
          <span className="flex items-baseline gap-2 text-sm tabular-nums text-muted-foreground">
            {onSale && (
              <span className="text-muted-foreground/70 line-through">
                {formatPrice(album.compareAtCents!)}
              </span>
            )}
            <span className="text-foreground">{formatPrice(album.priceCents)}</span>
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{album.blurb}</p>
        <p className="mt-1 text-xs text-muted-foreground/80">
          {album.wallpaperCount} wallpapers · iPhone + MacBook
        </p>
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => {
            addToBag();
            navigate({ to: "/checkout", search: { cancelled: undefined } });
          }}
        >
          Buy now
        </Button>
        <Button size="sm" variant="outline" disabled={inCart} onClick={addToBag}>
          {inCart ? "In your bag" : "Add to bag"}
        </Button>
      </div>
    </div>
  );
}
