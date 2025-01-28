import { NextResponse } from "next/server";
import { lists } from "@/server/data/lists";
import { getServerSession } from "@/server/auth/session";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    placeId: z.string(),
  }),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ placeId: string }> },
) {
  const validatedParams = routeContextSchema.parse({
    params: await params,
  });

  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await lists.queries.getAllForPlaceCardByUserId(
      session.user.id,
      validatedParams.params.placeId,
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch lists for place:", error);
    return new NextResponse("Failed to fetch lists", { status: 500 });
  }
}
