// A small in-memory rate limiter: each visitor (IP) gets a budget of
// requests per minute, so nobody can drain the day's free AI quota solo.
// In-memory is a deliberate trade-off — on serverless it resets per
// instance, which is plenty for a portfolio app and needs zero extra
// services. Swap for a shared store (e.g. Upstash) if this ever scales.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8; // one full bake = 2 requests, so ~4 bakes/min
const MAX_TRACKED_IPS = 5_000;

const buckets = new Map<string, number[]>();

export function clientIp(request: Request): string {
  // Vercel/most proxies put the real client IP first in x-forwarded-for.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export function rateLimit(ip: string): boolean {
  const now = Date.now();

  // Keep the map bounded if lots of unique IPs show up.
  if (buckets.size > MAX_TRACKED_IPS) {
    for (const [key, times] of buckets) {
      if (times.every((t) => now - t >= WINDOW_MS)) buckets.delete(key);
    }
  }

  const recent = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    buckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  buckets.set(ip, recent);
  return true;
}
