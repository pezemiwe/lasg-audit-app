import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import type {
  FollowUpStatus,
  LessonCategory,
  QualityRating,
} from "../../types";
import {
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Star,
  Users,
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  Shield,
  BarChart3,
  ArrowRight,
  FileText,
  Target,
  FileSignature,
} from "lucide-react";
import s from "../../styles/pages.module.css";

/* ─── Helpers ─── */
const userName = (id: string) =>
  MOCK_USERS.find((u) => u.id === id)?.name ?? id;

const followUpVariant = (st: FollowUpStatus) => {
  switch (st) {
    case "Open":
      return "default" as const;
    case "In Progress":
      return "info" as const;
    case "Implemented":
      return "warning" as const;
    case "Verified":
      return "success" as const;
    case "Overdue":
      return "error" as const;
  }
};

const LESSON_CATEGORIES: LessonCategory[] = [
  "Process Improvement",
  "Risk Management",
  "Resource Allocation",
  "Methodology",
  "Communication",
  "Technology",
];

const TABS = [
  { key: "summary", label: "Audit Review", icon: BarChart3 },
  { key: "scope", label: "Scope & Timeline", icon: FileSignature },
  { key: "follow-ups", label: "Follow-Up Tracker", icon: Target },
  { key: "exit-conference", label: "Exit Conference", icon: Users },
  { key: "lessons", label: "Lessons Learned", icon: BookOpen },
  { key: "quality", label: "Quality Review", icon: Star },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ─── Star Rating Component ─── */
const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div style={{ marginBottom: "0.75rem" }}>
    <label className={s.formLabel}>{label}</label>
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
          }}
        >
          <Star
            size={22}
            fill={n <= value ? "#f59e0b" : "none"}
            color={n <= value ? "#f59e0b" : "#d1d5db"}
          />
        </button>
      ))}
      <span
        style={{ marginLeft: "8px", fontSize: "0.85rem", color: "#6b7280" }}
      >
        {value}/5
      </span>
    </div>
  </div>
);

interface PostAuditPageProps {
  auditId?: string;
  embedded?: boolean;
}

