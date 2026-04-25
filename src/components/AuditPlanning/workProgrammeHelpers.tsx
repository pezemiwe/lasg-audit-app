import React from "react";
import {
  BarChart3,
  ClipboardList,
  FolderOpen,
  AlertTriangle,
  PenTool,
  MessageSquare,
  DollarSign,
  FileText,
  FileCheck,
} from "lucide-react";

export const procStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "In Progress":
      return "info" as const;
    default:
      return "default" as const;
  }
};

export const fmtCurrency = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });

export const sevColor: Record<string, { bg: string; color: string }> = {
  Low: { bg: "#d1fae5", color: "#065f46" },
  Medium: { bg: "#fef3c7", color: "#92400e" },
  High: { bg: "#fee2e2", color: "#991b1b" },
  Critical: { bg: "#fce7f3", color: "#9d174d" },
};

export const statusColor: Record<string, { bg: string; color: string }> = {
  Draft: { bg: "#f3f4f6", color: "#6b7280" },
  Proposed: { bg: "#d1fae5", color: "#065f46" },
  Agreed: { bg: "#d1fae5", color: "#065f46" },
  Posted: { bg: "#d1fae5", color: "#065f46" },
  Waived: { bg: "#f3f4f6", color: "#9ca3af" },
  Discussed: { bg: "#fef3c7", color: "#92400e" },
  Resolved: { bg: "#d1fae5", color: "#065f46" },
  Reported: { bg: "#d1fae5", color: "#065f46" },
  "Not Received": { bg: "#fee2e2", color: "#991b1b" },
  Received: { bg: "#fef3c7", color: "#92400e" },
  "Under Review": { bg: "#ecfdf5", color: "#059669" },
  Adjusted: { bg: "#fce7f3", color: "#9d174d" },
  Final: { bg: "#d1fae5", color: "#065f46" },
  Prepared: { bg: "#ecfdf5", color: "#059669" },
  Reviewed: { bg: "#fef3c7", color: "#92400e" },
};

export const InlineBadge: React.FC<{
  label: string;
  bg: string;
  color: string;
}> = ({ label, bg, color }) => (
  <span
    style={{
      fontSize: "0.7rem",
      fontWeight: 700,
      padding: "0.15rem 0.5rem",
      borderRadius: "3px",
      background: bg,
      color,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

export type TabKey =
  | "overview"
  | "procedures"
  | "evidence"
  | "exceptions"
  | "workpapers"
  | "journals"
  | "comments"
  | "statements"
  | "report"
  | "completion";

export const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <BarChart3 size={14} /> },
  { key: "procedures", label: "Procedures", icon: <ClipboardList size={14} /> },
  {
    key: "evidence",
    label: "Evidence Library",
    icon: <FolderOpen size={14} />,
  },
  {
    key: "exceptions",
    label: "Exceptions Register",
    icon: <AlertTriangle size={14} />,
  },
  { key: "workpapers", label: "Workpapers", icon: <FolderOpen size={14} /> },
  { key: "journals", label: "Journals", icon: <PenTool size={14} /> },
  {
    key: "comments",
    label: "Audit Comments",
    icon: <MessageSquare size={14} />,
  },
  {
    key: "statements",
    label: "Financial Statements",
    icon: <DollarSign size={14} />,
  },
  { key: "report", label: "Audit Report", icon: <FileText size={14} /> },
  { key: "completion", label: "Completion", icon: <FileCheck size={14} /> },
];
