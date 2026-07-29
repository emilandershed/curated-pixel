/**
 * Order persistence and download-token minting.
 *
 * Everything here runs with the service-role client. None of the order tables
 * are reachable from the browser — a buyer only ever sees their own order via
 * the unguessable `access_token` handed to them at checkout.
 */
import { albums, albumDownloadKey, bundle } from "@/config/products";
import { DOWNLOAD_TOKEN_VALID_DAYS } from "@/config/brand";
import {
  resolveLinePriceCents,
  resolveLineTitle,
  type CartLine,
} from "@/lib/pricing";

export type ResolvedLine = {
  kind: "album" | "bundle";
  productId: string;
  title: string;
  priceCents: number;
};

export type DownloadLink = {
  albumId: string;
  albumTitle: string;
  token: string;
  expiresAt: string;
};

export type OrderSummary = {
  id: string;
  email: string;
  status: string;
  amountCents: number;
  currency: string;
  items: { title: string; priceCents: number }[];
  downloads: DownloadLink[];
};

/** URL-safe random string. 32 bytes ≈ 43 chars of entropy. */
export function randomToken(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Turn client-supplied cart lines into priced lines using ONLY the server
 * catalogue. Any id the catalogue does not recognise is dropped, and prices
 * from the browser are never read.
 */
export function resolveOrderLines(lines: CartLine[]): ResolvedLine[] {
  const seen = new Set<string>();
  const resolved: ResolvedLine[] = [];

  for (const line of lines) {
    if (seen.has(line.id)) continue;
    const priceCents = resolveLinePriceCents(line);
    const title = resolveLineTitle(line);
    if (priceCents === null || title === null) continue;
    seen.add(line.id);
    resolved.push({ kind: line.kind, productId: line.id, title, priceCents });
  }

  // The bundle contains every album, so it supersedes individual albums.
  const bundleLine = resolved.find((l) => l.kind === "bundle");
  return bundleLine ? [bundleLine] : resolved;
}

/** Which albums a set of purchased lines grants access to. */
export function albumsForLines(lines: ResolvedLine[]) {
  if (lines.some((l) => l.kind === "bundle" && l.productId === bundle.id)) return albums;
  const slugs = new Set(lines.filter((l) => l.kind === "album").map((l) => l.productId));
  return albums.filter((album) => slugs.has(album.slug));
}

type Admin = Awaited<
  typeof import("@/integrations/supabase/client.server")
>["supabaseAdmin"];

async function admin(): Promise<Admin> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function createPendingOrder(input: {
  email: string;
  lines: ResolvedLine[];
  amountCents: number;
  currency: string;
}) {
  const db = await admin();
  const accessToken = randomToken();

  const { data: order, error } = await db
    .from("orders")
    .insert({
      email: input.email,
      amount_cents: input.amountCents,
      currency: input.currency,
      access_token: accessToken,
      status: "pending",
    })
    .select("id, access_token")
    .single();

  if (error || !order) throw new Error(`Could not create order: ${error?.message}`);

  const { error: itemsError } = await db.from("order_items").insert(
    input.lines.map((line) => ({
      order_id: order.id,
      kind: line.kind,
      product_id: line.productId,
      title: line.title,
      price_cents: line.priceCents,
    })),
  );

  if (itemsError) throw new Error(`Could not create order items: ${itemsError.message}`);

  return { id: order.id, accessToken: order.access_token };
}

export async function attachCheckoutSession(orderId: string, sessionId: string) {
  const db = await admin();
  await db.from("orders").update({ provider_session_id: sessionId }).eq("id", orderId);
}

/**
 * Idempotent: records the webhook event id first and bails out if we have
 * already handled it, so a Stripe retry never mints a second set of tokens.
 */
export async function recordEventOnce(eventId: string, eventType: string): Promise<boolean> {
  const db = await admin();
  const { error } = await db
    .from("payment_events")
    .insert({ event_id: eventId, event_type: eventType });

  if (!error) return true;
  // 23505 = unique violation → already processed.
  if ((error as { code?: string }).code === "23505") return false;
  throw new Error(`Could not record payment event: ${error.message}`);
}

/** Mark an order paid and mint one 90-day download token per included album. */
export async function fulfilOrder(input: {
  sessionId: string;
  paymentId: string | null;
  email: string | null;
}): Promise<OrderSummary | null> {
  const db = await admin();

  const { data: order } = await db
    .from("orders")
    .select("id, email, status, amount_cents, currency, access_token")
    .eq("provider_session_id", input.sessionId)
    .maybeSingle();

  if (!order) {
    console.error("[fulfilment] no order for session", input.sessionId);
    return null;
  }

  const { data: items } = await db
    .from("order_items")
    .select("kind, product_id, title, price_cents")
    .eq("order_id", order.id);

  const resolved: ResolvedLine[] = (items ?? []).map((item) => ({
    kind: item.kind as "album" | "bundle",
    productId: item.product_id,
    title: item.title,
    priceCents: item.price_cents,
  }));

  const expiresAt = new Date(
    Date.now() + DOWNLOAD_TOKEN_VALID_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const grants = albumsForLines(resolved).map((album) => ({
    order_id: order.id,
    album_id: album.slug,
    album_title: album.title,
    token: randomToken(),
    expires_at: expiresAt,
  }));

  if (grants.length > 0) {
    // Re-running fulfilment must not duplicate or rotate existing links.
    await db.from("download_tokens").upsert(grants, {
      onConflict: "order_id,album_id",
      ignoreDuplicates: true,
    });
  }

  await db
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      provider_payment_id: input.paymentId,
      ...(input.email ? { email: input.email } : {}),
    })
    .eq("id", order.id);

  return getOrderByAccessToken(order.access_token);
}

export async function getOrderByAccessToken(accessToken: string): Promise<OrderSummary | null> {
  const db = await admin();

  const { data: order } = await db
    .from("orders")
    .select("id, email, status, amount_cents, currency")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (!order) return null;

  const [{ data: items }, { data: tokens }] = await Promise.all([
    db.from("order_items").select("title, price_cents").eq("order_id", order.id),
    db
      .from("download_tokens")
      .select("album_id, album_title, token, expires_at")
      .eq("order_id", order.id)
      .order("album_title"),
  ]);

  return {
    id: order.id,
    email: order.email,
    status: order.status,
    amountCents: order.amount_cents,
    currency: order.currency,
    items: (items ?? []).map((i) => ({ title: i.title, priceCents: i.price_cents })),
    downloads: (tokens ?? []).map((t) => ({
      albumId: t.album_id,
      albumTitle: t.album_title,
      token: t.token,
      expiresAt: t.expires_at,
    })),
  };
}

/** Validate a download token and return the private storage key it unlocks. */
export async function redeemDownloadToken(token: string) {
  const db = await admin();

  const { data: row } = await db
    .from("download_tokens")
    .select("id, album_id, expires_at, download_count, order_id")
    .eq("token", token)
    .maybeSingle();

  if (!row) return { ok: false as const, reason: "not_found" as const };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false as const, reason: "expired" as const };
  }

  const { data: order } = await db
    .from("orders")
    .select("status")
    .eq("id", row.order_id)
    .maybeSingle();

  if (order?.status !== "paid") return { ok: false as const, reason: "unpaid" as const };

  await db
    .from("download_tokens")
    .update({
      download_count: row.download_count + 1,
      last_downloaded_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  return { ok: true as const, albumId: row.album_id, storageKey: albumDownloadKey(row.album_id) };
}
