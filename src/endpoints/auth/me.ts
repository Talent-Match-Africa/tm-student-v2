import { backendJson, type BackendResult } from "@/lib/api-client";
import type { PublicAuthProfile } from "@/types/auth";

interface CurrentUserResponse {
  status: "success";
  data: PublicAuthProfile;
}

export function getCurrentUser(
  accessToken: string,
): Promise<BackendResult<CurrentUserResponse>> {
  return backendJson<CurrentUserResponse>("/auth/me", {
    accessToken,
    method: "GET",
  });
}
