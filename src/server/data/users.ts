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

    getProfileMetadata: async (username: DbUser["username"]) => {
      const foundUser = await db.query.user.findFirst({
        where: eq(user.username, username),
        columns: {
          id: true,
          username: true,
          name: true,
          isPublic: true,
        },
      });

      if (!foundUser) return null;

      const session = await getServerSession();
      const isOwnProfile = session?.user.id === foundUser.id;

      return {
        name: foundUser.name,
        username: foundUser.username,
        isPublic: foundUser.isPublic,
        isOwnProfile,
      };
    },

    getProfile: async (
      params: ProfileParams,
    ): Promise<PublicProfileData | PrivateProfileData | null> => {
      const validated = profileParamsSchema.safeParse(params);
      if (!validated.success) {
        throw new Error("Invalid profile parameters");
      }

      const { username, page, limit } = validated.data;

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

      const userLists = await lists.queries.getAllByUserId(
        foundUser.id,
        isOwnProfile,
        {
          page,
          limit,
        },
      );

      return {
        user: { ...foundUser, type: "public" as const },
        isOwnProfile,
        lists: userLists,
      };
    },

    getPlaceData: async (userId: string) => {
      const userData = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
        with: {
          lists: {
            orderBy: (lists, { desc }) => [desc(lists.createdAt)],
            with: {
              savedPlaces: true,
            },
          },
          likes: {
            orderBy: (likes, { desc }) => [desc(likes.createdAt)],
          },
        },
      });

      if (!userData) {
        throw new Error("User not found");
      }

      return {
        likes: userData.likes,
        lists: userData.lists,
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
