import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { likes } from "@/server/data/likes";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userLikes = await likes.queries.getAllByUserId(session.user.id);
    return NextResponse.json({ likes: userLikes });
  } catch (error) {
    console.error("[GET_USER_LIKES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
