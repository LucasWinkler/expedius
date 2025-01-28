import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { env } from "@/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimiters = {
  likes: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "ratelimit:likes",
  }),
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: "ratelimit:search",
  }),
  lists: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: "ratelimit:lists",
  }),
  savePlaces: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: "ratelimit:save-places",
  }),
  profile: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "ratelimit:profile",
  }),
} as const;

type RateLimitType = keyof typeof rateLimiters;

export const withRateLimit = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  type: RateLimitType,
) => {
  return async (...args: Args) => {
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success, remaining } = await rateLimiters[type].limit(ip);

    console.info(`Rate Limit: ${type}`, { success, remaining });

    if (!success) {
      throw new Error(`Too many ${type} requests`);
    }

    return fn(...args);
  };
};
