import { uid } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { User } from "../../types";

type SetFn = {
  (updater: (state: AuditStore) => Partial<AuditStore>): void;
  (partial: Partial<AuditStore>): void;
};
type GetFn = () => AuditStore;

export type UiActions = Pick<
  AuditStore,
  | "addUser"
  | "updateUser"
  | "addToast"
  | "removeToast"
  | "openModal"
  | "closeModal"
>;

export function createUiActions(set: SetFn, get: GetFn): UiActions {
  return {
    addUser: (user: Omit<User, "id">) =>
      set((s) => ({
        users: [...s.users, { ...user, id: uid() } as User],
      })),
    updateUser: (id: string, updates: Partial<User>) =>
      set((s) => ({
        users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      })),
    addToast: (toast) => {
      const id = uid();
      set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
      setTimeout(() => get().removeToast(id), 5000);
    },
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    openModal: (modal) => set({ modal: { ...modal, isOpen: true } }),
    closeModal: () => set((s) => ({ modal: { ...s.modal, isOpen: false } })),
  };
}
