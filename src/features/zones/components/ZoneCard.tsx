import React from "react";
import { MapPin, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { Audit, LGA, User, Zone } from "../../../types";
import SupervisorCard from "./SupervisorCard";
import LgaRow from "./LgaRow";

interface Props {
  zone: Zone;
  zoneLgas: LGA[];
  assignedSupervisors: User[];
  isExpanded: boolean;
  onToggleZone: () => void;
  onAddSupervisor: () => void;
  onRemoveSupervisor: (supId: string) => void;
  audits: Audit[];
  users: User[];
  expandedLgaId: string | null;
  setExpandedLgaId: (id: string | null) => void;
  onAssignLead: (lga: LGA) => void;
}

const ZoneCard: React.FC<Props> = ({
  zone,
  zoneLgas,
  assignedSupervisors,
  isExpanded,
  onToggleZone,
  onAddSupervisor,
  onRemoveSupervisor,
  audits,
  users,
  expandedLgaId,
  setExpandedLgaId,
  onAssignLead,
}) => {
  const hasSupervisors = assignedSupervisors.length > 0;

  return (
    <div className={s.card} style={{ marginBottom: "1rem" }}>
      <div
        className={s.cardHeader}
        style={{ cursor: "pointer" }}
        onClick={onToggleZone}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleZone();
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <MapPin size={18} style={{ color: "#c8930a" }} />
          <div>
            <h3 className={s.cardTitle}>{zone.name} Zone</h3>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#64748b",
                marginTop: "0.15rem",
              }}
            >
              {
                zoneLgas.filter(
                  (l) => !l.councilType || l.councilType === "LGA",
                ).length
              }{" "}
              LGAs, {zoneLgas.filter((l) => l.councilType === "LCDA").length}{" "}
              LCDAs
              {hasSupervisors &&
                ` · ${assignedSupervisors.length} Supervisor(s)`}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <StatusBadge
            label={hasSupervisors ? "Assigned" : "Pending"}
            variant={hasSupervisors ? "success" : "warning"}
          />
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className={s.cardBody}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px" }}>
              <div
                className={s.sectionDivider}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Supervisors</span>
                <button
                  className={s.btnSmall}
                  style={{
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid #e2e8f0",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSupervisor();
                  }}
                >
                  <UserPlus size={14} /> Add Supervisor
                </button>
              </div>

              {assignedSupervisors.map((sup) => (
                <SupervisorCard
                  key={sup.id}
                  supervisor={sup}
                  onRemove={() => onRemoveSupervisor(sup.id)}
                />
              ))}

              {assignedSupervisors.length === 0 && (
                <div
                  style={{
                    padding: "1.5rem",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "6px",
                    marginTop: "1rem",
                    background: "#f8fafc",
                    fontStyle: "italic",
                  }}
                >
                  No supervisors assigned yet.
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 300px" }}>
              <div className={s.sectionDivider}>
                Councils (LGAs &amp; LCDAs)
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                {zoneLgas.map((lga) => {
                  const activeAudit = audits.find(
                    (a) => a.lgaId === lga.id && a.status !== "Completed",
                  );
                  const lead = activeAudit?.leadId
                    ? users.find((u) => u.id === activeAudit.leadId) || null
                    : null;
                  const team = activeAudit?.teamIds
                    ? activeAudit.teamIds
                        .map((id) => users.find((u) => u.id === id))
                        .filter((u): u is User => !!u)
                    : [];
                  return (
                    <LgaRow
                      key={lga.id}
                      lga={lga}
                      activeAudit={activeAudit}
                      lead={lead}
                      team={team}
                      expanded={expandedLgaId === lga.id}
                      onToggle={() =>
                        setExpandedLgaId(
                          expandedLgaId === lga.id ? null : lga.id,
                        )
                      }
                      onAssignLead={() => onAssignLead(lga)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;
