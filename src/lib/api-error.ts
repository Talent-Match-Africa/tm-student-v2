export interface ApiErrorPayload {
  status: "error";
  code?: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface SafeApiError {
  status: number;
  code: string;
  message: string;
  errors: Record<string, string[]>;
}

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Review the highlighted information and try again.",
  401: "Your student session has expired. Sign in again to continue.",
  403: "Your account cannot perform this student action.",
  404: "The requested information is no longer available.",
  409: "This action conflicts with the latest record state.",
  413: "The selected file is larger than the supported limit.",
  422: "Review the submitted information and try again.",
  429: "Too many requests. Wait a moment, then try again.",
  500: "Talent Match could not process this request right now.",
  503: "Talent Match is temporarily unavailable. Try again shortly.",
};

export function mapApiError(payload: unknown, status: number): SafeApiError {
  const record = readRecord(payload);
  const message =
    typeof record?.message === "string" && !looksInternal(record.message)
      ? record.message
      : (FALLBACK_MESSAGES[status] ??
        "Talent Match could not complete this request.");

  return {
    status,
    code:
      typeof record?.code === "string" && record.code.trim()
        ? record.code.trim()
        : `http_${status}`,
    message,
    errors: readErrors(record?.errors),
  };
}

export function createErrorPayload(error: SafeApiError): ApiErrorPayload {
  return {
    status: "error",
    code: error.code,
    message: error.message,
    errors: error.errors,
  };
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readErrors(value: unknown): Record<string, string[]> {
  const record = readRecord(value);
  if (!record) return {};
  return Object.fromEntries(
    Object.entries(record)
      .map(([field, messages]) => [
        field,
        Array.isArray(messages)
          ? messages.filter(
              (message): message is string => typeof message === "string",
            )
          : [],
      ])
      .filter(([, messages]) => messages.length > 0),
  );
}

function looksInternal(message: string): boolean {
  return /prisma|sql|stack|database|exception|trace|localhost:\d+|node_modules/i.test(
    message,
  );
}
