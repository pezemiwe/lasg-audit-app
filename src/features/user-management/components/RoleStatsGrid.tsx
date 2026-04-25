import React from "react";
import type { Role } from "../../../types";
import { ROLE_COLORS, ROLE_LABELS } from "../data/roles";

interface StatItem {
  role: Role;
  label: string;
  count: number;
}

interface Props {
  stats: StatItem[];
  roleFilter: string;
  onToggle: (role: Role) => void;
}

const RoleStatsGrid: React.FC<Props> = ({ stats, roleFilter, onToggle }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat) => {
        const colors = ROLE_COLORS[stat.role];
        return (
          <div
            key={stat.role}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.color}30`,
              borderRadius: "4px",
              padding: "1.25rem 1rem",
              cursor: "pointer",
              transition: "opacity 0.15s",
              opacity:
                roleFilter === stat.role || roleFilter === "ALL" ? 1 : 0.5,
            }}
            onClick={() => onToggle(stat.role)}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: colors.color,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1,
              }}
            >
              {stat.count}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: colors.color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "0.4rem",
                lineHeight: 1.3,
                opacity: 0.8,
              }}
            >
              {ROLE_LABELS[stat.role]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoleStatsGrid;
