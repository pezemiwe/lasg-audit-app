import type { AxiosResponse, AxiosProgressEvent } from "axios";
import { apiClient } from "../client";

export const documentsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/documents", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) =>
    apiClient.get(`/documents/${id}`).then((r: AxiosResponse) => r.data),

  upload: (formData: FormData, onProgress?: (pct: number) => void) =>
    apiClient
      .post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (onProgress && e.total)
            onProgress(Math.round((e.loaded * 100) / e.total));
        },
      })
      .then((r: AxiosResponse) => r.data),

  download: (id: string) =>
    apiClient
      .get(`/documents/${id}/download`, { responseType: "blob" })
      .then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/documents/${id}`).then((r: AxiosResponse) => r.data),
};
