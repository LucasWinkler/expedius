import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { userLists } from "@/server/data/userLists";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lists = await userLists.queries.getAllByUserIdWithPlaces(
      session.user.id,
    );

    return NextResponse.json({ lists });
  } catch (error) {
    console.error("[GET_LISTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
