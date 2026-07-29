import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand } from "@/config/brand";

const title = "Terms & licence — " + brand.name;
const description = "What you may do with the files";

export const Route = createFileRoute("/legal/terms")({
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
    "heading": "Personal-use licence",
    "body": "You may use the wallpapers on any device you personally own, indefinitely."
  },
  {
    "heading": "Not permitted",
    "body": "Redistribution, resale, bundling, NFT minting, or commercial use of any kind."
  },
  {
    "heading": "Ownership",
    "body": "Copyright in all artwork remains with the artist."
  },
  {
    "heading": "Availability",
    "body": "Albums may be retired from sale; purchases already made remain downloadable for the stated period."
  }
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Terms & licence" intro="Placeholder copy — review with a lawyer before launch." />
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
