import { albums, bundle, getAlbumBySlug } from "@/config/products";

export type CartLine = { id: string; kind: "album" | "bundle"; quantity: 1 };

/** Sum of every album bought individually. */
export const catalogueTotalCents = albums.reduce((n, a) => n + a.priceCents, 0);

/** What the bundle saves versus buying everything separately. */
export const bundleSavingsCents = catalogueTotalCents - bundle.priceCents;

export const bundleSavingsPercent = Math.round(
  (bundleSavingsCents / catalogueTotalCents) * 100,
);

/** Savings if you already hold one album and upgrade to the bundle. */
export const upgradeSavingsCents = (albumPriceCents: number) =>
  Math.max(0, catalogueTotalCents - albumPriceCents - (bundle.priceCents - albumPriceCents));

/**
 * Resolve a cart line to its authoritative price.
 * Never trust a price supplied by the client — always resolve it here.
 */
export const resolveLinePriceCents = (line: CartLine): number | null => {
  if (line.kind === "bundle") return line.id === bundle.id ? bundle.priceCents : null;
  return getAlbumBySlug(line.id)?.priceCents ?? null;
};

export const resolveLineTitle = (line: CartLine): string | null => {
  if (line.kind === "bundle") return line.id === bundle.id ? bundle.title : null;
  return getAlbumBySlug(line.id)?.title ?? null;
};

export const cartTotalCents = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + (resolveLinePriceCents(line) ?? 0), 0);
