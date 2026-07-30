import { backendJson, type BackendResult } from "@/lib/api-client";

export function logout(accessToken: string): Promise<BackendResult<unknown>> {
  return backendJson("/auth/logout", { accessToken, method: "POST" });
}
