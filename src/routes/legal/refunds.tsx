import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand } from "@/config/brand";

const title = "Refund policy — " + brand.name;
const description =
  "Refunds, faulty files and the right of withdrawal for instantly delivered digital downloads.";

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://faintline.shop/legal/refunds" },
    ],
    links: [{ rel: "canonical", href: "https://faintline.shop/legal/refunds" }],
  }),
  component: Page,
});

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Right of withdrawal, and why it is waived",
    body: [
      "EU consumers normally have 14 days to withdraw from a distance purchase. For digital content that is delivered immediately and not on a physical medium, that right lapses once delivery has begun — provided you have given express prior consent to immediate delivery and acknowledged that you thereby lose the right of withdrawal (Consumer Rights Directive 2011/83/EU, Art. 16(m); in Sweden, distansavtalslagen 2 kap. 11 § p. 11).",
      "That is exactly what the confirmation box at checkout is for. You cannot complete a purchase without ticking it, and your consent is recorded with the order.",
      "If you have not yet downloaded anything, contact us within 14 days and we will cancel and refund the order in full anyway.",
    ],
  },
  {
    heading: "Faulty, corrupt or incomplete files",
    body: [
      "Statutory rights always apply. If a file will not open, is corrupt, is mislabelled, or an album is missing one of the two promised formats, contact us. We will repair and re-deliver the files, and if we cannot, we refund the purchase in full.",
    ],
  },
  {
    heading: "Duplicate purchases",
    body: [
      "If you accidentally buy the same album twice, or buy an album and then the all-in-one bundle, tell us and we refund the redundant order in full — no questions asked.",
    ],
  },
  {
    heading: "Download links",
    body: [
      "Expired or lost links are not a reason for a refund, because we re-issue them free of charge for the whole validity period. Just use the contact form with the email address you bought with.",
    ],
  },
  {
    heading: "What is not refundable",
    body: [
      "Once you have downloaded an album, we cannot refund it simply because you changed your mind or did not like the artwork. Every album shows watermarked previews of its content before purchase — please look at them first.",
      "We also cannot refund purchases where the files have been redistributed or otherwise used in breach of the licence.",
    ],
  },
  {
    heading: "How to request a refund",
    body: [
      "Write to us through the contact form with the email address used at checkout and the order reference from your confirmation email. We answer within two business days. Approved refunds go back to the original payment method through Stripe, normally within 5–10 business days depending on your bank.",
    ],
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Legal"
        title="Refund policy"
        intro="Digital goods, instant delivery, and what happens when something is wrong."
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
