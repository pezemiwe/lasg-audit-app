import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const usersApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/users", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) => apiClient.get(`/users/${id}`).then((r: AxiosResponse) => r.data),

  create: (payload: unknown) =>
    apiClient.post("/users", payload).then((r: AxiosResponse) => r.data),

  update: (id: string, payload: unknown) =>
    apiClient.put(`/users/${id}`, payload).then((r: AxiosResponse) => r.data),

  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r: AxiosResponse) => r.data),

  changePassword: (
    id: string,
    payload: { currentPassword: string; newPassword: string },
  ) => apiClient.patch(`/users/${id}/password`, payload).then((r: AxiosResponse) => r.data),
};
