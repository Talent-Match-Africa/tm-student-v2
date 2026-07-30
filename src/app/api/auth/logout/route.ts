import { NextResponse } from "next/server";
import { logout } from "@/endpoints/auth/logout";
import { refreshSession } from "@/endpoints/auth/refresh";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from "@/lib/auth-cookies";
import { readTokens } from "@/lib/session-response";

export async function POST() {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);
  if (accessToken) {
    const result = await logout(accessToken);
    if (!result.ok && refreshToken) await revokeWithRefresh(refreshToken);
  } else if (refreshToken) {
    await revokeWithRefresh(refreshToken);
  }
  const response = NextResponse.json(
    { status: "success", message: "Logged out successfully." },
    {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
  clearAuthCookies(response);
  return response;
}

async function revokeWithRefresh(refreshToken: string) {
  const refreshed = await refreshSession(refreshToken);
  const tokens = readTokens(refreshed.payload);
  if (refreshed.ok && tokens) await logout(tokens.access);
}
