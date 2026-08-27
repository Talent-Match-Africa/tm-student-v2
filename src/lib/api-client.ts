import {
  createErrorPayload,
  mapApiError,
  type ApiErrorPayload,
} from "./api-error";
import { getApiInternalUrl } from "./env";

export type BackendResult<T = unknown> =
  | {
      ok: true;
      status: number;
      payload: T;
    }
  | {
      ok: false;
      status: number;
      payload: ApiErrorPayload;
    };

interface BackendJsonOptions {
  accessToken?: string | null;
  body?: unknown;
  method?: "DELETE" | "GET" | "PATCH" | "POST";
}

export async function backendJson<T = unknown>(
  path: string,
  options: BackendJsonOptions = {},
): Promise<BackendResult<T>> {
  const method =
    options.method ?? (options.body === undefined ? "GET" : "POST");
  const headers = new Headers({ Accept: "application/json" });
  if (options.body !== undefined)
    headers.set("Content-Type", "application/json");
  if (options.accessToken)
    headers.set("Authorization", `Bearer ${options.accessToken}`);

  try {
    const response = await fetch(`${getApiInternalUrl()}${path}`, {
      method,
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
    });
    return await normalizeResponse<T>(response);
  } catch {
    const error = mapApiError(null, 503);
    return {
      ok: false,
      status: 503,
      payload: createErrorPayload(error),
    };
  }
}

export async function backendFormData<T = unknown>(
  path: string,
  formData: FormData,
  accessToken: string | null,
  method: "PATCH" | "POST" = "POST",
): Promise<BackendResult<T>> {
  const headers = new Headers({ Accept: "application/json" });
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  try {
    const response = await fetch(`${getApiInternalUrl()}${path}`, {
      method,
      headers,
      body: formData,
      cache: "no-store",
    });
    return await normalizeResponse<T>(response);
  } catch {
    const error = mapApiError(null, 503);
    return {
      ok: false,
      status: 503,
      payload: createErrorPayload(error),
    };
  }
}

async function normalizeResponse<T>(
  response: Response,
): Promise<BackendResult<T>> {
  const payload = await readJson(response);
  if (!response.ok) {
    const error = mapApiError(payload, response.status);
    return {
      ok: false,
      status: response.status,
      payload: createErrorPayload(error),
    };
  }
  return { ok: true, status: response.status, payload: payload as T };
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      code: "invalid_backend_response",
      message: "Talent Match returned an unexpected response.",
    };
  }
}
