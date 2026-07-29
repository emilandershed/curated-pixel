import { useRef, useState } from "react";

import { PreviewTile } from "@/components/preview-tile";

/**
 * Before/after slider illustrating compressed vs. full-resolution output.
 * Both sides are watermarked preview assets.
 */
export function QualitySlider({
  gradient,
}: {
  gradient: readonly [string, string, string];
}) {
  const [position, setPosition] = useState(52);
  const frame = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative select-none overflow-hidden shadow-lift" ref={frame}>
      <div className="relative">
        <div className="blur-[3px] saturate-[0.6] contrast-[0.9]">
          <PreviewTile gradient={gradient} ratio="wide" watermark={false} />
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <PreviewTile gradient={gradient} ratio="wide" watermark={false} />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-background/90"
          style={{ left: `${position}%` }}
        />
      </div>

      <label className="sr-only" htmlFor="quality-slider">
        Compare compressed and full-resolution output
      </label>
      <input
        id="quality-slider"
        type="range"
        min={4}
        max={96}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />

      <span className="pointer-events-none absolute bottom-3 left-3 bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur">
        Typical download
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-foreground backdrop-blur">
        Our master file
      </span>
    </div>
  );
}
