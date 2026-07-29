## Goal

A calm, editorial, museum-like digital wallpaper store (akiyo.co.uk quality bar) with 10 albums, an All-in-One bundle hero offer, Stripe checkout in test mode, and instant download delivery. English, EUR, guest checkout only.

## Single sources of truth

- `src/config/brand.ts` — brand name, tagline, contact email, social links, legal entity placeholders. Rename in one place.
- `src/config/products.ts` — the 10 albums (id, slug, title, theme, blurb, price, gradient tokens for preview tiles, wallpaper count, featured flag, sort dates) plus the bundle definition and derived savings math.
- `src/config/reviews.ts`, `src/config/faq.ts` — sample content, clearly labelled as sample in the UI.

## Preview vs. delivery assets (anti-piracy, baked in now)

The data model separates two asset fields per wallpaper from day one:

```text
previewSrc   -> low-resolution, watermarked; the ONLY thing ever rendered in the browser
downloadKey  -> full-resolution original; private storage, reachable only via a signed
                download token issued after a verified payment
```

Full-resolution files are never referenced from any page, never in an `<img>`, never in a public bucket. Placeholder gradient tiles now occupy the `previewSrc` slot, so swapping in real watermarked previews later is a data change only. Album pages also disable drag/right-click save on preview tiles as a light deterrent (the real protection is that the file simply isn't there).

## Design system

- Palette: near-monochrome warm off-white / ink / soft stone greys as oklch tokens in `src/styles.css`. No hardcoded colors in components.
- Type: one elegant serif for headlines, one clean grotesk for body, loaded via `<link>` in `__root.tsx`.
- Motion: scroll fade/slide-up, hover scale 1.02 on cards, smooth route transitions. Nothing bouncy.
- Mobile-first, generous whitespace, fixed aspect-ratio media boxes so there's zero layout shift; skeletons where data loads.

## Pages

```text
/                 home
/shop             catalog + sorting
/albums/$slug     album page
/bundle           all-in-one offer
/faq  /contact
/thank-you        post-purchase downloads
/legal/privacy  /legal/terms  /legal/refunds
```

- **Home**: full-bleed hero + CTA → value-prop strip (instant delivery · ultra-high res · both formats) → bundle offer with savings framing → album grid → before/after quality slider → iPhone + MacBook mockup showing one wallpaper in both formats → reviews with star rating → FAQ preview → newsletter signup → footer with legal links, contact, payment logos.
- **Shop**: 10 albums + bundle card, hover reveals a second preview, sort by featured / price / newest.
- **Album page**: watermarked preview gallery, "Included formats: iPhone 9:16 + MacBook 16:9" badge, price, add to cart, bundle upsell with computed savings %.
- **Cart**: slide-out drawer, persisted in localStorage, no accounts.

Each route gets its own `head()` with unique title, description, and OG/Twitter tags.

## Payments and delivery

1. Enable Lovable Cloud (orders, download tokens, email).
2. **Stripe is the requirement.** I'll enable Stripe in test mode. If it turns out to be technically unavailable for this setup, I stop and ask you before touching any alternative — no silent provider substitution.
3. Create the 10 album products plus the bundle from the central config.
4. Checkout: server function builds the session from cart contents; prices are always resolved server-side from `products.ts`, never trusted from the client. Cards, Apple Pay, Google Pay.
5. Webhook on `/api/public/*` verifies the signature, records the order, mints download tokens.
6. **Download tokens are valid for 90 days** (a single constant in config — 30 days is the floor you asked for, 90 gives extra headroom). Tokens are re-issuable, not one-shot: a buyer can download the same album repeatedly during that window.
7. **Resend download link**: a self-serve form on `/contact` and linked from the relevant FAQ entry. Enter the purchase email, and if an order exists a fresh link is emailed. The response is identical whether or not an order matches, so the form can't be used to probe who bought what. Rate-limited server-side.
8. `/thank-you` shows per-album download buttons; the same links go out by email.
9. Contact form emails the store owner; all input validated with Zod.

Delivery ZIPs are placeholder files until you supply real artwork — the plumbing is complete and swapping in real assets is a storage upload.

## Technical notes

- TanStack Start file routes, TanStack Query for loads, shadcn primitives with themed variants.
- Cart state in a small typed context; price math in one `pricing.ts` module with unit-testable helpers.
- Conventional structure and naming throughout, since this goes to GitHub for review.

## Not in this pass

Real artwork, real reviews, real legal copy (placeholders, properly linked), lightbox gallery, sticky mobile upsell.

## One note back to you

Agreed on the reviews, and I'll build for it: sample reviews live in `reviews.ts`, render with a visible "sample content" label, carry no "Verified purchase" badge, and the whole section disappears if the array is emptied. Deleting one file's contents is enough to ship without them.
