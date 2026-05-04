import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string };
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r: AxiosResponse) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload).then((r: AxiosResponse) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r: AxiosResponse) => r.data),

  me: () => apiClient.get<AuthResponse["user"]>("/auth/me").then((r: AxiosResponse) => r.data),

  refreshToken: () =>
    apiClient
      .post<{ token: string }>("/auth/refresh-token")
      .then((r: AxiosResponse) => r.data),
};
