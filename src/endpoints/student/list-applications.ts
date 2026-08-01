import { backendJson, type BackendResult } from "@/lib/api-client";
import type { ApplicationFilters } from "@/types/applications";
import type {
  PageResponse,
  StudentApplication,
} from "@/types/student-self-service";
import { buildApplicationQuery } from "./application-query";

export function listApplications(
  token: string,
  type: "jobs" | "internships",
  filters: ApplicationFilters,
): Promise<BackendResult<PageResponse<StudentApplication>>> {
  return backendJson(
    `/student/applications/${type}?${buildApplicationQuery(filters)}`,
    { accessToken: token, method: "GET" },
  );
}
