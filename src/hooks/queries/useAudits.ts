import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "../../utils/apiClient";
import { queryKeys } from "./queryKeys";

export interface AuditSummary {
  id: string;
  title: string;
  status: string;
  zoneId?: string;
  lgaId?: string;
}

export function useAudits(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.audits.list(filters),
    queryFn: () => fetchClient<AuditSummary[]>("/audits", { params: filters }),
  });
}

export function useAudit(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.audits.detail(id ?? ""),
    queryFn: () => fetchClient<AuditSummary>(`/audits/${id}`),
    enabled: !!id,
  });
}

export function useCreateAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AuditSummary>) =>
      fetchClient<AuditSummary>("/audits", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.audits.all });
    },
  });
}
