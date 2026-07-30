import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/endpoints/auth/refresh";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth-cookies";
import { getAuthAppLoginUrl, getStudentAppUrl } from "@/lib/env";
import { readTokens } from "@/lib/session-response";

const FALLBACK_PATH = "/dashboard";
const LOCAL_BASE = "https://student.local";

export async function GET(request: NextRequest) {
  const nextPath = readSafeNextPath(request.nextUrl.searchParams.get("next"));
  const refreshToken = await getRefreshToken();
  if (!refreshToken)
    return redirectToLogin(nextPath, "student_session_required");
  const result = await refreshSession(refreshToken);
  const tokens = readTokens(result.payload);
  if (!result.ok || !tokens) {
    return redirectToLogin(nextPath, "student_session_expired");
  }
  const response = NextResponse.redirect(new URL(nextPath, getStudentAppUrl()));
  setAuthCookies(response, tokens);
  return response;
}

function readSafeNextPath(value: string | null): string {
  if (!value) return FALLBACK_PATH;
  try {
    const url = new URL(value, LOCAL_BASE);
    if (
      url.origin !== LOCAL_BASE ||
      url.pathname.startsWith("/api") ||
      url.pathname === "/login"
    ) {
      return FALLBACK_PATH;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return FALLBACK_PATH;
  }
}

function redirectToLogin(nextPath: string, reason: string): NextResponse {
  const url = new URL(getAuthAppLoginUrl());
  url.searchParams.set("next", nextPath);
  url.searchParams.set("reason", reason);
  const response = NextResponse.redirect(url);
  clearAuthCookies(response);
  return response;
}
