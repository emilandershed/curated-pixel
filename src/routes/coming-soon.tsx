import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { Reveal } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";
import motif01 from "@/assets/waitlist/motif-01.png";

const title = `A tee we're testing | ${brand.name}`;
const description =
  "A design we're considering printing. Register your interest and you'll be told first if it gets made.";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComingSoonPage,
});

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
});

function ComingSoonPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = emailSchema.safeParse({ email: form.get("email") });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const response = await fetch(
        `/api/public/waitlist${window.location.search}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-8 sm:py-20">
      <Reveal>
        <p className="eyebrow">In testing</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.05] text-foreground sm:text-5xl">
          A tee we&apos;re thinking about.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          This design isn&apos;t made yet — we&apos;re seeing whether it should be.
          Leave your email and you&apos;ll be the first to know if it happens.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <div className="rounded-sm bg-card p-6 sm:p-10">
          <img
            src={motif01}
            alt="Design being tested for a possible printed tee"
            width={1200}
            height={1600}
            className="mx-auto aspect-[3/4] w-full object-contain"
            draggable={false}
          />
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-10">
        {status === "done" ? (
          <div className="rounded-sm border border-border p-6 text-center">
            <p className="font-display text-2xl text-foreground">
              You&apos;re on the list.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Nothing has been ordered or charged. If this design gets made,
              you&apos;ll hear from us first.
            </p>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={onSubmit} noValidate>
            <Input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              aria-invalid={error ? true : undefined}
              className="h-12 text-base"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Registering…" : "Register interest"}
            </Button>
          </form>
        )}
      </Reveal>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        One email if it gets made. No payment, no obligation, unsubscribe any time.
      </p>
    </div>
  );
}
