import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";

const title = "Privacy policy — " + brand.name;
const description =
  "How Faint Line collects, uses and protects your personal data under the GDPR.";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://faintline.shop/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://faintline.shop/legal/privacy" }],
  }),
  component: Page,
});

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Who is responsible for your data",
    body: [
      `${brand.legal.entity} is the data controller for personal data processed through this store. Contact details are at the bottom of this page and through the contact form.`,
    ],
  },
  {
    heading: "What we collect and why",
    body: [
      "Order data: your email address, the items purchased, the amount paid, the currency and the time of purchase. We need this to deliver your files, to re-issue download links on request and to keep the accounting records Swedish law requires. Legal basis: performance of a contract (Art. 6(1)(b) GDPR) and legal obligation (Art. 6(1)(c) GDPR).",
      "Payment data: card and billing details are collected and processed directly by Stripe on their own hosted payment page. We never see or store full card numbers. We receive only a payment reference, the outcome, and the last four digits where Stripe provides them.",
      "Support messages: if you use the contact form, we process the email address and message you send us in order to answer you. Legal basis: legitimate interest (Art. 6(1)(f) GDPR).",
      "Technical logs: our hosting and backend providers keep short-lived server logs (IP address, user agent, requested URL) for security and troubleshooting. Legal basis: legitimate interest.",
    ],
  },
  {
    heading: "What we do not do",
    body: [
      "We do not sell or rent your data. We do not run advertising trackers or profile you across other sites. We do not create user accounts — checkout is guest-only. We only send you marketing email if you have explicitly signed up for it, and every such email carries an unsubscribe link.",
    ],
  },
  {
    heading: "Cookies and similar technology",
    body: [
      "The store uses only strictly necessary storage: your shopping bag is kept in your browser's local storage, and Stripe sets its own cookies on its payment page to process the transaction and prevent fraud. No analytics or advertising cookies are set without your consent.",
    ],
  },
  {
    heading: "Processors we use",
    body: [
      "Stripe Payments Europe, Ltd. — payment processing.",
      "Supabase — database and file storage for orders and download tokens.",
      "Lovable / Cloudflare — website hosting and content delivery.",
      "Resend — delivery of transactional email (order confirmations and download links), sending from notify.faintline.shop.",
      "Each provider acts as a processor under a data processing agreement and may process data outside the EU/EEA. Where that happens, transfers rely on the European Commission's Standard Contractual Clauses or an adequacy decision.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      `Download tokens expire automatically ${DOWNLOAD_TOKEN_VALID_DAYS} days after purchase. Order and invoice records are retained for seven years to satisfy the Swedish Bookkeeping Act (bokföringslagen). Support correspondence is deleted within 24 months. Server logs are kept for a maximum of 90 days.`,
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You have the right to access your data, to have it corrected, to have it erased where no legal retention duty applies, to restrict or object to processing, and to receive your data in a portable format. Contact us through the contact form and we will respond within one month.",
      "If you believe we handle your data incorrectly, you may complain to the Swedish Authority for Privacy Protection (Integritetsskyddsmyndigheten, imy.se) or to the supervisory authority in your own country.",
    ],
  },
  {
    heading: "Security",
    body: [
      "Traffic is encrypted with TLS. Full-resolution files sit in private storage and are reachable only through single-use, expiring download links issued after a verified payment. Access to the production database is restricted to the store owner.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "If this policy changes materially, the updated version is published on this page. This version is effective from the date it was last published.",
    ],
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy policy"
        intro="How we handle personal data when you buy from this store."
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
        {brand.legal.entity} · {brand.legal.address} · Org. no. / VAT:{" "}
        {brand.legal.vatNumber}
        <br />
        <Link to="/contact" className="underline hover:text-foreground">
          Contact form
        </Link>
      </p>
    </div>
  );
}