const PostAuditPage: React.FC<PostAuditPageProps> = ({
  auditId,
  embedded = false,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const reports = useAuditStore((st) => st.reports);
  const followUps = useAuditStore((st) => st.followUps);
  const lessonsLearned = useAuditStore((st) => st.lessonsLearned);
  const qualityReviews = useAuditStore((st) => st.qualityReviews);
  const exitConferences = useAuditStore((st) => st.exitConferences);
  const scopeAgreements = useAuditStore((st) => st.scopeAgreements);
  const addFollowUp = useAuditStore((st) => st.addFollowUp);
  const updateFollowUp = useAuditStore((st) => st.updateFollowUp);
  const verifyFollowUp = useAuditStore((st) => st.verifyFollowUp);
  const addLesson = useAuditStore((st) => st.addLesson);
  const addQualityReview = useAuditStore((st) => st.addQualityReview);
  const addExitConference = useAuditStore((st) => st.addExitConference);
  const logActivity = useAuditStore((st) => st.logActivity);
  const addToast = useAuditStore((st) => st.addToast);

  const isAG =
    user?.role === "STATE_AUDITOR_GENERAL" ||
    user?.role === "AUDITOR_GENERAL_FEDERATION";
  const isSupervisor = user?.role === "AUDIT_SUPERVISOR";
  const isLead = user?.role === "AUDIT_LEAD";
  const isHLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const canManage = isSupervisor || isLead; // AG is viewer mostly

  /* Eligible audits: Completed or Reporting status */
  const eligibleAudits = useMemo(() => {
    if (!user) return [];
    // DEMO: All audits eligible
    return audits
      .filter(() => true)
      .sort((a) => (a.status === "Completed" ? -1 : 1));
    /*
    if (isAG) {
      // AG sees all completed/reporting audits
      return audits.filter(
        (a) => a.status === "Completed" || a.status === "Reporting",
      ).sort((a,b) => (a.status === 'Completed' ? -1 : 1));
    }
    if (isHLGA) {
      return audits.filter(
        (a) =>
          a.lgaId === user.lgaId &&
          (a.status === "Completed" || a.status === "Reporting"),
      );
    }
    if (isSupervisor) {
      // Logic for supervisor zone filtering would go here, simplified:
      return audits.filter(
        (a) => a.status === "Completed" || a.status === "Reporting",
      );
    }
    if (isLead) {
      return audits.filter(
        (a) =>
          a.leadId === user.id &&
          (a.status === "Completed" || a.status === "Reporting"),
      );
    }
    return audits.filter(
      (a) => a.status === "Completed" || a.status === "Reporting",
    ).sort((a,b) => (a.status === 'Completed' ? -1 : 1));
    */
  }, [audits, user, isHLGA, isLead, isAG, isSupervisor]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || eligibleAudits[0]?.id || "",
  );

  React.useEffect(() => {
    if (auditId) setSelectedAuditId(auditId);
  }, [auditId]);

  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);
  const selectedLga = lgas.find((l) => l.id === selectedAudit?.lgaId);
  const auditScope = scopeAgreements.find(
    (s) => s.auditId === selectedAuditId || s.lgaId === selectedAudit?.lgaId,
  );
  const auditReports = reports.filter((r) => r.auditId === selectedAuditId);
  const auditFollowUps = followUps.filter((f) => f.auditId === selectedAuditId);
  const auditLessons = lessonsLearned.filter(
    (l) => l.auditId === selectedAuditId,
  );
  const auditQualityReview = qualityReviews.find(
    (q) => q.auditId === selectedAuditId,
  );
  const auditExitConf = exitConferences.find(
    (c) => c.auditId === selectedAuditId,
  );

  /* ─── Follow-Up Form ─── */
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const allFindings = auditReports.flatMap((r) => r.findings);
  const [fuFindingId, setFuFindingId] = useState("");
  const [fuResponsible, setFuResponsible] = useState("");
  const [fuTargetDate, setFuTargetDate] = useState("");

  const handleAddFollowUp = () => {
    const finding = allFindings.find((f) => f.id === fuFindingId);
    if (!finding || !fuResponsible || !fuTargetDate) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Select finding, responsible party, and target date",
      });
      return;
    }
    addFollowUp({
      auditId: selectedAuditId,
      findingId: finding.id,
      findingTitle: finding.title,
      recommendation: finding.recommendation,
      responsibleParty: fuResponsible,
      targetDate: fuTargetDate,
      status: "Open",
    });
    logActivity({
      userId: user!.id,
      action: "CREATE_FOLLOW_UP",
      details: `Follow-up created for: ${finding.title}`,
      entityType: "follow-up",
      entityId: selectedAuditId,
    });
    setShowFollowUpForm(false);
    setFuFindingId("");
    setFuResponsible("");
    setFuTargetDate("");
  };

  const handleUpdateFollowUpStatus = (
    id: string,
    status: FollowUpStatus,
    notes?: string,
  ) => {
    if (status === "Verified") {
      verifyFollowUp(id, user!.id);
    } else {
      updateFollowUp(id, {
        status,
        ...(notes ? { implementationNotes: notes } : {}),
      });
    }
    logActivity({
      userId: user!.id,
      action: "UPDATE_FOLLOW_UP",
      details: `Follow-up status changed to ${status}`,
      entityType: "follow-up",
      entityId: id,
    });
  };

  /* ─── Exit Conference Form ─── */
  const [showExitForm, setShowExitForm] = useState(false);
  const [ecDate, setEcDate] = useState("");
  const [ecAttendees, setEcAttendees] = useState("");
  const [ecDiscussions, setEcDiscussions] = useState("");
  const [ecActions, setEcActions] = useState("");
  const [ecLgaRep, setEcLgaRep] = useState("");
  const [ecAuditRep] = useState(user?.name ?? "");

  const handleAddExitConference = () => {
    if (
      !ecDate ||
      !ecAttendees.trim() ||
      !ecDiscussions.trim() ||
      !ecActions.trim()
    ) {
      addToast({
        type: "error",
        title: "Required",
        message: "All exit conference fields are required",
      });
      return;
    }
    addExitConference({
      auditId: selectedAuditId,
      date: ecDate,
      attendees: ecAttendees.split(",").map((a) => a.trim()),
      agendaItems: [
        "Audit Findings Review",
        "Management Responses",
        "Follow-Up Actions",
        "Timeline Agreement",
      ],
      keyDiscussions: ecDiscussions,
      agreedActions: ecActions,
      lgaRepresentative: ecLgaRep,
      auditRepresentative: ecAuditRep,
      minutesApproved: false,
      createdBy: user!.id,
    });
    logActivity({
      userId: user!.id,
      action: "RECORD_EXIT_CONFERENCE",
      details: `Exit conference recorded for ${selectedLga?.name || selectedAuditId}`,
      entityType: "exit-conference",
      entityId: selectedAuditId,
    });
    setShowExitForm(false);
  };

  /* ─── Lesson Learned Form ─── */
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [llCategory, setLlCategory] = useState<LessonCategory>(
    "Process Improvement",
  );
  const [llTitle, setLlTitle] = useState("");
  const [llDescription, setLlDescription] = useState("");
  const [llImpact, setLlImpact] = useState<"Positive" | "Negative">("Positive");
  const [llAction, setLlAction] = useState("");

  const handleAddLesson = () => {
    if (!llTitle.trim() || !llDescription.trim()) {
      addToast({
        type: "error",
        title: "Required",
        message: "Title and description are required",
      });
      return;
    }
    addLesson({
      auditId: selectedAuditId,
      category: llCategory,
      title: llTitle,
      description: llDescription,
      impact: llImpact,
      actionRequired: llAction,
      submittedBy: user!.id,
    });
    logActivity({
      userId: user!.id,
      action: "ADD_LESSON_LEARNED",
      details: `Lesson: ${llTitle}`,
      entityType: "lesson",
      entityId: selectedAuditId,
    });
    setShowLessonForm(false);
    setLlTitle("");
    setLlDescription("");
    setLlAction("");
  };

  /* ─── Quality Review Form ─── */
  const [showQualityForm, setShowQualityForm] = useState(false);
  const [qrOverall, setQrOverall] = useState<QualityRating>(3);
  const [qrPlanning, setQrPlanning] = useState<QualityRating>(3);
  const [qrFieldwork, setQrFieldwork] = useState<QualityRating>(3);
  const [qrReporting, setQrReporting] = useState<QualityRating>(3);
  const [qrTeam, setQrTeam] = useState<QualityRating>(3);
  const [qrTimeliness, setQrTimeliness] = useState<QualityRating>(3);
  const [qrStrengths, setQrStrengths] = useState("");
  const [qrImprovements, setQrImprovements] = useState("");

  const handleSubmitQuality = () => {
    if (!qrStrengths.trim() || !qrImprovements.trim()) {
      addToast({
        type: "error",
        title: "Required",
        message: "Strengths and improvement areas required",
      });
      return;
    }
    addQualityReview({
      auditId: selectedAuditId,
      overallRating: qrOverall,
      planningQuality: qrPlanning,
      fieldworkQuality: qrFieldwork,
      reportingQuality: qrReporting,
      teamPerformance: qrTeam,
      timelinessRating: qrTimeliness,
      strengths: qrStrengths,
      improvements: qrImprovements,
      reviewedBy: user!.id,
    });
    logActivity({
      userId: user!.id,
      action: "SUBMIT_QUALITY_REVIEW",
      details: `Quality review submitted: ${qrOverall}/5 overall`,
      entityType: "quality-review",
      entityId: selectedAuditId,
    });
    setShowQualityForm(false);
  };

  /* ─── KPI Calculations ─── */
  const totalFollowUps = auditFollowUps.length;
  const verifiedCount = auditFollowUps.filter(
    (f) => f.status === "Verified",
  ).length;
  const overdueCount = auditFollowUps.filter((f) => {
    if (f.status === "Verified") return false;
    return new Date(f.targetDate) < new Date();
  }).length;
  const implementationRate =
    totalFollowUps > 0 ? Math.round((verifiedCount / totalFollowUps) * 100) : 0;

  /* ─── Render ─── */
  if (!user) return null;

  if (eligibleAudits.length === 0) {
    return (
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Post-Audit Activities</h1>
        <p className={s.pageSubtitle}>
          No completed or reporting-stage audits available for post-audit
          activities.
        </p>
        <div className={s.emptyState}>
          <ClipboardList size={48} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Eligible Audits</h3>
          <p className={s.emptyDesc}>
            Post-audit activities become available when audits reach the
            Reporting or Completed stage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!embedded && (
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Post-Audit Activities</h1>
          <p className={s.pageSubtitle}>
            Follow-ups, exit conferences, lessons learned &amp; quality
            assurance
          </p>
        </div>
      )}

      {/* ─── Audit Selector ─── */}
      {!embedded && (
        <div className={s.card} style={{ marginBottom: "1.5rem" }}>
          <div className={s.cardBody} style={{ padding: "1.25rem" }}>
            <div
              className={s.formGrid}
              style={{ gridTemplateColumns: "2fr 1fr" }}
            >
              <div className={s.formGroup}>
                <label className={s.formLabel}>Select Completed Audit</label>
                <select
                  className={s.formSelect}
                  value={selectedAuditId}
                  onChange={(e) => setSelectedAuditId(e.target.value)}
                >
                  {eligibleAudits
                    .sort((a) => (a.status === "Completed" ? -1 : 1))
                    .map((a) => {
                      const lga = lgas.find((l) => l.id === a.lgaId);
                      return (
                        <option key={a.id} value={a.id}>
                          {lga?.name || a.lgaId} — {a.type} Audit {a.year} (
                          {a.status})
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Current Status</label>
                <div
                  style={{
                    paddingTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <StatusBadge
                    label={selectedAudit?.status || ""}
                    variant={
                      selectedAudit?.status === "Completed"
                        ? "success"
                        : "warning"
                    }
                  />
                  {selectedAudit?.status === "Completed" && (
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#16a34a",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <CheckCircle size={14} /> Finalized
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── KPIs ─── */}
      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <Target className={s.kpiIconBlue} />
          <div>
            <div className={s.kpiLabel}>Follow-Ups</div>
            <div className={s.kpiValue}>{totalFollowUps}</div>
            <div className={s.kpiMeta}>{verifiedCount} verified</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <CheckCircle className={s.kpiIconGreen} />
          <div>
            <div className={s.kpiLabel}>Implementation Rate</div>
            <div className={s.kpiValue}>{implementationRate}%</div>
            <div className={s.kpiMeta}>
              {verifiedCount}/{totalFollowUps} items
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <AlertTriangle className={s.kpiIconAmber} />
          <div>
            <div className={s.kpiLabel}>Overdue</div>
            <div className={s.kpiValue}>{overdueCount}</div>
            <div className={s.kpiMeta}>past target date</div>
          </div>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: "1.5rem",
          gap: "2rem",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#064e3b" : "#64748b",
                borderBottom: isActive
                  ? "2px solid #064e3b"
                  : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════ TAB: Audit Summary ════════════ */}
      {activeTab === "summary" && (
        <>
          {selectedAudit?.status === "Completed" && (
            <div
              style={{
                background: "linear-gradient(to right, #ecfdf5, #f0fdf9)",
                border: "1px solid #a7f3d0",
                borderRadius: "8px",
                padding: "1.5rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Shield size={32} color="#059669" fill="#d1fae5" />
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#064e3b",
                    marginBottom: "0.25rem",
                  }}
                >
                  Audit Successfully Completed
                </h2>
                <p style={{ color: "#065f46", fontSize: "0.95rem" }}>
                  This audit cycle has been finalized. The final report has been
                  issued and all major findings have been addressed or
                  transferred to the follow-up tracker.
                </p>
              </div>
              <div>
                <button
                  className={s.btnPrimary}
                  onClick={() =>
                    addToast({
                      type: "success",
                      title: "Downloading",
                      message: "Downloading Final Report PDF...",
                    })
                  }
                >
                  <FileText size={16} /> Download Final Report
                </button>
              </div>
            </div>
          )}

          <div className={s.gridTwoCols}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Executive Summary</h3>
              </div>
              <div className={s.cardBody}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.5rem",
                  }}
                >
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Audit Entity (LGA)</div>
                    <div className={s.infoValue}>{selectedLga?.name}</div>
                  </div>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Audit Year</div>
                    <div className={s.infoValue}>{selectedAudit?.year}</div>
                  </div>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Audit Type</div>
                    <div className={s.infoValue}>{selectedAudit?.type}</div>
                  </div>
                  <div className={s.infoItem}>
                    <div className={s.infoLabel}>Audit Opinion</div>
                    <div
                      className={s.infoValue}
                      style={{ color: "#16a34a", fontWeight: 600 }}
                    >
                      Unqualified (Clean)
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "2rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "var(--text-1)",
                    }}
                  >
                    Objective Achievement
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#16a34a",
                        }}
                      ></div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      100%
                    </span>
                  </div>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.85rem",
                      color: "var(--text-2)",
                    }}
                  >
                    All audit objectives as defined in the planning phase were
                    successfully met.
                  </p>
                </div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Findings Impact Analysis</h3>
              </div>
              <div className={s.cardBody}>
                {allFindings.length === 0 ? (
                  <div className={s.emptyState}>
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      <CheckCircle
                        size={48}
                        style={{ color: "#16a34a", marginBottom: "1rem" }}
                      />
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                        Clean Audit!
                      </h3>
                      <p style={{ color: "var(--text-2)" }}>
                        No findings were recorded for this audit.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={s.kpiGrid}
                      style={{
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      <div
                        className={s.kpiBox}
                        style={{
                          background: "#fef2f2",
                          borderColor: "#fecaca",
                          padding: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "#dc2626",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {
                            allFindings.filter((f) => f.severity === "Critical")
                              .length
                          }
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#991b1b",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Critical
                        </div>
                      </div>
                      <div
                        className={s.kpiBox}
                        style={{
                          background: "#fff7ed",
                          borderColor: "#fed7aa",
                          padding: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "#ea580c",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {
                            allFindings.filter((f) => f.severity === "High")
                              .length
                          }
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#9a3412",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          High
                        </div>
                      </div>
                      <div
                        className={s.kpiBox}
                        style={{
                          background: "#fefce8",
                          borderColor: "#fde047",
                          padding: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "#d97706",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {
                            allFindings.filter((f) => f.severity === "Medium")
                              .length
                          }
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#854d0e",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Medium
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          marginBottom: "0.75rem",
                        }}
                      >
                        Top Risk Areas Identified
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {[
                          "Procurement",
                          "Financial Controls",
                          "Asset Management",
                        ].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              background: "#f1f5f9",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "2rem",
                              fontSize: "0.8rem",
                              color: "#475569",
                              fontWeight: 500,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════ TAB: Scope & Timeline ════════════ */}
      {activeTab === "scope" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Scope, Timeline & Sign-offs</h3>
          </div>
          <div className={s.cardBody}>
            {!auditScope ? (
              <div className={s.emptyState}>
                <FileSignature size={40} className={s.emptyIcon} />
                <div className={s.emptyTitle}>No Scope Agreement Found</div>
                <div className={s.emptyDesc}>
                  The scope agreement for this audit has not been initialized.
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", gap: "2rem" }}>
                    <div>
                      <div className={s.label}>Status</div>
                      <StatusBadge label={auditScope.status} />
                    </div>
                    <div>
                      <div className={s.label}>Total Duration</div>
                      <div className={s.value}>
                        {auditScope.totalWeeks} Weeks
                      </div>
                    </div>
                    <div>
                      <div className={s.label}>Created By</div>
                      <div className={s.value}>
                        {userName(auditScope.createdBy)}
                      </div>
                    </div>
                  </div>
                </div>

                <table className={s.dataTable}>
                  <thead>
                    <tr>
                      <th>Audit Area</th>
                      <th>Description</th>
                      <th>Expectations</th>
                      <th>Timeline</th>
                      <th>Auditor Sign-off</th>
                      <th>LGA Sign-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditScope.rows.map((row) => (
                      <tr key={row.id}>
                        <td style={{ fontWeight: 600 }}>{row.area}</td>
                        <td>{row.description}</td>
                        <td>{row.expectations}</td>
                        <td>{row.timelineWeeks} Weeks</td>
                        <td>
                          {row.auditorSignOff ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                color: "#16a34a",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle size={14} />
                              {row.auditorSignOff.name}
                            </div>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-3)",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          {row.lgaSignOff ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                color: "#16a34a",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle size={14} />
                              {row.lgaSignOff.name}
                            </div>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-3)",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════ TAB: Follow-Up Tracker ════════════ */}
      {activeTab === "follow-ups" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              <Target size={18} /> Follow-Up Tracker
            </h3>
            {canManage && allFindings.length > 0 && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
              >
                <Plus size={16} /> Add Follow-Up
              </button>
            )}
          </div>

          {showFollowUpForm && (
            <div className={s.cardBody}>
              <div
                style={{
                  padding: "1rem",
                  background: "#f0fdf4",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
                  Create Follow-Up Item
                </h4>
                <div className={s.formGrid}>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Select Finding</label>
                    <select
                      className={s.formSelect}
                      value={fuFindingId}
                      onChange={(e) => setFuFindingId(e.target.value)}
                    >
                      <option value="">âselect finding</option>
                      {allFindings.map((f) => (
                        <option key={f.id} value={f.id}>
                          [{f.severity}] {f.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Responsible Party</label>
                    <select
                      className={s.formSelect}
                      value={fuResponsible}
                      onChange={(e) => setFuResponsible(e.target.value)}
                    >
                      <option value="">select</option>
                      <option value="LGA Management">LGA Management</option>
                      <option value="Finance Department">
                        Finance Department
                      </option>
                      <option value="Internal Audit">Internal Audit</option>
                      <option value="Procurement Unit">Procurement Unit</option>
                      <option value="HR Department">HR Department</option>
                      <option value="IT Department">IT Department</option>
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Target Date</label>
                    <input
                      type="date"
                      className={s.formInput}
                      value={fuTargetDate}
                      onChange={(e) => setFuTargetDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button className={s.btnPrimary} onClick={handleAddFollowUp}>
                    <CheckCircle size={16} /> Create Follow-Up
                  </button>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowFollowUpForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.cardBody}>
            {auditFollowUps.length === 0 ? (
              <div className={s.emptyState}>
                <Target size={40} className={s.emptyIcon} />
                <h3 className={s.emptyTitle}>No Follow-Up Items</h3>
                <p className={s.emptyDesc}>
                  {canManage
                    ? "Create follow-up items from audit findings to track remediation."
                    : "Follow-up items will appear once created by the audit team."}
                </p>
              </div>
            ) : (
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>Finding</th>
                      <th>Responsible</th>
                      <th>Target Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditFollowUps.map((fu) => {
                      const isOverdue =
                        fu.status !== "Verified" &&
                        new Date(fu.targetDate) < new Date();
                      return (
                        <tr key={fu.id}>
                          <td>
                            <strong>{fu.findingTitle}</strong>
                            <br />
                            <small style={{ color: "#6b7280" }}>
                              {fu.recommendation.slice(0, 80)}...
                            </small>
                          </td>
                          <td>{fu.responsibleParty}</td>
                          <td>
                            <span
                              style={{
                                color: isOverdue ? "#dc2626" : "inherit",
                                fontWeight: isOverdue ? 600 : 400,
                              }}
                            >
                              {new Date(fu.targetDate).toLocaleDateString()}
                            </span>
                            {isOverdue && (
                              <small
                                style={{
                                  display: "block",
                                  color: "#dc2626",
                                  fontWeight: 600,
                                }}
                              >
                                OVERDUE
                              </small>
                            )}
                          </td>
                          <td>
                            <StatusBadge
                              label={
                                isOverdue && fu.status !== "Verified"
                                  ? "Overdue"
                                  : fu.status
                              }
                              variant={
                                isOverdue && fu.status !== "Verified"
                                  ? "error"
                                  : followUpVariant(fu.status)
                              }
                            />
                          </td>
                          <td>
                            {fu.implementationNotes || (
                              <span style={{ color: "#9ca3af" }}>-</span>
                            )}
                            {fu.verifiedBy && (
                              <small
                                style={{
                                  display: "block",
                                  color: "#059669",
                                  marginTop: "4px",
                                }}
                              >
                                Verified by {userName(fu.verifiedBy)}
                              </small>
                            )}
                          </td>
                          <td>
                            <div className={s.tableActions}>
                              {isHLGA && fu.status === "Open" && (
                                <button
                                  className={`${s.btnSmall} ${s.btnPrimary}`}
                                  onClick={() =>
                                    handleUpdateFollowUpStatus(
                                      fu.id,
                                      "In Progress",
                                      "Implementation started by LGA",
                                    )
                                  }
                                >
                                  Start
                                </button>
                              )}
                              {isHLGA && fu.status === "In Progress" && (
                                <button
                                  className={`${s.btnSmall} ${s.btnPrimary}`}
                                  onClick={() =>
                                    handleUpdateFollowUpStatus(
                                      fu.id,
                                      "Implemented",
                                      "Implementation completed, awaiting verification",
                                    )
                                  }
                                >
                                  Mark Implemented
                                </button>
                              )}
                              {canManage && fu.status === "Implemented" && (
                                <button
                                  className={`${s.btnSmall} ${s.btnGold}`}
                                  onClick={() =>
                                    handleUpdateFollowUpStatus(
                                      fu.id,
                                      "Verified",
                                    )
                                  }
                                >
                                  <CheckCircle size={14} /> Verify
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â• TAB: Exit Conference â•â•â•â•â•â•â• */}
      {activeTab === "exit-conference" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              <Users size={18} /> Exit Conference
            </h3>
            {canManage && !auditExitConf && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowExitForm(!showExitForm)}
              >
                <Plus size={16} /> Record Exit Conference
              </button>
            )}
          </div>

          {showExitForm && !auditExitConf && (
            <div className={s.cardBody}>
              <div
                style={{
                  padding: "1rem",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
                  Exit Conference Details
                </h4>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Conference Date *</label>
                    <input
                      type="date"
                      className={s.formInput}
                      value={ecDate}
                      onChange={(e) => setEcDate(e.target.value)}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>LGA Representative *</label>
                    <input
                      type="text"
                      className={s.formInput}
                      value={ecLgaRep}
                      onChange={(e) => setEcLgaRep(e.target.value)}
                      placeholder="Name of LGA representative"
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Attendees * (comma-separated)
                    </label>
                    <input
                      type="text"
                      className={s.formInput}
                      value={ecAttendees}
                      onChange={(e) => setEcAttendees(e.target.value)}
                      placeholder="e.g. John Doe, Jane Smith, Mohammed Ibrahim"
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Key Discussions *</label>
                    <textarea
                      className={s.formTextarea}
                      rows={4}
                      value={ecDiscussions}
                      onChange={(e) => setEcDiscussions(e.target.value)}
                      placeholder="Summarise key discussion points during the exit conference..."
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Agreed Actions *</label>
                    <textarea
                      className={s.formTextarea}
                      rows={3}
                      value={ecActions}
                      onChange={(e) => setEcActions(e.target.value)}
                      placeholder="List agreed follow-up actions and timelines..."
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnPrimary}
                    onClick={handleAddExitConference}
                  >
                    <CheckCircle size={16} /> Save Exit Conference
                  </button>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowExitForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.cardBody}>
            {auditExitConf ? (
              <div>
                <div className={s.gridTwoCols}>
                  <div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>Date</span>
                      <span className={s.detailValue}>
                        <Calendar size={14} style={{ marginRight: "6px" }} />
                        {new Date(auditExitConf.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>LGA Representative</span>
                      <span className={s.detailValue}>
                        {auditExitConf.lgaRepresentative}
                      </span>
                    </div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>
                        Audit Representative
                      </span>
                      <span className={s.detailValue}>
                        {auditExitConf.auditRepresentative}
                      </span>
                    </div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>Minutes Approved</span>
                      <span className={s.detailValue}>
                        <StatusBadge
                          label={
                            auditExitConf.minutesApproved
                              ? "Approved"
                              : "Pending"
                          }
                          variant={
                            auditExitConf.minutesApproved
                              ? "success"
                              : "warning"
                          }
                        />
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>Attendees</span>
                      <span className={s.detailValue}>
                        {auditExitConf.attendees.map((a, i) => (
                          <span
                            key={i}
                            className={s.poolTag}
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          >
                            {a}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>Agenda Items</span>
                      <span className={s.detailValue}>
                        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                          {auditExitConf.agendaItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  </div>
                </div>

                <div className={s.sectionDivider} />

                <div style={{ marginBottom: "1rem" }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FileText size={16} /> Key Discussions
                  </h4>
                  <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                    {auditExitConf.keyDiscussions}
                  </p>
                </div>

                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ArrowRight size={16} /> Agreed Actions
                  </h4>
                  <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                    {auditExitConf.agreedActions}
                  </p>
                </div>
              </div>
            ) : (
              <div className={s.emptyState}>
                <Users size={40} className={s.emptyIcon} />
                <h3 className={s.emptyTitle}>No Exit Conference Recorded</h3>
                <p className={s.emptyDesc}>
                  {canManage
                    ? "Record the exit conference with LGA management to document agreed-upon actions."
                    : "The exit conference will be recorded by the audit team."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â• TAB: Lessons Learned â•â•â•â•â•â•â• */}
      {activeTab === "lessons" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              <BookOpen size={18} /> Lessons Learned
            </h3>
            {(canManage || isHLGA) && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowLessonForm(!showLessonForm)}
              >
                <Plus size={16} /> Add Lesson
              </button>
            )}
          </div>

          {showLessonForm && (
            <div className={s.cardBody}>
              <div
                style={{
                  padding: "1rem",
                  background: "#fefce8",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
                  Record a Lesson Learned
                </h4>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Category</label>
                    <select
                      className={s.formSelect}
                      value={llCategory}
                      onChange={(e) =>
                        setLlCategory(e.target.value as LessonCategory)
                      }
                    >
                      {LESSON_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Impact</label>
                    <select
                      className={s.formSelect}
                      value={llImpact}
                      onChange={(e) =>
                        setLlImpact(e.target.value as "Positive" | "Negative")
                      }
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </select>
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Title *</label>
                    <input
                      type="text"
                      className={s.formInput}
                      value={llTitle}
                      onChange={(e) => setLlTitle(e.target.value)}
                      placeholder="Brief lesson title"
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Description *</label>
                    <textarea
                      className={s.formTextarea}
                      rows={3}
                      value={llDescription}
                      onChange={(e) => setLlDescription(e.target.value)}
                      placeholder="Describe what was learned and its context..."
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Action Required</label>
                    <input
                      type="text"
                      className={s.formInput}
                      value={llAction}
                      onChange={(e) => setLlAction(e.target.value)}
                      placeholder="What action should be taken based on this lesson"
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button className={s.btnPrimary} onClick={handleAddLesson}>
                    <CheckCircle size={16} /> Save Lesson
                  </button>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowLessonForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.cardBody}>
            {auditLessons.length === 0 ? (
              <div className={s.emptyState}>
                <BookOpen size={40} className={s.emptyIcon} />
                <h3 className={s.emptyTitle}>No Lessons Recorded</h3>
                <p className={s.emptyDesc}>
                  Document lessons learned from this audit to improve future
                  engagements.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {auditLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={s.findingCard}
                    style={{
                      borderLeftColor:
                        lesson.impact === "Positive" ? "#059669" : "#dc2626",
                    }}
                  >
                    <div className={s.findingHeader}>
                      <h4 className={s.findingTitle}>
                        {lesson.impact === "Positive" ? (
                          <TrendingUp size={16} style={{ color: "#059669" }} />
                        ) : (
                          <TrendingDown
                            size={16}
                            style={{ color: "#dc2626" }}
                          />
                        )}
                        {lesson.title}
                      </h4>
                      <StatusBadge label={lesson.category} variant="info" />
                    </div>
                    <div className={s.findingBody}>
                      <p>{lesson.description}</p>
                    </div>
                    {lesson.actionRequired && (
                      <div className={s.findingRec}>
                        <strong>Action Required:</strong>{" "}
                        {lesson.actionRequired}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        color: "#6b7280",
                      }}
                    >
                      Submitted by {userName(lesson.submittedBy)} ”¢{" "}
                      {new Date(lesson.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â• TAB: Quality Review â•â•â•â•â•â•â• */}
      {activeTab === "quality" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              <Star size={18} /> Quality Assurance Review
            </h3>
            {(isAG || isSupervisor) && !auditQualityReview && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowQualityForm(!showQualityForm)}
              >
                <Plus size={16} /> Submit Review
              </button>
            )}
          </div>

          {showQualityForm && !auditQualityReview && (
            <div className={s.cardBody}>
              <div
                style={{
                  padding: "1.25rem",
                  background: "#faf5ff",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h4 style={{ marginBottom: "1rem", fontWeight: 600 }}>
                  Quality Assessment
                </h4>
                <div className={s.gridTwoCols}>
                  <div>
                    <StarRating
                      value={qrOverall}
                      onChange={(v) => setQrOverall(v as QualityRating)}
                      label="Overall Rating"
                    />
                    <StarRating
                      value={qrPlanning}
                      onChange={(v) => setQrPlanning(v as QualityRating)}
                      label="Planning Quality"
                    />
                    <StarRating
                      value={qrFieldwork}
                      onChange={(v) => setQrFieldwork(v as QualityRating)}
                      label="Fieldwork Quality"
                    />
                  </div>
                  <div>
                    <StarRating
                      value={qrReporting}
                      onChange={(v) => setQrReporting(v as QualityRating)}
                      label="Reporting Quality"
                    />
                    <StarRating
                      value={qrTeam}
                      onChange={(v) => setQrTeam(v as QualityRating)}
                      label="Team Performance"
                    />
                    <StarRating
                      value={qrTimeliness}
                      onChange={(v) => setQrTimeliness(v as QualityRating)}
                      label="Timeliness"
                    />
                  </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>Key Strengths *</label>
                    <textarea
                      className={s.formTextarea}
                      rows={3}
                      value={qrStrengths}
                      onChange={(e) => setQrStrengths(e.target.value)}
                      placeholder="What went well during this audit..."
                    />
                  </div>
                  <div className={s.formGroupFull}>
                    <label className={s.formLabel}>
                      Areas for Improvement *
                    </label>
                    <textarea
                      className={s.formTextarea}
                      rows={3}
                      value={qrImprovements}
                      onChange={(e) => setQrImprovements(e.target.value)}
                      placeholder="What could be improved for future audits..."
                    />
                  </div>
                </div>
                <div className={s.formActions}>
                  <button
                    className={s.btnPrimary}
                    onClick={handleSubmitQuality}
                  >
                    <CheckCircle size={16} /> Submit Quality Review
                  </button>
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowQualityForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={s.cardBody}>
            {auditQualityReview ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    background:
                      auditQualityReview.overallRating >= 4
                        ? "#f0fdf4"
                        : auditQualityReview.overallRating >= 3
                          ? "#fefce8"
                          : "#fef2f2",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color:
                        auditQualityReview.overallRating >= 4
                          ? "#059669"
                          : auditQualityReview.overallRating >= 3
                            ? "#d97706"
                            : "#dc2626",
                    }}
                  >
                    {auditQualityReview.overallRating}/5
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                      Overall Quality Rating
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      Reviewed by {userName(auditQualityReview.reviewedBy)} ”¢{" "}
                      {new Date(
                        auditQualityReview.reviewedAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className={s.gridThreeCols}>
                  {[
                    {
                      label: "Planning",
                      val: auditQualityReview.planningQuality,
                    },
                    {
                      label: "Fieldwork",
                      val: auditQualityReview.fieldworkQuality,
                    },
                    {
                      label: "Reporting",
                      val: auditQualityReview.reportingQuality,
                    },
                    {
                      label: "Team Performance",
                      val: auditQualityReview.teamPerformance,
                    },
                    {
                      label: "Timeliness",
                      val: auditQualityReview.timelinessRating,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        padding: "0.75rem",
                        background: "#f9fafb",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginBottom: "4px",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "2px",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={16}
                            fill={n <= item.val ? "#f59e0b" : "none"}
                            color={n <= item.val ? "#f59e0b" : "#d1d5db"}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={s.sectionDivider} />

                <div className={s.gridTwoCols}>
                  <div>
                    <h4
                      style={{
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: "#059669",
                      }}
                    >
                      <TrendingUp size={16} /> Key Strengths
                    </h4>
                    <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                      {auditQualityReview.strengths}
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: "#d97706",
                      }}
                    >
                      <AlertTriangle size={16} /> Areas for Improvement
                    </h4>
                    <p style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                      {auditQualityReview.improvements}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.emptyState}>
                <Star size={40} className={s.emptyIcon} />
                <h3 className={s.emptyTitle}>No Quality Review</h3>
                <p className={s.emptyDesc}>
                  {isAG || isSupervisor
                    ? "Submit a quality assurance review for this audit engagement."
                    : "The quality review will be completed by the Supervisor or Auditor-General."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â• TAB: Audit Summary â•â•â•â•â•â•â• */}
      {activeTab === "summary" && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>
              <BarChart3 size={18} /> Audit Engagement Summary
            </h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.gridTwoCols}>
              {/* Left: General Info */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
                  General Information
                </h4>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>LGA</span>
                  <span className={s.detailValue}>
                    {selectedLga?.name || "-"}
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Audit Type</span>
                  <span className={s.detailValue}>
                    {selectedAudit?.type || "-"}
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Year</span>
                  <span className={s.detailValue}>
                    {selectedAudit?.year || "-"}
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Lead Auditor</span>
                  <span className={s.detailValue}>
                    {selectedAudit?.leadId
                      ? userName(selectedAudit.leadId)
                      : "Unassigned"}
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Status</span>
                  <span className={s.detailValue}>
                    <StatusBadge
                      label={selectedAudit?.status || "-"}
                      variant={
                        selectedAudit?.status === "Completed"
                          ? "success"
                          : "warning"
                      }
                    />
                  </span>
                </div>
              </div>

              {/* Right: Statistics */}
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
                  Engagement Statistics
                </h4>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Reports</span>
                  <span className={s.detailValue}>
                    {auditReports.length} report(s)
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Total Findings</span>
                  <span className={s.detailValue}>{allFindings.length}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Critical Findings</span>
                  <span className={s.detailValue}>
                    <span style={{ color: "#dc2626", fontWeight: 600 }}>
                      {
                        allFindings.filter((f) => f.severity === "Critical")
                          .length
                      }
                    </span>
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Follow-Up Items</span>
                  <span className={s.detailValue}>{totalFollowUps}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Implementation Rate</span>
                  <span className={s.detailValue}>
                    <span
                      style={{
                        color:
                          implementationRate >= 80
                            ? "#059669"
                            : implementationRate >= 50
                              ? "#d97706"
                              : "#dc2626",
                        fontWeight: 600,
                      }}
                    >
                      {implementationRate}%
                    </span>
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Exit Conference</span>
                  <span className={s.detailValue}>
                    <StatusBadge
                      label={auditExitConf ? "Completed" : "Pending"}
                      variant={auditExitConf ? "success" : "default"}
                    />
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Quality Review</span>
                  <span className={s.detailValue}>
                    {auditQualityReview ? (
                      <span>
                        {auditQualityReview.overallRating}/5{" "}
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={12}
                            fill={
                              n <= auditQualityReview.overallRating
                                ? "#f59e0b"
                                : "none"
                            }
                            color={
                              n <= auditQualityReview.overallRating
                                ? "#f59e0b"
                                : "#d1d5db"
                            }
                          />
                        ))}
                      </span>
                    ) : (
                      <StatusBadge label="Pending" variant="default" />
                    )}
                  </span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Lessons Learned</span>
                  <span className={s.detailValue}>
                    {auditLessons.length} recorded
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Audit Completion Status */}
            <div className={s.sectionDivider} />
            <h4 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              Post-Audit Completion Checklist
            </h4>
            <div className={s.gridThreeCols}>
              {[
                {
                  label: "Exit Conference",
                  done: !!auditExitConf,
                  icon: Users,
                },
                {
                  label: "Follow-Ups Created",
                  done: totalFollowUps > 0,
                  icon: Target,
                },
                {
                  label: "Quality Review",
                  done: !!auditQualityReview,
                  icon: Star,
                },
                {
                  label: "Lessons Documented",
                  done: auditLessons.length > 0,
                  icon: BookOpen,
                },
                {
                  label: "All Verified",
                  done: totalFollowUps > 0 && verifiedCount === totalFollowUps,
                  icon: Shield,
                },
                {
                  label: "Audit Closed",
                  done: selectedAudit?.status === "Completed",
                  icon: CheckCircle,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.75rem",
                    background: item.done ? "#f0fdf4" : "#f9fafb",
                    borderRadius: "6px",
                    border: item.done
                      ? "1px solid #bbf7d0"
                      : "1px solid #e5e7eb",
                  }}
                >
                  <item.icon
                    size={18}
                    color={item.done ? "#059669" : "#9ca3af"}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: item.done ? "#059669" : "#6b7280",
                      fontWeight: item.done ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                  {item.done && (
                    <CheckCircle
                      size={14}
                      style={{ marginLeft: "auto", color: "#059669" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PostAuditWrapper: React.FC<PostAuditPageProps> = (props) => (
  // <WorkflowGate phase="post-audit">
  <PostAuditPage {...props} />
  // </WorkflowGate>
);

export default PostAuditWrapper;
