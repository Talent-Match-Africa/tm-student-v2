export interface CounselorFilters { page: number; search: string | null }

export function parseCounselorFilters(query: Record<string, string | string[] | undefined>): CounselorFilters {
  const pageValue = read(query.page); const page = Number(pageValue); const search = read(query.search);
  return { page: Number.isSafeInteger(page) && page > 0 && page <= 100_000 ? page : 1, search: search && search.length >= 3 && search.length <= 100 ? search : null };
}

export function buildCounselorsHref(filters: CounselorFilters) {
  const query = new URLSearchParams({ page: String(filters.page) }); if (filters.search) query.set("search", filters.search); return `/counselors?${query}`;
}

export function counselorInitials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "TM"; }
export function formatCounselorDate(value: string) { return new Intl.DateTimeFormat("en-RW", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)); }
export function readCounselorError(payload: unknown) { return typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string" ? payload.message : "Counselors could not be loaded right now."; }
function read(value: string | string[] | undefined) { const result = Array.isArray(value) ? value[0] : value; return result?.trim() || null; }
