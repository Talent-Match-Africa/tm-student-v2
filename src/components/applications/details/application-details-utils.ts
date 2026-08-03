export function formatApplicationDetailDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-RW", { dateStyle: "long" }).format(date);
}

export function formatApplicationStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatWorkHistory(value: unknown): string[] {
  if (!value) return [];
  const entries = Array.isArray(value) ? value : [value];

  return entries
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (!entry || typeof entry !== "object") return String(entry);

      return Object.entries(entry)
        .filter(([, detail]) => detail !== null && detail !== "")
        .map(([key, detail]) => {
          const label = key
            .replaceAll("_", " ")
            .replace(/\b\w/g, (character) => character.toUpperCase());
          return `${label}: ${formatValue(detail)}`;
        })
        .join(" · ");
    })
    .filter(Boolean);
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (value && typeof value === "object") {
    return Object.values(value).map(formatValue).join(", ");
  }
  return String(value);
}
