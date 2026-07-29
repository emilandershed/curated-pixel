/**
 * One-shot, idempotent sync of the catalogue into Stripe.
 *
 *   STRIPE_SECRET_KEY=sk_test_... bun run scripts/sync-stripe-products.ts
 *
 * Creates (or updates) one Stripe Product per album plus the bundle, each with
 * a EUR price carrying a stable `lookup_key`. Re-running is safe: existing
 * products are matched by lookup key and only changed prices create a new
 * Price object (Stripe prices are immutable), with the old one deactivated.
 *
 * Note: checkout does NOT depend on these objects — it always builds line
 * items from `src/config/products.ts` so the price charged can never drift
 * from the price shown. This sync exists so the catalogue is visible and
 * reportable inside the Stripe dashboard.
 */
import { albums, bundle } from "../src/config/products";
import { brand } from "../src/config/brand";

const API = "https://api.stripe.com/v1";
const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  console.error("STRIPE_SECRET_KEY is not set.");
  process.exit(1);
}

const currency = brand.currency.toLowerCase();

type StripeList<T> = { data: T[] };
type Product = { id: string; name: string };
type Price = { id: string; unit_amount: number; lookup_key: string | null; active: boolean };

async function call<T>(path: string, method: "GET" | "POST", body?: Record<string, string>) {
  const params = body ? new URLSearchParams(body) : undefined;
  const url = method === "GET" && params ? `${API}${path}?${params}` : `${API}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: method === "POST" ? params : undefined,
  });
  const json = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok) throw new Error(json.error?.message ?? `${method} ${path} failed`);
  return json;
}

async function upsert(item: {
  lookupKey: string;
  name: string;
  description: string;
  priceCents: number;
  metadata: Record<string, string>;
}) {
  const existing = await call<StripeList<Price>>("/prices", "GET", {
    "lookup_keys[0]": item.lookupKey,
    limit: "1",
    expand0: "",
  }).catch(() => ({ data: [] as Price[] }));

  let productId: string;
  const currentPrice = existing.data[0];

  if (currentPrice) {
    const price = await call<Price & { product: string }>(
      `/prices/${currentPrice.id}`,
      "GET",
    );
    productId = price.product;
    await call<Product>(`/products/${productId}`, "POST", {
      name: item.name,
      description: item.description,
    });

    if (currentPrice.unit_amount === item.priceCents && currentPrice.active) {
      console.log(`= ${item.lookupKey} (unchanged)`);
      return;
    }

    // Prices are immutable: retire the old one, then mint the replacement.
    await call(`/prices/${currentPrice.id}`, "POST", {
      active: "false",
      lookup_key: "",
    });
  } else {
    const product = await call<Product>("/products", "POST", {
      name: item.name,
      description: item.description,
      ...Object.fromEntries(
        Object.entries(item.metadata).map(([k, v]) => [`metadata[${k}]`, v]),
      ),
    });
    productId = product.id;
  }

  await call<Price>("/prices", "POST", {
    product: productId,
    currency,
    unit_amount: String(item.priceCents),
    lookup_key: item.lookupKey,
    transfer_lookup_key: "true",
  });

  console.log(`${currentPrice ? "~" : "+"} ${item.lookupKey} — ${item.priceCents / 100} ${currency}`);
}

async function main() {
  console.log(
    `Syncing ${albums.length} albums + bundle to Stripe (${key!.startsWith("sk_test_") ? "test" : "LIVE"} mode)…`,
  );

  for (const album of albums) {
    await upsert({
      lookupKey: `album_${album.slug.replace(/-/g, "_")}`,
      name: `${album.title} — ${brand.name}`,
      description: `${album.wallpaperCount} wallpapers, iPhone 9:16 and MacBook 16:9 included.`,
      priceCents: album.priceCents,
      metadata: { kind: "album", product_id: album.slug, theme: album.theme },
    });
  }

  await upsert({
    lookupKey: "bundle_all_in_one",
    name: `${bundle.title} — ${brand.name}`,
    description: bundle.description,
    priceCents: bundle.priceCents,
    metadata: { kind: "bundle", product_id: bundle.id },
  });

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
