import { cn } from "@/lib/utils";

type Ratio = "mobile" | "desktop" | "wide" | "square" | "auto";

const ratioClass: Record<Ratio, string> = {
  mobile: "aspect-[9/16]",
  desktop: "aspect-[16/9]",
  wide: "aspect-[21/9]",
  square: "aspect-square",
  auto: "",
};

/**
 * Renders an album/wallpaper preview.
 *
 * IMPORTANT: this component only ever renders `previewSrc`, which is the
 * low-resolution, watermarked asset. Full-resolution files live behind the
 * signed download flow and must never be passed here.
 */
export function PreviewTile({
  gradient,
  ratio = "desktop",
  previewSrc = null,
  alt,
  className,
  watermark = true,
  children,
}: {
  gradient: readonly [string, string, string];
  ratio?: Ratio;
  previewSrc?: string | null;
  alt?: string;
  className?: string;
  watermark?: boolean;
  children?: React.ReactNode;
}) {
  const [a, b, c] = gradient;
  const isAuto = ratio === "auto";

  return (
    <div
      className={cn(
        "no-save relative overflow-hidden bg-muted",
        ratioClass[ratio],
        className,
      )}
      onContextMenu={(e) => e.preventDefault()}
    >
      {previewSrc ? (
        <img
          src={previewSrc}
          alt={alt ?? ""}
          loading="lazy"
          draggable={false}
          className={cn(
            "block w-full",
            isAuto ? "h-auto object-contain" : "absolute inset-0 h-full object-cover",
          )}
        />
      ) : (
        <div
          aria-hidden
          className={cn("inset-0", isAuto ? "aspect-[16/9]" : "absolute")}
          style={{
            backgroundImage: `radial-gradient(120% 90% at 20% 15%, ${a} 0%, transparent 60%), radial-gradient(110% 100% at 85% 30%, ${b} 0%, transparent 65%), linear-gradient(160deg, ${b} 0%, ${c} 100%)`,
          }}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 3px, rgba(255,255,255,0.35) 3px 4px)",
        }}
      />

      {watermark && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.2em] text-white/55 mix-blend-overlay"
        >
          preview
        </span>
      )}

      {children}
    </div>
  );
}
