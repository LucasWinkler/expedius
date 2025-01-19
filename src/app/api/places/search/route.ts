import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { env } from "@/env";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.photos",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
].join(",");

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
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
        }),
      },
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Places API error:", error);
    return new NextResponse("Failed to search places", { status: 500 });
  }
}
