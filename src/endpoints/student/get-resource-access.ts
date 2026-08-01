import { backendJson, type BackendResult } from "@/lib/api-client";

export interface DocumentAccess {
  expires_at?: string;
  url?: string;
}

export function getResourceAccess(
  accessToken: string,
  resourceId: string,
): Promise<BackendResult<DocumentAccess>> {
  return backendJson(`/student/resources/${resourceId}/document-access`, {
    accessToken,
    method: "GET",
  });
}
