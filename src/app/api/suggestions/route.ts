import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { suggestions } from "@/server/data/suggestions";
import {
  SUGGESTION_CONTEXTS,
  type SuggestionsContext,
} from "@/lib/suggestions";

/**
 * GET /api/suggestions
 * Fetches personalized suggestions for the current user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") as SuggestionsContext;

    if (!Object.values(SUGGESTION_CONTEXTS).includes(context)) {
      return NextResponse.json({ error: "Invalid context" }, { status: 400 });
    }

    const headersList = await headers();
    const clientHour = headersList.get("X-Client-Hour");
    const timezoneOffset = headersList.get("X-Client-Timezone-Offset");

    // Create time info object with client's time if available, otherwise use server time
    const timeInfo = {
      clientHour: clientHour ? parseInt(clientHour, 10) : new Date().getHours(),
      timezoneOffset: timezoneOffset ? parseInt(timezoneOffset, 10) : 0,
    };

    const session = await getServerSession();

    return NextResponse.json(
      await suggestions.queries.getPersonalizedSuggestions(
        session?.user.id ?? null,
        context,
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
