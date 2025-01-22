import { NextResponse } from "next/server";
import { env } from "@/env";
import type { PlaceSearchResponse } from "@/types";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.photos",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
].join(",");

const cache = new Map<
  string,
  {
    data: PlaceSearchResponse;
    timestamp: number;
  }
>();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const size = searchParams.get("size") ?? 10;
  if (!query) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  const cacheKey = `search:${query}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `${env.GOOGLE_PLACES_API_BASE_URL}/places:searchText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "en",
          pageSize: size,
        }),
      },
    );

    const data = (await res.json()) as PlaceSearchResponse;
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Places API error:", error);
    return new NextResponse("Failed to search places", { status: 500 });
  }
}
