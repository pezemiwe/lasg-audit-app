import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import QuestionnairePage from "../Questionnaire";
import AuditPlanningPage from "../AuditPlanning";
import FieldworkPage from "../Fieldwork";
import PostAuditPage from "../PostAudit";
import ScopeAgreementPage from "../ScopeAgreement";
import DocumentPortalPage from "../DocumentPortal";
import ReportsPage from "../Reports";
import PreAuditPage from "../PreAudit";

const AuditDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const updateAuditTimelines = useAuditStore((st) => st.updateAuditTimelines);

  const audit = audits.find((a) => a.id === id);
  const lga = lgas.find((l) => l.id === audit?.lgaId);

  const [activeTab, setActiveTab] = useState("engagement");

  // Auto-switch to Post-Audit if Completed, Reporting if in Reporting phase
  React.useEffect(() => {
    if (audit?.status === "Completed") {
      setActiveTab("post-audit");
    } else if (audit?.status === "Reporting") {
      setActiveTab("reporting");
    } else if (audit?.status === "Fieldwork") {
      setActiveTab("fieldwork");
    }
  }, [audit?.status]);

  const [isEditingTimelines, setIsEditingTimelines] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timelineForm, setTimelineForm] = useState<
    Record<string, { startDate: string; endDate: string }>
  >({});

  const handleEditTimelines = () => {
    if (audit?.phaseTimelines) {
      setTimelineForm({ ...audit.phaseTimelines });
    } else {
      // Initialize default phases if empty
      const defaults: Record<string, { startDate: string; endDate: string }> =
        {};
      [
        "Pre-Audit",
        "Planning",
        "Fieldwork",
        "Reporting",
        "Review",
        "Post-Audit",
      ].forEach((p) => {
        defaults[p] = { startDate: "", endDate: "" };
      });
      setTimelineForm(defaults);
    }
    setIsEditingTimelines(true);
  };

  const handleSaveTimelines = () => {
    if (audit) {
      updateAuditTimelines(audit.id, timelineForm);
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
      /* ─── Phase 1: Engagement Acceptance ─── */
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
                  <h3 className={s.cardTitle}>Phase Timelines</h3>
                  {!isEditingTimelines &&
                    (user.role === "AUDIT_SUPERVISOR" ||
                      user.role === "AUDIT_LEAD" ||
                      user.role === "STATE_AUDITOR_GENERAL") && (
                      <button
                        className={s.btnSecondary}
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.25rem 0.75rem",
                        }}
                        onClick={handleEditTimelines}
                      >
                        Manage Timelines
                      </button>
                    )}
                  {isEditingTimelines && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
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
                        Save Changes
                      </button>
                    </div>
                  )}
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
                    {[
                      "Pre-Audit",
                      "Planning",
                      "Fieldwork",
                      "Reporting",
                      "Review",
                      "Post-Audit",
                    ].map((phase) => (
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {audit.phaseTimelines &&
                      Object.entries(audit.phaseTimelines).map(
                        ([phase, dates]) => (
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
                              style={{ fontSize: "0.75rem", color: "#4b5563" }}
                            >
                              <div>Start: {dates.startDate || "Not set"}</div>
                              <div>End: {dates.endDate || "Not set"}</div>
                            </div>
                          </div>
                        ),
                      )}
                    {(!audit.phaseTimelines ||
                      Object.keys(audit.phaseTimelines).length === 0) && (
                      <div style={{ fontStyle: "italic", color: "#6b7280" }}>
                        No phase timelines set.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pre-Engagement Tasks */}
            <PreAuditPage auditId={audit.id} embedded />
          </div>
        );

      /* ─── Phase 2: Risk Assessment (Questionnaire + Scope) ─── */
      case "questionnaire":
        return (
          <div className={s.tabContent}>
            <div className={s.sectionBlock}>
              <QuestionnairePage auditId={audit.id} embedded />
            </div>
          </div>
        );

      /* ─── Phase 2b: Planning (Scope Agreement + Audit Strategy) ─── */
      case "planning":
        return (
          <div className={s.tabContent}>
            <div className={s.sectionBlock}>
              <h3 className={s.sectionTitle}>Scope Agreement</h3>
              <ScopeAgreementPage auditId={audit.id} embedded />
            </div>
            <div className={s.sectionBlock} style={{ marginTop: "2rem" }}>
              <h3 className={s.sectionTitle}>Audit Plan & Strategy</h3>
              <AuditPlanningPage />
            </div>
          </div>
        );

      /* ─── Phase 3: Fieldwork Execution ─── */
      case "fieldwork":
        return <FieldworkPage auditId={audit.id} embedded />;

      /* ─── Phase 4: Reporting ─── */
      case "reporting":
        return <ReportsPage auditId={audit.id} embedded />;

      /* ─── Phase 4b: Quality Review (EQCR) ─── */
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

      /* ─── Phase 5: Post-Audit & Follow-Up ─── */
      case "post-audit":
        return <PostAuditPage auditId={audit.id} embedded />;

      /* ─── Audit File / Documents ─── */
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
              {audit.type} Audit - {lga?.name} ({audit.year})
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
