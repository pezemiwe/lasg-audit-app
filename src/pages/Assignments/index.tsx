import React, { useMemo, useState } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Calendar,
  ShieldCheck,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import s from "../../styles/pages.module.css";

// Conflict of Interest declaration questions
const COI_DECLARATIONS = [
  "I have no personal, financial, or professional conflict of interest with this LGA or any of its officials.",
  "I have not provided any services or accepted any gifts from this LGA in the past 24 months.",
  "No member of my immediate family is employed by or holds a directorial position in this LGA.",
  "I am not aware of any circumstance that could impair my objectivity or independence on this engagement.",
];

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const invitations = useAuditStore((st) => st.invitations);
  const acceptInvitation = useAuditStore((st) => st.acceptInvitation);
  const declineInvitation = useAuditStore((st) => st.declineInvitation);
  const openModal = useAuditStore((st) => st.openModal);
  const lgas = useAuditStore((st) => st.lgas);
  const zones = useAuditStore((st) => st.zones);
  const mandates = useAuditStore((st) => st.mandates);

  // COI modal state
  const [showCOIModal, setShowCOIModal] = useState(false);
  const [coiTargetId, setCoiTargetId] = useState<string | null>(null);
  const [coiChecks, setCoiChecks] = useState<boolean[]>(
    COI_DECLARATIONS.map(() => false),
  );
  // Track which invitations have completed COI
  const [coiCompleted, setCoiCompleted] = useState<Set<string>>(new Set());
  // Track expanded prep panel per accepted invitation
  const [expandedPrep, setExpandedPrep] = useState<Set<string>>(new Set());

  const myInvitations = useMemo(
    () => (user ? invitations.filter((i) => i.userId === user.id) : []),
    [invitations, user],
  );

  const pending = myInvitations.filter((i) => i.status === "Pending");
  const accepted = myInvitations.filter((i) => i.status === "Accepted");
  const declined = myInvitations.filter((i) => i.status === "Declined");

  const allCOIChecked = coiChecks.every(Boolean);

  const handleAccept = (invId: string) => {
    // Require COI declaration before accepting
    setCoiTargetId(invId);
    setCoiChecks(COI_DECLARATIONS.map(() => false));
    setShowCOIModal(true);
  };

  const handleCOIConfirm = () => {
    if (!coiTargetId || !allCOIChecked) return;
    setCoiCompleted((prev) => new Set([...prev, coiTargetId]));
    acceptInvitation(coiTargetId);
    setShowCOIModal(false);
    setCoiTargetId(null);
  };

  const handleDecline = (invId: string) => {
    openModal({
      title: "Decline Assignment",
      message:
        "Are you sure you want to decline this assignment? The supervisor will be notified and may reassign the engagement.",
      confirmText: "Decline",
      variant: "danger",
      onConfirm: () => declineInvitation(invId),
    });
  };

  const togglePrep = (invId: string) => {
    setExpandedPrep((prev) => {
      const next = new Set(prev);
      if (next.has(invId)) {
        next.delete(invId);
      } else {
        next.add(invId);
      }
      return next;
    });
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "AUDIT_LEAD":
        return "Audit Lead";
      case "TEAM_AUDITOR":
        return "Team Auditor";
      case "AUDIT_SUPERVISOR":
        return "Audit Supervisor";
      default:
        return role;
    }
  };

  const getLgaName = (id?: string) =>
    lgas.find((l) => l.id === id)?.name || "—";
  const getZoneName = (id?: string) =>
    zones.find((z) => z.id === id)?.name || "—";
  const getMandateTitle = (id: string) =>
    mandates.find((m) => m.id === id)?.title || "—";

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Assignments</h1>
          <p className={s.pageSubtitle}>
            Review and respond to your audit engagement invitations
          </p>
        </div>
        <span className={s.pageBadge}>
          <Briefcase size={12} /> {user?.role.replace(/_/g, " ")}
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending</div>
            <div className={s.kpiValue}>{pending.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Accepted</div>
            <div className={s.kpiValue}>{accepted.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Mail size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total</div>
            <div className={s.kpiValue}>{myInvitations.length}</div>
          </div>
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Pending Invitations
          </div>
          {pending.map((inv) => (
            <div key={inv.id} className={s.invitationCard}>
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
                      background: "#fffbeb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#d97706",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text, #0f172a)",
                      }}
                    >
                      {getRoleName(inv.role)} Assignment
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {inv.lgaId && `${getLgaName(inv.lgaId)}`}
                      {inv.zoneId && `${getZoneName(inv.zoneId)} Zone`}
                      {` · Sent ${new Date(inv.sentAt).toLocaleDateString("en-NG")}`}
                    </div>
                  </div>
                </div>
                <div className={s.invitationActions}>
                  <button
                    className={`${s.btnPrimary} ${s.btnSmall}`}
                    onClick={() => handleAccept(inv.id)}
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    className={`${s.btnDanger} ${s.btnSmall}`}
                    onClick={() => handleDecline(inv.id)}
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
              <div className={s.invitationBody}>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Mandate</div>
                  <div className={s.detailValue}>
                    {getMandateTitle(inv.mandateId)}
                  </div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Role</div>
                  <div className={s.detailValue}>
                    <StatusBadge label={getRoleName(inv.role)} variant="gold" />
                  </div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Expires</div>
                  <div className={s.detailValue}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Calendar size={14} style={{ color: "#64748b" }} />
                      {new Date(inv.expiresAt).toLocaleString("en-NG")}
                    </div>
                  </div>
                </div>
                {/* COI pre-acceptance notice */}
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                  }}
                >
                  <AlertTriangle
                    size={15}
                    style={{
                      color: "#d97706",
                      marginTop: "0.1rem",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#92400e",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Required:</strong> You must complete a Conflict of
                    Interest Declaration before accepting this engagement.
                    Clicking <em>Accept</em> will open the declaration form.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {accepted.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Active Assignments
          </div>
          {accepted.map((inv) => {
            const hasCOI = coiCompleted.has(inv.id);
            const isPrepExpanded = expandedPrep.has(inv.id);
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
              <div key={inv.id} className={s.invitationCard}>
                {/* Header */}
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
                      onClick={() => togglePrep(inv.id)}
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

                {/* Engagement Preparation Checklist */}
                {isPrepExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid var(--border, #e2e8f0)",
                      padding: "1.25rem 1.5rem",
                    }}
                  >
                    {/* Progress bar */}
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
                              completedCount === prepSteps.length
                                ? "#16a34a"
                                : "#d97706",
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
                              completedCount === prepSteps.length
                                ? "#16a34a"
                                : "#d97706",
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Step list */}
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
                            borderColor: step.done
                              ? "#bbf7d0"
                              : "var(--border, #e2e8f0)",
                            background: step.done
                              ? "#f0fdf4"
                              : "var(--bg-card, #fff)",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "0.15rem",
                              color: step.done ? "#16a34a" : "#94a3b8",
                              flexShrink: 0,
                            }}
                          >
                            {step.done ? (
                              <CheckCircle size={18} />
                            ) : (
                              <Clock size={18} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: step.done
                                  ? "#166534"
                                  : "var(--text, #0f172a)",
                              }}
                            >
                              {step.label}
                            </div>
                            <div
                              style={{
                                fontSize: "0.775rem",
                                color: step.done
                                  ? "#166534"
                                  : "var(--text-3, #94a3b8)",
                                marginTop: "0.2rem",
                              }}
                            >
                              {step.note}
                            </div>
                          </div>
                          <div
                            style={{
                              color: step.done
                                ? "#16a34a"
                                : "var(--text-3, #94a3b8)",
                              flexShrink: 0,
                            }}
                          >
                            {step.icon}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* COI action button if not declared */}
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
                            Complete your Conflict of Interest declaration to
                            unlock the next preparation steps.
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCoiTargetId(inv.id);
                            setCoiChecks(COI_DECLARATIONS.map(() => false));
                            setShowCOIModal(true);
                          }}
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

                    {/* Engagement reference info */}
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
                            <div
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              Engagement Letter
                            </div>
                            <div
                              style={{
                                fontSize: "0.775rem",
                                color: "var(--text-3)",
                                marginTop: "0.15rem",
                              }}
                            >
                              Ref: EL-2024-{inv.lgaId?.toUpperCase() ?? "LGA"} ·
                              Issued by Supervisor
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
                            <div
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              Audit Charter
                            </div>
                            <div
                              style={{
                                fontSize: "0.775rem",
                                color: "var(--text-3)",
                                marginTop: "0.15rem",
                              }}
                            >
                              LASG Standing Instructions 2024 · Mandatory
                              reading
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
          })}
        </>
      )}

      {declined.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Declined
          </div>
          {declined.map((inv) => (
            <div
              key={inv.id}
              className={s.invitationCard}
              style={{ opacity: 0.6 }}
            >
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
                      background: "#fef2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#dc2626",
                      flexShrink: 0,
                    }}
                  >
                    <XCircle size={20} />
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
                      {inv.lgaId ? getLgaName(inv.lgaId) : ""}
                    </div>
                  </div>
                </div>
                <StatusBadge label="Declined" variant="error" />
              </div>
            </div>
          ))}
        </>
      )}

      {myInvitations.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Mail size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No assignments yet</div>
              <div className={s.emptyDesc}>
                You have not received any audit engagement invitations.
                Assignments will appear here when a supervisor or lead adds you
                to their team.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Conflict of Interest Declaration Modal ── */}
      {showCOIModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-card, #fff)",
              borderRadius: "10px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: "540px",
              border: "1px solid var(--border, #e2e8f0)",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "1.5rem 1.75rem 1.25rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} style={{ color: "#d97706" }} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                  }}
                >
                  Independence & Conflict of Interest Declaration
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-3)",
                    marginTop: "0.25rem",
                  }}
                >
                  LASG Office of the Auditor-General — Mandatory Pre-Engagement
                  Requirement
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: "1.5rem 1.75rem" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-2)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                As required by the Lagos State Audit Service Standing
                Instructions, you must declare your independence and confirm the
                absence of any conflict of interest before commencing this
                engagement. Please read and check each statement carefully.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {COI_DECLARATIONS.map((text, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "0.85rem 1rem",
                      border: "1px solid",
                      borderColor: coiChecks[idx]
                        ? "#86efac"
                        : "var(--border, #e2e8f0)",
                      borderRadius: "6px",
                      background: coiChecks[idx]
                        ? "#f0fdf4"
                        : "var(--bg, #f8fafc)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={coiChecks[idx]}
                      onChange={(e) => {
                        const next = [...coiChecks];
                        next[idx] = e.target.checked;
                        setCoiChecks(next);
                      }}
                      style={{
                        marginTop: "0.15rem",
                        flexShrink: 0,
                        accentColor: "#16a34a",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                        color: coiChecks[idx]
                          ? "#166534"
                          : "var(--text, #0f172a)",
                        fontWeight: coiChecks[idx] ? 500 : 400,
                      }}
                    >
                      {text}
                    </span>
                  </label>
                ))}
              </div>

              {!allCOIChecked && (
                <div
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.8rem",
                    color: "#b45309",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <AlertTriangle size={14} />
                  All four declarations must be confirmed to proceed.
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div
              style={{
                padding: "1.25rem 1.75rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                background: "var(--bg, #f8fafc)",
              }}
            >
              <button
                onClick={() => setShowCOIModal(false)}
                style={{
                  padding: "0.65rem 1.25rem",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCOIConfirm}
                disabled={!allCOIChecked}
                style={{
                  padding: "0.65rem 1.5rem",
                  background: allCOIChecked ? "#16a34a" : "#e5e7eb",
                  color: allCOIChecked ? "white" : "#9ca3af",
                  border: "none",
                  borderRadius: "6px",
                  cursor: allCOIChecked ? "pointer" : "not-allowed",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "background 0.2s",
                }}
              >
                <ShieldCheck size={15} />
                {coiTargetId && accepted.find((i) => i.id === coiTargetId)
                  ? "Submit Declaration"
                  : "Declare & Accept Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
