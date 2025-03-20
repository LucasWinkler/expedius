import { NextRequest, NextResponse } from "next/server";
import {
  PUBLIC_PATHS,
  AUTH_PATHS,
  AUTH_API_PREFIX,
  UT_API_PREFIX,
  PROTECTED_PATHS,
} from "@/constants/routes";
import { getSessionCookie } from "better-auth/cookies";

export const middleware = (req: NextRequest) => {
  const sessionCookie = getSessionCookie(req);
  const pathname = req.nextUrl.pathname;

  const isAuthenticated = !!sessionCookie;
  const isPublicRoute = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAuthApi = pathname.startsWith(AUTH_API_PREFIX);
  const isUTApi = pathname.startsWith(UT_API_PREFIX);
  const isProtectedRoute = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isAuthApi || isUTApi) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && (isProtectedRoute || !isPublicRoute)) {
    let callbackUrl = pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }

    const redirectUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/sign-in?callbackUrl=${redirectUrl}`, req.nextUrl),
    );
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
