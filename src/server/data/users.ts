import "server-only";

import { eq, sql } from "drizzle-orm";
import type { DbUser } from "@/server/types/db";
import { db } from "@/server/db";
import { user, like, list } from "@/server/db/schema";
import { getServerSession } from "@/server/auth/session";

export const users = {
  queries: {
    getByUsername: async (username: DbUser["username"]) => {
      const user = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });
      return user;
    },

    getById: async (id: DbUser["id"]) => {
      const user = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
      return user;
    },

    getProfileMetadata: async (username: DbUser["username"]) => {
      const foundUser = await db.query.user.findFirst({
        where: eq(user.username, username),
        columns: {
          id: true,
          username: true,
          name: true,
          isPublic: true,
        },
      });

      if (!foundUser) {
        return null;
      }

      const session = await getServerSession();
      const isOwner = session?.user.id === foundUser.id;

      return {
        name: foundUser.name,
        username: foundUser.username,
        isPublic: foundUser.isPublic,
        isOwner,
      };
    },

    getListsAndLikesCount: async (userId: string) => {
      const [listsCount, likesCount] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)` })
          .from(list)
          .where(eq(list.userId, userId))
          .then((result) => Number(result[0].count)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(like)
          .where(eq(like.userId, userId))
          .then((result) => Number(result[0].count)),
      ]);
      return { listsCount, likesCount };
    },

    getPlaceData: async (userId: string) => {
      const userData = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
        with: {
          lists: {
            orderBy: (lists, { desc }) => [desc(lists.createdAt)],
            with: {
              savedPlaces: true,
            },
          },
          likes: {
            orderBy: (likes, { desc }) => [desc(likes.createdAt)],
          },
        },
      });

      if (!userData) {
        throw new Error("User not found");
      }

      return {
        likes: userData.likes,
        lists: userData.lists,
      };
    },
  },

  mutations: {
    update: async (
      userId: DbUser["id"],
      data: Partial<{
        name: DbUser["name"];
        username: DbUser["username"];
        bio: DbUser["bio"];
        image: DbUser["image"];
      }>,
    ) => {
      const [updatedUser] = await db
        .update(user)
        .set({
          ...data,
          usernameUpdatedAt: data.username ? new Date() : undefined,
        })
        .where(eq(user.id, userId))
        .returning();
      return updatedUser;
    },
  },
} as const;

export default users;
