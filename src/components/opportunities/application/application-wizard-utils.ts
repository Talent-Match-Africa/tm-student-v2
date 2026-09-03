export const APPLICATION_FILE_ACCEPT = ".pdf,application/pdf";

export const APPLICATION_WIZARD_STEPS = [
  { label: "Review fit", description: "Confirm the opportunity" },
  { label: "Your story", description: "Add supporting context" },
  { label: "Documents", description: "Review and submit" },
] as const;

const SUPPORTED_APPLICATION_FILE_TYPES = new Set(["application/pdf"]);

export function applicationFileIsValid(file: File) {
  return (
    file.size > 0 &&
    file.size <= 10 * 1024 * 1024 &&
    SUPPORTED_APPLICATION_FILE_TYPES.has(file.type)
  );
}

export function formatApplicationDate(value: string | null) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not specified"
    : new Intl.DateTimeFormat("en-RW", { dateStyle: "medium" }).format(date);
}

export function formatApplicationFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
