import React from "react";

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const MAP: Record<string, { bg: string; color: string }> = {
    Approved: { bg: "#d1fae5", color: "#065f46" },
    Complete: { bg: "#d1fae5", color: "#065f46" },
    Submitted: { bg: "#dbeafe", color: "#1e40af" },
    "Under Review": { bg: "#fef3c7", color: "#92400e" },
    Draft: { bg: "#f3f4f6", color: "#6b7280" },
    Pending: { bg: "#f3f4f6", color: "#6b7280" },
    Rejected: { bg: "#fee2e2", color: "#991b1b" },
    "In Progress": { bg: "#dbeafe", color: "#1e40af" },
    Completed: { bg: "#d1fae5", color: "#065f46" },
  };
  const c = MAP[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

export default Badge;
