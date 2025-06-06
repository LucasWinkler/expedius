import { NextResponse } from "next/server";
import { env } from "@/env";
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
  "places.location",
  "nextPageToken",
].join(",");

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

  const parsedSize = Number(size);
  const parsedRadius = radius ? Number(radius) : PLACE_FILTERS.RADIUS.DEFAULT;
  const validatedRadius = Math.min(
    Math.max(parsedRadius, PLACE_FILTERS.RADIUS.MIN),
    PLACE_FILTERS.RADIUS.MAX,
  );
  const parsedMinRating = minRating
    ? Math.min(
        Math.max(Number(minRating), PLACE_FILTERS.RATING.MIN),
        PLACE_FILTERS.RATING.MAX,
      )
    : undefined;
  const parsedOpenNow = openNow === "true" ? true : undefined;

  try {
    const body = {
      textQuery: query || "",
      languageCode: "en",
      pageSize: parsedSize,
      ...(pageToken && { pageToken }),
      ...(parsedMinRating && { minRating: parsedMinRating }),
      ...(parsedOpenNow !== undefined && { openNow: parsedOpenNow }),
      ...(lat &&
        lng && {
          locationBias: {
            circle: {
              center: {
                latitude: Number(lat),
                longitude: Number(lng),
              },
              radius: validatedRadius,
            },
          },
        }),
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

    if (!res.ok) {
      console.error(`Places API error: ${res.status} ${res.statusText}`);
      return new NextResponse(`Google Places API error: ${res.statusText}`, {
        status: res.status,
      });
    }

    const placesData = await res.json();
    return NextResponse.json(placesData);
  } catch (error) {
    console.error("Places API error:", error);
    return new NextResponse("Failed to search places", { status: 500 });
  }
}, "search");
