import { betterAuth, BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { lists } from "@/server/data/lists";
import { env } from "@/env";
import { resend } from "@/lib/email";
import { minPasswordLength } from "@/constants";
import { EmailVerification } from "@/components/emails/email-verification";
import { ResetPassword } from "@/components/emails/reset-password";
import { EmailChange } from "@/components/emails/email-change";
import { DeleteAccount } from "@/components/emails/delete-account";
import { twoFactor } from "better-auth/plugins/two-factor";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  appName: env.NEXT_PUBLIC_APP_NAME,
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({
        user,
        url,
      }: {
        user: { email: string; name: string; id: string };
        url: string;
      }) => {
        await resend.emails.send({
          from: "Expedius <noreply@lucaswinkler.dev>",
          to: user.email,
          subject: "Delete account",
          react: DeleteAccount({ url, name: user.name }),
        });
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user,
        newEmail,
        url,
      }: {
        user: { email: string; name: string };
        newEmail: string;
        url: string;
      }) => {
        await resend.emails.send({
          from: "Expedius <noreply@lucaswinkler.dev>",
          to: user.email,
          subject: "Approve email change",
          react: EmailChange({ url, name: user.name, newEmail }),
        });
      },
    },
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
    minPasswordLength: minPasswordLength,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Expedius <noreply@lucaswinkler.dev>",
        to: user.email,
        subject: "Reset your password",
        react: ResetPassword({ url, name: user.name }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Expedius <noreply@lucaswinkler.dev>",
        to: user.email,
        subject: "Verify your email address for Expedius",
        react: EmailVerification({ url, name: user.name }),
      });
    },
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
  plugins: [
    nextCookies(),
    twoFactor({
      issuer: env.NEXT_PUBLIC_APP_NAME,
    }),
  ],
} satisfies BetterAuthOptions);
