import React from "react";
import { ChevronDown, Shield, Users } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { Audit, LGA, User } from "../../../types";

interface Props {
  lga: LGA;
  activeAudit: Audit | undefined;
  lead: User | null;
  team: User[];
  expanded: boolean;
  onToggle: () => void;
  onAssignLead: () => void;
}

const LgaRow: React.FC<Props> = ({
  lga,
  activeAudit,
  lead,
  team,
  expanded,
  onToggle,
  onAssignLead,
}) => {
  return (
    <div
      className={s.listRow}
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
        cursor: lead ? "pointer" : "default",
      }}
      onClick={() => lead && onToggle()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div>
          <div className={s.listRowName}>
            {lga.name}
            {lga.councilType === "LCDA" && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "#7c3aed",
                  background: "#ede9fe",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "4px",
                  marginLeft: "0.4rem",
                  letterSpacing: "0.04em",
                }}
              >
                LCDA
              </span>
            )}
            {lead && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "var(--text-2)",
                  marginLeft: "0.5rem",
                }}
              >
                • Audited by {lead.name}
              </span>
            )}
          </div>
          <div className={s.listRowSub}>
            {lga.contactName} · {lga.contactEmail}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StatusBadge
            label={lead ? `Lead Assigned` : "Pending"}
            variant={lead ? "success" : "default"}
          />
          {!lead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssignLead();
              }}
              style={{
                background: "transparent",
                border: "1px dashed var(--border-color)",
                color: "var(--primary-color)",
                fontSize: "0.75rem",
                fontWeight: 500,
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              + Assign Lead
            </button>
          )}
          {lead && (
            <ChevronDown
              size={14}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          )}
        </div>
      </div>

      {expanded && lead && (
        <div
          style={{
            width: "100%",
            paddingTop: "0.75rem",
            marginTop: "0.25rem",
            borderTop: "1px dashed #e2e8f0",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--text-2)",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Audit Team for {activeAudit?.year}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#eff6ff",
                color: "#1e40af",
                padding: "0.3rem 0.6rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                border: "1px solid #dbeafe",
              }}
            >
              <Shield size={12} />
              <span style={{ fontWeight: 600 }}>{lead.name}</span>
              <span style={{ opacity: 0.7 }}>(Lead)</span>
            </div>

            {team.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#f8fafc",
                  color: "#475569",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "99px",
                  fontSize: "0.8rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Users size={12} />
                <span>{member.name}</span>
              </div>
            ))}

            {team.length === 0 && (
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  padding: "0.3rem 0",
                }}
              >
                No other team members assigned.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LgaRow;
