import type { Place, PlaceSearchResponse } from "@/types";
import { getPlacePhotoUrl } from "@/lib/place";
import { toast } from "sonner";
import { SearchFilters } from "@/hooks/useSearch";
import { LocationCoords } from "@/contexts/LocationContext";

const processPlacePhotos = async (places: Place[]): Promise<Place[]> => {
  try {
    const results = await Promise.all(
      places.map(async (place) => {
        try {
          if (!place.photos?.[0]) {
            return place;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          try {
            const photoRes = await fetch(
              getPlacePhotoUrl(place.photos[0].name),
              {
                signal: controller.signal,
              },
            );
            clearTimeout(timeoutId);

            if (!photoRes.ok) {
              console.warn(
                `Failed to fetch photo for ${place.id}: ${photoRes.status} ${photoRes.statusText}`,
              );
              return place;
            }

            const { widthPx, heightPx } = place.photos[0];

            return {
              ...place,
              image: {
                url: getPlacePhotoUrl(place.photos[0].name),
                blurDataURL: photoRes.headers.get("x-blur-data") || "",
                width: widthPx,
                height: heightPx,
              },
            };
          } catch (fetchError) {
            if (
              fetchError instanceof DOMException &&
              fetchError.name === "AbortError"
            ) {
              console.warn(`Fetch timeout for photo of place ${place.id}`);
            } else {
              console.warn(
                `Fetch error for photo of place ${place.id}:`,
                fetchError,
              );
            }
            return place;
          }
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

export async function searchPlacesClient(
  query: string,
  size: number,
  coords: LocationCoords,
  filters?: SearchFilters,
  pageToken?: string | null,
): Promise<PlaceSearchResponse | null> {
  try {
    const params: Record<string, string> = {
      q: query,
      size: size.toString(),
    };

    if (filters?.minRating) {
      params.minRating = filters.minRating.toString();
    }

    if (filters?.openNow !== undefined) {
      params.openNow = filters.openNow.toString();
    }

    if (filters?.radius) {
      params.radius = filters.radius.toString();
    }

    if (coords.latitude !== null && coords.longitude !== null) {
      params.lat = coords.latitude.toString();
      params.lng = coords.longitude.toString();
    }

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const searchParams = new URLSearchParams(params);
    const url = `/api/places/search?${searchParams.toString()}`;

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) {
        toast.error("Please wait a moment before searching again");
        return null;
      }
      console.error(`Search API error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch results: ${res.statusText}`);
    }

    const data = (await res.json()) as PlaceSearchResponse;
    if (!data.places) return null;

    const placesWithPhotos = await processPlacePhotos(data.places);
    return { ...data, places: placesWithPhotos };
  } catch (error) {
    console.error("Failed to search:", error);
    return null;
  }
}
