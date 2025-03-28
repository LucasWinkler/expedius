import { eq, and, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { like } from "@/server/db/schema";
import type { DbLike, DbUser } from "@/server/types/db";
import { getServerSession } from "../auth/session";
import type { PaginationParams } from "@/types";
import { PaginatedResponse } from "../types/profile";

export const likes = {
  queries: {
    getByPlaceId: async (userId: DbUser["id"], placeId: DbLike["placeId"]) => {
      return db.query.like.findFirst({
        where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
      });
    },

    getAllByUserId: async (
      userId: DbUser["id"],
      { page = 1, limit = 10 }: PaginationParams = {},
    ): Promise<PaginatedResponse<DbLike>> => {
      const offset = (page - 1) * limit;

      const [items, totalItems] = await Promise.all([
        db.query.like.findMany({
          where: eq(like.userId, userId),
          orderBy: (like, { desc }) => [desc(like.createdAt)],
          limit,
          offset,
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(like)
          .where(eq(like.userId, userId))
          .then((result) => Number(result[0].count)),
      ]);

      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;

      return {
        items,
        metadata: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNextPage,
        },
      };
    },

    getStatuses: async (placeIds: DbLike["placeId"][]) => {
      const session = await getServerSession();
      if (!session) return {};

      if (!placeIds.length) return {};

      const likedPlaces = await Promise.all(
        placeIds.map(async (placeId) => {
          const like = await likes.queries.getByPlaceId(
            session.user.id,
            placeId,
          );
          return [placeId, !!like] as const;
        }),
      );

      return Object.fromEntries(likedPlaces);
    },

    getPaginatedLikes: async (
      userId: DbUser["id"],
      { page = 1, limit = 10 }: PaginationParams = {},
    ): Promise<PaginatedResponse<DbLike>> => {
      const userLikes = await likes.queries.getAllByUserId(userId, {
        page,
        limit,
      });

      return userLikes;
    },
  },

  mutations: {
    toggle: async (userId: DbUser["id"], placeId: DbLike["placeId"]) => {
      const existing = await db.query.like.findFirst({
        where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
      });

      if (existing) {
        await db.delete(like).where(eq(like.id, existing.id));
        return { liked: false };
      }

      await db.insert(like).values({ userId, placeId });
      return { liked: true };
    },
  },
} as const;
