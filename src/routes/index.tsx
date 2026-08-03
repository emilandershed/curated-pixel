import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Download, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { AlbumCard } from "@/components/album-card";
import { DeviceMockups } from "@/components/device-mockups";
import { PreviewTile } from "@/components/preview-tile";
import { QualitySlider } from "@/components/quality-slider";
import { Reveal, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brand, formatPrice } from "@/config/brand";
import { faq } from "@/config/faq";
import { reviews, reviewsAreSampleContent } from "@/config/reviews";
import { BUNDLE_AVAILABLE, albums, bundle, featuredAlbums, totalWallpaperCount } from "@/config/products";
import { bundleSavingsCents, bundleSavingsPercent } from "@/lib/pricing";

const title = `${brand.name} — Digital wallpapers for iPhone & MacBook`;
const description = `${totalWallpaperCount} curated wallpapers across ${albums.length} ${albums.length === 1 ? "album" : "albums"}. Every frame delivered in both 9:16 and 16:9, at full resolution, instantly after purchase.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

const valueProps = [
  {
    icon: Download,
    title: "Instant delivery",
    body: "Your download page opens the second payment clears. The links are emailed too.",
  },
  {
    icon: Layers,
    title: "Both formats, always",
    body: "Every wallpaper ships as 9:16 for iPhone and 16:9 for MacBook. One purchase covers both.",
  },
  {
    icon: Sparkles,
    title: "Master-file resolution",
    body: "Mobile from 1290 × 2796, desktop from 3840 × 2160. Graded for Retina and OLED panels.",
  },
];

function Home() {
  const hero = albums[0];
  const featured = featuredAlbums();
  const entryAlbum = albums.reduce((a, b) => (a.priceCents <= b.priceCents ? a : b), albums[0]);
  const entryOnSale = Boolean(
    entryAlbum.compareAtCents && entryAlbum.compareAtCents > entryAlbum.priceCents,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[64vh] min-h-[420px] w-full overflow-hidden sm:h-[78vh] sm:min-h-[520px]">
          <PreviewTile
            gradient={hero.gradient}
            previewSrc={(hero.homeCoverSrc ?? hero.coverSrc) ?? null}
            alt={hero.title}
            ratio="desktop"
            watermark={false}
            eager
            className="absolute inset-0 !aspect-auto h-full w-full"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />

          <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-24">
            <p className="eyebrow animate-rise">Collection {new Date().getFullYear()}</p>
            <h1 className="font-display animate-rise mt-3 max-w-3xl text-[2rem] leading-[1.02] text-foreground sm:mt-4 sm:text-7xl">
              Wallpapers worth the screen they live on.
            </h1>
            <p className="animate-rise mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              iPhone and MacBook formats included, at full resolution. Instant download.
            </p>

            <p className="animate-rise mt-5 flex items-baseline gap-2 text-sm tabular-nums text-foreground sm:mt-6">
              <span>Albums from {formatPrice(entryAlbum.priceCents)}</span>
              {entryOnSale && (
                <span className="text-muted-foreground/80 line-through">
                  was {formatPrice(entryAlbum.compareAtCents!)}
                </span>
              )}
            </p>

            <div className="animate-rise mt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/shop">
                  Shop the albums — from {formatPrice(entryAlbum.priceCents)}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust strip */}
            <p className="animate-rise mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-snug text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Download className="h-3.5 w-3.5" strokeWidth={1.25} /> Instant download
              </span>
              <span aria-hidden="true" className="text-muted-foreground/50">
                ·
              </span>
              <span>iPhone + MacBook included</span>
              <span aria-hidden="true" className="text-muted-foreground/50">
                ·
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.25} /> Secure payment via Stripe
              </span>
            </p>

            {BUNDLE_AVAILABLE && (
              <p className="animate-rise mt-3 text-xs text-muted-foreground">
                <Link to="/bundle" className="underline underline-offset-4 hover:text-foreground">
                  Or get both albums for {formatPrice(bundle.priceCents)}
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured albums — buyable, immediately after the hero */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-20 sm:px-8 sm:pt-16 sm:pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="Selected albums"
            title="Start with one."
            intro="Each album is a single idea, worked through from beginning to end."
          />
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((album, i) => (
            <Reveal key={album.id} delay={i * 80}>
              <AlbumCard album={album} index={i} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <Button asChild variant="outline">
            <Link to="/shop">
              {albums.length > 1 ? `All ${albums.length} albums` : "Browse the shop"} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Value props */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
          {valueProps.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 90}>
              <prop.icon className="h-5 w-5 text-foreground" strokeWidth={1.25} />
              <h3 className="font-display mt-4 text-xl">{prop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{prop.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bundle offer */}
      {BUNDLE_AVAILABLE && (
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="eyebrow">The complete library</p>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] sm:text-5xl">
              {bundle.title}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {bundle.description}
            </p>
            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-display text-4xl tabular-nums">
                {formatPrice(bundle.priceCents)}
              </span>
              <span className="text-sm text-muted-foreground line-through tabular-nums">
                {formatPrice(bundle.priceCents + bundleSavingsCents)}
              </span>
              <span className="bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
                Save {bundleSavingsPercent}%
              </span>
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link to="/bundle">
                See what's included <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {albums.slice(0, 6).map((album) => (
              <div key={album.id} className="overflow-hidden shadow-frame">
                <PreviewTile gradient={album.gradient} previewSrc={(album.homeCoverSrc ?? album.coverSrc) ?? null} alt={album.title} ratio="square" watermark={false} />
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* Quality slider */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Resolution"
              title="Drag to see the difference."
              intro="Left: the compressed files you find for free. Right: what lands in your download folder."
            />
          </Reveal>
          <Reveal className="mt-12">
            <QualitySlider
              gradient={albums[0].gradient}
              previewSrc={
                albums[0].coverSrc ??
                albums[0].homeCoverSrc ??
                albums[0].wallpapers[0]?.previewSrc ??
                null
              }
              alt={albums[0].title}
            />
          </Reveal>
        </div>
      </section>

      {/* Device mockups */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Two formats, one purchase"
            title="Made for both screens you actually use."
            intro="Never a cropped desktop shot squeezed onto a phone. Each frame is composed twice."
          />
        </Reveal>
        <Reveal className="mt-16" delay={100}>
          <DeviceMockups
            gradient={albums[albums.length - 1].gradient}
            previewSrc={null}
            alt="Wallpaper formats shown on MacBook and iPhone"
          />
        </Reveal>
      </section>


      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="border-y border-border">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="What people say" title="In their words." />
              {reviewsAreSampleContent && (
                <p className="mt-4 inline-block border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                  Sample content — placeholder quotes shown until real customer reviews are
                  collected.
                </p>
              )}
            </Reveal>
            <ul className="mt-12 grid gap-8 sm:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal as="li" key={review.id} delay={i * 80}>
                  <p aria-label={`${review.rating} out of 5`} className="text-sm tracking-[0.2em]">
                    {"★".repeat(review.rating)}
                    <span className="text-muted-foreground/40">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </p>
                  <blockquote className="font-display mt-4 text-xl leading-snug">
                    “{review.quote}”
                  </blockquote>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {review.name} · {review.location}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ preview */}
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Good to know" title="Questions, answered." />
        </Reveal>
        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faq.slice(0, 5).map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="link" className="mt-6 px-0">
            <Link to="/faq">
              Read the full FAQ <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
