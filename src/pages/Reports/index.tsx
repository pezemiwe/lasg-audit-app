import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import type { Finding, ReportStatus } from "../../types";
import {
  FileText,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Eye,
  ChevronLeft,
  Clock,
  BarChart3,
  Trash2,
  MessageSquare,
  Users,
  Shield,
} from "lucide-react";
import { WorkflowGate } from "../../components/UI/WorkflowGate";
import s from "../../styles/pages.module.css";

const reportStatusVariant = (st: ReportStatus) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Submitted":
      return "info" as const;
    case "Under Review":
      return "warning" as const;
    case "Revision Required":
      return "error" as const;
    case "Approved":
      return "success" as const;
    case "Final":
      return "gold" as const;
  }
};

const severityVariant = (sev: string) => {
  switch (sev) {
    case "Low":
      return "default" as const;
    case "Medium":
      return "warning" as const;
    case "High":
      return "error" as const;
    case "Critical":
      return "error" as const;
    default:
      return "default" as const;
  }
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/* ─── 3-Level Workflow Labels ─── */
const WORKFLOW_STEPS = [
  {
    key: "Draft",
    label: "1. Draft Report",
    desc: "Audit Lead creates draft with findings",
  },
  {
    key: "Submitted",
    label: "2. Supervisor Review",
    desc: "Supervisor reviews and approves or requests revision",
  },
  {
    key: "Approved",
    label: "3. Management Response",
    desc: "HLGA responds to each finding",
  },
  {
    key: "Final",
    label: "4. Final Report",
    desc: "Exit meeting held, report finalized",
  },
];

const ReportsPage: React.FC<{ auditId?: string; embedded?: boolean }> = ({
  auditId: propAuditId,
  embedded,
}) => {
  const { user } = useAuth();
  const reports = useAuditStore((st) => st.reports);
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const createReport = useAuditStore((st) => st.createReport);
  const submitReport = useAuditStore((st) => st.submitReport);
  const reviewReport = useAuditStore((st) => st.reviewReport);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);
  const logActivity = useAuditStore((st) => st.logActivity);

  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<
    "Preliminary" | "Draft" | "Final" | "Consolidated"
  >("Draft");
  const [formAuditId, setFormAuditId] = useState("");
  const [findings, setFindings] = useState<Omit<Finding, "id">[]>([]);

  const [findTitle, setFindTitle] = useState("");
  const [findDesc, setFindDesc] = useState("");
  const [findSeverity, setFindSeverity] =
    useState<Finding["severity"]>("Medium");
  const [findRec, setFindRec] = useState("");

  /* Management response drafts by finding ID */
  const [mgmtResponses, setMgmtResponses] = useState<Record<string, string>>(
    {},
  );
  /* Exit meeting state */
  const [exitMeetingNotes, setExitMeetingNotes] = useState("");
  const [exitMeetingDate, setExitMeetingDate] = useState("");

  const isHLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const isAG = user?.role === "STATE_AUDITOR_GENERAL";

  const myAudit = useMemo(() => {
    if (!user) return null;
    if (propAuditId) return audits.find((a) => a.id === propAuditId) || null;
    const myLga = lgas.find(
      (l) => l.auditLeadId === user.id || l.id === user.lgaId,
    );
    return audits.find((a) => a.lgaId === myLga?.id) || audits[0];
  }, [user, audits, lgas, propAuditId]);

  const myReports = useMemo(() => {
    if (propAuditId) return reports.filter((r) => r.auditId === propAuditId);
    if (
      user?.role === "AUDIT_SUPERVISOR" ||
      user?.role === "STATE_AUDITOR_GENERAL"
    )
      return reports;
    if (user?.role === "HEAD_OF_LOCAL_GOVERNMENT") {
      // HLGA sees reports that have been approved (awaiting management response) or finalized
      return reports.filter(
        (r) =>
          r.status === "Approved" ||
          r.status === "Under Review" ||
          r.status === "Final",
      );
    }
    if (!myAudit) return reports;
    return reports.filter((r) => r.auditId === myAudit.id);
  }, [reports, myAudit, user, propAuditId]);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId),
    [reports, selectedId],
  );

  const getLgaForAudit = (auditId: string) => {
    const audit = audits.find((a) => a.id === auditId);
    return lgas.find((l) => l.id === audit?.lgaId)?.name || "—";
  };

  const addFinding = () => {
    if (!findTitle.trim() || !findDesc.trim()) return;
    setFindings((prev) => [
      ...prev,
      {
        title: findTitle.trim(),
        description: findDesc.trim(),
        severity: findSeverity,
        recommendation: findRec.trim(),
        status: "Open" as const,
      },
    ]);
    setFindTitle("");
    setFindDesc("");
    setFindSeverity("Medium");
    setFindRec("");
  };

  const removeFinding = (idx: number) => {
    setFindings((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formAuditId || !user) return;
    createReport({
      auditId: formAuditId,
      title: formTitle.trim(),
      type: formType,
      status: "Draft",
      preparedBy: user.id,
      findings: findings.map((f) => ({ ...f, id: `finding-${uid()}` })),
    });
    setFormTitle("");
    setFormType("Draft");
    setFormAuditId("");
    setFindings([]);
    setView("list");
  };

  const handleSubmit = (reportId: string) => {
    openModal({
      title: "Submit Report",
      message:
        "Submit this audit report for supervisory review? The assigned supervisor will be notified.",
      confirmText: "Submit Report",
      variant: "info",
      onConfirm: () => {
        submitReport(reportId);
        addToast({ type: "success", title: "Report Submitted" });
      },
    });
  };

  const handleReview = (reportId: string, approved: boolean) => {
    if (!user) return;
    openModal({
      title: approved ? "Approve Report" : "Request Revision",
      message: approved
        ? "Approve this draft report? It will be sent to the LGA Head for Management Response."
        : "Request revisions on this report? The audit lead will be notified to make corrections.",
      confirmText: approved ? "Approve" : "Request Revision",
      variant: approved ? "info" : "warning",
      onConfirm: () => {
        reviewReport(reportId, user.id, approved);
        if (approved) {
          addToast({
            type: "success",
            title: "Report Approved — Awaiting Management Response",
            message: "The HLGA will now respond to each finding",
          });
          logActivity({
            userId: user.id,
            action: "APPROVE_DRAFT_REPORT",
            details: "Draft report approved — sent for management response",
            entityType: "report",
            entityId: reportId,
          });
        } else {
          addToast({
            type: "warning",
            title: "Revision Requested",
          });
        }
      },
    });
  };

  /* ─── HLGA: Submit Management Responses ─── */
  const handleSubmitMgmtResponse = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report || !user) return;
    const allResponded = report.findings.every((f) =>
      mgmtResponses[f.id]?.trim(),
    );
    if (!allResponded) {
      addToast({
        type: "warning",
        title: "Incomplete Responses",
        message: "Please respond to every finding before submitting",
      });
      return;
    }
    // Update each finding's managementResponse in the store
    useAuditStore.setState((state) => ({
      reports: state.reports.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          lgaResponse: `Management responses submitted by ${user.name} on ${new Date().toLocaleString("en-NG")}`,
          findings: r.findings.map((f) => ({
            ...f,
            managementResponse: mgmtResponses[f.id] || f.managementResponse,
            status: mgmtResponses[f.id]?.trim()
              ? ("Addressed" as const)
              : f.status,
          })),
          status: "Under Review" as const,
        };
      }),
    }));
    setMgmtResponses({});
    addToast({
      type: "success",
      title: "Management Responses Submitted",
      message:
        "Your responses have been recorded. The audit team will review and prepare the final report.",
    });
    logActivity({
      userId: user.id,
      action: "SUBMIT_MANAGEMENT_RESPONSE",
      details: `HLGA submitted management responses for ${report.findings.length} findings`,
      entityType: "report",
      entityId: reportId,
    });
  };

  /* ─── Finalize Report (after management response + exit meeting) ─── */
  const handleFinalizeReport = (reportId: string) => {
    if (!user) return;
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    const hasAllResponses = report.findings.every((f) => f.managementResponse);
    if (!hasAllResponses) {
      addToast({
        type: "warning",
        title: "Cannot Finalize",
        message:
          "All findings must have management responses before finalizing",
      });
      return;
    }
    openModal({
      title: "Finalize Audit Report",
      message:
        "Finalize this report? This marks the end of the reporting phase. The report will be included in the consolidated annual report to the AG.",
      confirmText: "Finalize Report",
      variant: "info",
      onConfirm: () => {
        useAuditStore.setState((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  status: "Final" as const,
                  type: "Final" as const,
                }
              : r,
          ),
        }));
        // Auto-advance audit to completed
        if (report.auditId) {
          useAuditStore
            .getState()
            .updateAuditStatus(report.auditId, "Completed");
        }
        addToast({
          type: "success",
          title: "Report Finalized",
          message:
            "Audit report is now final. Audit status updated to Completed.",
        });
        logActivity({
          userId: user.id,
          action: "FINALIZE_REPORT",
          details: "Audit report finalized — audit marked Complete",
          entityType: "report",
          entityId: reportId,
        });
      },
    });
  };

  if (view === "detail" && selectedReport) {
    const preparer = MOCK_USERS.find((u) => u.id === selectedReport.preparedBy);
    const reviewer = selectedReport.reviewedBy
      ? MOCK_USERS.find((u) => u.id === selectedReport.reviewedBy)
      : null;
    const isReviewer = user?.role === "AUDIT_SUPERVISOR";
    const awaitingMgmtResponse =
      selectedReport.status === "Approved" && !selectedReport.lgaResponse;
    const hasMgmtResponse = !!selectedReport.lgaResponse;
    const canFinalize =
      (user?.role === "AUDIT_LEAD" ||
        user?.role === "AUDIT_SUPERVISOR" ||
        isAG) &&
      hasMgmtResponse &&
      selectedReport.status !== "Final";

    /* Workflow step index */
    const stepIdx =
      selectedReport.status === "Final"
        ? 3
        : selectedReport.status === "Approved" && hasMgmtResponse
          ? 2.5
          : selectedReport.status === "Approved"
            ? 2
            : selectedReport.status === "Submitted" ||
                selectedReport.status === "Under Review"
              ? 1
              : 0;

    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => setView("list")}
        >
          <ChevronLeft size={16} /> Back to Reports
        </button>

        {/* ── 3-Level Workflow Progress Bar ── */}
        <div className={s.card} style={{ marginBottom: "1.5rem" }}>
          <div className={s.cardBody}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              {WORKFLOW_STEPS.map((step, i) => {
                const isComplete = stepIdx > i;
                const isCurrent = Math.floor(stepIdx) === i && stepIdx < 3;
                return (
                  <div
                    key={step.key}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        margin: "0 auto 0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: isComplete
                          ? "#064e3b"
                          : isCurrent
                            ? "#c8930a"
                            : "#e2e8f0",
                        color: isComplete || isCurrent ? "#fff" : "#64748b",
                        border: isCurrent ? "2px solid #c8930a" : "none",
                      }}
                    >
                      {isComplete ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent
                          ? "#c8930a"
                          : isComplete
                            ? "#064e3b"
                            : "#64748b",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#94a3b8",
                        marginTop: "0.15rem",
                      }}
                    >
                      {step.desc}
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          right: "-50%",
                          width: "100%",
                          height: "2px",
                          background: isComplete ? "#064e3b" : "#e2e8f0",
                          zIndex: 0,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>{selectedReport.title}</h1>
            <p className={s.pageSubtitle}>
              {getLgaForAudit(selectedReport.auditId)} · {selectedReport.type}{" "}
              Report
            </p>
          </div>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <StatusBadge
              label={selectedReport.status}
              variant={reportStatusVariant(selectedReport.status)}
              size="md"
            />
            {selectedReport.status === "Draft" &&
              user?.id === selectedReport.preparedBy && (
                <button
                  className={s.btnPrimary}
                  onClick={() => handleSubmit(selectedReport.id)}
                >
                  <Send size={14} /> Submit for Review
                </button>
              )}
            {isReviewer &&
              (selectedReport.status === "Submitted" ||
                selectedReport.status === "Under Review") && (
                <>
                  <button
                    className={s.btnPrimary}
                    onClick={() => handleReview(selectedReport.id, true)}
                  >
                    <CheckCircle size={14} /> Approve & Send to HLGA
                  </button>
                  <button
                    className={s.btnDanger}
                    onClick={() => handleReview(selectedReport.id, false)}
                  >
                    <AlertTriangle size={14} /> Request Revision
                  </button>
                </>
              )}
            {canFinalize && (
              <button
                className={s.btnGold}
                onClick={() => handleFinalizeReport(selectedReport.id)}
              >
                <Shield size={14} /> Finalize Report
              </button>
            )}
          </div>
        </div>

        <div className={s.gridTwoCols}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Report Details</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Prepared By</div>
                <div className={s.detailValue}>{preparer?.name || "—"}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Type</div>
                <div className={s.detailValue}>{selectedReport.type}</div>
              </div>
              {selectedReport.submittedAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Submitted</div>
                  <div className={s.detailValue}>
                    {new Date(selectedReport.submittedAt).toLocaleString(
                      "en-NG",
                    )}
                  </div>
                </div>
              )}
              {reviewer && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Reviewed By</div>
                  <div className={s.detailValue}>{reviewer.name}</div>
                </div>
              )}
              {selectedReport.reviewedAt && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Reviewed</div>
                  <div className={s.detailValue}>
                    {new Date(selectedReport.reviewedAt).toLocaleString(
                      "en-NG",
                    )}
                  </div>
                </div>
              )}
              {selectedReport.lgaResponse && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>LGA Response</div>
                  <div className={s.detailValue} style={{ color: "#15803d" }}>
                    {selectedReport.lgaResponse}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Findings Summary</h3>
            </div>
            <div className={s.cardBody}>
              <div
                style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}
              >
                <div>
                  <div className={s.kpiLabel}>Total</div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {selectedReport.findings.length}
                  </div>
                </div>
                <div>
                  <div className={s.kpiLabel}>Critical/High</div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#dc2626",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {
                      selectedReport.findings.filter(
                        (f) =>
                          f.severity === "Critical" || f.severity === "High",
                      ).length
                    }
                  </div>
                </div>
                <div>
                  <div className={s.kpiLabel}>Addressed</div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#15803d",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {
                      selectedReport.findings.filter(
                        (f) =>
                          f.status === "Addressed" || f.status === "Closed",
                      ).length
                    }
                  </div>
                </div>
                <div>
                  <div className={s.kpiLabel}>Open</div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#d97706",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {
                      selectedReport.findings.filter((f) => f.status === "Open")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HLGA Management Response Notice ── */}
        {awaitingMgmtResponse && !isHLGA && (
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.85rem",
              color: "#92400e",
            }}
          >
            <Clock size={18} />
            <div>
              <strong>Awaiting Management Response</strong> — The Head of Local
              Government Administration has been notified to respond to each
              finding. The report cannot be finalized until all responses are
              received.
            </div>
          </div>
        )}

        {awaitingMgmtResponse && isHLGA && (
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.85rem",
              color: "#075985",
            }}
          >
            <MessageSquare size={18} />
            <div>
              <strong>Your Response Required</strong> — Please provide a
              management response to each audit finding below. Your responses
              will be included in the final audit report.
            </div>
          </div>
        )}

        {/* ── Findings with Management Response ── */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Audit Findings</h3>
            {isHLGA && awaitingMgmtResponse && (
              <button
                className={s.btnPrimary}
                onClick={() => handleSubmitMgmtResponse(selectedReport.id)}
              >
                <Send size={14} /> Submit All Responses
              </button>
            )}
          </div>
          <div className={s.cardBody}>
            {selectedReport.findings.length > 0 ? (
              selectedReport.findings.map((finding) => (
                <div key={finding.id} className={s.findingCard}>
                  <div className={s.findingHeader}>
                    <div className={s.findingTitle}>{finding.title}</div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <StatusBadge
                        label={finding.severity}
                        variant={severityVariant(finding.severity)}
                      />
                      <StatusBadge
                        label={finding.status}
                        variant={
                          finding.status === "Open"
                            ? "warning"
                            : finding.status === "Addressed"
                              ? "info"
                              : "success"
                        }
                      />
                    </div>
                  </div>
                  <div className={s.findingBody}>{finding.description}</div>
                  {finding.recommendation && (
                    <div className={s.findingRec}>
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </div>
                  )}

                  {/* Management Response Section */}
                  {finding.managementResponse && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "#15803d",
                          marginBottom: "0.35rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Users size={12} /> Management Response (HLGA)
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#166534",
                          lineHeight: 1.6,
                        }}
                      >
                        {finding.managementResponse}
                      </div>
                    </div>
                  )}

                  {/* HLGA response input */}
                  {isHLGA && awaitingMgmtResponse && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "#f0f9ff",
                        border: "1px solid #bae6fd",
                        borderRadius: "4px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "#075985",
                          marginBottom: "0.35rem",
                          display: "block",
                        }}
                      >
                        Your Management Response *
                      </label>
                      <textarea
                        className={s.formTextarea}
                        value={mgmtResponses[finding.id] || ""}
                        onChange={(e) =>
                          setMgmtResponses((prev) => ({
                            ...prev,
                            [finding.id]: e.target.value,
                          }))
                        }
                        placeholder="Provide your management response to this finding... (e.g., corrective actions taken, timeline for resolution, or disagreement with finding)"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={s.emptyState}>
                <div className={s.emptyTitle}>No findings</div>
                <div className={s.emptyDesc}>
                  This report has no findings recorded.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Exit Meeting (for finalization) ── */}
        {hasMgmtResponse && canFinalize && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Exit Meeting Documentation</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.formGrid}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Exit Meeting Date</label>
                  <input
                    className={s.formInput}
                    type="date"
                    value={exitMeetingDate}
                    onChange={(e) => setExitMeetingDate(e.target.value)}
                  />
                </div>
                <div className={s.formGroupFull}>
                  <label className={s.formLabel}>Meeting Notes</label>
                  <textarea
                    className={s.formTextarea}
                    value={exitMeetingNotes}
                    onChange={(e) => setExitMeetingNotes(e.target.value)}
                    placeholder="Document exit meeting discussions, agreements, and any changes to findings..."
                    rows={3}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "#fffbeb",
                  borderRadius: "4px",
                  fontSize: "0.82rem",
                  color: "#92400e",
                }}
              >
                <strong>Note:</strong> The exit meeting is the final opportunity
                for the LGA to present additional evidence or contest findings.
                Once finalized, the report will be included in the AG&apos;s
                consolidated report.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "create") {
    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => setView("list")}
        >
          <ChevronLeft size={16} /> Back to Reports
        </button>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Create Audit Report</h1>
            <p className={s.pageSubtitle}>
              Compile findings and recommendations into a formal report
            </p>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Report Information</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroupFull}>
                <label className={s.formLabel} htmlFor="r-title">
                  Report Title
                </label>
                <input
                  id="r-title"
                  className={s.formInput}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Financial Audit Report — Ikeja LGA FY 2025"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="r-type">
                  Report Type
                </label>
                <select
                  id="r-type"
                  className={s.formSelect}
                  value={formType}
                  onChange={(e) =>
                    setFormType(
                      e.target.value as "Preliminary" | "Draft" | "Final",
                    )
                  }
                >
                  <option value="Preliminary">Preliminary</option>
                  <option value="Draft">Draft</option>
                  <option value="Final">Final</option>
                  <option value="Consolidated">Consolidated</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="r-audit">
                  Audit
                </label>
                <select
                  id="r-audit"
                  className={s.formSelect}
                  value={formAuditId}
                  onChange={(e) => setFormAuditId(e.target.value)}
                >
                  <option value="">Select audit...</option>
                  {audits.map((a) => (
                    <option key={a.id} value={a.id}>
                      {getLgaForAudit(a.id)} — {a.type} ({a.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Findings ({findings.length})</h3>
          </div>
          <div className={s.cardBody}>
            {findings.map((f, idx) => (
              <div key={idx} className={s.findingCard}>
                <div className={s.findingHeader}>
                  <div className={s.findingTitle}>{f.title}</div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      alignItems: "center",
                    }}
                  >
                    <StatusBadge
                      label={f.severity}
                      variant={severityVariant(f.severity)}
                    />
                    <button
                      className={s.btnIcon}
                      aria-label="Remove finding"
                      onClick={() => removeFinding(idx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className={s.findingBody}>{f.description}</div>
                {f.recommendation && (
                  <div className={s.findingRec}>
                    Recommendation: {f.recommendation}
                  </div>
                )}
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid var(--border, #e2e8f0)",
                paddingTop: "1rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: "#334155",
                }}
              >
                Add Finding
              </div>
              <div className={s.formGrid}>
                <div className={s.formGroup}>
                  <label className={s.formLabel} htmlFor="f-title">
                    Finding Title
                  </label>
                  <input
                    id="f-title"
                    className={s.formInput}
                    value={findTitle}
                    onChange={(e) => setFindTitle(e.target.value)}
                    placeholder="e.g., Unreconciled Bank Balances"
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel} htmlFor="f-sev">
                    Severity
                  </label>
                  <select
                    id="f-sev"
                    className={s.formSelect}
                    value={findSeverity}
                    onChange={(e) =>
                      setFindSeverity(e.target.value as Finding["severity"])
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className={s.formGroupFull}>
                  <label className={s.formLabel} htmlFor="f-desc">
                    Description
                  </label>
                  <textarea
                    id="f-desc"
                    className={s.formTextarea}
                    value={findDesc}
                    onChange={(e) => setFindDesc(e.target.value)}
                    placeholder="Describe the finding..."
                    rows={2}
                  />
                </div>
                <div className={s.formGroupFull}>
                  <label className={s.formLabel} htmlFor="f-rec">
                    Recommendation
                  </label>
                  <textarea
                    id="f-rec"
                    className={s.formTextarea}
                    value={findRec}
                    onChange={(e) => setFindRec(e.target.value)}
                    placeholder="Recommended corrective action..."
                    rows={2}
                  />
                </div>
              </div>
              <button
                className={s.btnGold}
                style={{ marginTop: "0.75rem" }}
                onClick={addFinding}
                disabled={!findTitle.trim() || !findDesc.trim()}
              >
                <Plus size={14} /> Add Finding
              </button>
            </div>
          </div>
        </div>

        <div className={s.formActions} style={{ marginBottom: "2rem" }}>
          <button className={s.btnSecondary} onClick={() => setView("list")}>
            Cancel
          </button>
          <button
            className={s.btnPrimary}
            onClick={handleCreate}
            disabled={!formTitle.trim() || !formAuditId}
          >
            <FileText size={14} /> Save Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Audit Reports</h1>
            <p className={s.pageSubtitle}>
              {isHLGA
                ? "Review audit findings and submit management responses"
                : user?.role === "AUDIT_SUPERVISOR" || isAG
                  ? "Review and approve audit reports across your zone"
                  : "Create and manage audit reports for your engagement"}
            </p>
          </div>
          {(user?.role === "AUDIT_LEAD" || user?.role === "TEAM_AUDITOR") && (
            <button className={s.btnPrimary} onClick={() => setView("create")}>
              <Plus size={14} /> New Report
            </button>
          )}
        </div>
      )}

      {embedded &&
        (user?.role === "AUDIT_LEAD" || user?.role === "TEAM_AUDITOR") && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <button className={s.btnPrimary} onClick={() => setView("create")}>
              <Plus size={14} /> New Report
            </button>
          </div>
        )}

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Reports</div>
            <div className={s.kpiValue}>{myReports.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Review</div>
            <div className={s.kpiValue}>
              {
                myReports.filter(
                  (r) =>
                    r.status === "Submitted" || r.status === "Under Review",
                ).length
              }
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Approved</div>
            <div className={s.kpiValue}>
              {
                myReports.filter(
                  (r) => r.status === "Approved" || r.status === "Final",
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {myReports.length > 0 ? (
        <div className={s.card}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>LGA</th>
                  <th>Type</th>
                  <th>Findings</th>
                  <th>Mgmt Response</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myReports.map((r) => {
                  const respondedCount = r.findings.filter(
                    (f) => f.managementResponse,
                  ).length;
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, maxWidth: "280px" }}>
                        {r.title}
                      </td>
                      <td>{getLgaForAudit(r.auditId)}</td>
                      <td>
                        <StatusBadge label={r.type} variant="info" />
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          {r.findings.length}
                          {r.findings.some(
                            (f) => f.severity === "Critical",
                          ) && (
                            <AlertTriangle
                              size={14}
                              style={{ color: "#dc2626" }}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        {respondedCount > 0 ? (
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color:
                                respondedCount === r.findings.length
                                  ? "#15803d"
                                  : "#d97706",
                              fontWeight: 600,
                            }}
                          >
                            {respondedCount}/{r.findings.length}
                          </span>
                        ) : r.status === "Approved" ? (
                          <StatusBadge label="Awaiting" variant="warning" />
                        ) : (
                          <span
                            style={{ color: "#94a3b8", fontSize: "0.78rem" }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge
                          label={r.status}
                          variant={reportStatusVariant(r.status)}
                        />
                      </td>
                      <td>
                        <div className={s.tableActions}>
                          <button
                            className={s.btnIcon}
                            aria-label="View report"
                            onClick={() => {
                              setSelectedId(r.id);
                              setView("detail");
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          {r.status === "Draft" &&
                            user?.id === r.preparedBy && (
                              <button
                                className={`${s.btnPrimary} ${s.btnSmall}`}
                                onClick={() => handleSubmit(r.id)}
                              >
                                <Send size={12} /> Submit
                              </button>
                            )}
                          {user?.role === "AUDIT_SUPERVISOR" &&
                            r.status === "Submitted" && (
                              <>
                                <button
                                  className={`${s.btnPrimary} ${s.btnSmall}`}
                                  onClick={() => handleReview(r.id, true)}
                                >
                                  Approve
                                </button>
                                <button
                                  className={`${s.btnDanger} ${s.btnSmall}`}
                                  onClick={() => handleReview(r.id, false)}
                                >
                                  Revise
                                </button>
                              </>
                            )}
                          {isHLGA &&
                            r.status === "Approved" &&
                            !r.lgaResponse && (
                              <button
                                className={`${s.btnGold} ${s.btnSmall}`}
                                onClick={() => {
                                  setSelectedId(r.id);
                                  setView("detail");
                                }}
                              >
                                <MessageSquare size={12} /> Respond
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
        </div>
      ) : (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <BarChart3 size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No reports yet</div>
              <div className={s.emptyDesc}>
                Create your first audit report to compile findings and
                recommendations.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsPageWrapper: React.FC<{
  auditId?: string;
  embedded?: boolean;
}> = (props) => (
  // We can pass embedded to WorkflowGate if we want to customize its appearance too,
  // but for now let's just use it as logic gate.
  <WorkflowGate phase="reporting">
    <ReportsPage {...props} />
  </WorkflowGate>
);

export default ReportsPageWrapper;
