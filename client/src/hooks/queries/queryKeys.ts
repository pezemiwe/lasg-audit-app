export const queryKeys = {
  audits: {
    all: ["audits"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.audits.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.audits.all, "detail", id] as const,
  },
  zones: {
    all: ["zones"] as const,
    list: () => [...queryKeys.zones.all, "list"] as const,
    detail: (id: string) => [...queryKeys.zones.all, "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
  },
  mandates: {
    all: ["mandates"] as const,
    list: () => [...queryKeys.mandates.all, "list"] as const,
    detail: (id: string) => [...queryKeys.mandates.all, "detail", id] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
  },
  reports: {
    all: ["reports"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.reports.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.reports.all, "detail", id] as const,
  },
  workpapers: {
    all: ["workpapers"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.workpapers.all, "list", filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.workpapers.all, "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.documents.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.documents.all, "detail", id] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.assignments.all, "list", filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.assignments.all, "detail", id] as const,
  },
} as const;
