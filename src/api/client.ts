export type ApiEnvelope<T> = {
  resultCode?: string;
  msg?: string;
  data?: T;
};

export type ApiError = Error & {
  status?: number;
  details?: unknown;
};

const fallbackBaseUrl = "http://localhost:8080";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? fallbackBaseUrl;

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return Boolean(value && typeof value === "object" && "data" in value);
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const error = new Error(`API request failed with ${response.status}`) as ApiError;
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  if (isEnvelope<T>(payload)) {
    return payload.data as T;
  }

  return payload as T;
}
