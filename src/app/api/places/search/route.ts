import { NextResponse } from "next/server";
import { env } from "@/env";
import type { PlaceSearchResponse } from "@/types";
import { withApiLimit } from "@/server/lib/rate-limit";
import { PLACE_FILTERS } from "@/constants";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.photos",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "nextPageToken",
].join(",");

const placesCache = new Map<
  string,
  { data: PlaceSearchResponse; timestamp: number }
>();

const CACHE_DURATION = 24 * 3600000; // 24 hours

export const GET = withApiLimit(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const size = searchParams.get("size") ?? "12";
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");
  const minRating = searchParams.get("minRating");
  const openNow = searchParams.get("openNow");
  const pageToken = searchParams.get("pageToken");

  if (!query && !pageToken) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  const parsedRadius = radius ? Number(radius) : PLACE_FILTERS.RADIUS.DEFAULT;
  const validatedRadius = Math.min(
    Math.max(parsedRadius, PLACE_FILTERS.RADIUS.MIN),
    PLACE_FILTERS.RADIUS.MAX,
  );

  const parsedSize = Number(size);
  const parsedMinRating = minRating
    ? Math.min(
        Math.max(Number(minRating), PLACE_FILTERS.RATING.MIN),
        PLACE_FILTERS.RATING.MAX,
      )
    : undefined;
  const parsedOpenNow = openNow === "true" ? true : undefined;

  // Only use cache for initial queries, not for pagination
  if (!pageToken) {
    const cacheKeyParams = [
      `query:${query}`,
      `size:${parsedSize}`,
      lat && `lat:${lat}`,
      lng && `lng:${lng}`,
      `radius:${validatedRadius}`,
      ...(parsedMinRating ? [`minRating:${parsedMinRating}`] : []),
      ...(parsedOpenNow ? [`openNow:${parsedOpenNow}`] : []),
    ].filter(Boolean);
    const cacheKey = `search:${cacheKeyParams.join(":")}`;
    const cachedPlaces = placesCache.get(cacheKey);

    if (cachedPlaces && Date.now() - cachedPlaces.timestamp < CACHE_DURATION) {
      console.log("Returning cached search results");
      return NextResponse.json(cachedPlaces.data);
    }
  }

  try {
    const apiUrl = `${env.GOOGLE_PLACES_API_BASE_URL}/places:searchText`;
    const body: {
      textQuery?: string;
      languageCode?: string;
      pageSize?: number;
      minRating?: number;
      openNow?: boolean;
      locationBias?: {
        circle: {
          center: {
            latitude: number;
            longitude: number;
          };
          radius: number;
        };
      };
      pageToken?: string;
    } = {
      textQuery: query || "",
      languageCode: "en",
      pageSize: parsedSize,
    };

    if (pageToken) {
      body.pageToken = pageToken;
    }

    if (parsedMinRating) {
      body.minRating = parsedMinRating;
    }

    if (parsedOpenNow !== undefined) {
      body.openNow = parsedOpenNow;
    }

    if (lat && lng) {
      body.locationBias = {
        circle: {
          center: {
            latitude: Number(lat),
            longitude: Number(lng),
          },
          radius: validatedRadius,
        },
      };
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`Places API error: ${res.status} ${res.statusText}`);
      return new NextResponse(`Google Places API error: ${res.statusText}`, {
        status: res.status,
      });
    }

    const placesData = await res.json();

    // Only cache initial queries
    if (!pageToken) {
      const cacheKeyParams = [
        `query:${query}`,
        `size:${parsedSize}`,
        lat && `lat:${lat}`,
        lng && `lng:${lng}`,
        `radius:${validatedRadius}`,
        ...(parsedMinRating ? [`minRating:${parsedMinRating}`] : []),
        ...(parsedOpenNow ? [`openNow:${parsedOpenNow}`] : []),
      ].filter(Boolean);
      const cacheKey = `search:${cacheKeyParams.join(":")}`;
      placesCache.set(cacheKey, { data: placesData, timestamp: Date.now() });
    }

    return NextResponse.json(placesData);
  } catch (error) {
    console.error("Places API error:", error);
    return new NextResponse("Failed to search places", { status: 500 });
  }
}, "search");
