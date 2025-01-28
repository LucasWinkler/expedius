import { unstable_cache } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { like } from "@/server/db/schema";
import type { DbLike, DbUser } from "@/server/db/schema";

export const likes = {
  queries: {
    getByPlaceId: async (userId: DbUser["id"], placeId: DbLike["placeId"]) => {
      return unstable_cache(
        async () => {
          return db.query.like.findFirst({
            where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
          });
        },
        [`like-${userId}-${placeId}`],
        {
          tags: [`user-likes`],
          revalidate: 60,
        },
      )();
    },

    getAllByUserId: async (userId: DbUser["id"]) => {
      return unstable_cache(
        async () => {
          return db.query.like.findMany({
            where: eq(like.userId, userId),
            orderBy: (like, { desc }) => [desc(like.createdAt)],
          });
        },
        [`user-${userId}-likes`],
        {
          tags: [`user-likes`],
          revalidate: 60,
        },
      )();
    },
  },

  mutations: {
    toggle: async (userId: DbUser["id"], placeId: DbLike["placeId"]) => {
      const existing = await db.query.like.findFirst({
        where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
      });

      if (existing) {
        return {
          liked: !!(await db.delete(like).where(eq(like.id, existing.id))),
        };
      }

      return { liked: !!(await db.insert(like).values({ userId, placeId })) };
    },
  },
} as const;
