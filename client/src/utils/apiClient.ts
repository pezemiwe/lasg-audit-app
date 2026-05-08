const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  skipAuthRedirect?: boolean;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

function handleUnauthorized() {
  try {
    sessionStorage.removeItem("audit_user");
    localStorage.removeItem("auth_token");
  } catch {
    // storage may be unavailable (e.g., SSR, private mode)
  }
  if (typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    const isPublic =
      current.startsWith("/login") ||
      current.startsWith("/unauthorized") ||
      current === "/" ||
      current.startsWith("/public-");
    if (!isPublic) {
      window.location.replace(
        `/unauthorized?redirect=${encodeURIComponent(current)}`,
      );
    }
  }
}

export async function fetchClient<T>(
  endpoint: string,
  {
    params,
    headers,
    skipAuthRedirect,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    ...customConfig
  }: FetchOptions = {},
): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else
      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }

  const config: RequestInit = {
    ...customConfig,
    headers: { ...defaultHeaders, ...(headers as Record<string, string>) },
    signal: controller.signal,
  };

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new ApiError(0, "Request timed out or was aborted", null);
    }
    throw new ApiError(0, (err as Error).message || "Network error", null);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let errorData: { message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    if (response.status === 401 && !skipAuthRedirect) {
      handleUnauthorized();
    }

    throw new ApiError(
      response.status,
      errorData.message || response.statusText || "An API error occurred",
      errorData,
    );
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null as unknown as T;
  }

  return response.json();
}
