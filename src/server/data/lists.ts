import { unstable_cache } from "next/cache";
import { and, eq, like, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { list, savedPlace } from "@/server/db/schema";
import type { DbUser, DbList, DbListWithPlacesCount } from "@/server/types/db";
import type { PaginationParams } from "@/types";
import { users } from "./users";
import {
  CreateListRequest,
  UpdateListRequest,
} from "@/server/validations/lists";
import { generateUniqueSlug } from "@/lib/slug";
import { defaultListName } from "@/constants";
import { lower } from "../lib/db-helpers";

export const lists = {
  queries: {
    getById: async (id: DbList["id"]) => {
      const foundList = await db.query.list.findFirst({
        where: eq(list.id, id),
        with: { savedPlaces: true },
      });

      return unstable_cache(async () => foundList, [`list-${id}`], {
        tags: foundList
          ? [`user-${foundList.userId}-lists`, `user-lists`]
          : [`user-lists`],
        revalidate: 60,
      })();
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
        [`user-${userId}-lists-page-${page}-auth-${isOwnProfile}`],
        {
          tags: [`user-${userId}-lists`, `user-lists`],
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
        [`user-${username}-lists-page-${page}-auth-${isOwnProfile}`],
        {
          tags: [`user-${username}-lists`, `user-lists`],
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
          tags: [`user-${userId}-lists`, `list-places`],
          revalidate: 60,
        },
      )();
    },

    getBySlug: async (slug: string, userId: string) => {
      const foundList = await db.query.list.findFirst({
        where: and(eq(list.slug, slug), eq(list.userId, userId)),
        with: { savedPlaces: true },
      });

      return unstable_cache(async () => foundList, [`list-${userId}-${slug}`], {
        tags: [`user-${userId}-lists`, `user-lists`],
        revalidate: 60,
      })();
    },

    getSlugsStartingWith: async (userId: string, baseSlug: string) => {
      const results = await db
        .select({ slug: list.slug })
        .from(list)
        .where(and(eq(list.userId, userId), like(list.slug, `${baseSlug}%`)));

      return results.map((r) => r.slug);
    },

    getByNameAndUserId: async (name: string, userId: string) => {
      const foundList = await db.query.list.findFirst({
        where: and(
          eq(list.userId, userId),
          eq(lower(list.name), name.toLowerCase()),
        ),
      });
      return foundList;
    },
  },

  mutations: {
    create: async (userId: DbUser["id"], data: CreateListRequest) => {
      const slug = await generateUniqueSlug(data.name, userId);

      const [newList] = await db
        .insert(list)
        .values({ ...data, userId, slug })
        .returning();

      return newList;
    },

    createDefault: async (userId: DbUser["id"]) => {
      const defaultSlug = await generateUniqueSlug(defaultListName, userId);

      const [defaultList] = await db
        .insert(list)
        .values({
          userId,
          name: defaultListName,
          slug: defaultSlug,
          description: "Your default list for saved places",
        })
        .returning();
      return defaultList;
    },

    update: async (id: DbList["id"], data: UpdateListRequest) => {
      const existingList = await db.query.list.findFirst({
        where: eq(list.id, id),
      });

      if (!existingList) throw new Error("List not found");

      const slug = data.name
        ? await generateUniqueSlug(
            data.name,
            existingList.userId,
            existingList.slug,
          )
        : existingList.slug;

      const [updatedList] = await db
        .update(list)
        .set({ ...data, slug })
        .where(eq(list.id, id))
        .returning();

      return updatedList;
    },

    delete: async (id: DbList["id"]) => {
      await db.delete(list).where(eq(list.id, id));
    },
  },
} as const;
