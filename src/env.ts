import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (url) =>
          url.startsWith("postgres://") || url.startsWith("postgresql://"),
        "Must be a PostgreSQL connection string",
      ),
    BETTER_AUTH_SECRET: z.string().min(1, "Auth secret is required"),
    UPLOADTHING_TOKEN: z.string().min(1, "Uploadthing token is required"),
    UPLOADTHING_APP_ID: z.string().min(1, "Uploadthing app ID is required"),
    GOOGLE_PLACES_API_KEY: z
      .string()
      .min(1, "Google Places API key is required"),
    GOOGLE_PLACES_API_BASE_URL: z
      .literal("https://places.googleapis.com/v1")
      .default("https://places.googleapis.com/v1"),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .url()
      .refine(
        (url) => url.includes(".upstash.io"),
        "Must be an Upstash Redis URL ending with .upstash.io",
      ),
    UPSTASH_REDIS_REST_TOKEN: z
      .string()
      .min(1, "Upstash Redis REST token is required"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_APP_NAME: z
      .string()
      .min(1, "App name is required")
      .default("PoiToGo"),
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url()
      .min(1)
      .default(
        process.env.NEXT_PUBLIC_VERCEL_ENV
          ? process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
            : `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
          : "http://localhost:3000",
      ),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
