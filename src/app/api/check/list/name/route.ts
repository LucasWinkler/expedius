import { NextResponse } from "next/server";
import { lists } from "@/server/data/lists";
import { getServerSession } from "@/server/auth/session";
import { z } from "zod";
import { withApiLimit } from "@/server/lib/rate-limit";

const listNameSchema = z.object({
  name: z.string().min(1),
});

export const GET = withApiLimit(async (request: Request) => {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const result = listNameSchema.safeParse({ name });
    if (!result.success) {
      return NextResponse.json({ available: false }, { status: 400 });
    }

    const existingList = await lists.queries.getByNameAndUserId(
      result.data.name,
      session.user.id,
    );

    return NextResponse.json({ available: !existingList });
  } catch (error) {
    console.error("Error checking list name", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}, "availability");
