import React from "react";
import type { Invitation } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import {
  CheckCircle,
  Clock,
  ShieldCheck,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import { getRoleName } from "../utils/assignmentsData";

type Props = {
  inv: Invitation;
  hasCOI: boolean;
  isPrepExpanded: boolean;
  getLgaName: (id?: string) => string;
  getZoneName: (id?: string) => string;
  getMandateTitle: (id: string) => string;
  onTogglePrep: (invId: string) => void;
  onStartCOI: (invId: string) => void;
};

const AcceptedInvitationCard: React.FC<Props> = ({
  inv,
  hasCOI,
  isPrepExpanded,
  getLgaName,
  getZoneName,
  getMandateTitle,
  onTogglePrep,
  onStartCOI,
}) => {
  const prepSteps = [
    {
      id: "assignment",
      label: "Assignment Received & Acknowledged",
      done: true,
      icon: <CheckCircle size={16} />,
      note: `Accepted ${inv.acceptedAt ? new Date(inv.acceptedAt).toLocaleDateString("en-NG") : ""}`,
    },
    {
      id: "coi",
      label: "Conflict of Interest Declaration",
      done: hasCOI,
      icon: <ShieldCheck size={16} />,
      note: hasCOI
        ? "All four Independence declarations confirmed"
        : "Pending declaration — must be submitted to supervisor",
    },
    {
      id: "letter",
      label: "Engagement Letter Accessed",
      done: hasCOI,
      icon: <FileText size={16} />,
      note: hasCOI
        ? "Ref: EL-2024-LGA — Reviewed and on file"
        : "Available after COI declaration",
    },
    {
      id: "charter",
      label: "Audit Charter / Guidelines Reviewed",
      done: false,
      icon: <BookOpen size={16} />,
      note: "LASG Office of the Auditor-General Standing Instructions, 2024 Edition",
    },
    {
      id: "briefing",
      label: "Pre-Audit Team Briefing Attended",
      done: false,
      icon: <ClipboardList size={16} />,
      note: "Scheduled by the Audit Lead — check Pre-Audit page",
    },
  ];
  const completedCount = prepSteps.filter((p) => p.done).length;

  return (
    <div className={s.invitationCard}>
      <div className={s.invitationHeader}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "4px",
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16a34a",
              flexShrink: 0,
            }}
          >
            <CheckCircle size={20} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--text, #0f172a)",
              }}
            >
              {getRoleName(inv.role)} —{" "}
              {inv.lgaId
                ? getLgaName(inv.lgaId)
                : inv.zoneId
                  ? getZoneName(inv.zoneId)
                  : ""}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
              Accepted{" "}
              {inv.acceptedAt
                ? new Date(inv.acceptedAt).toLocaleDateString("en-NG")
                : ""}
              {" · "}
              Mandate: {getMandateTitle(inv.mandateId)}
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
          <StatusBadge label="Active" variant="success" size="md" />
          <button
            onClick={() => onTogglePrep(inv.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.85rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: "var(--bg, #f8fafc)",
              border: "1px solid var(--border, #e2e8f0)",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--text, #0f172a)",
            }}
          >
            <ClipboardList size={14} />
            Prep Checklist
            {isPrepExpanded ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      {isPrepExpanded && (
        <div
          style={{
            borderTop: "1px solid var(--border, #e2e8f0)",
            padding: "1.25rem 1.5rem",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-3, #94a3b8)",
                }}
              >
                Engagement Preparation Progress
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color:
                    completedCount === prepSteps.length ? "#16a34a" : "#d97706",
                }}
              >
                {completedCount}/{prepSteps.length} Complete
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "var(--border, #e2e8f0)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedCount / prepSteps.length) * 100}%`,
                  background:
                    completedCount === prepSteps.length ? "#16a34a" : "#d97706",
                  borderRadius: "99px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {prepSteps.map((step) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: step.done ? "#bbf7d0" : "var(--border, #e2e8f0)",
                  background: step.done ? "#f0fdf4" : "var(--bg-card, #fff)",
                }}
              >
                <div
                  style={{
                    marginTop: "0.15rem",
                    color: step.done ? "#16a34a" : "#94a3b8",
                    flexShrink: 0,
                  }}
                >
                  {step.done ? <CheckCircle size={18} /> : <Clock size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: step.done ? "#166534" : "var(--text, #0f172a)",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.775rem",
                      color: step.done ? "#166534" : "var(--text-3, #94a3b8)",
                      marginTop: "0.2rem",
                    }}
                  >
                    {step.note}
                  </div>
                </div>
                <div
                  style={{
                    color: step.done ? "#16a34a" : "var(--text-3, #94a3b8)",
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

          {!hasCOI && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#92400e",
                  }}
                >
                  Independence Declaration Required
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#78350f",
                    marginTop: "0.25rem",
                  }}
                >
                  Complete your Conflict of Interest declaration to unlock the
                  next preparation steps.
                </div>
              </div>
              <button
                onClick={() => onStartCOI(inv.id)}
                style={{
                  padding: "0.6rem 1.2rem",
                  background: "#d97706",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.825rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <ShieldCheck size={14} /> Declare Independence
              </button>
            </div>
          )}

          {hasCOI && (
            <div
              style={{
                marginTop: "1.25rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid var(--border, #e2e8f0)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <FileText size={20} style={{ color: "#4f46e5" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Engagement Letter
                  </div>
                  <div
                    style={{
                      fontSize: "0.775rem",
                      color: "var(--text-3)",
                      marginTop: "0.15rem",
                    }}
                  >
                    Ref: EL-2024-{inv.lgaId?.toUpperCase() ?? "LGA"} · Issued by
                    Supervisor
                  </div>
                </div>
                <button
                  style={{
                    marginLeft: "auto",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "var(--primary, #4f46e5)",
                  }}
                >
                  View
                </button>
              </div>
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid var(--border, #e2e8f0)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <BookOpen size={20} style={{ color: "#0891b2" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Audit Charter
                  </div>
                  <div
                    style={{
                      fontSize: "0.775rem",
                      color: "var(--text-3)",
                      marginTop: "0.15rem",
                    }}
                  >
                    LASG Standing Instructions 2024 · Mandatory reading
                  </div>
                </div>
                <button
                  style={{
                    marginLeft: "auto",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "var(--primary, #4f46e5)",
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedInvitationCard;
