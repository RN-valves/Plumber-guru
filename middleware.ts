import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  detectLocaleFromRequest,
  isValidLocale,
} from "@/lib/locale";

const SKIP_LOCALE_PREFIX = [
  "/api",
  "/_next",
  "/favicon.ico",
  "/auth",
  "/dashboard",
  "/admin",
  "/sitemap.xml",
  "/robots.txt",
];

function shouldSkipLocale(pathname: string): boolean {
  return SKIP_LOCALE_PREFIX.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function handleLocale(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (shouldSkipLocale(pathname)) return null;

  // Already on a locale-prefixed path — persist cookie
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isValidLocale(first)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = detectLocaleFromRequest(request);
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Localized homepage only — other routes stay unprefixed until full i18n routing
  if (locale !== DEFAULT_LOCALE && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export default withAuth(
  function middleware(request) {
    const localeResponse = handleLocale(request);
    if (localeResponse) return localeResponse;

    const token = request.nextauth.token;
    const path = request.nextUrl.pathname;

    if (
      path.startsWith("/admin") &&
      token &&
      token.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
