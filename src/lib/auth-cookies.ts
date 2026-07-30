import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { AuthTokenPair } from "@/types/auth";
import {
  getAccessCookieName,
  getAuthCookieDomain,
  getRefreshCookieName,
  shouldUseSecureCookies,
} from "./env";

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(getAccessCookieName())?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  return (await cookies()).get(getRefreshCookieName())?.value ?? null;
}

export function setAuthCookies(
  response: NextResponse,
  tokens: AuthTokenPair,
): void {
  setCookie(
    response,
    getAccessCookieName(),
    tokens.access,
    tokens.accessExpiresAt,
  );
  setCookie(
    response,
    getRefreshCookieName(),
    tokens.refresh,
    tokens.refreshExpiresAt,
  );
}

export function clearAuthCookies(response: NextResponse): void {
  clearCookie(response, getAccessCookieName());
  clearCookie(response, getRefreshCookieName());
}

function setCookie(
  response: NextResponse,
  name: string,
  value: string,
  expiry: string,
): void {
  const expires = new Date(expiry);
  response.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    path: "/",
    domain: getAuthCookieDomain(),
    expires: Number.isNaN(expires.getTime()) ? undefined : expires,
    priority: "high",
  });
}

function clearCookie(response: NextResponse, name: string): void {
  response.cookies.set({
    name,
    value: "",
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    path: "/",
    domain: getAuthCookieDomain(),
    expires: new Date(0),
    maxAge: 0,
    priority: "high",
  });
}
