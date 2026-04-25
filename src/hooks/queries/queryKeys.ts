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
    list: () => [...queryKeys.reports.all, "list"] as const,
    detail: (id: string) => [...queryKeys.reports.all, "detail", id] as const,
  },
} as const;
