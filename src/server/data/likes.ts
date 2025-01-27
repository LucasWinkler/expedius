import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { like } from "@/server/db/schema";
import type { DbLike, DbUser } from "@/server/db/schema";

export const likes = {
  queries: {
    getByPlaceId: async (userId: DbUser["id"], placeId: DbLike["placeId"]) => {
      return db.query.like.findFirst({
        where: and(eq(like.userId, userId), eq(like.placeId, placeId)),
      });
    },

    getAllByUserId: async (userId: DbUser["id"]) => {
      return db.query.like.findMany({
        where: eq(like.userId, userId),
        orderBy: (like, { desc }) => [desc(like.createdAt)],
      });
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
