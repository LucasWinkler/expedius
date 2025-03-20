"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "../auth/session";

export async function refreshUserSession() {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  revalidatePath("/settings");
  revalidatePath("/", "layout");

  if (session.user.username) {
    revalidatePath(`/u/${session.user.username}`);
  }

  return { success: true };
}
