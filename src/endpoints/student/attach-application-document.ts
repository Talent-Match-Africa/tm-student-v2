import { backendFormData, type BackendResult } from "@/lib/api-client";
import type { ApplicationSubmissionResponse } from "@/types/applications";
import type { OpportunityApiType } from "@/types/opportunities";

export function attachApplicationDocument(
  accessToken: string,
  type: OpportunityApiType,
  applicationId: string,
  formData: FormData,
): Promise<BackendResult<ApplicationSubmissionResponse>> {
  return backendFormData<ApplicationSubmissionResponse>(
    `/student/applications/${type}/${encodeURIComponent(applicationId)}/document`,
    formData,
    accessToken,
    "PATCH",
  );
}
