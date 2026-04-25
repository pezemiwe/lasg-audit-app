import React from "react";

const BADGE_COLOR: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#d1fae5", color: "#065f46" },
  "In Progress": { bg: "#fef3c7", color: "#92400e" },
  Pending: { bg: "#fee2e2", color: "#991b1b" },
  Sent: { bg: "#dbeafe", color: "#1e40af" },
  Scheduled: { bg: "#ede9fe", color: "#4c1d95" },
};

const PreAuditBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = BADGE_COLOR[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {status}
    </span>
  );
};

export default PreAuditBadge;
