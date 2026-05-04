import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import StatusBadge from "../../../components/UI/StatusBadge";
import {
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import { reportStatusVariant } from "../utils/reportHelpers";
import type { AuditReport } from "../../../types";

interface Props {
  embedded?: boolean;
  myReports: AuditReport[];
  getLgaForAudit: (auditId: string) => string;
  onCreate: () => void;
  onView: (id: string) => void;
  onSubmit: (reportId: string) => void;
  onReview: (reportId: string, approved: boolean) => void;
  onRespond: (id: string) => void;
}

const ReportsListView: React.FC<Props> = ({
  embedded,
  myReports,
  getLgaForAudit,
  onCreate,
  onView,
  onSubmit,
  onReview,
  onRespond,
}) => {
  const { user } = useAuth();
  const isHLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const isAG = user?.role === "STATE_AUDITOR_GENERAL";

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
            <button className={s.btnPrimary} onClick={onCreate}>
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
            <button className={s.btnPrimary} onClick={onCreate}>
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
                  <th>Council</th>
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
                            onClick={() => onView(r.id)}
                          >
                            <Eye size={14} />
                          </button>
                          {r.status === "Draft" &&
                            user?.id === r.preparedBy && (
                              <button
                                className={`${s.btnPrimary} ${s.btnSmall}`}
                                onClick={() => onSubmit(r.id)}
                              >
                                <Send size={12} /> Submit
                              </button>
                            )}
                          {user?.role === "AUDIT_SUPERVISOR" &&
                            r.status === "Submitted" && (
                              <>
                                <button
                                  className={`${s.btnPrimary} ${s.btnSmall}`}
                                  onClick={() => onReview(r.id, true)}
                                >
                                  Approve
                                </button>
                                <button
                                  className={`${s.btnDanger} ${s.btnSmall}`}
                                  onClick={() => onReview(r.id, false)}
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
                                onClick={() => onRespond(r.id)}
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

export default ReportsListView;
