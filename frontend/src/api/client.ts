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
  const response = await fetch(`${apiBaseUrl}${path}`, {
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

  return payload.data as T;
}

