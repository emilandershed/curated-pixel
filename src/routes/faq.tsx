import { Link, createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brand } from "@/config/brand";
import { faq } from "@/config/faq";

const title = `FAQ — delivery, formats and downloads | ${brand.name}`;
const description =
  "How wallpapers are delivered, which formats and resolutions you get, how long download links last, and how to get a lost link resent.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Support"
        title="Frequently asked."
        intro="If your question isn't here, write to us — replies usually arrive within a working day."
      />

      <Accordion type="single" collapsible className="mt-12 w-full">
        {faq.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 border border-border bg-secondary/50 p-6">
        <h2 className="font-display text-2xl">Lost your download link?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your purchase email and we'll send a fresh one straight away.
        </p>
        <Button asChild className="mt-5">
          <Link to="/contact" hash="resend">
            Resend my download link
          </Link>
        </Button>
      </div>
    </div>
  );
}
