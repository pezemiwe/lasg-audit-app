import React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "gold";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<
  BadgeVariant,
  { bg: string; color: string; border: string }
> = {
  default: { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
  success: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  warning: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  error: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  info: { bg: "#f0f9ff", color: "#075985", border: "#bae6fd" },
  gold: { bg: "#fffbeb", color: "#92400e", border: "#f5a800" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "default",
  size = "sm",
}) => {
  const styles = variantStyles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: size === "sm" ? "0.2rem 0.6rem" : "0.3rem 0.8rem",
        fontSize: size === "sm" ? "0.7rem" : "0.8rem",
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderRadius: "3px",
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
