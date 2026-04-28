import type { RiskLevel, AnalyticFlag } from "../../types";
import {
  Building2,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
} from "lucide-react";
import React from "react";

export const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

export const RISK_AREAS = [
  "Revenue & Receipts",
  "Expenditure & Payments",
  "Payroll & Personnel Costs",
  "Bank & Cash Management",
  "Procurement & Contracts",
  "Fixed Assets & Capital Projects",
  "Grants & Transfers",
  "Tax & Deductions",
];

export const MATERIALITY_BASES = [
  "Total Revenue",
  "Total Expenditure",
  "Net Assets",
  "Total Assets",
  "Surplus/Deficit",
];

export const FRAMEWORKS = [
  "IPSAS Accrual Basis",
  "IPSAS Cash Basis",
  "Modified Cash Basis",
  "Nigerian SAS",
];

export const IT_SYSTEMS = [
  "SIFMIS",
  "IPPIS",
  "GIFMIS",
  "Manual Spreadsheets",
  "Custom ERP",
  "Sage",
  "QuickBooks",
];

export const STEP_CONFIG = [
  {
    key: "entity",
    label: "Entity Understanding",
    icon: Building2,
    shortLabel: "Entity",
  },
  {
    key: "analytical-review",
    label: "Analytical Review",
    icon: BarChart3,
    shortLabel: "Analytical Review",
  },
  {
    key: "risk",
    label: "Risk Assessment",
    icon: AlertTriangle,
    shortLabel: "Risk",
  },
] as const;

export type StepKey = (typeof STEP_CONFIG)[number]["key"];

export type ArDocType = "fs" | "tb";

export const riskColor: Record<
  RiskLevel,
  { bg: string; text: string; border: string }
> = {
  Low: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  High: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  Critical: { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
};

export const flagConfig: Record<
  AnalyticFlag,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Favorable: { bg: "#f0fdf4", text: "#166534", icon: TrendingDown },
  Adverse: { bg: "#fffbeb", text: "#92400e", icon: TrendingUp },
  Neutral: { bg: "#f8fafc", text: "#475569", icon: Minus },
  Investigate: { bg: "#fef2f2", text: "#991b1b", icon: Search },
};
