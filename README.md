# Frame & Form

Build a premium e-commerce website for Faint Line, a digital wallpaper store selling curated wallpaper collections for iPhone and MacBook (every wallpaper delivered in both mobile 9:16 and desktop 16:9 format).

Note: The brand name "Faint Line" is provisional — build the site so the brand name/logo is defined in ONE central config/constant, making it trivial to rename later.

References (match and exceed this quality)

https://www.akiyo.co.uk — closest to the target: minimal, editorial, museum-like, generous whitespace

https://www.oleoclub.store — product structure: collections + all-in-one bundle, FAQ, before/after

https://eightclothing.de/collections/wallpapers — social proof and review presentation

The site must feel unmistakably professional and trustworthy — a visitor should never doubt it's a legitimate store. No template feel, no clutter, no aggressive popups.

Design system

Aesthetic: minimal, calm, editorial. Large imagery, generous whitespace, restrained typography (one elegant serif for headlines, one clean sans-serif for body). Muted, near-monochrome palette that lets the wallpaper artwork carry the color.

Motion: subtle only — soft fade/slide on scroll, gentle hover scale on product cards (1.02–1.03), smooth page transitions. Nothing bouncy or flashy.

Fully responsive, mobile-first. The mobile experience must be as polished as desktop.

Fast: lazy-load images, skeleton loaders, no layout shift.

Products

10 wallpaper albums (collections), each themed by category. Each album contains ~10 wallpapers, every wallpaper in two formats: iPhone (9:16) and MacBook/desktop (16:9). The buyer always gets both formats.

Use placeholder album names and placeholder imagery for now (e.g. "Album 01 — [Theme]"), structured so real names/images/prices are easy to swap in — keep all product data in one central data file.

Pricing model (use placeholder prices, easy to edit):

Single album: e.g. €7.99

All-in-One Bundle: all 10 albums at a strong discount (e.g. €19.99 instead of €79.90) — this is the hero offer, promoted on the homepage

Digital delivery: instant download after payment (download page + email with download link).

Pages & structure

Home: full-width hero with headline + CTA → featured All-in-One Bundle section with savings framing → album grid → "See the difference" before/after quality slider → device mockup section (iPhone + MacBook side by side showing the same wallpaper) → reviews/social proof → FAQ preview → email signup → footer.

Shop/Catalog: grid of all 10 albums + the bundle. Hover shows a second preview image. Sorting (featured, price, newest).

Album page (product): large preview gallery of wallpapers in the album (watermarked/low-res previews), clear "included formats: iPhone 9:16 + MacBook 16:9" badge, price, add to cart, and an upsell block: "Get all 10 albums for €X — save Y%".

Cart + Checkout: clean slide-out cart drawer. Checkout via Stripe (cards, Apple Pay, Google Pay). Show payment method logos in footer and at checkout for trust.

Thank you / Download page: immediate download buttons after purchase.

Contact: simple form (name, email, message) that emails the store owner, plus direct email address.

FAQ: accordion. Seed with: How do I receive my order? (instant download + email link) · What's included in an album? (~10 wallpapers, both iPhone and MacBook formats) · What resolution? (ultra-high, Retina-ready) · Refund policy for digital goods · What if the download email doesn't arrive? · Will new albums be released?

Legal: Privacy Policy, Terms of Service, Refund Policy pages (placeholder text, properly linked in footer).

Trust & conversion elements

Star rating + review section (placeholder reviews marked clearly as sample content, easy to replace with real ones)

"Instant delivery · Ultra-high resolution · Both formats included" value-prop strip

Payment method logos (Visa, Mastercard, Amex, Apple Pay, Google Pay)

Email newsletter signup ("early access to new albums")

Professional footer with legal links, contact, social placeholders

Technical requirements

Stripe integration for payments (test mode first)

Clean, well-structured component architecture and a single source of truth for products, prices, and brand name — the codebase will be pushed to GitHub for external code review, so keep it readable and conventional

SEO basics: semantic HTML, meta titles/descriptions, OG tags

No user accounts needed for v1 — guest checkout only

Start with the homepage and shop structure. I will iterate on individual pages afterwards.

Efter första genereringen – förslag på uppföljningspromptar

"Refine the album page: add a lightbox gallery for previews and make the bundle upsell sticky on mobile."

"Connect Stripe in test mode and build the post-purchase download flow."

"Replace placeholder products with my real album data" (bifoga namn, priser, bilder).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6042d397-bbbd-4aea-a731-b289db526b5b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
