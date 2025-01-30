import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { env } from "@/env";
import { RATE_LIMIT_PREFIX } from "@/constants";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimiters = {
  likes: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}likes`,
  }),
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}search`,
  }),
  lists: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}lists`,
  }),
  savePlaces: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}save-places`,
  }),
  removePlaceFromList: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}remove-place-from-list`,
  }),
  profile: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: `${RATE_LIMIT_PREFIX}profile`,
  }),
} as const;

type RateLimitType = keyof typeof rateLimiters;

export const withApiLimit = <T, Args extends unknown[]>(
  handler: (...args: Args) => Promise<T>,
  type: RateLimitType,
) => {
  return async (...args: Args) => {
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimiters[type].limit(ip);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: `Please wait a moment before trying this action again`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return handler(...args);
  };
};

export const withActionLimit = <T, Args extends unknown[]>(
  action: (...args: Args) => Promise<T>,
  type: RateLimitType,
) => {
  return async (...args: Args) => {
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimiters[type].limit(ip);

    if (!success) {
      throw new Error("Please wait a moment before trying this action again");
    }

    return action(...args);
  };
};
