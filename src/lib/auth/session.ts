import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { Session } from "@/lib/auth-client";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session as Session | null;
});

export const requireSession = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
};
