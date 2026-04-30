import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { Task } from "../../types";

export function useAssignments(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.assignments.list(filters),
    queryFn: () => assignmentsApi.getAll(filters) as Promise<Task[]>,
  });
}

export function useAssignment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(id ?? ""),
    queryFn: () => assignmentsApi.getById(id!) as Promise<Task>,
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Task, "id">) =>
      assignmentsApi.create(payload) as Promise<Task>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.assignments.all });
    },
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      assignmentsApi.update(id, payload) as Promise<Task>,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.assignments.all });
      qc.invalidateQueries({ queryKey: queryKeys.assignments.detail(id) });
    },
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.assignments.all });
    },
  });
}
