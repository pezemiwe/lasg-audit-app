import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workpapersApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { Workpaper } from "../../types";

export function useWorkpapers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.workpapers.list(filters),
    queryFn: () => workpapersApi.getAll(filters) as Promise<Workpaper[]>,
  });
}

export function useWorkpaper(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.workpapers.detail(id ?? ""),
    queryFn: () => workpapersApi.getById(id!) as Promise<Workpaper>,
    enabled: !!id,
  });
}

export function useCreateWorkpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Workpaper, "id" | "uploadedAt">) =>
      workpapersApi.create(payload) as Promise<Workpaper>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.all });
    },
  });
}

export function useUpdateWorkpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Workpaper>;
    }) => workpapersApi.update(id, payload) as Promise<Workpaper>,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.all });
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.detail(id) });
    },
  });
}

export function useSignWorkpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signature }: { id: string; signature: string }) =>
      workpapersApi.sign(id, signature),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.all });
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.detail(id) });
    },
  });
}

export function useDeleteWorkpaper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workpapersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workpapers.all });
    },
  });
}
