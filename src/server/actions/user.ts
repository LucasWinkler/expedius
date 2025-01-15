"use server";

import { getServerSession } from "@/lib/auth/session";
import { UpdateProfileInput } from "@/lib/validations/user";
import userQueries from "@/server/db/queries/user";
import { revalidatePath } from "next/cache";
import userMutations from "../db/mutations/user";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export const checkUsernameAvailability = async (username: string) => {
  if (username.length < 3) {
    return { available: false };
  }

  const existingUser = await userQueries.getByUsername(username);

  return { available: !existingUser };
};

export const updateProfile = async (
  data: UpdateProfileInput & { image?: string | null },
) => {
  try {
    const session = await getServerSession();
    if (!session) {
      return { error: "Unauthorized" };
    }

    const user = await userQueries.getById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    if (data.username !== user.username) {
      if (
        user.usernameUpdatedAt &&
        new Date(user.usernameUpdatedAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) {
        return { error: "You can only change your username every 30 days" };
      }

      const existingUser = await userQueries.getByUsername(data.username);
      if (existingUser) {
        return { error: "Username already taken" };
      }
    }

    const updatedUser = await userMutations.update(user.id, {
      ...data,
    });

    await auth.api.updateUser({
      body: {
        name: updatedUser.name,
        image: updatedUser.image,
        username: updatedUser.username,
      },
      headers: await headers(),
    });

    revalidatePath(`/u/${data.username}`);
    revalidatePath(`/u/${updatedUser.username}`);
    revalidatePath("/", "layout");

    return { data: updatedUser };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
};
