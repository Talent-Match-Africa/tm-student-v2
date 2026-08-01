import { backendFormData, type BackendResult } from "@/lib/api-client";
import type { StudentDocument } from "@/types/student-self-service";

export function replaceDocument(accessToken: string, documentId: string, formData: FormData): Promise<BackendResult<StudentDocument>> {
  return backendFormData(`/student/documents/${encodeURIComponent(documentId)}`, formData, accessToken, "PATCH");
}
