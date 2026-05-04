import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "../../api";
import { queryKeys } from "./queryKeys";
import type { DocumentUpload } from "../../types";

export function useDocuments(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.documents.list(filters),
    queryFn: () => documentsApi.getAll(filters) as Promise<DocumentUpload[]>,
  });
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.documents.detail(id ?? ""),
    queryFn: () => documentsApi.getById(id!) as Promise<DocumentUpload>,
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      formData,
      onProgress,
    }: {
      formData: FormData;
      onProgress?: (pct: number) => void;
    }) => documentsApi.upload(formData, onProgress) as Promise<DocumentUpload>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (id: string) => documentsApi.download(id) as Promise<Blob>,
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.documents.all });
    },
  });
}
