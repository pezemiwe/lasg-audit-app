import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const reportsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/reports", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) => apiClient.get(`/reports/${id}`).then((r: AxiosResponse) => r.data),

  generate: (payload: unknown) =>
    apiClient.post("/reports/generate", payload).then((r: AxiosResponse) => r.data),

  export: (id: string, format: "pdf" | "xlsx") =>
    apiClient
      .get(`/reports/${id}/export`, {
        params: { format },
        responseType: "blob",
      })
      .then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/reports/${id}`).then((r: AxiosResponse) => r.data),
};
