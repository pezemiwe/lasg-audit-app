import type { ReportStatus } from "../../../types";

export const reportStatusVariant = (st: ReportStatus) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Submitted":
      return "info" as const;
    case "Under Review":
      return "warning" as const;
    case "Revision Required":
      return "error" as const;
    case "Approved":
      return "success" as const;
    case "Final":
      return "gold" as const;
  }
};

export const severityVariant = (sev: string) => {
  switch (sev) {
    case "Low":
      return "default" as const;
    case "Medium":
      return "warning" as const;
    case "High":
      return "error" as const;
    case "Critical":
      return "error" as const;
    default:
      return "default" as const;
  }
};

export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const WORKFLOW_STEPS = [
  {
    key: "Draft",
    label: "1. Draft Report",
    desc: "Audit Lead creates draft with findings",
  },
  {
    key: "Submitted",
    label: "2. Supervisor Review",
    desc: "Supervisor reviews and approves or requests revision",
  },
  {
    key: "Approved",
    label: "3. Management Response",
    desc: "HLGA responds to each finding",
  },
  {
    key: "Final",
    label: "4. Final AG Approval",
    desc: "Auditor General approves final report",
  },
];
