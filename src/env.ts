import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    GOOGLE_PLACES_API_KEY: z.string().min(1),
    GOOGLE_PLACES_API_BASE_URL: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
