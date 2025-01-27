import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { lists } from "@/server/data/lists";
import { savedPlaces } from "@/server/data/savedPlaces";
import { saveToListSchema } from "@/server/validations/savedPlaces";
import { paginationSchema } from "@/server/validations/pagination";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const list = await lists.queries.getById(params.id);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    if (!list.isPublic && list.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const result = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const paginatedPlaces = await savedPlaces.queries.getByListId(
      params.id,
      result.data,
    );

    return NextResponse.json(paginatedPlaces);
  } catch (error) {
    console.error("[GET_SAVED_PLACES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
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

    const body = await request.json();
    const result = saveToListSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const savedPlace = await savedPlaces.mutations.create({
      listId: params.id,
      placeId: result.data.placeId,
    });

    return NextResponse.json(savedPlace);
  } catch (error) {
    console.error("[SAVE_PLACE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
