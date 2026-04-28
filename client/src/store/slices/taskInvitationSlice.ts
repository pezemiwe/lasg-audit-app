import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { Task, Invitation, InvitationStatus } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type TaskInvitationActions = Pick<
  AuditStore,
  | "createTask"
  | "updateTaskStatus"
  | "assignTask"
  | "sendInvitation"
  | "acceptInvitation"
  | "declineInvitation"
  | "getUserInvitations"
  | "getAuditTasks"
  | "getUserTasks"
>;

export function createTaskInvitationActions(
  set: SetFn,
  get: GetFn,
): TaskInvitationActions {
  return {
    createTask: (task) => {
      const newTask: Task = { ...task, id: `task-${uid()}` };
      set((s) => ({ tasks: [...s.tasks, newTask] }));
    },

    updateTaskStatus: (taskId, status) =>
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status,
                ...(status === "Completed" ? { completedAt: now() } : {}),
              }
            : t,
        ),
      })),

    assignTask: (taskId, userId) =>
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, assignedTo: userId } : t,
        ),
      })),

    sendInvitation: (data) => {
      const invitation: Invitation = {
        ...data,
        id: `inv-${uid()}`,
        status: "Pending" as InvitationStatus,
        sentAt: now(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      };
      set((s) => ({ invitations: [...s.invitations, invitation] }));
    },

    acceptInvitation: (invitationId) => {
      set((s) => {
        const inv = s.invitations.find((i) => i.id === invitationId);
        const updatedInvitations = s.invitations.map((i) =>
          i.id === invitationId
            ? {
                ...i,
                status: "Accepted" as InvitationStatus,
                acceptedAt: now(),
              }
            : i,
        );

        // When a team auditor accepts, add them to the audit's teamIds
        let updatedAudits = s.audits;
        if (inv?.role === "TEAM_AUDITOR" && inv.auditId && inv.userId) {
          updatedAudits = s.audits.map((a) =>
            a.id === inv.auditId
              ? {
                  ...a,
                  teamIds: [...new Set([...(a.teamIds ?? []), inv.userId])],
                }
              : a,
          );
        }

        return { invitations: updatedInvitations, audits: updatedAudits };
      });
      get().addToast({ type: "success", title: "Assignment Accepted" });
    },

    declineInvitation: (invitationId) => {
      set((s) => ({
        invitations: s.invitations.map((i) =>
          i.id === invitationId
            ? { ...i, status: "Declined" as InvitationStatus }
            : i,
        ),
      }));
      get().addToast({ type: "info", title: "Assignment Declined" });
    },

    getUserInvitations: (userId) =>
      get().invitations.filter((i) => i.userId === userId),

    getAuditTasks: (auditId) =>
      get().tasks.filter((t) => t.auditId === auditId),

    getUserTasks: (userId) =>
      get().tasks.filter((t) => t.assignedTo === userId),
  };
}
