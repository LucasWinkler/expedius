import { NextResponse } from "next/server";
import { env } from "@/env";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  try {
    const photoRef = decodeURIComponent((await params).ref);

    const res = await fetch(
      `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=400&maxWidthPx=400`,
      {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Photo API error:", error);
    return new NextResponse("Failed to fetch image", { status: 500 });
  }
}
