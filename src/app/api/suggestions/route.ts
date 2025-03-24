import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { getPlaceTypes } from "@/lib/api/places";
import { headers } from "next/headers";
import { suggestions } from "@/server/data/suggestions";

/**
 * GET /api/suggestions
 * Fetches personalized suggestions for the current user
 */
export async function GET() {
  try {
    const headersList = await headers();
    const clientHour = headersList.get("x-client-hour");
    const timezoneOffset = headersList.get("x-client-timezone-offset");

    // Create time info object with client's time if available, otherwise use server time
    const timeInfo = {
      clientHour: clientHour ? parseInt(clientHour, 10) : new Date().getHours(),
      timezoneOffset: timezoneOffset ? parseInt(timezoneOffset, 10) : 0,
    };

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        await suggestions.queries.getPersonalizedSuggestions(null, timeInfo),
        { status: 200 },
      );
    }

    // Get user's liked places
    const userLikes = await db.query.like.findMany({
      where: (like, { eq }) => eq(like.userId, session.user.id),
    });

    // Get place types for each liked place
    const placeTypes = await Promise.all(
      userLikes.map(async (like) => {
        const types = await getPlaceTypes(like.placeId);
        return types ? { placeId: like.placeId, ...types } : null;
      }),
    );

    // Filter out nulls
    placeTypes.filter(
      (types): types is NonNullable<typeof types> => types !== null,
    );

    return NextResponse.json(
      await suggestions.queries.getPersonalizedSuggestions(
        session.user.id,
        timeInfo,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
