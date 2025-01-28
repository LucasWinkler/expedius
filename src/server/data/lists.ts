import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { list, savedPlace } from "@/server/db/schema";
import type { DbUser, DbList, DbListWithPlacesCount } from "@/server/db/schema";
import type { PaginationParams } from "@/types";
import { users } from "./users";
import {
  CreateListRequest,
  UpdateListRequest,
} from "@/server/validations/lists";

export const lists = {
  queries: {
    getById: async (id: DbList["id"]) => {
      return unstable_cache(
        async () => {
          return db.query.list.findFirst({
            where: eq(list.id, id),
            with: { savedPlaces: true },
          });
        },
        [`list-${id}`],
        {
          tags: [`user-lists`],
          revalidate: 60,
        },
      )();
    },

    getAllByUserId: async (
      userId: DbUser["id"],
      isOwnProfile: boolean,
      { page = 1, limit = 10 }: PaginationParams = {},
    ) => {
      return unstable_cache(
        async () => {
          const offset = (page - 1) * limit;

          const [{ count }] = await db
            .select({
              count: sql<number>`cast(count(*) as integer)`,
            })
            .from(list)
            .where(
              and(
                eq(list.userId, userId),
                isOwnProfile ? undefined : eq(list.isPublic, true),
              ),
            );

          const items = await db.query.list.findMany({
            where: and(
              eq(list.userId, userId),
              isOwnProfile ? undefined : eq(list.isPublic, true),
            ),
            orderBy: (list, { desc }) => [desc(list.createdAt)],
            limit,
            offset,
            with: {
              savedPlaces: {
                columns: {
                  id: true,
                },
              },
            },
          });

          return {
            items: items.map((list) => ({
              ...list,
              _count: {
                savedPlaces: list.savedPlaces.length,
              },
              savedPlaces: undefined,
            })) satisfies DbListWithPlacesCount[],
            metadata: {
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              totalItems: count,
              hasNextPage: offset + items.length < count,
              hasPreviousPage: page > 1,
            },
          };
        },
        [`user-${userId}-lists-page-${page}`],
        {
          tags: [`user-lists`],
          revalidate: 60,
        },
      )();
    },

    getAllByUsername: async (
      username: string,
      isOwnProfile: boolean,
      { page = 1, limit = 10 }: PaginationParams = {},
    ) => {
      return unstable_cache(
        async () => {
          const user = await users.queries.getByUsername(username);
          if (!user) return null;

          return lists.queries.getAllByUserId(user.id, isOwnProfile, {
            page,
            limit,
          });
        },
        [`user-${username}-lists-page-${page}-${isOwnProfile}`],
        {
          tags: [`user-lists`],
          revalidate: 60,
        },
      )();
    },

    getAllForPlaceCardByUserId: async (userId: string, placeId: string) => {
      return unstable_cache(
        async () => {
          const lists = await db.query.list.findMany({
            where: eq(list.userId, userId),
            columns: {
              id: true,
              name: true,
              userId: true,
            },
            with: {
              savedPlaces: {
                where: eq(savedPlace.placeId, placeId),
                columns: {
                  placeId: true,
                },
              },
            },
            orderBy: (lists, { desc }) => [desc(lists.createdAt)],
          });

          return lists.map((list) => ({
            ...list,
            isSelected: list.savedPlaces.length > 0,
          }));
        },
        [`user-${userId}-place-${placeId}-lists`],
        {
          tags: [`user-lists`, `list-places`],
          revalidate: 60,
        },
      )();
    },
  },

  mutations: {
    create: async (userId: DbUser["id"], data: CreateListRequest) => {
      const [newList] = await db
        .insert(list)
        .values({ ...data, userId })
        .returning();

      return newList;
    },

    createDefault: async (userId: DbUser["id"]) => {
      const [defaultList] = await db
        .insert(list)
        .values({
          userId,
          name: "Saved Places",
          description: "Your default list for saved places",
        })
        .returning();
      return defaultList;
    },

    update: async (id: DbList["id"], data: UpdateListRequest) => {
      const [updatedList] = await db
        .update(list)
        .set(data)
        .where(eq(list.id, id))
        .returning();

      return updatedList;
    },

    delete: async (id: DbList["id"]) => {
      await db.delete(list).where(eq(list.id, id));
    },
  },
} as const;
