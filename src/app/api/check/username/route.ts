import { NextResponse } from "next/server";
import { withApiLimit } from "@/server/lib/rate-limit";
import { checkUsernameAvailability } from "@/server/actions/user";

export const GET = withApiLimit(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ available: false }, { status: 400 });
    }

    const isAvailable = await checkUsernameAvailability(username);
    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}, "availability");
