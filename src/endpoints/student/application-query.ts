import type { ApplicationFilters, ApplicationRouteType } from "@/types/applications";

const STATUSES = new Set([
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
]);

export function isApplicationRouteType(value: string): value is ApplicationRouteType {
  return value === "job-listings" || value === "internships";
}

export function parseApplicationFilters(
  query: Record<string, string | string[] | undefined>,
): ApplicationFilters {
  const status = value(query.status)?.toUpperCase() ?? null;
  const search = value(query.search);
  return {
    page: boundedPage(value(query.page)),
    search: search && search.length >= 3 && search.length <= 100 ? search : null,
    status: status && STATUSES.has(status) ? status : null,
  };
}

export function buildApplicationsHref(type: ApplicationRouteType, filters: ApplicationFilters) {
  return `/applications/${type}?${buildQuery(filters)}`;
}

export function buildApplicationsApiHref(type: ApplicationRouteType, filters: ApplicationFilters) {
  return `/api/student/application-feed/${type}?${buildQuery(filters)}`;
}

export function toApplicationApiType(type: ApplicationRouteType): "jobs" | "internships" {
  return type === "job-listings" ? "jobs" : "internships";
}

function buildQuery(filters: ApplicationFilters) {
  const query = new URLSearchParams({ page: String(filters.page), page_size: "24" });
  if (filters.search) query.set("search", filters.search);
  if (filters.status) query.set("status", filters.status);
  return query.toString();
}

function value(input: string | string[] | undefined) {
  return typeof input === "string" && input.trim() ? input.trim() : null;
}

function boundedPage(input: string | null) {
  const page = Number(input);
  return Number.isInteger(page) && page >= 1 && page <= 100_000 ? page : 1;
}
