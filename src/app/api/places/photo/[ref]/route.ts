import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { getPlaiceholder } from "plaiceholder";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> },
) {
  try {
    const photoRef = (await params).ref;

    if (!photoRef) {
      return new NextResponse("Photo reference required", { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get("maxWidthPx") ?? 400;
    const height = searchParams.get("maxHeightPx") ?? 400;

    const res = await fetch(
      `${env.GOOGLE_PLACES_API_BASE_URL}/${photoRef}/media?maxHeightPx=${height}&maxWidthPx=${width}`,
      {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch photo: ${res.statusText}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer);

    const contentType = res.headers.get("content-type");

    return new NextResponse(buffer, {
      headers: {
        "content-type": contentType || "image/jpeg",
        "x-blur-data": base64,
        etag: res.headers.get("etag") || crypto.randomUUID(),
      },
    });
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return new NextResponse("Failed to fetch photo", { status: 500 });
  }
}
