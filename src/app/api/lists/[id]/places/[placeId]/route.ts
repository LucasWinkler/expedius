import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { lists } from "@/server/data/lists";
import { savedPlaces } from "@/server/data/savedPlaces";

interface RouteParams {
  params: { id: string; placeId: string };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const list = await lists.queries.getById(params.id);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    if (list.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await savedPlaces.mutations.delete(params.id, params.placeId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[REMOVE_SAVED_PLACE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
