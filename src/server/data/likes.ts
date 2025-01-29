import { unstable_cache } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { like } from "@/server/db/schema";
import type { DbLike, DbUser } from "@/server/types/db";
import { getServerSession } from "../auth/session";

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
          tags: [`user-${userId}-likes`, `user-likes`],
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
          tags: [`user-${userId}-likes`, `user-likes`],
          revalidate: 60,
        },
      )();
    },

    getStatuses: async (placeIds: DbLike["placeId"][]) => {
      const session = await getServerSession();
      if (!session) return {};

      if (!placeIds.length) return {};

      const cacheKey = `user-${session.user.id}-likes-statuses-${placeIds.length}`;
      const cachedFn = unstable_cache(
        async () => {
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
        [cacheKey],
        {
          tags: [`user-${session.user.id}-likes`, `user-likes`],
          revalidate: 60,
        },
      );

      return cachedFn();
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
