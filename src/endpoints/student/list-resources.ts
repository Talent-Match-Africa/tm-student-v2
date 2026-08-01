import { backendJson, type BackendResult } from "@/lib/api-client";
import type { ResourceFilters } from "@/types/resources";
import type { PageResponse, Resource } from "@/types/student-self-service";

export function listResources(token: string, filters: ResourceFilters): Promise<BackendResult<PageResponse<Resource>>> {
  const query = new URLSearchParams({ page: String(filters.page), page_size: "24", ordering: filters.ordering });
  if (filters.search) query.set("search", filters.search);
  if (filters.type) query.set("type", filters.type);
  if (filters.visibility) query.set("visibility", filters.visibility);
  if (filters.createdFrom) query.set("created_from", filters.createdFrom);
  if (filters.createdTo) query.set("created_to", filters.createdTo);
  return backendJson(`/student/resources?${query}`, { accessToken: token, method: "GET" });
}
