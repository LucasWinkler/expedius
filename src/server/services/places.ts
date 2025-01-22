"server-only";

import { cache } from "react";
import { env } from "@/env";
import type { Place } from "@/types";
import { placeSearchResponseSchema } from "@/lib/validations/place";
import { getEnhancedPlacePhoto } from "./photos";

// Add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Wrap the photo fetching in a more resilient function
const processPlacePhotos = async (places: Place[]) => {
  const results = [];

  // Process photos sequentially instead of all at once
  for (const place of places) {
    try {
      if (!place.photos?.[0]) {
        results.push(place);
        continue;
      }

      const photo = await getEnhancedPlacePhoto(place.photos[0].name);
      results.push({
        ...place,
        image: photo,
      });

      await delay(100);
    } catch (error) {
      console.warn(`Failed to process photo for place ${place.id}:`, error);
      results.push(place);
    }
  }

  return results;
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

export const getPopularCityPlaces = async (userLocation?: {
  lat: number;
  lng: number;
}) => {
  // If we have user location, prioritize nearby cities
  if (userLocation) {
    // return searchNearbyPlaces(userLocation, "cities");
  }

  // Otherwise, return curated list of popular cities
  return searchPlaces("popular parks near me", 5);
};

export const getBestRatedRestaurants = async (userLocation?: {
  lat: number;
  lng: number;
}) => {
  if (userLocation) {
    // return searchNearbyPlaces(
    //   userLocation,
    //   {
    //     type: "restaurant",
    //     rankBy: "rating",
    //     minRating: 4.0,
    //   },
    //   3,
    // );
  }

  // Default to highly-rated restaurants in popular areas
  return searchPlaces("best rated restaurants near me", 5);
};

export const getPopularAttractions = async (userLocation?: {
  lat: number;
  lng: number;
}) => {
  if (userLocation) {
    // return searchNearbyPlaces(
    //   userLocation,
    //   {
    //     type: "tourist_attraction",
    //     rankBy: "rating",
    //   },
    //   3,
    // );
  }

  // Default to famous landmarks and attractions
  return searchPlaces("famous landmarks and tourist attractions near me", 5);
};

// type SearchOptions = {
//   type: string;
//   rankBy?: "rating" | "distance";
//   minRating?: number;
// };

// const searchNearbyPlaces = async (
//   location: { lat: number; lng: number },
//   options: SearchOptions,
//   limit: number = 3,
// ): Promise<Place[] | null> => {
//   try {
//     const params = new URLSearchParams({
//       location: `${location.lat},${location.lng}`,
//       type: options.type,
//       rankby: options.rankBy || "rating",
//       ...(options.minRating && { min_rating: options.minRating.toString() }),
//     });

//     const res = await fetch(
//       `${env.BETTER_AUTH_URL}/api/places/nearby?${params.toString()}`,
//       {
//         next: { revalidate: 3600 }, // 1 hour
//       },
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch nearby places");
//     }

//     const data = await res.json();
//     const validated = placeSearchResponseSchema.parse(data);
//     if (!validated.places) {
//       return null;
//     }

//     // Process photos and limit results
//     const places = await Promise.all(
//       validated.places.slice(0, limit).map(async (place) => {
//         if (!place.photos?.[0]) {
//           return place;
//         }

//         const photo = await getEnhancedPlacePhoto(place.photos[0].name);

//         return {
//           ...place,
//           image: photo,
//         };
//       }),
//     );

//     return places;
//   } catch (error) {
//     console.error("Failed to fetch nearby places:", error);
//     return null;
//   }
// };
