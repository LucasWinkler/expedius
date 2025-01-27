"server-only";

import { eq } from "drizzle-orm";
import type { DbUser } from "@/server/db/schema";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { getServerSession } from "@/server/auth/session";
import type {
  PublicProfileData,
  PrivateProfileData,
} from "@/server/types/profile";
import { profileParamsSchema } from "@/lib/validations/profile";
import { ProfileParams } from "@/lib/validations/profile";
import { PAGINATION } from "@/constants";
import { lists } from "@/server/data/lists";

export const users = {
  queries: {
    getByUsername: async (username: DbUser["username"]) => {
      const user = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });
      return user;
    },

    getById: async (id: DbUser["id"]) => {
      const user = await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
      return user;
    },

    getProfileMetadata: async (username: string) => {
      const foundUser = await db.query.user.findFirst({
        where: eq(user.username, username),
        columns: {
          username: true,
          name: true,
          isPublic: true,
        },
      });

      if (!foundUser) return null;

      return {
        name: foundUser.name,
        username: foundUser.username,
        isPublic: foundUser.isPublic,
      };
    },

    getProfile: async (
      params: ProfileParams,
    ): Promise<PublicProfileData | PrivateProfileData | null> => {
      const validated = profileParamsSchema.safeParse(params);
      if (!validated.success) {
        throw new Error("Invalid profile parameters");
      }

      const { username, page } = validated.data;

      const foundUser = await db.query.user.findFirst({
        where: eq(user.username, username),
      });

      if (!foundUser) return null;

      const session = await getServerSession();
      const isOwnProfile = session?.user.id === foundUser.id;

      if (!isOwnProfile && !foundUser.isPublic) {
        return {
          type: "private",
          username: foundUser.username,
        };
      }

      const userLists = await lists.queries.getAllByUserId(foundUser.id, {
        page,
        limit: PAGINATION.ITEMS_PER_PAGE,
      });

      return {
        user: { ...foundUser, type: "public" as const },
        isOwnProfile,
        lists: userLists,
      };
    },
  },

  mutations: {
    update: async (
      userId: DbUser["id"],
      data: Partial<{
        name: DbUser["name"];
        username: DbUser["username"];
        bio: DbUser["bio"];
        image: DbUser["image"];
      }>,
    ) => {
      const [updatedUser] = await db
        .update(user)
        .set({
          ...data,
          usernameUpdatedAt: data.username ? new Date() : undefined,
        })
        .where(eq(user.id, userId))
        .returning();
      return updatedUser;
    },
  },
} as const;

export default users;
