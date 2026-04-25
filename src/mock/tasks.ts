import type {
  Task,
  Invitation,
  NotificationLetter,
} from "../types";

export const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    auditId: "audit-1",
    title: "Revenue Collection Review",
    description: "Review IGR collections for FY 2025",
    assignedTo: "user-auditor-1",
    status: "In Progress",
    dueDate: "2026-04-15",
  },
  {
    id: "task-2",
    auditId: "audit-1",
    title: "Payroll Verification",
    description: "Verify payroll records against staff establishment",
    assignedTo: "user-auditor-2",
    status: "Pending",
    dueDate: "2026-04-20",
  },
  {
    id: "task-3",
    auditId: "audit-1",
    title: "Budget & Expenditure Analysis",
    description: "Analyse approved budget vs actual expenditure",
    assignedTo: "user-auditor-1",
    status: "Pending",
    dueDate: "2026-04-25",
  },
  {
    id: "task-4",
    auditId: "audit-3",
    title: "Procurement Process Audit",
    description: "Review procurement documentation for Eti-Osa",
    assignedTo: "user-auditor-4",
    status: "Review",
    dueDate: "2026-04-10",
  },
  {
    id: "task-5",
    auditId: "audit-4",
    title: "Bank Reconciliation Review",
    description: "Reconcile bank statements with cashbooks",
    status: "Completed",
    dueDate: "2026-05-01",
    completedAt: "2026-04-28",
  },
];

export const SEED_INVITATIONS: Invitation[] = [
  {
    id: "inv-1",
    userId: "user-lead-1",
    role: "AUDIT_LEAD",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    auditId: "audit-1",
    status: "Accepted",
    sentAt: "2026-02-15T10:00:00Z",
    expiresAt: "2026-02-17T10:00:00Z",
    acceptedAt: "2026-02-15T14:30:00Z",
  },
  {
    id: "inv-2",
    userId: "user-auditor-1",
    role: "TEAM_AUDITOR",
    lgaId: "lga-4",
    mandateId: "mandate-1",
    auditId: "audit-1",
    status: "Accepted",
    sentAt: "2026-02-16T09:00:00Z",
    expiresAt: "2026-02-18T09:00:00Z",
    acceptedAt: "2026-02-16T11:00:00Z",
    tasks: ["task-1", "task-3"],
  },
];

export const SEED_LETTERS: NotificationLetter[] = [
  {
    id: "notif-Escalation",
    lgaId: "lga-19",
    mandateId: "mandate-1",
    type: "Audit Notification",
    date: "2026-02-21",
    status: "Sent",
    title: "URGENT: Audit Timeline Exceeded - Escalation Notice",
    content:
      "Notice of non-compliance with audit timeline. The fieldwork phase for 2024 Financial Audit was due for completion by 20 Feb 2026. Immediate explanation required.",
    checklist: [],
  },
];
