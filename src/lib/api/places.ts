import { env } from "@/env";
import type { PlaceDetails } from "@/types";

const PLACE_DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "photos",
  "rating",
  "userRatingCount",
  "priceLevel",
  "currentOpeningHours",
  "websiteUri",
  "internationalPhoneNumber",
  "nationalPhoneNumber",
  "priceRange",
  "editorialSummary",
  "reviews",
  "paymentOptions",
  "parkingOptions",
  "dineIn",
  "takeout",
  "delivery",
  "curbsidePickup",
  "reservable",
  "servesBreakfast",
  "servesLunch",
  "servesDinner",
  "servesBrunch",
  "servesCoffee",
  "outdoorSeating",
  "servesWine",
  "servesBeer",
  "servesVegetarianFood",
  "types",
  "primaryTypeDisplayName",
  "location",
  "goodForWatchingSports",
  "goodForGroups",
  "goodForChildren",
  "menuForChildren",
  "servesDessert",
  "restroom",
  "liveMusic",
  "businessStatus",
  "googleMapsLinks",
  "accessibilityOptions",
  "pureServiceAreaBusiness",
  "utcOffsetMinutes",
  "allowsDogs",
].join(",");

export const getPlaceDetails = async (
  placeId: string,
): Promise<PlaceDetails> => {
  const res = await fetch(
    `${env.GOOGLE_PLACES_API_BASE_URL}/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK,
      },
    },
  );

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Too Many Requests: API quota exceeded");
    }
    throw new Error(
      `Failed to fetch place details: ${res.statusText} (${res.status})`,
    );
  }

  return res.json();
};

interface PlaceTypesResponse {
  id: string;
  primaryType?: string;
  types?: string[];
}

export async function getPlaceTypes(
  placeId: string,
): Promise<PlaceTypesResponse | null> {
  try {
    const response = await fetch(
      `${env.GOOGLE_PLACES_API_BASE_URL}/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "id,primaryType,types",
        },
      },
    );

    if (!response.ok) {
      console.error(`Error fetching place types: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch place types:", error);
    return null;
  }
}
