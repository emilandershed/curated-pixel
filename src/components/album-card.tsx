import { Link } from "@tanstack/react-router";

import { PreviewTile } from "@/components/preview-tile";
import { formatPrice } from "@/config/brand";
import type { Album } from "@/config/products";

export function AlbumCard({ album, index = 0 }: { album: Album; index?: number }) {
  const hoverGradient = album.wallpapers[1]?.gradient ?? album.gradient;

  return (
    <Link
      to="/albums/$slug"
      params={{ slug: album.slug }}
      className="group block"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="relative overflow-hidden bg-muted shadow-frame transition-shadow duration-500 group-hover:shadow-lift">
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.02]">
          <PreviewTile gradient={album.gradient} ratio="desktop" watermark={false} />
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <PreviewTile gradient={hoverGradient} ratio="desktop" watermark={false} />
        </div>
        <span className="absolute left-3 top-3 bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur">
          {album.theme}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl leading-none text-foreground">{album.title}</h3>
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatPrice(album.priceCents)}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{album.blurb}</p>
      <p className="mt-1 text-xs text-muted-foreground/80">
        {album.wallpaperCount} wallpapers · iPhone + MacBook
      </p>
    </Link>
  );
}
