"server-only";

import { auth } from "@/server/auth/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export const requireSession = cache(
  async (redirectTo: string = "/auth/sign-in") => {
    const session = await getServerSession();

    if (!session) {
      redirect(redirectTo);
    }

    return session;
  },
);
