import type {
  OpportunityApiType,
  OpportunityFilters,
  OpportunityRouteType,
} from "@/types/opportunities";

const VALID_STATUS = new Set(["ACTIVE", "OPEN", "UPCOMING", "CLOSED", "ALL"]);
const VALID_ORDERING = new Set([
  "-created_at",
  "created_at",
  "deadline",
  "title",
]);
const VALID_FLEXIBILITY = new Set(["REMOTE", "HYBRID", "ONSITE"]);

export function parseOpportunityFilters(
  query: Record<string, string | string[] | undefined>,
): OpportunityFilters {
  const status = value(query.status)?.toUpperCase() ?? "ACTIVE";
  const ordering = value(query.ordering) ?? "-created_at";
  const flexibility = value(query.work_flexibility)?.toUpperCase() ?? null;
  return {
    page: boundedInteger(value(query.page), 1, 100_000, 1),
    search: boundedSearch(value(query.search)),
    workFlexibility:
      flexibility && VALID_FLEXIBILITY.has(flexibility) ? flexibility : null,
    industrySector: boundedText(value(query.industry_sector), 100),
    location: boundedText(value(query.location), 100),
    status: VALID_STATUS.has(status) ? status : "ACTIVE",
    ordering: VALID_ORDERING.has(ordering) ? ordering : "-created_at",
  };
}

export function buildOpportunityQuery(filters: OpportunityFilters): string {
  const query = new URLSearchParams({
    page: String(filters.page),
    page_size: "24",
    status: filters.status,
    ordering: filters.ordering,
  });
  setOptional(query, "search", filters.search);
  setOptional(query, "work_flexibility", filters.workFlexibility);
  setOptional(query, "industry_sector", filters.industrySector);
  setOptional(query, "location", filters.location);
  return query.toString();
}

export function buildOpportunityHref(
  type: OpportunityRouteType,
  filters: OpportunityFilters,
): string {
  return `/opportunities/${type}?${buildOpportunityQuery(filters)}`;
}

export function toApiType(type: OpportunityRouteType): OpportunityApiType {
  return type === "job-listings" ? "jobs" : "internships";
}

export function isOpportunityRouteType(
  value: string,
): value is OpportunityRouteType {
  return value === "job-listings" || value === "internships";
}

function value(input: string | string[] | undefined): string | null {
  return typeof input === "string" && input.trim() ? input.trim() : null;
}

function boundedSearch(input: string | null): string | null {
  const text = boundedText(input, 100);
  return text && text.length >= 3 ? text : null;
}

function boundedText(input: string | null, max: number): string | null {
  return input && input.length <= max ? input : null;
}

function boundedInteger(
  input: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  const number = Number(input);
  return Number.isInteger(number) && number >= min && number <= max
    ? number
    : fallback;
}

function setOptional(query: URLSearchParams, key: string, value: string | null) {
  if (value) query.set(key, value);
}
