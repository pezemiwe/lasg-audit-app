import type {
  AuditReport,
} from "../types";

export const SEED_REPORTS: AuditReport[] = [
  {
    id: "report-1",
    auditId: "audit-4",
    title: "Financial Audit Report — Ajeromi-Ifelodun LGA FY 2025",
    type: "Final",
    status: "Approved",
    preparedBy: "user-lead-3",
    submittedAt: "2026-06-15T09:00:00Z",
    reviewedBy: "user-sup-lagos",
    reviewedAt: "2026-06-18T16:00:00Z",
    findings: [
      {
        id: "f-1",
        title: "Unreconciled Bank Balances",
        description:
          "Bank balances showed a variance of N12.5M between cashbook and bank statements",
        severity: "High",
        recommendation: "Conduct monthly reconciliation",
        status: "Addressed",
      },
      {
        id: "f-2",
        title: "Procurement Irregularities",
        description:
          "3 contracts exceeding N5M awarded without due process certification",
        severity: "Critical",
        recommendation:
          "Obtain retrospective due process certification and implement controls",
        status: "Open",
      },
    ],
  },
];

