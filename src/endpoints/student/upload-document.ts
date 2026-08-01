import { backendFormData, type BackendResult } from "@/lib/api-client";
import type { StudentDocument } from "@/types/student-self-service";

export function uploadDocument(
  accessToken: string,
  formData: FormData,
): Promise<BackendResult<StudentDocument>> {
  return backendFormData("/student/documents", formData, accessToken);
}
