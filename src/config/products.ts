/**
 * Single source of truth for the catalog.
 *
 * ASSET MODEL — read before adding real artwork:
 *   previewSrc  -> low-resolution, WATERMARKED image. The only thing ever
 *                  rendered in the browser. Safe to be public.
 *   downloadKey -> full-resolution original in private storage. Never
 *                  referenced from a page, never in an <img>. Reachable only
 *                  through a signed download token issued after a verified
 *                  payment.
 *
 * Until real artwork exists, `previewSrc` is null and the UI renders a
 * deterministic gradient placeholder tile from `gradient`.
 */

export type Wallpaper = {
  id: string;
  name: string;
  /** Low-res, watermarked preview. Public. Null = render gradient placeholder. */
  previewSrc: string | null;
  /** Private storage key for the full-resolution files. NEVER rendered. */
  downloadKey: string;
  gradient: [string, string, string];
};

export type Album = {
  id: string;
  slug: string;
  title: string;
  theme: string;
  blurb: string;
  description: string;
  priceCents: number;
  wallpaperCount: number;
  featured: boolean;
  /** Low-res, watermarked 16:9 cover. Public. Null = gradient placeholder. */
  coverSrc?: string | null;
  releasedAt: string;
  gradient: [string, string, string];
  wallpapers: Wallpaper[];
};

import tourKitCover from "@/assets/tour-kit-cover.png.asset.json";
import tourKit01 from "@/assets/tour-kit-01.jpg.asset.json";
import tourKit02 from "@/assets/tour-kit-02.jpg.asset.json";
import tourKit03 from "@/assets/tour-kit-03.jpg.asset.json";
import tourKit04 from "@/assets/tour-kit-04.jpg.asset.json";
import tourKit05 from "@/assets/tour-kit-05.jpg.asset.json";
import tourKit06 from "@/assets/tour-kit-06.jpg.asset.json";
import tourKit07 from "@/assets/tour-kit-07.jpg.asset.json";
import tourKit08 from "@/assets/tour-kit-08.jpg.asset.json";
import tourKit09 from "@/assets/tour-kit-09.jpg.asset.json";
import tourKit10 from "@/assets/tour-kit-10.jpg.asset.json";

/**
 * Real, delivered preview art keyed by `${albumId}-${index}`.
 * Only low-resolution, watermarked previews belong here.
 */
const previewOverrides: Record<string, string> = {
  "tour-kit-1": tourKit01.url,
  "tour-kit-2": tourKit02.url,
  "tour-kit-3": tourKit03.url,
  "tour-kit-4": tourKit04.url,
  "tour-kit-5": tourKit05.url,
  "tour-kit-6": tourKit06.url,
  "tour-kit-7": tourKit07.url,
  "tour-kit-8": tourKit08.url,
  "tour-kit-9": tourKit09.url,
  "tour-kit-10": tourKit10.url,
};

