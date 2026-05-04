import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const mandatesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/mandates", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) =>
    apiClient.get(`/mandates/${id}`).then((r: AxiosResponse) => r.data),

  create: (payload: unknown) =>
    apiClient.post("/mandates", payload).then((r: AxiosResponse) => r.data),

  update: (id: string, payload: unknown) =>
    apiClient
      .put(`/mandates/${id}`, payload)
      .then((r: AxiosResponse) => r.data),

  publish: (id: string) =>
    apiClient
      .patch(`/mandates/${id}/publish`)
      .then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/mandates/${id}`).then((r: AxiosResponse) => r.data),
};
