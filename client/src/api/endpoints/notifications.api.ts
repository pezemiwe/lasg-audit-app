import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const notificationsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/notifications", { params }).then((r: AxiosResponse) => r.data),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then((r: AxiosResponse) => r.data),

  markAllRead: () =>
    apiClient.patch("/notifications/read-all").then((r: AxiosResponse) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/notifications/${id}`).then((r: AxiosResponse) => r.data),
};
