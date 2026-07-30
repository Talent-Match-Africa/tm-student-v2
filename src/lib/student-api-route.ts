import { NextResponse } from "next/server";
import { refreshSession } from "@/endpoints/auth/refresh";
import type { AuthTokenPair } from "@/types/auth";
import type { BackendResult } from "./api-client";
import { createErrorPayload, mapApiError } from "./api-error";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from "./auth-cookies";
import { createBackendJsonResponse, readTokens } from "./session-response";

type BackendRequest<T> = (accessToken: string) => Promise<BackendResult<T>>;

export async function createAuthenticatedBackendResponse<T>(
  request: BackendRequest<T>,
): Promise<NextResponse> {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);
  if (accessToken) {
    const result = await request(accessToken);
    if (result.status !== 401) return createBackendJsonResponse(result);
    if (!refreshToken) {
      const response = createBackendJsonResponse(result);
      clearAuthCookies(response);
      return response;
    }
  }
  if (!refreshToken) return missingSession();
  const refreshed = await refreshSession(refreshToken);
  const tokens = readTokens(refreshed.payload);
  if (!refreshed.ok || !tokens) return expiredSession();
  return retry(request, tokens);
}

async function retry<T>(
  request: BackendRequest<T>,
  tokens: AuthTokenPair,
): Promise<NextResponse> {
  const result = await request(tokens.access);
  if (result.status === 401) {
    const response = createBackendJsonResponse(result);
    clearAuthCookies(response);
    return response;
  }
  return createBackendJsonResponse(result, tokens);
}

function missingSession(): NextResponse {
  const error = mapApiError(null, 401);
  return NextResponse.json(createErrorPayload(error), {
    status: 401,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function expiredSession(): NextResponse {
  const error = mapApiError(
    { message: "Your student session has expired. Sign in again." },
    401,
  );
  const response = NextResponse.json(createErrorPayload(error), {
    status: 401,
    headers: { "Cache-Control": "private, no-store" },
  });
  clearAuthCookies(response);
  return response;
}
