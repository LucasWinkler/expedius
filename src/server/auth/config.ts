import { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import userLists from "@/server/data/userLists";

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: [
    "http://192.168.86.96:3000",
    "http://192.168.86.96:3000/api/auth",
  ],
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "user",
      },
      bio: {
        type: "string",
        required: false,
        input: false,
      },
      isPublic: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
        fieldName: "is_public",
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
          await userLists.mutations.createDefault(user.id);
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
} satisfies BetterAuthOptions;
