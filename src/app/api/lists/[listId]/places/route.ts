import { NextResponse } from "next/server";
import { savedPlaces } from "@/server/data/savedPlaces";
import { paginationSchema } from "@/server/validations/pagination";
import { z } from "zod";
import { env } from "@/env";
import { lists } from "@/server/data/lists";
import { getEnhancedPlacePhoto } from "@/server/services/photos";
import type { Place } from "@/types";
import type { SavedPlacesResponse } from "@/lib/api/types";

const routeContextSchema = z.object({
  params: z.object({
    listId: z.string(),
  }),
});

const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "photos",
  "rating",
  "userRatingCount",
  "priceLevel",
].join(",");

interface RouteParams {
  params: Promise<{ listId: string }>;
}

const processPlacePhotos = async (place: Place): Promise<Place> => {
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
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const validatedParams = routeContextSchema.parse({
      params: await params,
    });

    const { searchParams } = new URL(request.url);
    const result = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const list = await lists.queries.getById(validatedParams.params.listId);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    const paginatedSavedPlaces = await savedPlaces.queries.getByListId(
      list.id,
      result.data,
    );

    const savedPlacesWithDetails = await Promise.all(
      paginatedSavedPlaces.items.map(async (savedPlace) => {
        const res = await fetch(
          `${env.GOOGLE_PLACES_API_BASE_URL}/places/${savedPlace.placeId}`,
          {
            headers: {
              "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
              "X-Goog-FieldMask": FIELD_MASK,
            },
          },
        );

        if (!res.ok) {
          console.error(
            `Failed to fetch place details for ${savedPlace.placeId}:`,
            await res.text(),
          );
          return null;
        }

        const placeDetails = await res.json();
        const processedPlace = await processPlacePhotos(placeDetails);

        return {
          id: savedPlace.id,
          listId: savedPlace.listId,
          placeId: savedPlace.placeId,
          createdAt: savedPlace.createdAt,
          updatedAt: savedPlace.updatedAt,
          place: processedPlace,
        };
      }),
    );

    const validSavedPlaces = savedPlacesWithDetails.filter(
      (savedPlace): savedPlace is NonNullable<typeof savedPlace> =>
        savedPlace !== null,
    );

    const response: SavedPlacesResponse = {
      items: validSavedPlaces,
      metadata: paginatedSavedPlaces.metadata,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET_LIST_PLACES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
