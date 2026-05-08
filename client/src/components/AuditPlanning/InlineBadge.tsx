import React from "react";

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
