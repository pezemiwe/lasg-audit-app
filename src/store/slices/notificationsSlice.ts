import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;

export type NotificationsActions = Pick<
  AuditStore,
  | "addNotification"
  | "addNotifications"
  | "markNotificationAsRead"
  | "markAllNotificationsAsRead"
  | "clearNotifications"
>;

export function createNotificationsActions(set: SetFn): NotificationsActions {
  return {
    addNotification: (data) =>
      set((s) => ({
        notifications: [
          {
            ...data,
            id: `notif-${uid()}`,
            isRead: false,
            timestamp: now(),
          },
          ...s.notifications,
        ],
      })),
    addNotifications: (notifs) =>
      set((s) => ({
        notifications: [
          ...notifs.map((n, i) => ({
            ...n,
            id: `notif-${uid()}-${i}`,
            isRead: false,
            timestamp: now(),
          })),
          ...s.notifications,
        ],
      })),
    markNotificationAsRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
      })),
    markAllNotificationsAsRead: (userId) =>
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.userId === userId ? { ...n, isRead: true } : n,
        ),
      })),
    clearNotifications: (userId) =>
      set((s) => ({
        notifications: s.notifications.filter((n) => n.userId !== userId),
      })),
  };
}
