export function getApiInternalUrl(): string {
  return normalizeUrl(
    process.env.API_INTERNAL_URL ?? "http://localhost:3000/api",
  );
}

export function getAuthAppLoginUrl(): string {
  return `${normalizeUrl(
    process.env.NEXT_PUBLIC_AUTH_APP_URL ?? "http://localhost:4000",
  )}/login`;
}

export function getStudentAppUrl(): string {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_STUDENT_APP_URL ?? "http://localhost:4002",
  );
}

export function getAccessCookieName(): string {
  return process.env.AUTH_ACCESS_COOKIE_NAME?.trim() || "tm_access";
}

export function getRefreshCookieName(): string {
  return process.env.AUTH_REFRESH_COOKIE_NAME?.trim() || "tm_refresh";
}

export function getAuthCookieDomain(): string | undefined {
  const value = process.env.AUTH_COOKIE_DOMAIN?.trim();
  if (!value || isLocalHostname(readHostname(getStudentAppUrl()))) {
    return undefined;
  }
  return value;
}

export function shouldUseSecureCookies(): boolean {
  const value = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  return process.env.NODE_ENV === "production";
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function readHostname(value: string): string {
  try {
    return new URL(value).hostname;
  } catch {
    return "localhost";
  }
}

function isLocalHostname(hostname: string): boolean {
  return ["localhost", "127.0.0.1", "::1"].includes(hostname);
}
