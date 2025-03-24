import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { suggestions } from "@/server/data/suggestions";
import { headers } from "next/headers";

/**
 * GET /api/suggestions
 * Fetches personalized suggestions for the current user
 */
export async function GET() {
  try {
    // Get client timezone information from headers
    const requestHeaders = await headers();
    const clientTimezoneOffset = parseInt(
      requestHeaders.get("X-Client-Timezone-Offset") || "0",
    );
    const clientHour = parseInt(requestHeaders.get("X-Client-Hour") || "-1");

    const timeInfo = {
      timezoneOffset: clientTimezoneOffset,
      clientHour: clientHour,
    };

    const session = await getServerSession();
    const personalizedSuggestions =
      await suggestions.queries.getPersonalizedSuggestions(
        session?.user?.id || null,
        timeInfo,
      );

    return NextResponse.json(personalizedSuggestions);
  } catch (error) {
    console.error("Error in suggestions API:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
