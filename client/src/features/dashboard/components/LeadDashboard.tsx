import React from "react";
import type { NavigateFunction } from "react-router-dom";
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Shield,
  Search,
  FolderOpen,
} from "lucide-react";
import { LGAS } from "../../../mock/data";
import type {
  User,
  Audit,
  Task,
  InternalControlTest,
  SubstantiveTest,
  FraudFlag,
  AuditReport,
  AuditProgramme,
  StageApproval,
  Mandate,
} from "../../../types";
import s from "../../../styles/pages.module.css";

interface LeadDashboardProps {
  user: User;
  audits: Audit[];
  tasks: Task[];
  controlTests: InternalControlTest[];
  substantiveTests: SubstantiveTest[];
  fraudFlags: FraudFlag[];
  reports: AuditReport[];
  programmes: AuditProgramme[];
  stageApprovals: StageApproval[];
  mandates: Mandate[];
  navigate: NavigateFunction;
}

const LeadDashboard: React.FC<LeadDashboardProps> = ({
  user,
  audits,
  tasks,
  controlTests,
  substantiveTests,
  fraudFlags,
  reports,
  programmes,
  stageApprovals,
  mandates,
  navigate,
}) => {
  const myLGA = LGAS.find((l) => l.id === user.lgaId);
  const myAudit =
    audits.find((a) => a.leadId === user.id) ||
    audits.find((a) => a.lgaId === user.lgaId);
  const auditId = myAudit?.id;
  const myTasks = auditId ? tasks.filter((t) => t.auditId === auditId) : [];
  const completedTasks = myTasks.filter((t) => t.status === "Completed").length;
  const teamSize = myAudit?.teamIds?.length || 0;
  const myControls = auditId
    ? controlTests.filter((c) => c.auditId === auditId)
    : [];
  const mySubstTests = auditId
    ? substantiveTests.filter((st) => st.auditId === auditId)
    : [];
  const myFraudFlags = auditId
    ? fraudFlags.filter((f) => f.auditId === auditId)
    : [];
  const myReports = auditId ? reports.filter((r) => r.auditId === auditId) : [];
  const myProgramme = auditId
    ? programmes.find((p) => p.auditId === auditId)
    : undefined;
  const fieldworkProgress =
    mySubstTests.length > 0
      ? Math.round(
          (mySubstTests.filter((st) => st.status === "Completed").length /
            mySubstTests.length) *
            100,
        )
      : 0;
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Engagement Dashboard</h1>
          <p className={s.pageSubtitle}>
            Auditing: <strong>{myLGA?.name || "Not assigned"}</strong>
            {myAudit && (
              <>
                {" "}
                —{" "}
                <span
                  style={{
                    padding: "0.15rem 0.5rem",
                    background:
                      myAudit.status === "Completed" ? "#ecfdf5" : "#fefce8",
                    color:
                      myAudit.status === "Completed" ? "#065f46" : "#854d0e",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {myAudit.status}
                </span>
              </>
            )}
          </p>
        </div>
        <span className={s.pageBadge}>
          <ClipboardList size={12} /> Audit Lead
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Users size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Team</div>
            <div className={s.kpiValue}>{teamSize}</div>
            <div className={s.kpiMeta}>auditors assigned</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <Shield size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Controls Tested</div>
            <div className={s.kpiValue}>{myControls.length}</div>
            <div className={s.kpiMeta}>
              {myControls.filter((c) => c.result === "Ineffective").length}{" "}
              ineffective
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Search size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Substantive Tests</div>
            <div className={s.kpiValue}>{mySubstTests.length}</div>
            <div className={s.kpiMeta}>{fieldworkProgress}% complete</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Fraud Flags</div>
            <div className={s.kpiValue}>
              {
                myFraudFlags.filter(
                  (f) => f.status !== "Resolved" && f.status !== "Dismissed",
                ).length
              }
            </div>
            <div className={s.kpiMeta}>
              {myFraudFlags.filter((f) => f.severity === "Critical").length}{" "}
              critical
            </div>
          </div>
        </div>
      </div>

      {/* Professional Audit Roadmap */}
      <div className={s.card} style={{ marginBottom: "1.5rem" }}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Audit Roadmap</h3>
        </div>
        <div
          className={s.cardBody}
          style={{
            padding: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              top: "3rem",
              left: "3.5rem",
              right: "3.5rem",
              height: "2px",
              backgroundColor: "#e2e8f0",
              zIndex: 0,
            }}
          />

          {[
            {
              phase: "Pre-Audit",
              stage: "Pre-Audit",
              desc: "Engagement setup & entry",
            },
            {
              phase: "Planning",
              stage: "Planning",
              desc: "Risk assessment & strategy",
            },
            {
              phase: "Fieldwork",
              stage: "Fieldwork",
              desc: "Testing & evidence gathering",
            },
            {
              phase: "Reporting",
              stage: "Reporting",
              desc: "Drafting & finalization",
            },
            {
              phase: "Post-Audit",
              stage: "Post-Audit",
              desc: "Follow-up & closure",
            },
          ].map((item, index) => {
            const approval = auditId
              ? stageApprovals.find(
                  (sa) => sa.auditId === auditId && sa.stage === item.stage,
                )
              : undefined;
            const isApproved = approval?.status === "Approved";
            const phaseStatuses = [
              "Pending",
              "Planning",
              "Fieldwork",
              "Reporting",
              "Post-Audit",
              "Completed",
            ];
            const auditPhaseIdx = phaseStatuses.indexOf(
              myAudit?.status || "Pending",
            );
            const mapStageToStatus =
              item.stage === "Pre-Audit" ? "Pending" : item.stage;
            const itemPhaseIdx = phaseStatuses.indexOf(mapStageToStatus);

            // Determine status for styling
            let status: "completed" | "current" | "upcoming" = "upcoming";
            if (isApproved || auditPhaseIdx > itemPhaseIdx) {
              status = "completed";
            } else if (
              auditPhaseIdx === itemPhaseIdx ||
              (item.stage === "Pre-Audit" && auditPhaseIdx <= 0)
            ) {
              status = "current";
            }

            return (
              <div
                key={item.phase}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor:
                      status === "completed"
                        ? "#059669"
                        : status === "current"
                          ? "#2563eb"
                          : "#f1f5f9",
                    border:
                      status === "current"
                        ? "4px solid #bfdbfe"
                        : status === "upcoming"
                          ? "2px solid #cbd5e1"
                          : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      status === "completed" || status === "current"
                        ? "white"
                        : "#94a3b8",
                    marginBottom: "0.75rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  {status === "completed" ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <div
                  style={{
                    fontWeight: status === "current" ? 700 : 600,
                    color:
                      status === "current"
                        ? "#1e293b"
                        : status === "completed"
                          ? "#059669"
                          : "#64748b",
                    fontSize: "0.9rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.phase}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    maxWidth: "120px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.gridTwoCols}>
        {/* Recent Tasks */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Active Tasks</h3>
          </div>
          <div className={s.cardBody}>
            {myTasks.length > 0 ? (
              <div className={s.listTable}>
                {myTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className={s.listRow}>
                    <div>
                      <div className={s.listRowName}>{task.title}</div>
                      <div className={s.listRowSub}>Due: {task.dueDate}</div>
                    </div>
                    <span
                      className={
                        task.status === "Completed"
                          ? s.statusActive
                          : s.statusPending
                      }
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={s.emptyState}>
                <ClipboardList size={32} className={s.emptyIcon} />
                <div className={s.emptyTitle}>No Active Tasks</div>
                <div className={s.emptyDesc}>Work programme is empty.</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Engagement Summary</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.listTable}>
              <div className={s.listRow}>
                <div className={s.listRowName}>Work Programme</div>
                <span
                  className={`${s.lgaStatus} ${myProgramme?.status === "Approved" ? s.statusActive : s.statusPending}`}
                >
                  {myProgramme?.status || "Not Created"}
                </span>
              </div>
              <div className={s.listRow}>
                <div className={s.listRowName}>Tasks</div>
                <span className={s.listRowSub}>
                  {completedTasks}/{myTasks.length} completed
                </span>
              </div>
              <div className={s.listRow}>
                <div className={s.listRowName}>Reports</div>
                <span className={s.listRowSub}>
                  {myReports.length} created
                  {myReports.some((r) => r.status === "Final") && " (Final)"}
                </span>
              </div>
              <div className={s.listRow}>
                <div className={s.listRowName}>Overall Progress</div>
                <span className={s.listRowSub}>
                  <strong>{myAudit?.progress || 0}%</strong>
                </span>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              <button
                className={s.btnPrimary}
                onClick={() => navigate(`/audits/${auditId}?tab=fieldwork`)}
              >
                <Search size={14} /> Fieldwork
              </button>
              <button
                className={s.btnOutline}
                onClick={() => navigate("/reports")}
              >
                <FileText size={14} /> Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Past Engagements */}
      {audits.filter((a) => a.leadId === user.id && a.status === "Completed")
        .length > 0 && (
        <div className={s.card} style={{ marginTop: "1.5rem" }}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Completed Engagements</h3>
          </div>
          <div className={s.listTable}>
            {audits
              .filter((a) => a.leadId === user.id && a.status === "Completed")
              .map((a) => (
                <div key={a.id} className={s.listRow}>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "4px",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                      }}
                    >
                      <FolderOpen size={16} />
                    </div>
                    <div>
                      {(() => {
                        const m = mandates.find((m) => m.id === a.mandateId);
                        return (
                          <>
                            <div className={s.listRowName}>
                              {m?.title || `Audit ${a.year}`}
                            </div>
                            <div className={s.listRowSub}>
                              {a.startDate
                                ? new Date(a.startDate).toLocaleDateString()
                                : ""}{" "}
                              —{" "}
                              {a.endDate
                                ? new Date(a.endDate).toLocaleDateString()
                                : ""}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <button className={s.btnSmall}>View Report</button>
                    <span className={`${s.lgaStatus} ${s.statusActive}`}>
                      Completed
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDashboard;
