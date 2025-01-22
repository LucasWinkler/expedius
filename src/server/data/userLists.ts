"server-only";

import { eq, and, count } from "drizzle-orm";
import { db } from "@/server/db";
import type { User, UserList } from "@/server/db/schema";
import { userList } from "@/server/db/schema";
import { getServerSession } from "@/server/auth/session";
import { withErrorHandling } from "@/server/utils/error";
import { cache } from "react";

export const userLists = {
  queries: {
    getById: cache(async (id: string) =>
      withErrorHandling(async () => {
        const list = await db.query.userList.findFirst({
          where: eq(userList.id, id),
        });
        return list;
      }, "Failed to fetch list"),
    ),

    getAllByUserId: cache(async (userId: User["id"]) =>
      withErrorHandling(async () => {
        const session = await getServerSession();
        const isOwnProfile = session?.user.id === userId;

        const userLists = await db.query.userList.findMany({
          where: isOwnProfile
            ? eq(userList.userId, userId)
            : and(eq(userList.userId, userId), eq(userList.isPublic, true)),
          orderBy: (lists, { desc }) => [desc(lists.createdAt)],
        });
        return userLists;
      }, "Failed to fetch lists"),
    ),

    getCountByUserId: cache(async (userId: User["id"]) =>
      withErrorHandling(async () => {
        const session = await getServerSession();
        const isOwnProfile = session?.user.id === userId;

        const [userLists] = await db
          .select({ count: count() })
          .from(userList)
          .where(
            isOwnProfile
              ? eq(userList.userId, userId)
              : and(eq(userList.userId, userId), eq(userList.isPublic, true)),
          );
        return userLists.count;
      }, "Failed to fetch lists count"),
    ),
  },

  mutations: {
    create: async (data: {
      name: UserList["name"];
      description?: UserList["description"];
      userId: User["id"];
      isPublic?: UserList["isPublic"];
      colour?: UserList["colour"];
      image?: UserList["image"];
      isDefault?: UserList["isDefault"];
    }) =>
      withErrorHandling(async () => {
        const [newList] = await db
          .insert(userList)
          .values({
            ...data,
            isDefault: data.isDefault ?? false,
          })
          .returning();
        return newList;
      }, "Failed to create list"),

    createDefault: async (userId: User["id"]) =>
      withErrorHandling(async () => {
        const newList = await userLists.mutations.create({
          name: "Quick Saves",
          description: "Your default collection for quickly saving places",
          userId,
          isDefault: true,
        });
        return newList;
      }, "Failed to create default list"),

    update: async (
      listId: string,
      data: Partial<{
        name: UserList["name"];
        description: UserList["description"];
        isPublic: UserList["isPublic"];
        colour: UserList["colour"];
        image: UserList["image"];
      }>,
    ) =>
      withErrorHandling(async () => {
        const [updatedList] = await db
          .update(userList)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(userList.id, listId))
          .returning();
        return updatedList;
      }, "Failed to update list"),

    delete: async (listId: string) =>
      withErrorHandling(async () => {
        const [deletedList] = await db
          .delete(userList)
          .where(eq(userList.id, listId))
          .returning();
        return deletedList;
      }, "Failed to delete list"),
  },
} as const;

export default userLists;
