"use server";

import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function checkUsernameAvailability(username: string) {
  if (username.length < 3) return { available: false };

  const existingUser = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  return { available: !existingUser };
}
