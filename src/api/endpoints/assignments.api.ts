import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const assignmentsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/assignments", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) =>
    apiClient.get(`/assignments/${id}`).then((r: AxiosResponse) => r.data),

  create: (payload: unknown) =>
    apiClient.post("/assignments", payload).then((r: AxiosResponse) => r.data),

  update: (id: string, payload: unknown) =>
    apiClient.put(`/assignments/${id}`, payload).then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/assignments/${id}`).then((r: AxiosResponse) => r.data),
};
