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
  Low: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Medium: { bg: "var(--text)", color: "var(--text)" },
  High: { bg: "var(--text)", color: "var(--text)" },
  Critical: { bg: "#fce7f3", color: "#9d174d" },
};

export const statusColor: Record<string, { bg: string; color: string }> = {
  Draft: { bg: "#f3f4f6", color: "#6b7280" },
  Proposed: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Agreed: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Posted: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Waived: { bg: "#f3f4f6", color: "#9ca3af" },
  Discussed: { bg: "var(--text)", color: "var(--text)" },
  Resolved: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Reported: { bg: "var(--bg-hover)", color: "var(--primary)" },
  "Not Received": { bg: "var(--text)", color: "var(--text)" },
  Received: { bg: "var(--text)", color: "var(--text)" },
  "Under Review": { bg: "var(--bg-hover)", color: "var(--primary)" },
  Adjusted: { bg: "#fce7f3", color: "#9d174d" },
  Final: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Prepared: { bg: "var(--bg-hover)", color: "var(--primary)" },
  Reviewed: { bg: "var(--text)", color: "var(--text)" },
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
  {
    key: "procedures",
    label: "Audit Procedure & Response",
    icon: <ClipboardList size={14} />,
  },
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

