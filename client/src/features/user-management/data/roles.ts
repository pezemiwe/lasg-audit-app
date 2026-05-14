import type { Role } from "../../../types";

export const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Administrator",
  STATE_AUDITOR_GENERAL: "Auditor-General for Local Governments",
  AUDIT_SUPERVISOR: "Audit Supervisor",
  AUDIT_LEAD: "Audit Lead",
  TEAM_AUDITOR: "Team Auditor",
  HEAD_OF_LOCAL_GOVERNMENT: "Head of Local Government",
};

export const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  SYSTEM_ADMIN: { bg: "#fce7f3", color: "#9d174d" },
  STATE_AUDITOR_GENERAL: { bg: "#064e3b", color: "#fff" },
  AUDIT_SUPERVISOR: { bg: "#dbeafe", color: "#1e40af" },
  AUDIT_LEAD: { bg: "#fef3c7", color: "#92400e" },
  TEAM_AUDITOR: { bg: "#f3f4f6", color: "#374151" },
  HEAD_OF_LOCAL_GOVERNMENT: { bg: "#cffafe", color: "#155e75" },
};
