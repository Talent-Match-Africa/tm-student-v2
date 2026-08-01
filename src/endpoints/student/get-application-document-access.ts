import { backendJson, type BackendResult } from "@/lib/api-client";
import type { DocumentAccess } from "./get-resource-access";

export function getApplicationDocumentAccess(
  accessToken: string,
  type: "internships" | "jobs",
  applicationId: string,
  field: "cover-letter" | "document",
): Promise<BackendResult<DocumentAccess>> {
  return backendJson(
    `/student/applications/${type}/${applicationId}/documents/${field}/access`,
    { accessToken, method: "GET" },
  );
}
