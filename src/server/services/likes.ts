import { LIKES_FIELD_MASK } from "@/constants/likes";
import { processPlaceThumbnail } from "./photos";
import { env } from "@/env";
import { likes } from "@/server/data/likes";

export const getLikesWithPlaceDetails = async (userId: string) => {
  const userLikes = await likes.queries.getAllByUserId(userId, {
    page: 1,
    limit: 10,
  });

  const likesWithPlaceDetails = await Promise.all(
    userLikes.items.map(async (like) => {
      const res = await fetch(
        `${env.GOOGLE_PLACES_API_BASE_URL}/places/${like.placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": LIKES_FIELD_MASK,
          },
          next: {
            revalidate: 3600,
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
      const processedPlace = await processPlaceThumbnail(placeDetails);

      return {
        placeId: like.placeId,
        place: processedPlace,
      };
    }),
  );

  const validLikesWithDetails = likesWithPlaceDetails.filter(
    (like): like is NonNullable<typeof like> => like !== null,
  );

  return validLikesWithDetails;
};
