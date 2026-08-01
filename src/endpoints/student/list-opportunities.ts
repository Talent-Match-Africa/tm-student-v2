import { backendJson, type BackendResult } from "@/lib/api-client";
import type {
  OpportunityApiType,
  OpportunityFilters,
  OpportunityListResponse,
} from "@/types/opportunities";
import { buildOpportunityQuery } from "./opportunity-query";

export function listStudentOpportunities(
  accessToken: string,
  type: OpportunityApiType,
  filters: OpportunityFilters,
): Promise<BackendResult<OpportunityListResponse>> {
  return backendJson<OpportunityListResponse>(
    `/student/opportunities/${type}?${buildOpportunityQuery(filters)}`,
    { accessToken, method: "GET" },
  );
}
