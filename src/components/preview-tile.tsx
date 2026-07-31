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
  eager = false,
  teaser = false,
  teaserIndex = 0,
  children,
}: {
  gradient: readonly [string, string, string];
  ratio?: Ratio;
  previewSrc?: string | null;
  alt?: string;
  className?: string;
  watermark?: boolean;
  eager?: boolean;
  /** Shows only a magnified fragment of the preview, softened and veiled. */
  teaser?: boolean;
  teaserIndex?: number;
  children?: React.ReactNode;
}) {
  const [a, b, c] = gradient;
  const isAuto = ratio === "auto";

  // Rotating focal points so each teaser reveals a different fragment.
  const focals = ["50% 22%", "32% 55%", "68% 40%", "50% 78%", "22% 32%"];
  const focal = focals[teaserIndex % focals.length];

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
          loading={eager ? "eager" : "lazy"}
          {...(eager ? { fetchPriority: "high" as const } : {})}
          decoding={eager ? "sync" : "async"}
          draggable={false}
          className={cn(
            "block w-full",
            isAuto ? "h-auto object-contain" : "absolute inset-0 h-full object-cover",
            teaser && "scale-[1.9] blur-[1.5px] saturate-[0.92]",
          )}
          style={teaser ? { objectPosition: focal } : undefined}
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

      {teaser && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(200deg, ${a}33 0%, transparent 45%, ${c}66 100%)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-background/10 backdrop-blur-[1px]"
          />
        </>
      )}

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
