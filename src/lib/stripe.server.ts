/**
 * Minimal Stripe REST client.
 *
 * We talk to Stripe over `fetch` rather than the official Node SDK: this code
 * runs in an edge worker, where the SDK's Node-only dependencies are not
 * available. The surface we need is small and stable.
 *
 * The secret key is read inside each call (never at module scope) because the
 * runtime injects environment variables per request.
 */

const STRIPE_API = "https://api.stripe.com/v1";

export class StripeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "StripeError";
  }
}

export const stripeSecretKey = () => process.env.STRIPE_SECRET_KEY ?? null;

export const stripeWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET ?? null;

/** True when the store is running against Stripe's test keys. */
export const isStripeTestMode = () => (stripeSecretKey() ?? "").startsWith("sk_test_");

/**
 * Stripe's API is form-encoded and uses `a[b][0][c]` bracket notation for
 * nested structures. This flattens a plain object into that shape.
 */
export function toFormBody(input: unknown, prefix = ""): URLSearchParams {
  const params = new URLSearchParams();

  const walk = (value: unknown, key: string) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((entry, i) => walk(entry, `${key}[${i}]`));
      return;
    }
    if (typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(v, key ? `${key}[${k}]` : k);
      }
      return;
    }
    params.append(key, String(value));
  };

  walk(input, prefix);
  return params;
}

export async function stripeRequest<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown; idempotencyKey?: string } = {},
): Promise<T> {
  const key = stripeSecretKey();
  if (!key) {
    throw new StripeError(
      "STRIPE_SECRET_KEY is not configured. Add it in Project Settings → Secrets.",
      500,
    );
  }

  const method = init.method ?? "POST";
  const body = init.body ? toFormBody(init.body) : undefined;
  const url = method === "GET" && body ? `${STRIPE_API}${path}?${body}` : `${STRIPE_API}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    },
    body: method === "POST" ? body : undefined,
  });

  const payload = (await response.json()) as { error?: { message?: string } };

  if (!response.ok) {
    // Stripe's own message is safe to log but not to surface verbatim to buyers.
    console.error("[stripe]", response.status, payload.error?.message);
    throw new StripeError(payload.error?.message ?? "Stripe request failed", response.status);
  }

  return payload as T;
}

/**
 * Verify the `Stripe-Signature` header against the raw request body.
 *
 * Uses Web Crypto (available in the worker runtime) and a constant-time
 * comparison. Rejects signatures older than `toleranceSeconds` to block
 * replay of a previously captured webhook.
 */
export async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  toleranceSeconds = 300,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [k, ...rest] = part.trim().split("=");
      return [k, rest.join("=")];
    }),
  ) as { t?: string; v1?: string };

  if (!parts.t || !parts.v1) return false;

  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) return false;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(`${parts.t}.${rawBody}`),
  );
  const expected = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqual(expected, parts.v1);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
