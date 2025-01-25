import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { userLists } from "@/server/data/userLists";
import { db } from "@/server/db";
import { userList } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { placeId } = await request.json();
    if (!placeId) {
      return new NextResponse("Place ID is required", { status: 400 });
    }

    let defaultList = await db.query.userList.findFirst({
      where: and(
        eq(userList.userId, session.user.id),
        eq(userList.isDefault, true),
      ),
    });

    if (!defaultList) {
      defaultList = await userLists.mutations.createDefault(session.user.id);
    }

    // Get current like status
    const currentLists = await userLists.queries.getAllByUserIdWithPlaces(
      session.user.id,
    );
    const isCurrentlyLiked = currentLists.some(
      (list) =>
        list.isDefault && list.places.some((p) => p.placeId === placeId),
    );

    // If currently liked, remove from likes list (unlike)
    // If not currently liked, add to likes list (like)
    const selectedLists = isCurrentlyLiked ? [] : [defaultList.id];

    await userLists.mutations.updateSelectedLists(
      session.user.id,
      placeId,
      selectedLists,
    );

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[LIKE_PLACE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
