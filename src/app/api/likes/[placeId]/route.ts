import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { checkLikeStatus } from "@/server/actions/like";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    placeId: z.string().min(1),
  }),
});

export async function GET(
  request: Request,
  context: { params: { placeId: string } },
) {
  try {
    const { params } = routeContextSchema.parse(context);

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ isLiked: false });
    }

    const isLiked = await checkLikeStatus(params.placeId);
    return NextResponse.json({ isLiked });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[GET_LIKE_STATUS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
