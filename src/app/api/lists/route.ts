import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { lists } from "@/server/data/lists";
import { paginationSchema } from "@/server/validations/pagination";
import { createListServerSchema } from "@/server/validations/lists";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const result = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const paginatedLists = await lists.queries.getAllByUserId(
      session.user.id,
      true,
      result.data,
    );

    return NextResponse.json(paginatedLists);
  } catch (error) {
    console.error("[GET_LISTS]", error);
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
    const result = createListServerSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const newList = await lists.mutations.create(session.user.id, result.data);
    return NextResponse.json(newList);
  } catch (error) {
    console.error("[CREATE_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
