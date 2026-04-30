/**
 * Axios base client — all API calls go through this instance.
 * Automatically attaches the JWT token and handles 401 logout.
 */
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ───────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: handle 401 globally ─────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
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
    return Promise.reject(error);
  },
);
