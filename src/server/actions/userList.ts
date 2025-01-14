"use server";

import { revalidatePath } from "next/cache";
import type { UserList } from "@/server/db/schema";
import userListMutations from "@/server/db/mutations/userList";
import { getServerSession } from "@/lib/auth/session";

export const createUserList = async (data: {
  name: UserList["name"];
  description?: UserList["description"];
  isDefault?: UserList["isDefault"];
}) => {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const list = await userListMutations.create({
      ...data,
      userId: session.user.id,
    });

    revalidatePath(`/u/${session.user.username}`);
    return { data: list };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
