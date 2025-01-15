import type { User, UserList } from "@/server/db/schema";
import { db } from "@/server/db";
import { user, userList } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userMutations = {
  update: async (
    userId: User["id"],
    data: Partial<{
      name: User["name"];
      username: User["username"];
      bio: User["bio"];
      image: User["image"];
    }>,
  ) => {
    try {
      const [updatedUser] = await db
        .update(user)
        .set({
          ...data,
          updatedAt: new Date(),
          usernameUpdatedAt: data.username ? new Date() : undefined,
        })
        .where(eq(user.id, userId))
        .returning();

      return updatedUser;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to update user");
    }
  },
};

export default userMutations;
