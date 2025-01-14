import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (request.nextUrl.pathname === "/profile") {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.redirect(
      new URL(`/u/${session.user.username}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile"],
};
