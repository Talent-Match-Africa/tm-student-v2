import type { ApiErrorPayload } from "@/lib/api-error";

export type StudentProfileFieldErrors = Record<string, string>;
export interface StudentProfileRequestResult<T> {
  ok: boolean;
  payload: T | ApiErrorPayload | null;
  status: number;
  transportError: string | null;
}

export async function requestStudentProfile<T>(input: string, init: RequestInit): Promise<StudentProfileRequestResult<T>> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return { ok: response.ok, payload: await readPayload<T>(response), status: response.status, transportError: null };
  } catch (error) {
    return { ok: false, payload: null, status: 0, transportError: error instanceof DOMException && error.name === "AbortError" ? "Talent Match could not confirm the result in time." : "Talent Match could not connect to the server." };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function validateIdentity(firstname: string, lastname: string, username: string): StudentProfileFieldErrors {
  const errors: StudentProfileFieldErrors = {};
  if (!firstname.trim() || firstname.trim().length > 150) errors.firstname = "Enter a valid first name.";
  if (!lastname.trim() || lastname.trim().length > 150) errors.lastname = "Enter a valid last name.";
  if (!/^[a-z0-9][a-z0-9._-]{2,49}$/.test(username.trim().toLowerCase())) errors.username = "Use 3-50 lowercase letters, numbers, dots, underscores, or hyphens.";
  return errors;
}

export function validateEmailChange(email: string, password: string, currentEmail: string): StudentProfileFieldErrors {
  const errors: StudentProfileFieldErrors = {};
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) errors.new_email = "Enter a valid email address.";
  else if (normalized === currentEmail.trim().toLowerCase()) errors.new_email = "Enter an email different from your current address.";
  if (!password) errors.current_password = "Enter your current password.";
  return errors;
}

export function validatePasswordChange(current: string, next: string, confirm: string): StudentProfileFieldErrors {
  const errors: StudentProfileFieldErrors = {};
  if (!current) errors.current_password = "Enter your current password.";
  if (getPasswordRequirements(next).some((item) => !item.met)) errors.new_password = "Use 8+ characters with uppercase, lowercase, a number, and a symbol.";
  if (next !== confirm) errors.confirm_password = "Passwords do not match.";
  if (next && next === current) errors.new_password = "Choose a different password.";
  return errors;
}

export function getPasswordRequirements(password: string) {
  return [
    { key: "length", label: "At least 8 characters", met: password.length >= 8 },
    { key: "uppercase", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { key: "lowercase", label: "One lowercase letter", met: /[a-z]/.test(password) },
    { key: "number", label: "One number", met: /\d/.test(password) },
    { key: "symbol", label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function readFieldErrors(payload: unknown): StudentProfileFieldErrors {
  if (!payload || typeof payload !== "object" || !("errors" in payload)) return {};
  const errors = (payload as { errors?: Record<string, string[]> }).errors ?? {};
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value[0] ?? ""]));
}

export function readStudentProfileError(payload: unknown): string | null {
  return payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string" ? payload.message : null;
}

export function isSuccessfulMutation<T extends object>(payload: unknown): payload is T & { message: string; status: "success" } {
  return Boolean(payload && typeof payload === "object" && "status" in payload && payload.status === "success" && "message" in payload && typeof payload.message === "string" && "data" in payload);
}

export function formatEmailChangeExpiry(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "soon" : new Intl.DateTimeFormat("en-RW", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function profileSubmitLabel(step: number): string {
  return ["Save profile", "Save education", "Send verification", "Change password"][step] ?? "Save";
}

export function profileSavingLabel(step: number): string {
  return ["Saving profile", "Saving education", "Sending verification", "Changing password"][step] ?? "Saving";
}

async function readPayload<T>(response: Response): Promise<T | ApiErrorPayload | null> {
  try { return (await response.json()) as T | ApiErrorPayload; } catch { return null; }
}
