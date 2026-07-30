import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";

const title = "Terms & licence — " + brand.name;
const description =
  "Terms of sale and the personal-use licence that comes with every Faint Line wallpaper album.";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://faintline.shop/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "https://faintline.shop/legal/terms" }],
  }),
  component: Page,
});

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. The seller",
    body: [
      `These terms govern all purchases from ${brand.name}, operated by ${brand.legal.entity}, trading as a private individual based in Sweden. Contact details are at the foot of this page. Swedish law applies, without prejudice to the mandatory consumer protections of your country of residence.`,
    ],
  },
  {
    heading: "2. Products",
    body: [
      "We sell digital wallpaper albums. Each album is a set of still images delivered as a downloadable archive containing every motif in both a 9:16 mobile format and a 16:9 desktop format. Nothing physical is shipped.",
      "Preview images shown on the site are low-resolution and watermarked. The delivered files are unwatermarked and at full resolution.",
    ],
  },
  {
    heading: "3. Prices and payment",
    body: [
      `All prices are shown in ${brand.currency} and include any applicable VAT. The price charged is always the price resolved on our server at the moment of checkout, never a value sent from your browser.`,
      "Payment is handled by Stripe. The contract is formed when your payment is confirmed and we send your order confirmation.",
    ],
  },
  {
    heading: "4. Delivery",
    body: [
      `Delivery is immediate and digital. After a confirmed payment you receive a download link on the confirmation page and by email. Download links remain valid for ${DOWNLOAD_TOKEN_VALID_DAYS} days; if yours expires or gets lost, use the contact form and we will re-issue it free of charge.`,
      "You are responsible for having a device and connection capable of downloading and unpacking a standard ZIP archive.",
    ],
  },
  {
    heading: "5. Personal-use licence",
    body: [
      "On payment you receive a perpetual, worldwide, non-exclusive, non-transferable licence to use the files as wallpapers or lock-screen images on any device you personally own, and to keep personal backup copies.",
    ],
  },
  {
    heading: "6. What the licence does not allow",
    body: [
      "You may not resell, redistribute, sub-licence, share or upload the files anywhere they can be downloaded by others; use them in any commercial, promotional or client work; include them in an app, template, theme pack or other product; print them for sale; mint them as NFTs or use them to train generative machine-learning models; or remove or alter authorship or copyright information.",
      "Serious or repeated breaches terminate the licence with immediate effect and without refund.",
    ],
  },
  {
    heading: "7. Ownership",
    body: [
      "Copyright and all other intellectual property in the artwork remain with the artist. Buying an album buys a licence to use it, not ownership of it.",
    ],
  },
  {
    heading: "8. Right of withdrawal",
    body: [
      "For digital content delivered immediately, the statutory 14-day right of withdrawal is waived once delivery begins, provided you gave your express prior consent and acknowledged the loss of that right. You give this consent by ticking the confirmation box at checkout. Full details are in the refund policy.",
    ],
  },
  {
    heading: "9. Availability and changes",
    body: [
      "Albums may be retired from sale at any time. Albums you have already bought stay downloadable for the validity period stated above. We may correct or improve files within an album; where we do, the improved version replaces the old one at no cost.",
    ],
  },
  {
    heading: "10. Liability",
    body: [
      "The files are supplied as they are. To the extent permitted by law, our total liability for any claim arising from a purchase is limited to the amount you paid for it. Nothing in these terms limits liability for gross negligence, intent, or any liability that cannot be limited under mandatory consumer law.",
    ],
  },
  {
    heading: "11. Disputes",
    body: [
      "Contact us first — most issues are settled in a day. EU consumers may also use the European Commission's online dispute resolution platform, and Swedish consumers may refer a dispute to the National Board for Consumer Disputes (Allmänna reklamationsnämnden, arn.se).",
    ],
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Legal"
        title="Terms & licence"
        intro="The terms of sale, and exactly what you may do with the files."
      />
      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-16 text-xs leading-relaxed text-muted-foreground">
        {brand.legal.entity} · {brand.legal.address}
        <br />
        <Link to="/contact" className="underline hover:text-foreground">
          Contact form
        </Link>
      </p>
    </div>
  );
}
