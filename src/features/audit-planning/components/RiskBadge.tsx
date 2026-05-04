import React from "react";
import { Shield } from "lucide-react";
import type { RiskLevel } from "../../../types";
import { riskColor } from "../constants";

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      fontSize: "0.72rem",
      fontWeight: 700,
      padding: "0.2rem 0.55rem",
      borderRadius: "4px",
      background: riskColor[level].bg,
      color: riskColor[level].text,
      border: `1px solid ${riskColor[level].border}`,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    }}
  >
    <Shield size={11} />
    {level}
  </span>
);

export default RiskBadge;
