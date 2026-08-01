import type {
  ApplicationFilters,
  ApplicationRouteType,
} from "@/types/applications";

const STATUSES = new Set([
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
]);

export function isApplicationRouteType(
  value: string,
): value is ApplicationRouteType {
  return value === "job-listings" || value === "internships";
}

export function parseApplicationFilters(
  query: Record<string, string | string[] | undefined>,
): ApplicationFilters {
  const status = value(query.status)?.toUpperCase() ?? null;
  const search = value(query.search);
  let appliedFrom = validDate(value(query.applied_from));
  let appliedTo = validDate(value(query.applied_to));
  if (appliedFrom && appliedTo && appliedFrom > appliedTo) {
    [appliedFrom, appliedTo] = [appliedTo, appliedFrom];
  }
  return {
    appliedFrom,
    appliedTo,
    page: boundedPage(value(query.page)),
    search: search && search.length >= 3 && search.length <= 100 ? search : null,
    status: status && STATUSES.has(status) ? status : null,
  };
}

export function buildApplicationsHref(
  type: ApplicationRouteType,
  filters: ApplicationFilters,
) {
  return `/applications/${type}?${buildApplicationQuery(filters)}`;
}

export function buildApplicationsApiHref(
  type: ApplicationRouteType,
  filters: ApplicationFilters,
) {
  return `/api/student/application-feed/${type}?${buildApplicationQuery(filters)}`;
}

export function toApplicationApiType(
  type: ApplicationRouteType,
): "jobs" | "internships" {
  return type === "job-listings" ? "jobs" : "internships";
}

export function buildApplicationQuery(filters: ApplicationFilters) {
  const query = new URLSearchParams({
    page: String(filters.page),
    page_size: "24",
  });
  if (filters.search) query.set("search", filters.search);
  if (filters.status) query.set("status", filters.status);
  if (filters.appliedFrom) query.set("applied_from", filters.appliedFrom);
  if (filters.appliedTo) query.set("applied_to", filters.appliedTo);
  return query.toString();
}

function value(input: string | string[] | undefined) {
  return typeof input === "string" && input.trim() ? input.trim() : null;
}

function boundedPage(input: string | null) {
  const page = Number(input);
  return Number.isInteger(page) && page >= 1 && page <= 100_000 ? page : 1;
}

function validDate(input: string | null) {
  if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const parsed = new Date(`${input}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === input
    ? input
    : null;
}
