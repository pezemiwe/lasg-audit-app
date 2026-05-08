import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { User } from "../../types";

export function useUsers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersApi.getAll(filters) as Promise<User[]>,
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    queryFn: () => usersApi.getById(id!) as Promise<User>,
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<User, "id">) =>
      usersApi.create(payload) as Promise<User>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      usersApi.update(id, payload) as Promise<User>,
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      id,
      currentPassword,
      newPassword,
    }: {
      id: string;
      currentPassword: string;
      newPassword: string;
    }) => usersApi.changePassword(id, { currentPassword, newPassword }),
  });
}
