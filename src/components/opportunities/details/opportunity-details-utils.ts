import type { OpportunityRecord } from "@/types/opportunities";

export function formatOpportunityDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value.length === 10 ? `${value}T00:00:00.000Z` : value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : new Intl.DateTimeFormat("en-RW", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}

export function formatOpportunityLabel(value: string | null, fallback: string) {
  return value
    ? value
        .toLowerCase()
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ")
    : fallback;
}

export function opportunityLocation(opportunity: OpportunityRecord) {
  return [
    opportunity.location,
    opportunity.address.province,
    opportunity.address.district,
    opportunity.address.sector,
  ]
    .filter(Boolean)
    .join(", ");
}

export function opportunityOwnerInitials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "TM"
  );
}
