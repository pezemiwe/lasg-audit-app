import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mandatesApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { Mandate } from "../../types";

export function useMandates() {
  return useQuery({
    queryKey: queryKeys.mandates.list(),
    queryFn: () => mandatesApi.getAll() as Promise<Mandate[]>,
  });
}

export function useMandate(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.mandates.detail(id ?? ""),
    queryFn: () => mandatesApi.getById(id!) as Promise<Mandate>,
    enabled: !!id,
  });
}

export function useCreateMandate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Mandate, "id" | "createdAt" | "status">) =>
      mandatesApi.create(payload) as Promise<Mandate>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mandates.all });
    },
  });
}

export function usePublishMandate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mandatesApi.publish(id) as Promise<Mandate>,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.mandates.all });
      qc.invalidateQueries({ queryKey: queryKeys.mandates.detail(id) });
    },
  });
}

export function useDeleteMandate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mandatesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mandates.all });
    },
  });
}
