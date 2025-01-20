"server-only";

import { eq } from "drizzle-orm";
import type { User } from "@/server/db/schema";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { withErrorHandling } from "@/server/utils/error";

export const users = {
  queries: {
    getByUsername: async (username: User["username"]) =>
      withErrorHandling(async () => {
        const user = await db.query.user.findFirst({
          where: (users, { eq }) => eq(users.username, username),
        });
        return user;
      }, "Failed to fetch user"),

    getById: async (id: User["id"]) =>
      withErrorHandling(async () => {
        const user = db.query.user.findFirst({
          where: (users, { eq }) => eq(users.id, id),
        });
        return user;
      }, "Failed to fetch user"),
  },

  mutations: {
    update: async (
      userId: User["id"],
      data: Partial<{
        name: User["name"];
        username: User["username"];
        bio: User["bio"];
        image: User["image"];
      }>,
    ) =>
      withErrorHandling(async () => {
        const [updatedUser] = await db
          .update(user)
          .set({
            ...data,
            usernameUpdatedAt: data.username ? new Date() : undefined,
          })
          .where(eq(user.id, userId))
          .returning();
        return updatedUser;
      }, "Failed to update user"),
  },
} as const;

export default users;
