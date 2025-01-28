import { NextResponse } from "next/server";
import { lists } from "@/server/data/lists";
import { paginationSchema } from "@/server/validations/pagination";
import { getServerSession } from "@/server/auth/session";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

interface RouteParams {
  params: Promise<{ username: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const validatedParams = routeContextSchema.parse({
      params: await params,
    });

    const { searchParams } = new URL(request.url);
    const result = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const session = await getServerSession();
    const isOwnProfile =
      session?.user.username === validatedParams.params.username;

    const paginatedLists = await lists.queries.getAllByUsername(
      validatedParams.params.username,
      isOwnProfile,
      result.data,
    );

    return NextResponse.json(paginatedLists);
  } catch (error) {
    console.error("[GET_USER_LISTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
