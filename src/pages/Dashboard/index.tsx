import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { ZONES, LGAS, MOCK_USERS } from "../../mock/data";
import { useAuditStore } from "../../store/useAuditStore";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  FileCheck,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Eye,
  Shield,
  Activity,
  Server,
  Database,
  Lock,
  Search,
  Upload,
  Mail,
  FolderOpen,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activityLog = useAuditStore((state) => state.activityLog);
  const audits = useAuditStore((state) => state.audits);
  const mandates = useAuditStore((state) => state.mandates);
  const letters = useAuditStore((state) => state.letters);
  const documentUploads = useAuditStore((state) => state.documentUploads);
  const reports = useAuditStore((state) => state.reports);
  const stageApprovals = useAuditStore((state) => state.stageApprovals);
  const controlTests = useAuditStore((state) => state.controlTests);
  const substantiveTests = useAuditStore((state) => state.substantiveTests);
  const fraudFlags = useAuditStore((state) => state.fraudFlags);
  const tasks = useAuditStore((state) => state.tasks);
  const programmes = useAuditStore((state) => state.programmes);
  const assignLeadFn = useAuditStore((state) => state.assignLead);
  const addToast = useAuditStore((state) => state.addToast);
  const [assigningLgaId, setAssigningLgaId] = React.useState<string | null>(
    null,
  );
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>("");

  if (!user) return null;

  const leads = MOCK_USERS.filter((u) => u.role === "AUDIT_LEAD");

  /* ─── State Auditor General ─── */
  const renderStateAGDashboard = () => (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>State Overview</h1>
          <p className={s.pageSubtitle}>
            Comprehensive audit monitoring across all 5 zones and 20 LGAs
          </p>
        </div>
        <span className={s.pageBadge}>
          <Eye size={12} /> Auditor General
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <MapPin size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total LGAs</div>
            <div className={s.kpiValue}>{LGAS.length}</div>
            <div className={s.kpiMeta}>Across 5 zones</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <FileCheck size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Active Audits</div>
            <div className={s.kpiValue}>
              {audits.filter((a) => a.status !== "Completed").length}
            </div>
            <div className={s.kpiMeta}>
              {audits.filter((a) => a.status === "Completed").length} completed
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Reviews</div>
            <div className={s.kpiValue}>
              {
                reports.filter(
                  (r) =>
                    r.status === "Submitted" || r.status === "Under Review",
                ).length
              }
            </div>
            <div className={s.kpiMeta}>Awaiting approval</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Compliance Rate</div>
            <div className={s.kpiValue}>
              {audits.length > 0
                ? Math.round(
                    audits.reduce((s, a) => s + a.progress, 0) / audits.length,
                  )
                : 0}
              %
            </div>
            <div className={s.kpiMeta}>Avg. progress</div>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Zone Performance</h3>
        </div>
      </div>

      <div className={s.gridThreeCols}>
        {ZONES.map((zone) => {
          const zoneLgas = LGAS.filter((l) => zone.lgas.includes(l.id));
          return (
            <div key={zone.id} className={s.zoneCard}>
              <div className={s.zoneHeader}>
                <div>
                  <div className={s.zoneName}>{zone.name} Zone</div>
                  <div className={s.zoneLgaCount}>
                    {zone.lgas.length} LGA{zone.lgas.length > 1 ? "s" : ""}
                  </div>
                </div>
                <MapPin size={18} className={s.zoneMapIcon} />
              </div>
              <div className={s.zoneBody}>
                <div className={s.progressBar}>
                  <div
                    className={s.progressFill}
                    style={{ width: `${Math.floor(60 + Math.random() * 35)}%` }}
                  />
                </div>
                <ul className={s.lgaList}>
                  {zoneLgas.map((lga) => (
                    <li key={lga.id} className={s.lgaItem}>
                      <span>{lga.name}</span>
                      <span className={`${s.lgaStatus} ${s.statusActive}`}>
                        In Progress
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ─── Audit Supervisor ─── */
  const renderSupervisorDashboard = () => {
    const myZone = ZONES.find((z) => z.id === user.zoneId);
    const myLGAs = LGAS.filter((l) => myZone?.lgas.includes(l.id));
    const zoneLgaIds = myLGAs.map((l) => l.id);
    const zoneAudits = audits.filter((a) => zoneLgaIds.includes(a.lgaId));
    const pendingApprovals = stageApprovals.filter(
      (sa) =>
        sa.status === "Pending" && zoneAudits.some((a) => a.id === sa.auditId),
    );
    const pendingReports = reports.filter(
      (r) =>
        (r.status === "Submitted" || r.status === "Under Review") &&
        zoneAudits.some((a) => a.id === r.auditId),
    );
    const zoneFraudFlags = fraudFlags.filter(
      (f) =>
        (f.status === "Open" || f.status === "Escalated") &&
        zoneAudits.some((a) => a.id === f.auditId),
    );

    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>
              Zone: {myZone?.name || "Unassigned"}
            </h1>
            <p className={s.pageSubtitle}>
              Supervising {myLGAs.length} LGA{myLGAs.length > 1 ? "s" : ""} —
              audit oversight and team allocation
            </p>
          </div>
          <span className={s.pageBadge}>
            <Users size={12} /> Supervisor
          </span>
        </div>

        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <MapPin size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Zone Audits</div>
              <div className={s.kpiValue}>{zoneAudits.length}</div>
              <div className={s.kpiMeta}>
                {zoneAudits.filter((a) => a.status !== "Completed").length}{" "}
                active
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Leads Assigned</div>
              <div className={s.kpiValue}>
                {myLGAs.filter((l) => l.auditLeadId).length}
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Pending Approvals</div>
              <div className={s.kpiValue}>
                {pendingApprovals.length + pendingReports.length}
              </div>
              <div className={s.kpiMeta}>
                {pendingApprovals.length} stages, {pendingReports.length}{" "}
                reports
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconPurple}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Fraud Flags</div>
              <div className={s.kpiValue}>{zoneFraudFlags.length}</div>
              <div className={s.kpiMeta}>
                {zoneFraudFlags.filter((f) => f.severity === "Critical").length}{" "}
                critical
              </div>
            </div>
          </div>
        </div>

        <div className={s.gridTwoCols}>
          {/* LGA List */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>LGA Audit Status</h3>
            </div>
            <div className={s.listTable}>
              {myLGAs.map((lga) => (
                <div key={lga.id} className={s.listRow}>
                  <div>
                    <div className={s.listRowName}>{lga.name}</div>
                    <div className={s.listRowSub}>
                      Lead: {lga.auditLeadId ? "Assigned" : "Unassigned"}
                    </div>
                  </div>
                  {lga.auditLeadId ? (
                    <span className={`${s.lgaStatus} ${s.statusActive}`}>
                      Active
                    </span>
                  ) : (
                    <button
                      className={s.assignBtn}
                      onClick={() => setAssigningLgaId(lga.id)}
                    >
                      Assign Lead
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Pending Approvals</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.emptyState}>
                <CheckCircle size={40} className={s.emptyIcon} />
                <div className={s.emptyTitle}>All caught up</div>
                <div className={s.emptyDesc}>
                  No pending approvals at this time.
                </div>
              </div>
            </div>
          </div>
        </div>

        {assigningLgaId && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: "90%",
                maxWidth: "500px",
                padding: "1.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: "1rem",
                  color: "var(--text)",
                }}
              >
                Assign Audit Lead
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-2)",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Select an Audit Lead for{" "}
                <strong>
                  {myLGAs.find((l) => l.id === assigningLgaId)?.name}
                </strong>
                .
              </p>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-2)",
                  }}
                >
                  Select Lead Auditor
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                >
                  <option value="">Select Auditor...</option>
                  {leads.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  className={s.btnSecondary}
                  onClick={() => {
                    setAssigningLgaId(null);
                    setSelectedLeadId("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={s.btnPrimary}
                  onClick={() => {
                    if (!selectedLeadId) {
                      addToast({
                        type: "error",
                        title: "Please select a lead",
                      });
                      return;
                    }
                    const lga = myLGAs.find((l) => l.id === assigningLgaId);
                    if (!lga) return;
                    const lgaAudit = audits.find((a) => a.lgaId === lga.id);
                    if (!lgaAudit) {
                      // If no audit exists (shouldn't happen if initialized properly), maybe create one?
                      // For now, assume generic audit ID if missing
                      assignLeadFn(
                        lga.id,
                        selectedLeadId,
                        `audit-${lga.id}`,
                        "mandate-default",
                      );
                    } else {
                      assignLeadFn(
                        lga.id,
                        selectedLeadId,
                        lgaAudit.id,
                        lgaAudit.mandateId,
                      );
                    }
                    setAssigningLgaId(null);
                    setSelectedLeadId("");
                  }}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ─── Audit Lead ─── */
  const renderLeadDashboard = () => {
    const myLGA = LGAS.find((l) => l.id === user.lgaId);
    const myAudit =
      audits.find((a) => a.leadId === user.id) ||
      audits.find((a) => a.lgaId === user.lgaId);
    const auditId = myAudit?.id;
    const myTasks = auditId ? tasks.filter((t) => t.auditId === auditId) : [];
    const completedTasks = myTasks.filter(
      (t) => t.status === "Completed",
    ).length;
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
    const myReports = auditId
      ? reports.filter((r) => r.auditId === auditId)
      : [];
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

        <div className={s.gridTwoCols}>
          {/* Audit Roadmap — dynamic from store */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Audit Roadmap</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.timeline}>
                {[
                  { phase: "Pre-Audit", stage: "Pre-Audit" as const },
                  { phase: "Planning", stage: "Planning" as const },
                  { phase: "Fieldwork", stage: "Fieldwork" as const },
                  { phase: "Reporting", stage: "Reporting" as const },
                  { phase: "Post-Audit", stage: "Post-Audit" as const },
                ].map((item) => {
                  const approval = auditId
                    ? stageApprovals.find(
                        (sa) =>
                          sa.auditId === auditId && sa.stage === item.stage,
                      )
                    : undefined;
                  const isApproved = approval?.status === "Approved";
                  const isPending = approval?.status === "Pending";
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
                  const itemPhaseIdx = phaseStatuses.indexOf(
                    item.stage === "Pre-Audit" ? "Pending" : item.stage,
                  );
                  const isCurrent =
                    auditPhaseIdx === itemPhaseIdx ||
                    (item.stage === "Pre-Audit" && auditPhaseIdx <= 0);
                  const isDone = isApproved || auditPhaseIdx > itemPhaseIdx;

                  return (
                    <div key={item.phase} className={s.timelineItem}>
                      <div
                        className={`${s.timelineDot} ${isDone ? s.dotGreen : isCurrent ? s.dotBlue : s.dotGray}`}
                      />
                      <div className={s.timelineTitle}>
                        {item.phase}
                        {isDone && " ✓"}
                        {isCurrent && !isDone && " (Current)"}
                      </div>
                      <div className={s.timelineDate}>
                        {isDone
                          ? `Approved${approval?.reviewedAt ? " — " + new Date(approval.reviewedAt).toLocaleDateString() : ""}`
                          : isPending
                            ? "Submitted — awaiting review"
                            : isCurrent
                              ? "In progress"
                              : "Not started"}
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  onClick={() => navigate("/fieldwork")}
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
      </div>
    );
  };

  /* ─── Team Auditor ─── */
  const renderTeamAuditorDashboard = () => {
    const myLGA = LGAS.find((l) => l.id === user.lgaId);
    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>My Assignments</h1>
            <p className={s.pageSubtitle}>
              LGA: <strong>{myLGA?.name || "Not assigned"}</strong> — assigned
              audit tasks and deliverables
            </p>
          </div>
          <span className={s.pageBadge}>
            <FileText size={12} /> Team Auditor
          </span>
        </div>

        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <ClipboardList size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Assigned Tasks</div>
              <div className={s.kpiValue}>6</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Completed</div>
              <div className={s.kpiValue}>2</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <Clock size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Next Deadline</div>
              <div className={s.kpiValue}>Mar 5</div>
              <div className={s.kpiMeta}>16 days remaining</div>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Current Tasks</h3>
          </div>
          <div className={s.cardBody}>
            {[
              {
                title: "Revenue Verification — Cash Collections",
                desc: "Verify cash collection records for Jan-Feb 2026 across all revenue points in Ikeja LGA. Cross-reference with bank deposits.",
                status: "progress" as const,
                due: "Mar 5, 2026",
              },
              {
                title: "Document Review — Procurement Files",
                desc: "Review procurement documentation for capital projects exceeding ₦50M. Verify compliance with Public Procurement Act.",
                status: "progress" as const,
                due: "Mar 12, 2026",
              },
              {
                title: "Bank Reconciliation — Q4 2025",
                desc: "Reconcile cashbook entries with bank statements for October-December 2025.",
                status: "complete" as const,
                due: "Feb 10, 2026",
              },
              {
                title: "Asset Verification — Vehicle Fleet",
                desc: "Physical verification of all registered vehicles. Document condition, location and usage logs.",
                status: "pending" as const,
                due: "Mar 20, 2026",
              },
            ].map((task, i) => (
              <div key={i} className={s.taskCard}>
                <div className={s.taskHeader}>
                  <div>
                    <div className={s.taskTitle}>{task.title}</div>
                    <div className={s.taskMeta}>Due: {task.due}</div>
                  </div>
                  <span
                    className={
                      task.status === "progress"
                        ? s.taskStatusProgress
                        : task.status === "pending"
                          ? s.taskStatusPending
                          : s.taskStatusComplete
                    }
                  >
                    {task.status === "progress"
                      ? "In Progress"
                      : task.status === "pending"
                        ? "Pending"
                        : "Completed"}
                  </span>
                </div>
                <div className={s.taskBody}>{task.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ─── System Admin ─── */
  const renderSystemAdminDashboard = () => {
    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>System Administration</h1>
            <p className={s.pageSubtitle}>
              Platform health monitoring, user management, and security logs
            </p>
          </div>
          <span className={s.pageBadge}>
            <Shield size={12} /> System Admin
          </span>
        </div>

        {/* Admin KPI Row */}
        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <Users size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Total Users</div>
              <div className={s.kpiValue}>{MOCK_USERS.length}</div>
              <div className={s.kpiMeta}>Across 5 roles</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <Activity size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>System Status</div>
              <div className={s.kpiValue} style={{ fontSize: "1.5rem" }}>
                Operational
              </div>
              <div className={s.kpiMeta}>Uptime: 99.98%</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconPurple}>
              <Server size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Server Load</div>
              <div className={s.kpiValue}>12%</div>
              <div className={s.kpiMeta}>Memory: 4.2GB / 16GB</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <Database size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Database</div>
              <div className={s.kpiValue}>Healthy</div>
              <div className={s.kpiMeta}>Last backup: 2h ago</div>
            </div>
          </div>
        </div>

        <div className={s.gridTwoCols}>
          {/* Recent Activity Log */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Recent System Activity</h3>
            </div>
            <div className={s.listTable}>
              {activityLog.slice(0, 6).map((log) => {
                const logUser = MOCK_USERS.find((u) => u.id === log.userId);
                const userName = logUser?.name || "Unknown User";
                const initials = userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <div key={log.id} className={s.listRow}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className={s.listRowName}>{log.action}</div>
                        <div className={s.listRowSub}>
                          {log.details} • {userName}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
              {activityLog.length === 0 && (
                <div className={s.emptyState}>
                  <div className={s.emptyDesc}>No recent activity logged.</div>
                </div>
              )}
            </div>
          </div>

          {/* Security & Quick Actions */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Security Overview</h3>
              </div>
              <div className={s.cardBody}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Lock size={18} color="#059669" />
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#065f46",
                        }}
                      >
                        No Active Threats
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#064e3b" }}>
                        Firewall active, all systems secure.
                      </div>
                    </div>
                  </div>
                  <CheckCircle size={18} color="#059669" />
                </div>

                <div className={s.listRow}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Failed Login Attempts (24h)
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>2</div>
                </div>
                <div className={s.listRow}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Active Sessions
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>14</div>
                </div>
                <div className={s.listRow}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Pending User Approvals
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>0</div>
                </div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Quick Actions</h3>
              </div>
              <div className={s.cardBody}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <button className={s.btnPrimary}>
                    <Users size={14} /> Manage Users
                  </button>
                  <button className={s.btnOutline}>
                    <Search size={14} /> View Logs
                  </button>
                  <button className={s.btnOutline}>
                    <Database size={14} /> Backup
                  </button>
                  <button className={s.btnOutline}>
                    <Activity size={14} /> Optimise
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (user.role) {
    case "SYSTEM_ADMIN":
      return renderSystemAdminDashboard();
    case "STATE_AUDITOR_GENERAL":
      return renderStateAGDashboard();
    case "AUDIT_SUPERVISOR":
      return renderSupervisorDashboard();
    case "AUDIT_LEAD":
      return renderLeadDashboard();
    case "TEAM_AUDITOR":
      return renderTeamAuditorDashboard();
    case "HEAD_OF_LOCAL_GOVERNMENT": {
      const lgaName = LGAS.find((l) => l.id === user.lgaId)?.name || "Your LGA";
      const myDocs = documentUploads.filter((d) => d.lgaId === user.lgaId);
      const docsUploaded = myDocs.filter(
        (d) => d.status !== "Not Uploaded",
      ).length;
      const docsApproved = myDocs.filter((d) => d.status === "Approved").length;
      const docsRejected = myDocs.filter((d) => d.status === "Rejected").length;
      const myLetters = letters.filter((l) => l.lgaId === user.lgaId);
      const activeMandates = mandates.filter(
        (m) => m.status === "Published" || m.status === "Active",
      );
      const lgaAudits = audits.filter((a) => a.lgaId === user.lgaId);
      return (
        <div>
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>{lgaName} LGA Dashboard</h1>
              <p className={s.pageSubtitle}>
                Manage audit notifications, document submissions, and mandate
                compliance
              </p>
            </div>
            <span className={s.pageBadge}>
              <Shield size={12} /> Head of Local Government
            </span>
          </div>

          <div className={s.kpiRow}>
            <div className={s.kpiCard}>
              <div className={s.kpiIconBlue}>
                <Mail size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Notifications</div>
                <div className={s.kpiValue}>{myLetters.length}</div>
                <div className={s.kpiMeta}>
                  {myLetters.filter((l) => l.status === "Sent").length} pending
                  action
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconGreen}>
                <Upload size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Documents</div>
                <div className={s.kpiValue}>
                  {docsUploaded}/{myDocs.length}
                </div>
                <div className={s.kpiMeta}>
                  {docsApproved} approved, {docsRejected} need re-upload
                </div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconAmber}>
                <Shield size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Active Mandates</div>
                <div className={s.kpiValue}>{activeMandates.length}</div>
                <div className={s.kpiMeta}>Requiring compliance</div>
              </div>
            </div>
            <div className={s.kpiCard}>
              <div className={s.kpiIconPurple}>
                <FileCheck size={20} />
              </div>
              <div>
                <div className={s.kpiLabel}>Audit Status</div>
                <div className={s.kpiValue}>
                  {lgaAudits.length > 0 ? lgaAudits[0].status : "None"}
                </div>
                <div className={s.kpiMeta}>
                  {lgaAudits.length > 0
                    ? `${lgaAudits[0].progress}% progress`
                    : "No active audit"}
                </div>
              </div>
            </div>
          </div>

          <div className={s.gridTwoCols}>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Document Submission Progress</h3>
              </div>
              <div className={s.cardBody}>
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "var(--text-2)" }}>
                      Overall Progress
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      {myDocs.length > 0
                        ? Math.round((docsApproved / myDocs.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "var(--border)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${myDocs.length > 0 ? (docsApproved / myDocs.length) * 100 : 0}%`,
                        background: "#064e3b",
                        borderRadius: "4px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
                {myDocs.slice(0, 6).map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <span style={{ color: "var(--text)", fontWeight: 500 }}>
                      {doc.documentName}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "2px",
                        background:
                          doc.status === "Approved"
                            ? "#ecfdf5"
                            : doc.status === "Rejected"
                              ? "#fef2f2"
                              : doc.status === "Uploaded"
                                ? "#fefce8"
                                : "#f3f4f6",
                        color:
                          doc.status === "Approved"
                            ? "#065f46"
                            : doc.status === "Rejected"
                              ? "#991b1b"
                              : doc.status === "Uploaded"
                                ? "#854d0e"
                                : "#6b7280",
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
                {myDocs.length > 6 && (
                  <button
                    className={s.btnOutline}
                    style={{ marginTop: "1rem", width: "100%" }}
                    onClick={() => navigate("/document-portal")}
                  >
                    View All Documents
                  </button>
                )}
                {myDocs.length === 0 && (
                  <div className={s.emptyState}>
                    <FolderOpen size={32} className={s.emptyIcon} />
                    <div className={s.emptyTitle}>
                      No Documents Required Yet
                    </div>
                    <div className={s.emptyDesc}>
                      Documents will appear here once an audit mandate is issued
                      for your LGA.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Quick Actions</h3>
              </div>
              <div className={s.cardBody}>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <button
                    className={s.btnPrimary}
                    style={{ width: "100%" }}
                    onClick={() => navigate("/document-portal")}
                  >
                    <Upload size={14} /> Upload Documents
                  </button>
                  <button
                    className={s.btnOutline}
                    style={{ width: "100%" }}
                    onClick={() => navigate("/notifications")}
                  >
                    <Mail size={14} /> View Notifications
                  </button>
                  <button
                    className={s.btnOutline}
                    style={{ width: "100%" }}
                    onClick={() => navigate("/reports")}
                  >
                    <FileText size={14} /> Audit Reports
                  </button>
                  <button
                    className={s.btnOutline}
                    style={{ width: "100%" }}
                    onClick={() => navigate("/post-audit")}
                  >
                    <ClipboardList size={14} /> Post-Audit
                  </button>
                  <button
                    className={s.btnOutline}
                    style={{ width: "100%" }}
                    onClick={() => navigate("/scope-agreement")}
                  >
                    <Shield size={14} /> Scope Agreement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    default:
      return (
        <div>
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>Welcome, {user.name}</h1>
              <p className={s.pageSubtitle}>
                Role: {user.role.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody}>
              <div className={s.emptyState}>
                <div className={s.emptyTitle}>Dashboard Coming Soon</div>
                <div className={s.emptyDesc}>
                  Please check your assigned tasks in the sidebar menu.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default Dashboard;
