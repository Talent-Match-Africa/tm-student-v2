import { backendFormData, type BackendResult } from "@/lib/api-client";
import type { ApplicationSubmissionResponse } from "@/types/applications";
import type { OpportunityApiType } from "@/types/opportunities";

export function createStudentApplication(
  accessToken: string,
  type: OpportunityApiType,
  opportunityId: string,
  formData: FormData,
): Promise<BackendResult<ApplicationSubmissionResponse>> {
  return backendFormData<ApplicationSubmissionResponse>(
    `/student/applications/${type}/opportunities/${encodeURIComponent(opportunityId)}`,
    formData,
    accessToken,
  );
}
