import { NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { lists } from "@/server/data/lists";
import { z } from "zod";
import { updateListServerSchema } from "@/server/validations/lists";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const validatedParams = routeContextSchema.parse({
      params: await params,
    });

    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const list = await lists.queries.getById(validatedParams.params.id);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    if (list.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("[GET_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const validatedParams = routeContextSchema.parse({
      params: await params,
    });

    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const result = updateListServerSchema.safeParse(body);
    if (!result.success) {
      return new NextResponse(result.error.message, { status: 400 });
    }

    const list = await lists.queries.getById(validatedParams.params.id);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    if (list.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedList = await lists.mutations.update(
      validatedParams.params.id,
      result.data,
    );
    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("[UPDATE_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const validatedParams = routeContextSchema.parse({
      params: await params,
    });

    const list = await lists.queries.getById(validatedParams.params.id);
    if (!list) {
      return new NextResponse("List not found", { status: 404 });
    }

    if (list.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await lists.mutations.delete(validatedParams.params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
