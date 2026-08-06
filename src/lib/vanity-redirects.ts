/**
 * Short vanity paths printed on social posts (e.g. /night) that must resolve
 * on a cold visit without any client-side routing. Redirects are issued by the
 * server handler with a 302 so the visitor — and analytics — land on the album
 * page URL including the campaign parameters.
 */
export function vanityRedirect(albumSlug: string, utmContent: string): Response {
  const params = new URLSearchParams({
    utm_source: "tiktok",
    utm_medium: "social",
    utm_campaign: "sprint1",
    utm_content: utmContent,
  });

  return new Response(null, {
    status: 302,
    headers: {
      location: `/albums/${albumSlug}?${params.toString()}`,
      "cache-control": "no-store",
    },
  });
}
