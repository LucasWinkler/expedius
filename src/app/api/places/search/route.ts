import { NextResponse } from "next/server";
import { env } from "@/env";
import { getServerSession } from "@/server/auth/session";
import { getLikeStatuses } from "@/server/actions/like";
import { lists } from "@/server/data/lists";
import type { PlaceSearchResponse } from "@/types";
import { DbListWithPlacesCount } from "@/server/db/schema";
import { LikeStatuses } from "@/lib/api/types";

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

export async function GET(request: Request) {
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
  let placesData: PlaceSearchResponse;

  if (cachedPlaces && Date.now() - cachedPlaces.timestamp < CACHE_DURATION) {
    placesData = cachedPlaces.data;
  } else {
    try {
      const body: {
        textQuery: string;
        languageCode: string;
        pageSize: number;
        locationBias?: {
          circle: {
            center: {
              latitude: number;
              longitude: number;
            };
            radius: number;
          };
        };
      } = {
        textQuery: query,
        languageCode: "en",
        pageSize: Number(size),
      };

      if (lat && lng) {
        body.locationBias = {
          circle: {
            center: {
              latitude: Number(lat),
              longitude: Number(lng),
            },
            radius: 0,
          },
        };
      }

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

      placesData = (await res.json()) as PlaceSearchResponse;
      placesCache.set(cacheKey, { data: placesData, timestamp: Date.now() });
    } catch (error) {
      console.error("Places API error:", error);
      return new NextResponse("Failed to search places", { status: 500 });
    }
  }

  const session = await getServerSession();
  let likeStatuses: LikeStatuses = {};
  let userLists: DbListWithPlacesCount[] = [];

  const placeIds = placesData.places.map((place) => place.id);
  if (session && placeIds.length > 0) {
    likeStatuses = await getLikeStatuses(placeIds);
    const userListsResponse = await lists.queries.getAllByUserId(
      session.user.id,
      true,
      {
        page: 1,
        limit: 10,
      },
    );
    userLists = userListsResponse.items;
  }

  const responseData = {
    ...placesData,
    likeStatuses,
    userLists,
  };

  return NextResponse.json(responseData);
}
