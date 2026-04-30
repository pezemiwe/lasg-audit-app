import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { AuditReport } from "../../types";

export function useReports(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.reports.list(filters),
    queryFn: () => reportsApi.getAll(filters) as Promise<AuditReport[]>,
  });
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id ?? ""),
    queryFn: () => reportsApi.getById(id!) as Promise<AuditReport>,
    enabled: !!id,
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<AuditReport, "id">) =>
      reportsApi.generate(payload) as Promise<AuditReport>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format: "pdf" | "xlsx" }) =>
      reportsApi.export(id, format) as Promise<Blob>,
  });
}

export function useDeleteReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reports.all });
    },
  });
}
