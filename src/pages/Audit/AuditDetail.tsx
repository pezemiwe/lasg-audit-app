import React, { useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FlaskConical,
  FolderOpen,
  Target,
  ClipboardList,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import s from "../../styles/pages.module.css";

// Import existing page components to embed
import AuditPlanningPage from "../AuditPlanning";
import FieldworkPage from "../Fieldwork";
import PostAuditPage from "../PostAudit";
import DocumentPortalPage from "../DocumentPortal";
import ReportsPage from "../Reports";
import PreAuditPage from "../PreAudit";
import QuestionnairePage from "../Questionnaire";

const AuditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const proposeAuditTimelines = useAuditStore((st) => st.proposeAuditTimelines);
  const approveAuditTimelines = useAuditStore((st) => st.approveAuditTimelines);

  const audit = audits.find((a) => a.id === id);
  const lga = lgas.find((l) => l.id === audit?.lgaId);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "engagement";
  const setActiveTab = useCallback(
    (tab: string) =>
      setSearchParams(
        (prev) => {
          prev.set("tab", tab);
          return prev;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

  // Auto-switch to the right tab on first visit (only if no tab in URL)
  React.useEffect(() => {
    if (searchParams.has("tab")) return;
    if (audit?.status === "Completed") setActiveTab("post-audit");
    else if (audit?.status === "Reporting") setActiveTab("reporting");
    else if (audit?.status === "Fieldwork") setActiveTab("fieldwork");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audit?.status]);

  const [isEditingTimelines, setIsEditingTimelines] = useState(false);
  const [timelineForm, setTimelineForm] = useState<
    Record<string, { startDate: string; endDate: string }>
  >({});

  const PHASES = [
    "Engagement",
    "Planning",
    "Risk Assessment",
    "Fieldwork",
    "Reporting",
    "Quality Review",
    "Post-Audit",
  ];

  const handleEditTimelines = () => {
    const source = audit?.proposedTimelines ?? audit?.phaseTimelines;
    if (source) {
      setTimelineForm({ ...source });
    } else {
      const defaults: Record<string, { startDate: string; endDate: string }> =
        {};
      PHASES.forEach((p) => {
        defaults[p] = { startDate: "", endDate: "" };
      });
      setTimelineForm(defaults);
    }
    setIsEditingTimelines(true);
  };

  const handleSaveTimelines = () => {
    if (audit) {
      proposeAuditTimelines(audit.id, timelineForm);
      setIsEditingTimelines(false);
    }
  };

  if (!audit || !user) {
    return (
      <div className={s.container}>
        <div className={s.pageHeader}>
          <button className={s.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1>Audit Not Found</h1>
        </div>
      </div>
    );
  }

  const isAG =
    user.role === "STATE_AUDITOR_GENERAL" ||
    user.role === "AUDITOR_GENERAL_FEDERATION";

  /* ──────────────────────────────────────────────
   *  ISA-aligned Audit Lifecycle Tabs
   *  Phase 1 – Engagement Acceptance & Pre-Engagement
   *  Phase 2 – Risk Assessment & Planning (ISA 300/315)
   *  Phase 3 – Fieldwork Execution (ISA 500/530)
   *  Phase 4 – Reporting & Quality Review (ISA 700/706)
   *  Phase 5 – Post-Audit & Follow-Up
   *  Supporting – Audit File / Documents
   * ────────────────────────────────────────────── */
  const tabs = [
    { id: "engagement", label: "Engagement", icon: BookOpen },
    ...(!isAG
      ? [{ id: "questionnaire", label: "Risk Assessment", icon: ClipboardList }]
      : []),
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "fieldwork", label: "Fieldwork", icon: FlaskConical },
    { id: "reporting", label: "Reporting", icon: BarChart3 },
    { id: "quality-review", label: "Quality Review", icon: ShieldCheck },
    { id: "post-audit", label: "Post-Audit", icon: Target },
    { id: "documents", label: "Audit File", icon: FolderOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "engagement":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Audit summary card */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Engagement Summary</h3>
              </div>
              <div className={s.cardBody}>
                <div className={s.gridTwoCols}>
                  <div>
                    <div className={s.label}>Entity Under Audit</div>
                    <div className={s.value}>{lga?.name || audit.lgaId}</div>
                  </div>
                  <div>
                    <div className={s.label}>Audit Type</div>
                    <div className={s.value}>{audit.type} Audit</div>
                  </div>
                  <div>
                    <div className={s.label}>Audit Year</div>
                    <div className={s.value}>{audit.year}</div>
                  </div>
                  <div>
                    <div className={s.label}>Current Phase</div>
                    <div style={{ marginTop: "0.5rem" }}>
                      <StatusBadge label={audit.status} />
                    </div>
                  </div>
                  <div>
                    <div className={s.label}>Engagement Start</div>
                    <div className={s.value}>
                      {audit.startDate || "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className={s.label}>Target Completion</div>
                    <div className={s.value}>{audit.endDate || "Not set"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Timelines */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <h3 className={s.cardTitle}>Phase Timelines</h3>
                    {audit.proposedTimelines && !audit.timelinesApproved && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          background: "#fef3c7",
                          color: "#92400e",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Pending Approval
                      </span>
                    )}
                    {audit.timelinesApproved && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          background: "#d1fae5",
                          color: "#065f46",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Approved
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {!isEditingTimelines && user.role === "AUDIT_LEAD" && (
                      <button
                        className={s.btnSecondary}
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.25rem 0.75rem",
                        }}
                        onClick={handleEditTimelines}
                      >
                        {audit.proposedTimelines
                          ? "Edit Proposal"
                          : "Set Timelines"}
                      </button>
                    )}
                    {!isEditingTimelines &&
                      user.role === "AUDIT_SUPERVISOR" &&
                      audit.proposedTimelines &&
                      !audit.timelinesApproved && (
                        <button
                          className={s.btnPrimary}
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.25rem 0.75rem",
                          }}
                          onClick={() => approveAuditTimelines(audit.id)}
                        >
                          Approve Timelines
                        </button>
                      )}
                    {isEditingTimelines && (
                      <>
                        <button
                          className={s.btnSecondary}
                          onClick={() => setIsEditingTimelines(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className={s.btnPrimary}
                          onClick={handleSaveTimelines}
                        >
                          Submit for Approval
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={s.cardBody}>
                {isEditingTimelines ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    {PHASES.map((phase) => (
                      <div
                        key={phase}
                        className={s.card}
                        style={{ padding: "0.75rem", border: "1px solid #eee" }}
                      >
                        <div
                          style={{ fontWeight: 600, marginBottom: "0.5rem" }}
                        >
                          {phase}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <div style={{ flex: 1 }}>
                            <label
                              style={{ fontSize: "0.75rem", color: "#666" }}
                            >
                              Start
                            </label>
                            <input
                              type="date"
                              className={s.formInput}
                              style={{ padding: "0.25rem", width: "100%" }}
                              value={timelineForm[phase]?.startDate || ""}
                              onChange={(e) =>
                                setTimelineForm({
                                  ...timelineForm,
                                  [phase]: {
                                    ...(timelineForm[phase] || {
                                      startDate: "",
                                      endDate: "",
                                    }),
                                    startDate: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                display: "block",
                                fontSize: "0.75rem",
                                color: "#666",
                              }}
                            >
                              End
                            </label>
                            <input
                              type="date"
                              className={s.formInput}
                              style={{ padding: "0.25rem", width: "100%" }}
                              value={timelineForm[phase]?.endDate || ""}
                              onChange={(e) =>
                                setTimelineForm({
                                  ...timelineForm,
                                  [phase]: {
                                    ...(timelineForm[phase] || {
                                      startDate: "",
                                      endDate: "",
                                    }),
                                    endDate: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {audit.proposedTimelines && !audit.timelinesApproved && (
                      <div
                        style={{
                          marginBottom: "1rem",
                          fontSize: "0.8rem",
                          color: "#92400e",
                          background: "#fef9c3",
                          padding: "0.6rem 1rem",
                          borderRadius: "6px",
                          border: "1px solid #fde68a",
                        }}
                      >
                        These timelines were proposed by the Audit Lead and are
                        awaiting supervisor approval.
                      </div>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {(() => {
                        const timelines = audit.phaseTimelines ?? {};
                        const proposed = audit.proposedTimelines;
                        const displayTimelines =
                          proposed && !audit.timelinesApproved
                            ? proposed
                            : timelines;
                        const entries = Object.entries(displayTimelines);
                        return entries.length > 0 ? (
                          entries.map(([phase, dates]) => (
                            <div
                              key={phase}
                              className={s.card}
                              style={{
                                padding: "0.75rem",
                                background: "#f9fafb",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {phase}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#4b5563",
                                }}
                              >
                                <div>Start: {dates.startDate || "Not set"}</div>
                                <div>End: {dates.endDate || "Not set"}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{ fontStyle: "italic", color: "#6b7280" }}
                          >
                            No phase timelines set.
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pre-Engagement Tasks */}
            <PreAuditPage auditId={audit.id} embedded />
          </div>
        );

      case "questionnaire":
        return (
          <div className={s.tabContent}>
            <div className={s.sectionBlock}>
              <QuestionnairePage auditId={audit.id} embedded />
            </div>
          </div>
        );

      case "planning":
        return (
          <div className={s.tabContent}>
            <div className={s.sectionBlock} style={{ marginTop: "2rem" }}>
              <h3 className={s.sectionTitle}>Audit Plan & Strategy</h3>
              <AuditPlanningPage auditId={audit.id} embedded />
            </div>
          </div>
        );

      case "fieldwork":
        return <FieldworkPage auditId={audit.id} embedded />;

      case "reporting":
        return <ReportsPage auditId={audit.id} embedded />;

      case "quality-review":
        return (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>
                Engagement Quality Control Review (EQCR)
              </h3>
            </div>
            <div className={s.cardBody}>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                }}
              >
                The EQCR is a mandatory review per ISQM 1 / ISA 220 before the
                audit report is issued. The reviewer must be independent of the
                engagement team.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Financial Statements Review",
                    desc: "Verify figures agree with working papers",
                  },
                  {
                    label: "Significant Judgements",
                    desc: "Review materiality, going concern, estimates",
                  },
                  {
                    label: "Audit Evidence Sufficiency",
                    desc: "Confirm adequate evidence for all assertions",
                  },
                  {
                    label: "Independence Confirmation",
                    desc: "Re-confirm team independence declarations",
                  },
                  {
                    label: "Compliance with Standards",
                    desc: "ISA/IPSAS/ISSAI compliance check",
                  },
                  {
                    label: "Report Drafting Review",
                    desc: "Final audit opinion and management letter",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      background: "#f8fafc",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {item.desc}
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      <StatusBadge label="Pending" variant="default" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "post-audit":
        return <PostAuditPage auditId={audit.id} embedded />;

      case "documents":
        return <DocumentPortalPage auditId={audit.id} embedded />;

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className={s.btnSecondary}
            onClick={() => navigate("/audit")}
            style={{ padding: "0.5rem" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={s.pageTitle}>
              {tabs.find((t) => t.id === activeTab)?.label || "Audit Detail"}
            </h1>
            <p className={s.pageSubtitle}>
              {audit.status} Stage • Lead: {audit.leadId || "Unassigned"}
            </p>
          </div>
        </div>
        <StatusBadge label={audit.status} />
      </div>

      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "2rem",
          overflowX: "auto",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "1rem 1.5rem",
                background: "transparent",
                border: "none",
                borderBottom: isActive
                  ? "3px solid #0369a1"
                  : "3px solid transparent",
                color: isActive ? "#0369a1" : "#64748b",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <tab.icon
                size={18}
                color={isActive ? "#0369a1" : "#64748b"}
                className={isActive ? "text-sky-700" : "text-slate-500"}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ minHeight: "500px" }}>{renderContent()}</div>
    </div>
  );
};

export default AuditDetail;
