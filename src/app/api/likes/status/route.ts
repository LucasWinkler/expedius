import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { likes } from "@/server/data/likes";
import { z } from "zod";

const querySchema = z.object({
  placeIds: z.string(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = querySchema.safeParse({
      placeIds: searchParams.get("placeIds"),
    });

    if (!result.success) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const session = await getServerSession();
    if (!session) return NextResponse.json({});

    const placeIds = result.data.placeIds.split(",");
    const likedPlaces = await Promise.all(
      placeIds.map(async (placeId) => {
        const like = await likes.queries.getByPlaceId(session.user.id, placeId);
        return [placeId, !!like] as const;
      }),
    );

    return NextResponse.json(Object.fromEntries(likedPlaces));
  } catch (error) {
    console.error("[GET_LIKE_STATUSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
