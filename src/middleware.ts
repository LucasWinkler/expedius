import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export const middleware = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (request.nextUrl.pathname === "/profile") {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    return NextResponse.redirect(
      new URL(`/u/${session.user.username}`, request.url),
    );
  }

  if (request.nextUrl.pathname.startsWith("/auth/") && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/profile", "/auth/:path*"],
};
