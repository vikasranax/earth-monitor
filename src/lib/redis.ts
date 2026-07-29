import { Redis } from "@upstash/redis";
import { serverEnv } from "@/lib/env";

let client: Redis | null = null;
let attempted = false;

export function getRedis(): Redis | null {
  if (attempted) return client;
  attempted = true;

  if (serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN) {
    client = new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    });
    console.warn("[jagat-manthan] redis: Upstash client armed");
  } else {
    console.warn(
      "[jagat-manthan] redis: UPSTASH_REDIS_REST_URL/TOKEN not set — " +
        "falling back to in-memory cache (dev only, not shared across instances/regions)",
    );
  }

  return client;
}

export const isRedisArmed = () => getRedis() !== null;
