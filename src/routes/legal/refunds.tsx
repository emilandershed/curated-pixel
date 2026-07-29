import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand } from "@/config/brand";

const title = "Refunds — " + brand.name;
const description = "Digital goods and your right of withdrawal";

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Page,
});

const sections = [
  {
    "heading": "Digital downloads",
    "body": "By completing checkout you agree to immediate delivery and waive the 14-day withdrawal right once files have been downloaded."
  },
  {
    "heading": "Faulty files",
    "body": "If a file is corrupt, mislabelled or missing a format, contact us and we will repair or refund it."
  },
  {
    "heading": "Duplicate orders",
    "body": "Accidental duplicate purchases are refunded in full."
  }
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Refunds" intro="Placeholder copy — review with a lawyer before launch." />
      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-16 text-xs text-muted-foreground">
        {brand.legal.entity} · {brand.legal.address} · {brand.contactEmail}
      </p>
    </div>
  );
}
