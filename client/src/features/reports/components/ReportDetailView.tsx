import React, { useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";
import { MOCK_USERS } from "../../../mock/data";
import StatusBadge from "../../../components/UI/StatusBadge";
import type { AuditReport } from "../../../types";
import {
  Send,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  Clock,
  MessageSquare,
  Users,
  Shield,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import { reportStatusVariant, severityVariant } from "../utils/reportHelpers";
import WorkflowProgressBar from "./WorkflowProgressBar";

interface Props {
  report: AuditReport;
  onBack: () => void;
  getLgaForAudit: (auditId: string) => string;
  onSubmit: (reportId: string) => void;
  onReview: (reportId: string, approved: boolean) => void;
}

const ReportDetailView: React.FC<Props> = ({
  report,
  onBack,
  getLgaForAudit,
  onSubmit,
  onReview,
}) => {
  const { user } = useAuth();
  const reports = useAuditStore((st) => st.reports);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);
  const logActivity = useAuditStore((st) => st.logActivity);

  const [mgmtResponses, setMgmtResponses] = useState<Record<string, string>>(
    {},
  );
  const [exitMeetingNotes, setExitMeetingNotes] = useState("");
  const [exitMeetingDate, setExitMeetingDate] = useState("");

  const isHLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const isAG = user?.role === "STATE_AUDITOR_GENERAL";

  const handleSubmitMgmtResponse = (reportId: string) => {
    const r = reports.find((rep) => rep.id === reportId);
    if (!r || !user) return;
    const allResponded = r.findings.every((f) => mgmtResponses[f.id]?.trim());
    if (!allResponded) {
      addToast({
        type: "warning",
        title: "Incomplete Responses",
        message: "Please respond to every finding before submitting",
      });
      return;
    }
    useAuditStore.setState((state) => ({
      reports: state.reports.map((rep) => {
        if (rep.id !== reportId) return rep;
        return {
          ...rep,
          lgaResponse: `Management responses submitted by ${user.name} on ${new Date().toLocaleString("en-NG")}`,
          findings: rep.findings.map((f) => ({
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
      details: `HLGA submitted management responses for ${r.findings.length} findings`,
      entityType: "report",
      entityId: reportId,
    });
  };

  const handleFinalizeReport = (reportId: string) => {
    if (!user) return;
    const r = reports.find((rep) => rep.id === reportId);
    if (!r) return;
    const hasAllResponses = r.findings.every((f) => f.managementResponse);
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
          reports: state.reports.map((rep) =>
            rep.id === reportId
              ? {
                  ...rep,
                  status: "Final" as const,
                  type: "Final" as const,
                }
              : rep,
          ),
        }));
        if (r.auditId) {
          useAuditStore.getState().updateAuditStatus(r.auditId, "Completed");
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
          details: "Audit report finalized; audit marked Complete",
          entityType: "report",
          entityId: reportId,
        });
      },
    });
  };

  const preparer = MOCK_USERS.find((u) => u.id === report.preparedBy);
  const reviewer = report.reviewedBy
    ? MOCK_USERS.find((u) => u.id === report.reviewedBy)
    : null;
  const isReviewer = user?.role === "AUDIT_SUPERVISOR";
  const awaitingMgmtResponse =
    report.status === "Approved" && !report.lgaResponse;
  const hasMgmtResponse = !!report.lgaResponse;
  const canFinalize = isAG && hasMgmtResponse && report.status !== "Final";

  const stepIdx =
    report.status === "Final"
      ? 3
      : report.status === "Approved" && hasMgmtResponse
        ? 2.5
        : report.status === "Approved"
          ? 2
          : report.status === "Submitted" || report.status === "Under Review"
            ? 1
            : 0;

  return (
    <div>
      <button
        className={s.btnSecondary}
        style={{ marginBottom: "1.5rem" }}
        onClick={onBack}
      >
        <ChevronLeft size={16} /> Back to Reports
      </button>

      <WorkflowProgressBar stepIdx={stepIdx} />

      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>{report.title}</h1>
          <p className={s.pageSubtitle}>
            {getLgaForAudit(report.auditId)} · {report.type} Report
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <StatusBadge
            label={report.status}
            variant={reportStatusVariant(report.status)}
            size="md"
          />
          {report.status === "Draft" && user?.id === report.preparedBy && (
            <button
              className={s.btnPrimary}
              onClick={() => onSubmit(report.id)}
            >
              <Send size={14} /> Submit for Review
            </button>
          )}
          {isReviewer &&
            (report.status === "Submitted" ||
              report.status === "Under Review") && (
              <>
                <button
                  className={s.btnPrimary}
                  onClick={() => onReview(report.id, true)}
                >
                  <CheckCircle size={14} /> Approve & Send to HLGA
                </button>
                <button
                  className={s.btnDanger}
                  onClick={() => onReview(report.id, false)}
                >
                  <AlertTriangle size={14} /> Request Revision
                </button>
              </>
            )}
          {canFinalize && (
            <button
              className={s.btnGold}
              onClick={() => handleFinalizeReport(report.id)}
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
              <div className={s.detailValue}>{report.type}</div>
            </div>
            {report.submittedAt && (
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Submitted</div>
                <div className={s.detailValue}>
                  {new Date(report.submittedAt).toLocaleString("en-NG")}
                </div>
              </div>
            )}
            {reviewer && (
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Reviewed By</div>
                <div className={s.detailValue}>{reviewer.name}</div>
              </div>
            )}
            {report.reviewedAt && (
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Reviewed</div>
                <div className={s.detailValue}>
                  {new Date(report.reviewedAt).toLocaleString("en-NG")}
                </div>
              </div>
            )}
            {report.lgaResponse && (
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Council Response</div>
                <div className={s.detailValue} style={{ color: "#15803d" }}>
                  {report.lgaResponse}
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
                  {report.findings.length}
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
                    report.findings.filter(
                      (f) => f.severity === "Critical" || f.severity === "High",
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
                    report.findings.filter(
                      (f) => f.status === "Addressed" || f.status === "Closed",
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
                  {report.findings.filter((f) => f.status === "Open").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <strong>Awaiting Management Response</strong>: The Head of Local
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
            <strong>Your Response Required</strong>: Please provide a management
            response to each audit finding below. Your responses will be
            included in the final audit report.
          </div>
        </div>
      )}

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Audit Findings</h3>
          {isHLGA && awaitingMgmtResponse && (
            <button
              className={s.btnPrimary}
              onClick={() => handleSubmitMgmtResponse(report.id)}
            >
              <Send size={14} /> Submit All Responses
            </button>
          )}
        </div>
        <div className={s.cardBody}>
          {report.findings.length > 0 ? (
            report.findings.map((finding) => (
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
              for the council to present additional evidence or contest
              findings. Once finalized, the report will be included in the
              AG&apos;s consolidated report.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailView;
