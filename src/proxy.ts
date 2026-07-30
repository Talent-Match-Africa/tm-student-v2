import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILE_PATTERN = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE_PATTERN.test(pathname)
  ) {
    return NextResponse.next();
  }
  const accessName = process.env.AUTH_ACCESS_COOKIE_NAME ?? "tm_access";
  const refreshName = process.env.AUTH_REFRESH_COOKIE_NAME ?? "tm_refresh";
  const hasAccess = Boolean(request.cookies.get(accessName)?.value);
  const hasRefresh = Boolean(request.cookies.get(refreshName)?.value);
  const nextPath = `${pathname}${search}`;

  if (hasAccess) return nextWithPath(request, nextPath);
  if (hasRefresh) {
    const url = new URL("/api/auth/refresh", request.nextUrl.origin);
    url.searchParams.set("next", nextPath);
    url.searchParams.set("reason", "student_session_refresh");
    return NextResponse.redirect(url);
  }
  const url = new URL(
    "/login",
    process.env.NEXT_PUBLIC_AUTH_APP_URL ?? "http://localhost:4000",
  );
  url.searchParams.set("next", nextPath);
  url.searchParams.set("reason", "student_session_required");
  return NextResponse.redirect(url);
}

function nextWithPath(request: NextRequest, nextPath: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-student-next-path", nextPath);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
