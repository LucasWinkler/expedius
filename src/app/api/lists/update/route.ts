import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { userLists } from "@/server/data/userLists";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { placeId, selectedLists } = await request.json();
    if (!placeId || !Array.isArray(selectedLists)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    await userLists.mutations.updateSelectedLists(
      session.user.id,
      placeId,
      selectedLists,
    );

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_LISTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
