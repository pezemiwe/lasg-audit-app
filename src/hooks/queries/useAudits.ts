import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { Audit } from "../../types";

export function useAudits(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.audits.list(filters),
    queryFn: () => auditsApi.getAll(filters) as Promise<Audit[]>,
  });
}

export function useAudit(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.audits.detail(id ?? ""),
    queryFn: () => auditsApi.getById(id!) as Promise<Audit>,
    enabled: !!id,
  });
}

export function useCreateAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Audit, "id">) =>
      auditsApi.create(payload) as Promise<Audit>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.audits.all });
    },
  });
}

export function useUpdateAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Audit> }) =>
      auditsApi.update(id, payload) as Promise<Audit>,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.audits.all });
      qc.invalidateQueries({ queryKey: queryKeys.audits.detail(id) });
    },
  });
}

export function useUpdateAuditStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      auditsApi.updateStatus(id, status) as Promise<Audit>,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.audits.all });
      qc.invalidateQueries({ queryKey: queryKeys.audits.detail(id) });
    },
  });
}
