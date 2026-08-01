import { backendJson, type BackendResult } from "@/lib/api-client";

export function deleteDocument(
  accessToken: string,
  documentId: string,
): Promise<BackendResult<unknown>> {
  return backendJson(`/student/documents/${documentId}`, {
    accessToken,
    method: "DELETE",
  });
}
