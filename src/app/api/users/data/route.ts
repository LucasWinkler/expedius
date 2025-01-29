import { getServerSession } from "@/server/auth/session";
import { NextResponse } from "next/server";
import { users } from "@/server/data/users";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userData = await users.queries.getPlaceData(session.user.id);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("[USER_DATA]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
