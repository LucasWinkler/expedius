import { unstable_cache } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { savedPlace } from "@/server/db/schema";
import type { DbList } from "@/server/db/schema";
import type { PaginationParams } from "@/types";

export const savedPlaces = {
  queries: {
    getByListId: async (
      listId: DbList["id"],
      { page = 1, limit = 20 }: PaginationParams = {},
    ) => {
      return unstable_cache(
        async () => {
          const offset = (page - 1) * limit;

          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(savedPlace)
            .where(eq(savedPlace.listId, listId));

          const items = await db.query.savedPlace.findMany({
            where: eq(savedPlace.listId, listId),
            orderBy: (savedPlace, { desc }) => [desc(savedPlace.createdAt)],
            limit,
            offset,
          });

          return {
            items,
            metadata: {
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              totalItems: count,
              hasNextPage: offset + items.length < count,
              hasPreviousPage: page > 1,
            },
          };
        },
        [`list-${listId}-places-page-${page}`],
        {
          tags: [`list-${listId}-places`, `list-places`],
          revalidate: 60,
        },
      )();
    },
  },

  mutations: {
    create: async (
      data: Pick<typeof savedPlace.$inferInsert, "listId" | "placeId">,
    ) => {
      const [newSavedPlace] = await db
        .insert(savedPlace)
        .values(data)
        .returning();
      return newSavedPlace;
    },

    delete: async (listId: DbList["id"], placeId: string) => {
      await db
        .delete(savedPlace)
        .where(
          and(eq(savedPlace.listId, listId), eq(savedPlace.placeId, placeId)),
        );
    },
  },
} as const;
