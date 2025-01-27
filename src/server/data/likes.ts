import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { like } from "@/server/db/schema";
import { withErrorHandling } from "@/server/utils/error";
import type { DbLike, DbUser } from "@/server/db/schema";

export const likes = {
  queries: {
    getByPlaceId: async (userId: DbUser["id"], placeId: DbLike["placeId"]) =>
      withErrorHandling(async () => {
        return db.query.like.findFirst({
          where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
        });
      }, "Failed to fetch like status"),
  },

  mutations: {
    toggle: async (userId: DbUser["id"], placeId: DbLike["placeId"]) =>
      withErrorHandling(async () => {
        const existing = await db.query.like.findFirst({
          where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
        });

        if (existing) {
          await db.delete(like).where(eq(like.id, existing.id));
          return { liked: false };
        }

        await db.insert(like).values({ userId, placeId });
        return { liked: true };
      }, "Failed to toggle like"),
  },
} as const;
