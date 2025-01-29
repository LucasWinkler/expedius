import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { likes } from "@/server/data/likes";
import { lists } from "@/server/data/lists";
import { z } from "zod";

const placeIdsSchema = z.object({
  placeIds: z.array(z.string().min(1)),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = placeIdsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [userLikes, userLists] = await Promise.all([
      likes.queries.getAllByUserId(session.user.id),
      lists.queries.getAllByUserId(session.user.id, true, {
        page: 1,
        limit: 10,
      }),
    ]);

    return NextResponse.json({
      likes: userLikes,
      lists: userLists.items,
    });
  } catch (error) {
    console.error("[USER_PLACE_DATA]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
