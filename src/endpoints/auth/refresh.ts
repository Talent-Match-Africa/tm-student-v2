import { backendJson, type BackendResult } from "@/lib/api-client";

export interface RefreshSessionResponse {
  status: "success";
  message: string;
  tokens?: {
    access?: string;
    refresh?: string;
    accessExpiresAt?: string;
    refreshExpiresAt?: string;
  };
}

export function refreshSession(
  refreshToken: string,
): Promise<BackendResult<RefreshSessionResponse>> {
  return backendJson<RefreshSessionResponse>("/auth/refresh", {
    method: "POST",
    body: { refresh: refreshToken },
  });
}
