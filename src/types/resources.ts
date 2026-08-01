export type ResourceType = "DOCUMENT" | "VIDEO";
export type ResourceVisibility = "GLOBAL" | "UNIVERSITY_ONLY" | "OWNER_ONLY";
export type ResourceOrdering = "created_at" | "-created_at" | "updated_at" | "-updated_at" | "name" | "-name" | "type" | "-type" | "published_at" | "-published_at";
export interface ResourceFilters { createdFrom: string | null; createdTo: string | null; ordering: ResourceOrdering; page: number; search: string | null; type: ResourceType | null; visibility: ResourceVisibility | null }
