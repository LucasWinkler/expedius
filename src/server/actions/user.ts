"use server";

import { getServerSession } from "@/server/auth/session";
import {
  updateProfileServerSchema,
  type UpdateProfileRequest,
} from "@/server/validations/user";
import users from "@/server/data/users";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth/auth";
import { headers } from "next/headers";
import { withActionLimit } from "../lib/rate-limit";

export const checkUsernameAvailability = async (username: string) => {
  if (username.length < 3) {
    return { available: false };
  }

  const existingUser = await users.queries.getByUsername(username);

  return { available: !existingUser };
};

export const updateProfile = withActionLimit(
  async (input: Partial<UpdateProfileRequest>) => {
    try {
      const session = await getServerSession();
      if (!session) {
        return { error: "Unauthorized" };
      }

      const validatedInput = updateProfileServerSchema
        .partial()
        .safeParse(input);
      if (!validatedInput.success) {
        return { error: "Invalid input" };
      }

      const data = validatedInput.data;
      const user = await users.queries.getById(session.user.id);
      if (!user) {
        return { error: "User not found" };
      }

      if (data.username && data.username !== user.username) {
        if (
          user.usernameUpdatedAt &&
          new Date(user.usernameUpdatedAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ) {
          return { error: "You can only change your username every 30 days" };
        }

        const existingUser = await users.queries.getByUsername(data.username);
        if (existingUser) {
          return { error: "Username already taken" };
        }
      }

      const updateData: Partial<UpdateProfileRequest> = {};
      if (data.username && data.username !== user.username)
        updateData.username = data.username;
      if (data.name && data.name !== user.name) updateData.name = data.name;
      if (data.bio !== undefined && data.bio !== user.bio)
        updateData.bio = data.bio;
      if (data.isPublic !== undefined && data.isPublic !== user.isPublic)
        updateData.isPublic = data.isPublic;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.colour !== undefined) updateData.colour = data.colour;

      if (Object.keys(updateData).length === 0) {
        return { data: user };
      }

      const updatedUser = await users.mutations.update(user.id, updateData);

      await auth.api.updateUser({
        body: {
          name: updatedUser.name,
          image: updatedUser.image,
          username: updatedUser.username,
          isPublic: updatedUser.isPublic,
          colour: updatedUser.colour,
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
  },
  "profile",
);
