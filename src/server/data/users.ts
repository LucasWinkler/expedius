"server-only";

import { eq, sql } from "drizzle-orm";
import type { DbUser } from "@/server/types/db";
import { db } from "@/server/db";
import { user, like } from "@/server/db/schema";
import { getServerSession } from "@/server/auth/session";
import type {
  PublicProfileData,
  PrivateProfileData,
} from "@/server/types/profile";
import { profileParamsSchema } from "@/lib/validations/profile";
import { ProfileParams } from "@/lib/validations/profile";
import { lists } from "@/server/data/lists";
import { likes } from "@/server/data/likes";
import { env } from "@/env";
import { getEnhancedPlacePhoto } from "@/server/services/photos";
import type { Place } from "@/types";

const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "photos",
  "rating",
  "userRatingCount",
  "priceLevel",
].join(",");

const processPlacePhotos = async (place: Place): Promise<Place> => {
  try {
    if (!place.photos?.[0]) {
      return place;
    }

    return {
      ...place,
      image: await getEnhancedPlacePhoto(place.photos[0].name),
    };
  } catch (error) {
    console.warn(`Failed to process photo for place ${place.id}:`, error);
    return place;
  }
};

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

      const [userLists, userLikes, likesCount] = await Promise.all([
        lists.queries.getAllByUserId(foundUser.id, isOwnProfile, {
          page,
          limit,
        }),
        likes.queries.getAllByUserId(foundUser.id, {
          page,
          limit,
        }),
        db
          .select({ count: sql<number>`count(*)` })
          .from(like)
          .where(eq(like.userId, foundUser.id))
          .then((result) => Number(result[0].count)),
      ]);

      // Fetch place details for each like
      const likesWithPlaceDetails = await Promise.all(
        userLikes.items.map(async (like) => {
          const res = await fetch(
            `${env.GOOGLE_PLACES_API_BASE_URL}/places/${like.placeId}`,
            {
              headers: {
                "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
                "X-Goog-FieldMask": FIELD_MASK,
              },
              next: {
                revalidate: 3600, // Cache for 1 hour
              },
            },
          );

          if (!res.ok) {
            console.error(
              `Failed to fetch place details for ${like.placeId}:`,
              await res.text(),
            );
            return null;
          }

          const placeDetails = await res.json();
          const processedPlace = await processPlacePhotos(placeDetails);

          return {
            placeId: like.placeId,
            place: processedPlace,
          };
        }),
      );

      // Filter out any failed requests
      const validLikes = likesWithPlaceDetails.filter(
        (like): like is NonNullable<typeof like> => like !== null,
      );

      return {
        user: { ...foundUser, type: "public" as const },
        isOwnProfile,
        lists: userLists,
        likes: {
          items: validLikes,
          metadata: userLikes.metadata,
        },
        totalLikes: likesCount,
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
