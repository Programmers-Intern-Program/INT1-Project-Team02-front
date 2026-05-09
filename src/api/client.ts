import { isDiscordActivityEnvironment } from "../lib/discord/environment";

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

function configuredBaseUrl() {
  const webBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? fallbackBaseUrl;
  const activityBaseUrl = import.meta.env.VITE_ACTIVITY_API_BASE_URL?.replace(/\/$/, "");

  if (isDiscordActivityEnvironment() && activityBaseUrl) {
    return activityBaseUrl;
  }

  return webBaseUrl;
}

export const apiBaseUrl = configuredBaseUrl();

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
