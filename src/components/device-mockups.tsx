import { PreviewTile } from "@/components/preview-tile";

/**
 * Shows one wallpaper in both delivered formats, side by side.
 * Uses watermarked preview tiles only.
 */
export function DeviceMockups({
  gradient,
  className,
}: {
  gradient: readonly [string, string, string];
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-center gap-6 sm:gap-10 ${className ?? ""}`}>
      <figure className="w-[58%] max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-2 shadow-lift">
          <div className="overflow-hidden rounded-sm">
            <PreviewTile gradient={gradient} ratio="desktop" watermark={false} />
          </div>
        </div>
        <div className="mx-auto h-2 w-1/3 rounded-b-md bg-stone" />
        <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
          MacBook · 16:9
        </figcaption>
      </figure>

      <figure className="w-[22%] max-w-[190px]">
        <div className="rounded-[2rem] border border-border bg-card p-1.5 shadow-lift">
          <div className="overflow-hidden rounded-[1.6rem]">
            <PreviewTile gradient={gradient} ratio="mobile" watermark={false} />
          </div>
        </div>
        <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
          iPhone · 9:16
        </figcaption>
      </figure>
    </div>
  );
}
