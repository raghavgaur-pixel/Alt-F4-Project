import { apiBaseUrl } from "@/lib/constants";

type HttpMethod = "GET" | "POST";

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: BodyInit | null;
    headers?: HeadersInit;
    token?: string | null;
  } = {}
): Promise<T> {
  const baseUrl = apiBaseUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:4000");
  const requestUrl = `${baseUrl}${path}`;
  const response = await fetch(requestUrl, {
    method: options.method ?? "GET",
    body: options.body,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    }
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  if (!Object.prototype.hasOwnProperty.call(payload, "data") || typeof payload.data === "undefined") {
    throw new Error(`Invalid API response from ${requestUrl}`);
  }

  return payload.data as T;
}

