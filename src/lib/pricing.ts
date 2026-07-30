import {
  BUNDLE_AVAILABLE,
  allAlbums,
  bundle,
  getAlbumBySlug,
} from "@/config/products";

export type CartLine = { id: string; kind: "album" | "bundle"; quantity: 1 };

/** Sum of every album in the full catalogue bought individually. */
export const catalogueTotalCents = allAlbums.reduce((n, a) => n + a.priceCents, 0);

/** What the bundle saves versus buying everything separately. */
export const bundleSavingsCents = catalogueTotalCents - bundle.priceCents;

export const bundleSavingsPercent = Math.round(
  (bundleSavingsCents / catalogueTotalCents) * 100,
);

/** Savings if you already hold one album and upgrade to the bundle. */
export const upgradeSavingsCents = (albumPriceCents: number) =>
  Math.max(0, catalogueTotalCents - albumPriceCents - (bundle.priceCents - albumPriceCents));

/**
 * AVAILABILITY GATE (server-authoritative).
 *
 * `getAlbumBySlug` only sees albums whitelisted in `AVAILABLE_ALBUM_SLUGS`, and
 * the bundle is gated behind `BUNDLE_AVAILABLE`. A hand-crafted or replayed
 * request naming a hidden album or the bundle resolves to `null` here, so
 * `resolveOrderLines` drops it and checkout refuses to price it.
 *
 * Never trust a price supplied by the client — always resolve it here.
 */
export const resolveLinePriceCents = (line: CartLine): number | null => {
  if (line.kind === "bundle") {
    if (!BUNDLE_AVAILABLE) return null;
    return line.id === bundle.id ? bundle.priceCents : null;
  }
  return getAlbumBySlug(line.id)?.priceCents ?? null;
};

export const resolveLineTitle = (line: CartLine): string | null => {
  if (line.kind === "bundle") {
    if (!BUNDLE_AVAILABLE) return null;
    return line.id === bundle.id ? bundle.title : null;
  }
  return getAlbumBySlug(line.id)?.title ?? null;
};

export const cartTotalCents = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + (resolveLinePriceCents(line) ?? 0), 0);
