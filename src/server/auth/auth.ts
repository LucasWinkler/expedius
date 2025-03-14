import { betterAuth, BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { lists } from "@/server/data/lists";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  appName: env.NEXT_PUBLIC_APP_NAME,
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  user: {
    additionalFields: {
      isPublic: {
        type: "boolean",
        required: true,
        defaultValue() {
          return false;
        },
        input: true,
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      role: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "user",
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  advanced: {
    generateId: false,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await lists.mutations.createDefault(user.id);
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [nextCookies()],
} satisfies BetterAuthOptions);
