import { NextResponse } from "next/server";
import { users } from "@/server/data/users";
import { z } from "zod";
import { withApiLimit } from "@/server/lib/rate-limit";

const usernameSchema = z.object({
  username: z.string().min(3),
});

export const GET = withApiLimit(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const result = usernameSchema.safeParse({ username });
    if (!result.success) {
      return NextResponse.json({ available: false }, { status: 400 });
    }

    const existingUser = await users.queries.getByUsername(
      result.data.username,
    );
    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}, "availability");
