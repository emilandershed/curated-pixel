import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand } from "@/config/brand";

const title = "Privacy — " + brand.name;
const description = "How we handle your data";

export const Route = createFileRoute("/legal/privacy")({
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
    "heading": "What we collect",
    "body": "Your email address and order details, so we can deliver your files and resend download links. Nothing more."
  },
  {
    "heading": "Payments",
    "body": "Card details are handled by our payment provider and never reach our servers."
  },
  {
    "heading": "Retention",
    "body": "Order records are kept as long as required for accounting; download tokens expire automatically."
  },
  {
    "heading": "Your rights",
    "body": "Write to us to access, correct or delete your data."
  }
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Privacy" intro="Placeholder copy — review with a lawyer before launch." />
      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-16 text-xs text-muted-foreground">
        {brand.legal.entity} · {brand.legal.address} ·{" "}
        <Link to="/contact" className="underline hover:text-foreground">
          Contact form
        </Link>
      </p>
    </div>
  );
}
