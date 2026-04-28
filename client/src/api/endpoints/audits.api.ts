import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const auditsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/audits", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) => apiClient.get(`/audits/${id}`).then((r: AxiosResponse) => r.data),

  create: (payload: unknown) =>
    apiClient.post("/audits", payload).then((r: AxiosResponse) => r.data),

  update: (id: string, payload: unknown) =>
    apiClient.put(`/audits/${id}`, payload).then((r: AxiosResponse) => r.data),

  delete: (id: string) => apiClient.delete(`/audits/${id}`).then((r: AxiosResponse) => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/audits/${id}/status`, { status }).then((r: AxiosResponse) => r.data),
};
