import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/redis";

const limiters = new Map<string, Ratelimit>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
}

function getLimiter(providerId: string, requests: number, windowSeconds: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${providerId}:${requests}:${windowSeconds}`;
  if (!limiters.has(cacheKey)) {
    limiters.set(
      cacheKey,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
        prefix: `ratelimit:${providerId}`,
      }),
    );
  }
  return limiters.get(cacheKey)!;
}

/**
 * Checks and consumes one request against a provider's rate limit.
 * Without Redis armed, there's no shared state to track against —
 * requests are allowed through rather than blocked.
 */
export async function checkRateLimit(
  providerId: string,
  requests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const limiter = getLimiter(providerId, requests, windowSeconds);
  if (!limiter) {
    return { success: true, remaining: requests, limit: requests };
  }
  const result = await limiter.limit(providerId);
  return { success: result.success, remaining: result.remaining, limit: result.limit };
}
