import { NextResponse } from "next/server";
import type { AuthTokenPair } from "@/types/auth";
import type { BackendResult } from "./api-client";
import { setAuthCookies } from "./auth-cookies";

export function createBackendJsonResponse<T>(
  result: BackendResult<T>,
  tokens?: AuthTokenPair | null,
): NextResponse {
  const response = NextResponse.json(result.payload, {
    status: result.status,
    headers: { "Cache-Control": "private, no-store" },
  });
  if (tokens) setAuthCookies(response, tokens);
  return response;
}

export function readTokens(value: unknown): AuthTokenPair | null {
  if (!isRecord(value) || !isRecord(value.tokens)) return null;
  const record = value.tokens;
  if (
    typeof record.access === "string" &&
    typeof record.refresh === "string" &&
    typeof record.accessExpiresAt === "string" &&
    typeof record.refreshExpiresAt === "string"
  ) {
    return {
      access: record.access,
      refresh: record.refresh,
      accessExpiresAt: record.accessExpiresAt,
      refreshExpiresAt: record.refreshExpiresAt,
    };
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
