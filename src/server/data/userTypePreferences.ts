import "server-only";

import { and, eq, desc } from "drizzle-orm";
import { db } from "@/server/db";
import {
  userPrimaryTypePreference,
  userTypePreference,
} from "@/server/db/schema";
import type { DbUser } from "@/server/types/db";

export const userTypePreferences = {
  queries: {
    async getUserTypePreferences(userId: DbUser["id"]) {
      return {
        primaryTypes: await db.query.userPrimaryTypePreference.findMany({
          where: eq(userPrimaryTypePreference.userId, userId),
          orderBy: [desc(userPrimaryTypePreference.count)],
        }),
        allTypes: await db.query.userTypePreference.findMany({
          where: eq(userTypePreference.userId, userId),
          orderBy: [desc(userTypePreference.count)],
        }),
      };
    },
  },

  mutations: {
    async updatePrimaryTypePreference(userId: DbUser["id"], placeType: string) {
      const existing = await db.query.userPrimaryTypePreference.findFirst({
        where: and(
          eq(userPrimaryTypePreference.userId, userId),
          eq(userPrimaryTypePreference.placeType, placeType),
        ),
      });

      if (existing) {
        return db
          .update(userPrimaryTypePreference)
          .set({ count: existing.count + 1 })
          .where(
            and(
              eq(userPrimaryTypePreference.userId, userId),
              eq(userPrimaryTypePreference.placeType, placeType),
            ),
          );
      } else {
        return db.insert(userPrimaryTypePreference).values({
          userId,
          placeType,
          count: 1,
        });
      }
    },

    async updateTypePreference(userId: DbUser["id"], placeType: string) {
      const existing = await db.query.userTypePreference.findFirst({
        where: and(
          eq(userTypePreference.userId, userId),
          eq(userTypePreference.placeType, placeType),
        ),
      });

      if (existing) {
        return db
          .update(userTypePreference)
          .set({ count: existing.count + 1 })
          .where(
            and(
              eq(userTypePreference.userId, userId),
              eq(userTypePreference.placeType, placeType),
            ),
          );
      } else {
        return db.insert(userTypePreference).values({
          userId,
          placeType,
          count: 1,
        });
      }
    },

    async trackPlaceTypes(
      userId: DbUser["id"],
      primaryType: string | null,
      types: string[],
    ) {
      if (primaryType) {
        await this.updatePrimaryTypePreference(userId, primaryType);
      }

      if (types && types.length > 0) {
        await Promise.all(
          types.map((type) => this.updateTypePreference(userId, type)),
        );
      }
    },
  },
} as const;
