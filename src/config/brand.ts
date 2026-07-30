/**
 * Single source of truth for brand identity.
 * Rename the store by editing this file only.
 */
export const brand = {
  name: "Faint Line",
  shortName: "Faint",
  tagline: "Wallpapers, framed with intent.",
  description:
    "Curated digital wallpaper collections for iPhone and MacBook. Every wallpaper delivered in both 9:16 and 16:9, at full resolution.",
  currency: "EUR",
  currencySymbol: "€",
  locale: "en-IE",
  legal: {
    entity: "Emil Andershed",
    address: "Örebro, Sweden",
  },
  social: {
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    pinterest: "https://pinterest.com/",
  },
} as const;

/** Download links stay valid for this many days after purchase. */
export const DOWNLOAD_TOKEN_VALID_DAYS = 90;

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
