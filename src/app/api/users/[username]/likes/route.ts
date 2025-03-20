import { NextResponse } from "next/server";
import { likes } from "@/server/data/likes";
import { paginationSchema } from "@/server/validations/pagination";
import { z } from "zod";
import { env } from "@/env";
import { users } from "@/server/data/users";
import { getEnhancedPlacePhoto } from "@/server/services/photos";
import type { Place } from "@/types";
import { usernameSchema } from "@/lib/validations";

const routeContextSchema = z.object({
  params: z.object({
    username: usernameSchema,
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
  params: Promise<{ username: string }>;
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

    const user = await users.queries.getByUsername(
      validatedParams.params.username,
    );
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const paginatedLikes = await likes.queries.getAllByUserId(
      user.id,
      result.data,
    );

    const likesWithPlaceDetails = await Promise.all(
      paginatedLikes.items.map(async (like) => {
        const res = await fetch(
          `${env.GOOGLE_PLACES_API_BASE_URL}/places/${like.placeId}`,
          {
            headers: {
              "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
              "X-Goog-FieldMask": FIELD_MASK,
            },
            next: {
              revalidate: 3600, // Cache for 1 hour
            },
          },
        );

        if (!res.ok) {
          console.error(
            `Failed to fetch place details for ${like.placeId}:`,
            await res.text(),
          );
          return null;
        }

        const placeDetails = await res.json();
        const processedPlace = await processPlacePhotos(placeDetails);

        return {
          placeId: like.placeId,
          place: processedPlace,
        };
      }),
    );

    const validLikes = likesWithPlaceDetails.filter(
      (like): like is NonNullable<typeof like> => like !== null,
    );

    return NextResponse.json({
      items: validLikes,
      metadata: paginatedLikes.metadata,
    });
  } catch (error) {
    console.error("[GET_USER_LIKES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
