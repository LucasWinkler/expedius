import "server-only";

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
  async (
    query: string,
    size = 10,
    lat?: number,
    lng?: number,
  ): Promise<Place[] | null> => {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        size: size.toString(),
      });

      if (lat && lng) {
        searchParams.append("lat", lat.toString());
        searchParams.append("lng", lng.toString());
      }

      const res = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/api/places/search?${searchParams.toString()}`,

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
