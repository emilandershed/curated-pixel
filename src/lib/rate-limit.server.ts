/**
 * Minimal durable rate limiter.
 *
 * Server workers are stateless, so counters live in the database. Each call
 * records one hit and reports whether the caller is already over the limit
 * inside the rolling window. Failing open is deliberate: a database hiccup
 * must never take down the only support channel a customer has.
 */

export async function checkRateLimit(input: {
  bucket: string;
  key: string;
  limit: number;
  windowSeconds?: number;
}): Promise<{ allowed: boolean }> {
  const { bucket, key, limit, windowSeconds = 3600 } = input;
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("bucket", bucket)
      .eq("key", key)
      .gte("created_at", since);

    if ((count ?? 0) >= limit) return { allowed: false };

    await supabaseAdmin.from("rate_limits").insert({ bucket, key });
    return { allowed: true };
  } catch (error) {
    console.error("[rate-limit] check failed, allowing request", error);
    return { allowed: true };
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    request.headers.get("cf-connecting-ip") ??
    (forwarded ? forwarded.split(",")[0]!.trim() : null) ??
    "unknown"
  );
}
