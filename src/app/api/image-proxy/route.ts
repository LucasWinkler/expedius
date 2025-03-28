import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("URL parameter required", { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse("Failed to fetch image", { status: res.status });
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    const isGooglePlacesImage =
      url.includes("places.googleapis.com") ||
      url.includes("googleusercontent.com");

    return new NextResponse(buffer, {
      headers: {
        "content-type": res.headers.get("content-type") || "image/jpeg",
        "cache-control": isGooglePlacesImage
          ? "no-store, no-cache, must-revalidate, proxy-revalidate"
          : "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Failed to process image", { status: 500 });
  }
}
