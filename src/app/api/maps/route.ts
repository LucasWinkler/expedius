import { env } from "@/env";
import { NextResponse } from "next/server";

/**
 * This route securely loads the Google Maps API script from the server
 * to avoid exposing the API key directly to clients.
 */
export async function GET() {
  try {
    const apiKey = env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return new NextResponse("Google Maps API key not configured", {
        status: 500,
      });
    }

    // Return a loader configuration for the Maps JavaScript API
    return NextResponse.json({
      apiKey,
      version: "weekly", // Use 'weekly' for the latest stable features
      libraries: ["places", "marker"], // Include required libraries
    });
  } catch (error) {
    console.error("Maps API error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
