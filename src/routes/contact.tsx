import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brand, DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";

const title = `Contact & download help | ${brand.name}`;
const description =
  "Get in touch about an order, a file problem, or a licence question — or have your download link resent to your purchase email.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "A little more detail, please").max(1000),
});

const resendSchema = z.object({
  email: z.string().trim().email("Enter the email you purchased with").max(255),
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Support"
        title="Get in touch."
        intro="Send us a message with the form below. Replies usually arrive within one working day."
      />

      <form
        className="mt-12 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const parsed = contactSchema.safeParse({
            name: form.get("name"),
            email: form.get("email"),
            message: form.get("message"),
          });
          if (!parsed.success) {
            toast.error(parsed.error.issues[0].message);
            return;
          }
          setSending(true);
          // Delivery is wired up once Cloud + email are connected.
          await new Promise((r) => setTimeout(r, 400));
          setSending(false);
          toast.success("Thanks — your message is on its way.");
          event.currentTarget.reset();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" maxLength={100} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              maxLength={255}
              required
              className="mt-2"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} maxLength={1000} required className="mt-2" />
        </div>
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </Button>
      </form>

      <section id="resend" className="mt-20 scroll-mt-24 border border-border bg-secondary/50 p-6 sm:p-8">
        <h2 className="font-display text-3xl">Resend my download link</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Download links stay valid for {DOWNLOAD_TOKEN_VALID_DAYS} days and can be used as
          many times as you like. Lost the email? Enter the address you purchased with and a
          fresh link is sent.
        </p>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const parsed = resendSchema.safeParse({ email: form.get("purchaseEmail") });
            if (!parsed.success) {
              toast.error(parsed.error.issues[0].message);
              return;
            }
            setResending(true);
            await new Promise((r) => setTimeout(r, 400));
            setResending(false);
            // Deliberately identical response whether or not an order exists.
            toast.success("If that email has an order, a fresh download link is on its way.");
            event.currentTarget.reset();
          }}
        >
          <Label htmlFor="purchaseEmail" className="sr-only">
            Purchase email
          </Label>
          <Input
            id="purchaseEmail"
            name="purchaseEmail"
            type="email"
            maxLength={255}
            required
            placeholder="you@example.com"
            className="sm:flex-1"
          />
          <Button type="submit" variant="outline" disabled={resending}>
            {resending ? "Sending…" : "Resend link"}
          </Button>
        </form>
      </section>
    </div>
  );
}
