import type { AxiosResponse } from "axios";
import { apiClient } from "../client";

export const zonesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get("/zones", { params }).then((r: AxiosResponse) => r.data),

  getById: (id: string) =>
    apiClient.get(`/zones/${id}`).then((r: AxiosResponse) => r.data),

  getLgas: (zoneId: string) =>
    apiClient.get(`/zones/${zoneId}/lgas`).then((r: AxiosResponse) => r.data),

  assignSupervisor: (zoneId: string, supervisorId: string) =>
    apiClient
      .patch(`/zones/${zoneId}/supervisor`, { supervisorId })
      .then((r: AxiosResponse) => r.data),
};
