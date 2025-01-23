"server-only";

import { eq, and, count, InferSelectModel } from "drizzle-orm";
import { db } from "@/server/db";
import { listPlace, User, UserList } from "@/server/db/schema";
import { userList } from "@/server/db/schema";
import { getServerSession } from "@/server/auth/session";
import { withErrorHandling } from "@/server/utils/error";
import { cache } from "react";

export type UserListFieldsForPlaceCard = Pick<
  InferSelectModel<typeof userList>,
  "id" | "name" | "userId"
>;
export type ListPlaceFieldsForPlaceCard = Pick<
  InferSelectModel<typeof listPlace>,
  "id" | "placeId"
>;
export type UserListForPlaceCard = UserListFieldsForPlaceCard & {
  places: ListPlaceFieldsForPlaceCard[];
};

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

    getAllByUserIdWithPlaces: cache(
      async (userId: User["id"]): Promise<UserListForPlaceCard[]> =>
        withErrorHandling(async () => {
          const session = await getServerSession();
          const isOwnProfile = session?.user.id === userId;

          const userLists = await db.query.userList.findMany({
            where: isOwnProfile
              ? eq(userList.userId, userId)
              : and(eq(userList.userId, userId), eq(userList.isPublic, true)),

            with: {
              places: true,
            },
            columns: {
              id: true,
              name: true,
              userId: true,
            },
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

    updateSelectedLists: async (
      userId: string,
      placeId: string,
      selectedLists: string[],
    ) =>
      withErrorHandling(async () => {
        // Fetch all lists for the user
        const userLists = await db.query.userList.findMany({
          where: eq(userList.userId, userId),
          with: { places: true },
        });

        // Determine which lists need to be updated
        const listsToAdd = selectedLists.filter(
          (listId) =>
            !userLists.some(
              (list) =>
                list.id === listId &&
                list.places.some((place) => place.placeId === placeId),
            ),
        );

        const listsToRemove = userLists
          .filter((list) =>
            list.places.some((place) => place.placeId === placeId),
          )
          .map((list) => list.id)
          .filter((listId) => !selectedLists.includes(listId));

        // Add the place to the selected lists
        await Promise.all(
          listsToAdd.map((listId) =>
            db.insert(listPlace).values({ listId, placeId }).execute(),
          ),
        );

        // Remove the place from the unselected lists
        await Promise.all(
          listsToRemove.map((listId) =>
            db
              .delete(listPlace)
              .where(
                and(
                  eq(listPlace.listId, listId),
                  eq(listPlace.placeId, placeId),
                ),
              )
              .execute(),
          ),
        );

        return { success: true };
      }, "Failed to update selected lists"),

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
