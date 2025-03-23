import { env } from "@/env";
import type { PlaceDetails } from "@/types";
import { cache } from "react";

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
  "menuForChildren",
  "servesDessert",
  "restroom",
  "liveMusic",
  "businessStatus",
  "googleMapsLinks",
  "accessibilityOptions",
  "pureServiceAreaBusiness",
  "utcOffsetMinutes",
].join(",");

export const getPlaceDetails = cache(
  async (placeId: string): Promise<PlaceDetails> => {
    const res = await fetch(
      `${env.GOOGLE_PLACES_API_BASE_URL}/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK,
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch place details: ${res.statusText}`);
    }

    return res.json();
  },
);
