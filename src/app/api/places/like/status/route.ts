import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { userList, listPlace } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");
    if (!placeId) {
      return new NextResponse("Place ID is required", { status: 400 });
    }

    const defaultList = await db.query.userList.findFirst({
      where: and(
        eq(userList.userId, session.user.id),
        eq(userList.isDefault, true),
      ),
      with: {
        places: {
          where: eq(listPlace.placeId, placeId),
        },
      },
    });

    const isLiked = (defaultList?.places?.length ?? 0) > 0;

    return NextResponse.json({ isLiked });
  } catch (error) {
    console.error("[GET_LIKE_STATUS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
