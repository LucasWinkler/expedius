import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { likes } from "@/server/data/likes";
import { toggleLikeSchema } from "@/server/validations/likes";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const result = toggleLikeSchema.safeParse({
      placeId: searchParams.get("placeId"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const like = await likes.queries.getByPlaceId(
      session.user.id,
      result.data.placeId,
    );
    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    console.error("[GET_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const result = toggleLikeSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const response = await likes.mutations.toggle(
      session.user.id,
      result.data.placeId,
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("[TOGGLE_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
