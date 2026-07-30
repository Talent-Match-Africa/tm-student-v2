import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/endpoints/auth/me";
import type { PublicAuthProfile } from "@/types/auth";
import { getAccessToken, getRefreshToken } from "./auth-cookies";
import { getAuthAppLoginUrl, getStudentAppUrl } from "./env";

export interface StudentSession {
  accessToken: string;
  profile: PublicAuthProfile;
}

type Resolution =
  | { status: "authorized"; session: StudentSession }
  | { status: "expired"; canRefresh: boolean }
  | {
      status: "missing" | "refreshable" | "forbidden" | "unavailable";
    };

const resolveStudentSession = cache(async (): Promise<Resolution> => {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);
  if (!accessToken) {
    return refreshToken ? { status: "refreshable" } : { status: "missing" };
  }
  const result = await getCurrentUser(accessToken);
  if (result.status === 401) {
    return { status: "expired", canRefresh: Boolean(refreshToken) };
  }
  if (!result.ok) {
    return { status: result.status === 403 ? "forbidden" : "unavailable" };
  }
  if (result.payload.data.role !== "STUDENT") {
    return { status: "forbidden" };
  }
  return {
    status: "authorized",
    session: { accessToken, profile: result.payload.data },
  };
});

export async function requireStudentSession(
  nextPath: string,
): Promise<StudentSession> {
  const result = await resolveStudentSession();
  if (result.status === "authorized") return result.session;
  if (result.status === "refreshable") {
    redirectToRefresh(nextPath, "student_session_refresh");
  }
  if (result.status === "expired" && result.canRefresh) {
    redirectToRefresh(nextPath, "student_session_refresh");
  }
  if (result.status === "expired") {
    redirectToLogin(nextPath, "student_session_expired");
  }
  if (result.status === "forbidden") {
    redirectToLogin(nextPath, "student_required");
  }
  redirectToLogin(
    nextPath,
    result.status === "missing"
      ? "student_session_required"
      : "student_session_unavailable",
  );
}

function redirectToLogin(nextPath: string, reason: string): never {
  const url = new URL(getAuthAppLoginUrl());
  url.searchParams.set("next", nextPath);
  url.searchParams.set("reason", reason);
  redirect(url.toString());
}

function redirectToRefresh(nextPath: string, reason: string): never {
  const url = new URL("/api/auth/refresh", getStudentAppUrl());
  url.searchParams.set("next", nextPath);
  url.searchParams.set("reason", reason);
  redirect(url.toString());
}
