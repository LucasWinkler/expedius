import { NextResponse } from "next/server";
import { lists } from "@/server/data/lists";
import { paginationSchema } from "@/server/validations/pagination";
import { getServerSession } from "@/server/auth/session";

interface RouteParams {
  params: { username: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { username } = await params;

    const { searchParams } = new URL(request.url);
    const result = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const session = await getServerSession();
    const isOwnProfile = session?.user.username === username;

    const paginatedLists = await lists.queries.getAllByUsername(
      username,
      isOwnProfile,
      result.data,
    );

    return NextResponse.json(paginatedLists);
  } catch (error) {
    console.error("[GET_USER_LISTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
