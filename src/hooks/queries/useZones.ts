import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zonesApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { Zone, LGA } from "../../types";

export function useZones() {
  return useQuery({
    queryKey: queryKeys.zones.list(),
    queryFn: () => zonesApi.getAll() as Promise<Zone[]>,
  });
}

export function useZone(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.zones.detail(id ?? ""),
    queryFn: () => zonesApi.getById(id!) as Promise<Zone>,
    enabled: !!id,
  });
}

export function useZoneLgas(zoneId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.zones.detail(zoneId ?? ""), "lgas"] as const,
    queryFn: () => zonesApi.getLgas(zoneId!) as Promise<LGA[]>,
    enabled: !!zoneId,
  });
}

export function useAssignZoneSupervisor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      zoneId,
      supervisorId,
    }: {
      zoneId: string;
      supervisorId: string;
    }) => zonesApi.assignSupervisor(zoneId, supervisorId),
    onSuccess: (_data, { zoneId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.zones.all });
      qc.invalidateQueries({ queryKey: queryKeys.zones.detail(zoneId) });
    },
  });
}
