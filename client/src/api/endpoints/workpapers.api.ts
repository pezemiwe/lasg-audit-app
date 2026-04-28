import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const workpapersApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/workpapers", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) =>
    apiClient.get(`/workpapers/${id}`).then((r: AxiosResponse) => r.data),

  create: (payload: unknown) =>
    apiClient.post("/workpapers", payload).then((r: AxiosResponse) => r.data),

  update: (id: string, payload: unknown) =>
    apiClient.put(`/workpapers/${id}`, payload).then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/workpapers/${id}`).then((r: AxiosResponse) => r.data),

  sign: (id: string, signature: string) =>
    apiClient
      .patch(`/workpapers/${id}/sign`, { signature })
      .then((r: AxiosResponse) => r.data),
};