const makeWallpapers = (
  albumId: string,
  count: number,
  palette: [string, string, string][],
): Wallpaper[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${albumId}-${i + 1}`,
    name: `${String(i + 1).padStart(2, "0")}`,
    previewSrc: previewOverrides[`${albumId}-${i + 1}`] ?? null,
    downloadKey: `albums/${albumId}/full/${String(i + 1).padStart(2, "0")}.zip`,
    gradient: palette[i % palette.length],
  }));

type AlbumSeed = Omit<Album, "wallpapers"> & { palette: [string, string, string][] };

const seeds: AlbumSeed[] = [
  {
    id: "nordic-mist",
    slug: "nordic-mist",
    title: "Nordic Mist",
    theme: "Landscape",
    blurb: "Fog over still water, in twelve quiet frames.",
    description:
      "Long exposures from the Scandinavian coast at first light. Muted greys, cold blues and a soft grain that keeps icons legible without fighting them.",
    priceCents: 900,
    wallpaperCount: 12,
    featured: true,
    releasedAt: "2026-06-02",
    gradient: ["oklch(0.86 0.02 230)", "oklch(0.72 0.03 235)", "oklch(0.53 0.04 245)"],
    palette: [
      ["oklch(0.88 0.02 230)", "oklch(0.7 0.03 235)", "oklch(0.5 0.04 245)"],
      ["oklch(0.82 0.02 220)", "oklch(0.63 0.03 230)", "oklch(0.44 0.04 240)"],
      ["oklch(0.9 0.015 210)", "oklch(0.74 0.025 225)", "oklch(0.56 0.035 238)"],
    ],
  },
  {
    id: "paper-grain",
    slug: "paper-grain",
    title: "Paper Grain",
    theme: "Texture",
    blurb: "Scanned cotton paper, folded and refolded.",
    description:
      "Ten high-resolution scans of handmade paper. Neutral, warm and near-monochrome — the closest thing to a blank screen that still feels made by hand.",
    priceCents: 800,
    wallpaperCount: 10,
    featured: true,
    releasedAt: "2026-05-18",
    gradient: ["oklch(0.96 0.01 85)", "oklch(0.9 0.015 80)", "oklch(0.78 0.02 75)"],
    palette: [
      ["oklch(0.97 0.008 85)", "oklch(0.91 0.014 80)", "oklch(0.8 0.02 72)"],
      ["oklch(0.94 0.012 70)", "oklch(0.87 0.018 65)", "oklch(0.74 0.024 60)"],
    ],
  },
  {
    id: "midnight-glass",
    slug: "midnight-glass",
    title: "Midnight Glass",
    theme: "Abstract",
    blurb: "Refracted light on black, for OLED screens.",
    description:
      "Deep-black backgrounds with thin refractions of colour. Built for OLED panels and always-on displays where true black saves both battery and attention.",
    priceCents: 1000,
    wallpaperCount: 14,
    featured: true,
    releasedAt: "2026-06-20",
    gradient: ["oklch(0.28 0.05 280)", "oklch(0.18 0.04 270)", "oklch(0.12 0.02 260)"],
    palette: [
      ["oklch(0.3 0.06 285)", "oklch(0.18 0.045 272)", "oklch(0.11 0.02 258)"],
      ["oklch(0.26 0.05 320)", "oklch(0.16 0.04 300)", "oklch(0.1 0.02 280)"],
      ["oklch(0.24 0.05 200)", "oklch(0.15 0.035 210)", "oklch(0.1 0.02 220)"],
    ],
  },
  {
    id: "desert-quiet",
    slug: "desert-quiet",
    title: "Desert Quiet",
    theme: "Landscape",
    blurb: "Dunes at the hour before the wind picks up.",
    description:
      "Warm sand, hard shadow, empty sky. Shot in the Alentejo and the Atacama, graded to keep home-screen widgets readable in full sun.",
    priceCents: 900,
    wallpaperCount: 11,
    featured: false,
    releasedAt: "2026-04-30",
    gradient: ["oklch(0.9 0.05 70)", "oklch(0.78 0.08 55)", "oklch(0.6 0.09 45)"],
    palette: [
      ["oklch(0.92 0.045 72)", "oklch(0.79 0.08 55)", "oklch(0.58 0.09 42)"],
      ["oklch(0.87 0.05 60)", "oklch(0.72 0.085 48)", "oklch(0.52 0.09 38)"],
    ],
  },
  {
    id: "concrete-lines",
    slug: "concrete-lines",
    title: "Concrete Lines",
    theme: "Architecture",
    blurb: "Brutalist facades, reduced to geometry.",
    description:
      "Twelve studies of post-war concrete: repetition, shadow, and the one diagonal that breaks the grid. Cool greys that sit well behind dark-mode interfaces.",
    priceCents: 900,
    wallpaperCount: 12,
    featured: false,
    releasedAt: "2026-03-14",
    gradient: ["oklch(0.8 0.005 250)", "oklch(0.62 0.008 250)", "oklch(0.42 0.01 255)"],
    palette: [
      ["oklch(0.82 0.005 250)", "oklch(0.6 0.008 250)", "oklch(0.4 0.01 255)"],
      ["oklch(0.75 0.006 240)", "oklch(0.55 0.008 245)", "oklch(0.34 0.01 250)"],
    ],
  },
  {
    id: "botanic-ink",
    slug: "botanic-ink",
    title: "Botanic Ink",
    theme: "Illustration",
    blurb: "Pressed leaves rendered as ink washes.",
    description:
      "Hand-inked botanical studies scanned at 1200 dpi and composed for both orientations. Soft sage and bone, with real brush edges.",
    priceCents: 1000,
    wallpaperCount: 9,
    featured: false,
    releasedAt: "2026-05-05",
    gradient: ["oklch(0.93 0.02 140)", "oklch(0.8 0.04 145)", "oklch(0.58 0.05 150)"],
    palette: [
      ["oklch(0.94 0.02 140)", "oklch(0.79 0.04 145)", "oklch(0.56 0.05 150)"],
      ["oklch(0.9 0.025 160)", "oklch(0.73 0.04 158)", "oklch(0.5 0.05 155)"],
    ],
  },
  {
    id: "analog-noise",
    slug: "analog-noise",
    title: "Analog Noise",
    theme: "Film",
    blurb: "35mm grain, halation, and honest dust.",
    description:
      "Scanned film frames left deliberately imperfect. Halation around highlights, visible grain structure, no digital sharpening anywhere.",
    priceCents: 800,
    wallpaperCount: 10,
    featured: false,
    releasedAt: "2026-02-11",
    gradient: ["oklch(0.85 0.03 40)", "oklch(0.66 0.05 30)", "oklch(0.4 0.05 25)"],
    palette: [
      ["oklch(0.86 0.03 40)", "oklch(0.65 0.05 30)", "oklch(0.38 0.05 25)"],
      ["oklch(0.8 0.035 20)", "oklch(0.58 0.05 15)", "oklch(0.33 0.045 12)"],
    ],
  },
  {
    id: "deep-field",
    slug: "deep-field",
    title: "Deep Field",
    theme: "Space",
    blurb: "Star fields with nothing else in them.",
    description:
      "Composited long exposures of the night sky. Almost black, with just enough structure to reward a closer look on a MacBook display.",
    priceCents: 1000,
    wallpaperCount: 13,
    featured: false,
    releasedAt: "2026-01-22",
    gradient: ["oklch(0.25 0.04 265)", "oklch(0.15 0.03 265)", "oklch(0.08 0.015 265)"],
    palette: [
      ["oklch(0.26 0.045 265)", "oklch(0.15 0.03 265)", "oklch(0.07 0.015 265)"],
      ["oklch(0.22 0.04 300)", "oklch(0.13 0.03 290)", "oklch(0.07 0.015 280)"],
    ],
  },
  {
    id: "soft-gradient",
    slug: "soft-gradient",
    title: "Soft Gradient",
    theme: "Minimal",
    blurb: "Colour fields with no edges at all.",
    description:
      "Wide, dithered gradients rendered at 16-bit so they band on nothing. The quietest set in the store, and the most requested.",
    priceCents: 700,
    wallpaperCount: 16,
    featured: true,
    releasedAt: "2026-07-01",
    gradient: ["oklch(0.9 0.06 320)", "oklch(0.85 0.06 260)", "oklch(0.82 0.05 210)"],
    palette: [
      ["oklch(0.91 0.06 320)", "oklch(0.86 0.06 265)", "oklch(0.83 0.05 210)"],
      ["oklch(0.93 0.05 60)", "oklch(0.88 0.05 20)", "oklch(0.84 0.05 340)"],
      ["oklch(0.9 0.05 170)", "oklch(0.87 0.05 200)", "oklch(0.84 0.05 240)"],
    ],
  },
  {
    id: "harbour-blue",
    slug: "harbour-blue",
    title: "Harbour Blue",
    theme: "Landscape",
    blurb: "Working ports, early, in one colour.",
    description:
      "Hulls, ropes and water at 5am along the Baltic. A single blue running through eleven frames, warm enough to avoid feeling clinical.",
    priceCents: 900,
    wallpaperCount: 11,
    featured: false,
    releasedAt: "2026-04-08",
    gradient: ["oklch(0.78 0.06 240)", "oklch(0.55 0.09 245)", "oklch(0.33 0.07 250)"],
    palette: [
      ["oklch(0.79 0.06 240)", "oklch(0.54 0.09 245)", "oklch(0.31 0.07 250)"],
      ["oklch(0.72 0.07 225)", "oklch(0.48 0.09 235)", "oklch(0.27 0.06 245)"],
    ],
  },
  {
    id: "tour-kit",
    slug: "tour-kit",
    title: "Tour Kit",
    theme: "Still life",
    blurb: "What fits in the bag matters. What happens between shots matters more.",
    description:
      "Aerial studies of the course itself — fairways, bunkers, water and the quiet figures moving through them. Each piece composed in thick, sculpted colour to sit calmly behind your icons.",
    priceCents: 699,
    wallpaperCount: 10,
    featured: false,
    coverSrc: tourKitCover.url,
    releasedAt: "2026-07-22",
    gradient: ["oklch(0.84 0.02 95)", "oklch(0.62 0.03 90)", "oklch(0.38 0.03 85)"],
    palette: [
      ["oklch(0.86 0.02 95)", "oklch(0.62 0.03 90)", "oklch(0.36 0.03 85)"],
      ["oklch(0.8 0.025 70)", "oklch(0.56 0.035 60)", "oklch(0.31 0.03 55)"],
      ["oklch(0.82 0.015 250)", "oklch(0.58 0.02 250)", "oklch(0.33 0.02 255)"],
    ],
  },
];


/**
 * AVAILABILITY GATE — temporary launch restriction.
 *
 * Seed data for every album stays in this file so albums can be switched back
 * on one at a time as real artwork lands. Only the slugs listed here are
 * purchasable or browsable; everything else is invisible to the storefront AND
 * rejected server-side during price resolution (see `src/lib/pricing.ts`).
 */
export const AVAILABLE_ALBUM_SLUGS: readonly string[] = ["tour-kit"];

/** The bundle promises the whole library, so it stays off until it's true. */
export const BUNDLE_AVAILABLE = false;

/** Every album that exists in the catalogue, available or not. */
export const allAlbums: Album[] = seeds.map(({ palette, ...album }) => ({
  ...album,
  wallpapers: makeWallpapers(album.id, album.wallpaperCount, palette),
}));

export const isAlbumAvailable = (slug: string) => AVAILABLE_ALBUM_SLUGS.includes(slug);

/** The public catalogue: only albums that are actually deliverable today. */
export const albums: Album[] = allAlbums.filter((a) => isAlbumAvailable(a.slug));

export const bundle = {
  id: "all-in-one",
  slug: "bundle",
  title: "The All-in-One Bundle",
  blurb: "Every album, every format, one price — including everything released next.",
  description:
    "The complete library in both iPhone and MacBook formats, plus every album published from here on. One purchase, permanent access.",
  priceCents: 4900,
  gradient: ["oklch(0.9 0.03 80)", "oklch(0.6 0.06 250)", "oklch(0.2 0.04 270)"] as [
    string,
    string,
    string,
  ],
} as const;

/** Public lookup — hidden albums resolve to undefined so their pages 404. */
export const getAlbumBySlug = (slug: string) =>
  albums.find((a) => a.slug === slug);

/** Lookup across the full catalogue. For fulfilling historical orders only. */
export const getAnyAlbumBySlug = (slug: string) =>
  allAlbums.find((a) => a.slug === slug);

export const featuredAlbums = () => {
  const picked = albums.filter((a) => a.featured);
  return picked.length > 0 ? picked : albums;
};

export const totalWallpaperCount = albums.reduce((n, a) => n + a.wallpaperCount, 0);

/**
 * Private storage key for an album's full-resolution archive (both formats).
 * Lives in a private bucket and is only ever reached through a signed URL
 * issued after a verified payment — never referenced from a page.
 */
export const albumDownloadKey = (albumId: string) => `albums/${albumId}/${albumId}.zip`;

