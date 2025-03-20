import type { auth } from "@/server/auth/auth";
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient()],
});

const { signOut: _signOut } = authClient;

export const signOut = async () => {
  const result = await _signOut();
  if (typeof window !== "undefined") {
    window.location.reload();
  }
  return result;
};

export const { signUp, signIn, useSession } = authClient;

export type ClientSession = typeof authClient.$Infer.Session;
export type ClientUser = typeof authClient.$Infer.Session.user;
