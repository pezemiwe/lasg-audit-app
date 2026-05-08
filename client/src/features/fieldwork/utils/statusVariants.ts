import type { BadgeVariant } from "../../../components/UI/StatusBadge";
import type {
  ProcedureExecutionStatus,
  ExceptionSeverity,
  DocumentRequisition,
} from "../../../types";

export const statusBadgeVariant = (
  st: ProcedureExecutionStatus,
): BadgeVariant => {
  switch (st) {
    case "Locked":
      return "default";
    case "Not Started":
      return "info";
    case "In Progress":
      return "warning";
    case "Submitted":
      return "gold";
    case "Reviewed":
      return "info";
    case "Cleared":
      return "success";
    case "Exception Raised":
      return "error";
    case "Limitation":
      return "error";
    default:
      return "default";
  }
};

export const severityVariant = (sv: ExceptionSeverity): BadgeVariant => {
  switch (sv) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "error";
    case "Critical":
      return "error";
  }
};

export const reqStatusVariant = (
  st: DocumentRequisition["status"],
): BadgeVariant => {
  switch (st) {
    case "Pending":
      return "warning";
    case "Issued":
      return "info";
    case "Received":
      return "success";
    case "Overdue":
      return "error";
    case "Waived":
      return "default";
  }
};
