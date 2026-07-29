import { getRedis } from "@/lib/redis";

interface MemoryCacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, MemoryCacheEntry<unknown>>();

export interface FetchWithCacheOptions {
  /** Cache lifetime in seconds. */
  ttlSeconds: number;
}

export interface FetchWithCacheResult<T> {
  data: T;
  cached: boolean;
}

/**
 * Cache-aside fetch: check cache, call fetcher on miss, store result.
 * Uses Upstash Redis when armed; falls back to per-instance in-memory
 * cache otherwise (fine for local dev, not for multi-instance prod).
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: FetchWithCacheOptions,
): Promise<FetchWithCacheResult<T>> {
  const redis = getRedis();

  if (redis) {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return { data: cached, cached: true };
    }
    const fresh = await fetcher();
    await redis.set(key, fresh, { ex: options.ttlSeconds });
    return { data: fresh, cached: false };
  }

  const now = Date.now();
  const entry = memoryCache.get(key) as MemoryCacheEntry<T> | undefined;
  if (entry && entry.expiresAt > now) {
    return { data: entry.value, cached: true };
  }

  const fresh = await fetcher();
  memoryCache.set(key, { value: fresh, expiresAt: now + options.ttlSeconds * 1000 });
  return { data: fresh, cached: false };
}
