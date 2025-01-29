import { NextResponse } from "next/server";
import { env } from "@/env";
import type { PlaceSearchResponse } from "@/types";
import { withApiLimit } from "@/server/lib/rate-limit";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.photos",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
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

  if (!query) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  const cacheKey =
    lat && lng
      ? `search:${query}:${lat}:${lng}:${size}`
      : `search:${query}:${size}`;

  const cachedPlaces = placesCache.get(cacheKey);

  if (cachedPlaces && Date.now() - cachedPlaces.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedPlaces.data);
  }

  try {
    const body = {
      textQuery: query,
      languageCode: "en",
      pageSize: Number(size),
      ...(lat && lng
        ? {
            locationBias: {
              circle: {
                center: {
                  latitude: Number(lat),
                  longitude: Number(lng),
                },
                radius: 0,
              },
            },
          }
        : {}),
    };

    const res = await fetch(
      `${env.GOOGLE_PLACES_API_BASE_URL}/places:searchText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify(body),
      },
    );

    const placesData = await res.json();
    placesCache.set(cacheKey, { data: placesData, timestamp: Date.now() });

    return NextResponse.json(placesData);
  } catch (error) {
    console.error("Places API error:", error);
    return new NextResponse("Failed to search places", { status: 500 });
  }
}, "search");
