"server-only";

import { cache } from "react";
import { env } from "@/env";
import type { Place } from "@/types";
import { placeSearchResponseSchema } from "@/lib/validations/place";
import { getEnhancedPlacePhoto } from "./photos";

const processPlacePhotos = async (places: Place[]) => {
  try {
    const results = await Promise.all(
      places.map(async (place) => {
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
      }),
    );

    return results;
  } catch (error) {
    console.error("Failed to process photos:", error);
    return places;
  }
};

export const searchPlaces = cache(
  async (query: string, size = 10): Promise<Place[] | null> => {
    try {
      const res = await fetch(
        `${env.BETTER_AUTH_URL}/api/places/search?q=${encodeURIComponent(query)}&size=${encodeURIComponent(size)}`,
        {
          next: { revalidate: 86400 }, // 24 hours
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await res.json();
      const validated = placeSearchResponseSchema.parse(data);
      if (!validated.places) {
        return null;
      }

      return processPlacePhotos(validated.places);
    } catch (error) {
      console.error(`Failed to search for ${query}:`, error);
      return null;
    }
  },
);

export const getPopularCityPlaces = () => {
  return searchPlaces("popular parks near me", 5);
};

export const getBestRatedRestaurants = () => {
  return searchPlaces("best rated restaurants near me", 5);
};

export const getPopularAttractions = () => {
  return searchPlaces("famous landmarks and tourist attractions near me", 5);
};
