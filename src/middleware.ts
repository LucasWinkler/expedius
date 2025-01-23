import { NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";
import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

const PUBLIC_PATHS = ["/", "/discover", "/u/"] as const;
const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up"] as const;
const AUTH_API_PREFIX = "/api/auth";
const UT_API_PREFIX = "/api/uploadthing";

export const middleware = async (req: NextRequest) => {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: req.nextUrl.origin,
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    },
  );

  const isAuthenticated = !!session;
  const pathname = req.nextUrl.pathname;
  const isPublicRoute = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAuthApi = pathname.startsWith(AUTH_API_PREFIX);
  const isUTApi = pathname.startsWith(UT_API_PREFIX);

  if (isAuthApi || isUTApi) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute) {
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
