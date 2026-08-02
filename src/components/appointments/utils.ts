export type AppointmentScheduleScope = "UPCOMING" | "PAST";
export type AppointmentOrdering =
  | "-created_at"
  | "created_at"
  | "date"
  | "-date"
  | "counselor_name"
  | "status";

export interface AppointmentFilters {
  dateFrom: string | null;
  dateTo: string | null;
  ordering: AppointmentOrdering;
  page: number;
  scheduleScope: AppointmentScheduleScope | null;
  search: string | null;
  status: string | null;
}

const STATUSES = new Set(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);
const ORDERING = new Set<AppointmentOrdering>([
  "-created_at",
  "created_at",
  "date",
  "-date",
  "counselor_name",
  "status",
]);

export function parseAppointmentFilters(
  query: Record<string, string | string[] | undefined>,
): AppointmentFilters {
  const page = Number(read(query.page));
  const status = read(query.status)?.toUpperCase() ?? null;
  const rawScope = read(query.schedule_scope)?.toUpperCase();
  const legacyUpcoming = ["true", "1"].includes(
    read(query.upcoming)?.toLowerCase() ?? "",
  );
  const scheduleScope =
    rawScope === "UPCOMING" || rawScope === "PAST"
      ? rawScope
      : legacyUpcoming
        ? "UPCOMING"
        : null;
  const rawOrdering = read(query.ordering) ?? "-created_at";
  let dateFrom = validDate(read(query.date_from));
  let dateTo = validDate(read(query.date_to));
  if (dateFrom && dateTo && dateFrom > dateTo) {
    [dateFrom, dateTo] = [dateTo, dateFrom];
  }
  const search = read(query.search);
  return {
    dateFrom,
    dateTo,
    ordering: ORDERING.has(rawOrdering as AppointmentOrdering)
      ? (rawOrdering as AppointmentOrdering)
      : "-created_at",
    page:
      Number.isSafeInteger(page) && page > 0 && page <= 100_000 ? page : 1,
    scheduleScope,
    search: search && search.length >= 3 && search.length <= 100 ? search : null,
    status: status && STATUSES.has(status) ? status : null,
  };
}

export function buildAppointmentsQuery(filters: AppointmentFilters) {
  const query = new URLSearchParams({
    ordering: filters.ordering,
    page: String(filters.page),
    page_size: "20",
  });
  set(query, "date_from", filters.dateFrom);
  set(query, "date_to", filters.dateTo);
  set(query, "schedule_scope", filters.scheduleScope);
  set(query, "search", filters.search);
  set(query, "status", filters.status);
  return query.toString();
}

export function buildAppointmentsHref(filters: AppointmentFilters) {
  return `/appointments?${buildAppointmentsQuery(filters)}`;
}

export function hasAppointmentFilters(filters: AppointmentFilters) {
  return Boolean(
    filters.dateFrom ||
    filters.dateTo ||
    filters.scheduleScope ||
    filters.search ||
    filters.status ||
    filters.ordering !== "-created_at",
  );
}

export function formatAppointmentDate(value: string) {
  return new Intl.DateTimeFormat("en-RW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatAppointmentTime(value: string) {
  return new Intl.DateTimeFormat("en-RW", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  }).format(new Date(value));
}

export function readAppointmentError(payload: unknown) {
  return typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
    ? payload.message
    : "Appointments could not be loaded right now.";
}

function validDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
    ? value
    : null;
}

function set(query: URLSearchParams, key: string, value: string | null) {
  if (value) query.set(key, value);
}

function read(value: string | string[] | undefined) {
  const result = Array.isArray(value) ? value[0] : value;
  return result?.trim() || null;
}
