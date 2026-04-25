import type { RiskLevel } from "../../../types";

export const calculateOverallRisk = (
  inherent: RiskLevel,
  control: RiskLevel,
  detection: RiskLevel,
): RiskLevel => {
  const map: Record<RiskLevel, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };
  const avg = (map[inherent] + map[control] + map[detection]) / 3;
  if (avg >= 3.5) return "Critical";
  if (avg >= 2.5) return "High";
  if (avg >= 1.5) return "Medium";
  return "Low";
};

export const fmtCurrency = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });

export const fmtPercent = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export const arFmt = (n: number) =>
  "₦" +
  n.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const arFmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
