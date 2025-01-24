import { NextResponse } from "next/server";
import userLists from "@/server/data/userLists";
import { getServerSession } from "@/server/auth/session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return NextResponse.json({ lists: [] });
    }

    const lists = await userLists.queries.getAllByUserIdWithPlaces(
      session.user.id,
    );
    return NextResponse.json({ lists });
  } catch (error) {
    console.error("Failed to fetch user lists:", error);
    return NextResponse.json({ lists: [] });
  }
}
