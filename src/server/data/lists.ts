import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { list } from "@/server/db/schema";
import type { DbUser, DbList, DbListWithPlacesCount } from "@/server/db/schema";
import type { PaginationParams } from "@/types";

export const lists = {
  queries: {
    getById: async (id: DbList["id"]) => {
      return db.query.list.findFirst({
        where: eq(list.id, id),
        with: {
          savedPlaces: true,
        },
      });
    },

    getAllByUserId: async (
      userId: DbUser["id"],
      { page = 1, limit = 10 }: PaginationParams = {},
    ) => {
      const offset = (page - 1) * limit;

      const [{ count }] = await db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(list)
        .where(eq(list.userId, userId));

      const items = await db.query.list.findMany({
        where: eq(list.userId, userId),
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
  },

  mutations: {
    create: async (
      userId: DbUser["id"],
      data: Pick<
        typeof list.$inferInsert,
        "name" | "description" | "colour" | "isPublic" | "image"
      >,
    ) => {
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

    update: async (
      id: DbList["id"],
      data: Partial<
        Pick<
          typeof list.$inferInsert,
          "name" | "description" | "colour" | "isPublic" | "image"
        >
      >,
    ) => {
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
