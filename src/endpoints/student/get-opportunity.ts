import { backendJson, type BackendResult } from "@/lib/api-client";
import type {
  OpportunityApiType,
  OpportunityDetailResponse,
} from "@/types/opportunities";

export function getStudentOpportunity(
  accessToken: string,
  type: OpportunityApiType,
  opportunityId: string,
): Promise<BackendResult<OpportunityDetailResponse>> {
  return backendJson<OpportunityDetailResponse>(
    `/student/opportunities/${type}/${encodeURIComponent(opportunityId)}`,
    { accessToken, method: "GET" },
  );
}
