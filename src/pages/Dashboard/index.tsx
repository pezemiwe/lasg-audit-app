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
  const renderStateAGDashboard = () => {
    // Audit Stage Breakdown
    const auditsByStage = {
      Planning: audits.filter((a) => a.status === "Planning").length,
      Fieldwork: audits.filter((a) => a.status === "Fieldwork").length,
      Reporting: audits.filter(
        (a) => a.status === "Reporting" || a.status === "Review",
      ).length,
      Completed: audits.filter(
        (a) => a.status === "Completed" || a.status === "Post-Audit",
      ).length,
    };

    // Calculate total for percentages
    const totalAudits = audits.length || 1;

    // Risk Analysis
    const criticalRisks = fraudFlags.filter(
      (f) => f.severity === "Critical" && f.status !== "Resolved",
    );
    const highRisks = fraudFlags.filter(
      (f) => f.severity === "High" && f.status !== "Resolved",
    );

    // Group Risks by LGA
    const riskByLga = LGAS.map((lga) => {
      const lgaAudits = audits
        .filter((a) => a.lgaId === lga.id)
        .map((a) => a.id);
      const criticalCount = criticalRisks.filter((f) =>
        lgaAudits.includes(f.auditId),
      ).length;
      const highCount = highRisks.filter((f) =>
        lgaAudits.includes(f.auditId),
      ).length;
      return {
        ...lga,
        criticalCount,
        highCount,
        totalRisk: criticalCount * 2 + highCount,
      };
    })
      .sort((a, b) => b.totalRisk - a.totalRisk)
      .filter((l) => l.totalRisk > 0);

    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>State Overview</h1>
            <p className={s.pageSubtitle}>
              High-level monitoring, risk assessment, and progress tracking
              across Lagos State
            </p>
          </div>
          <span className={s.pageBadge}>
            <Eye size={12} /> Auditor General
          </span>
        </div>

        {/* Primary KPI Row */}
        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <MapPin size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Total Coverage</div>
              <div className={s.kpiValue}>{LGAS.length} LGAs</div>
              <div className={s.kpiMeta}>Across 5 administrative zones</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <Activity size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Active Audits</div>
              <div className={s.kpiValue}>
                {audits.filter((a) => a.status !== "Completed").length}
              </div>
              <div className={s.kpiMeta}>
                {Math.round(
                  (audits.filter((a) => a.status !== "Completed").length /
                    totalAudits) *
                    100,
                )}
                % of total planned
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Critical Risks</div>
              <div className={s.kpiValue}>{criticalRisks.length}</div>
              <div className={s.kpiMeta}>Requires immediate attention</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconPurple}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Avg. Completion</div>
              <div className={s.kpiValue}>
                {audits.length > 0
                  ? Math.round(
                      audits.reduce((s, a) => s + a.progress, 0) /
                        audits.length,
                    )
                  : 0}
                %
              </div>
              <div className={s.kpiMeta}>Overall audit progress</div>
            </div>
          </div>
        </div>

        {/* Secondary Dashboard Grid */}
        <div
          className={s.gridTwoCols}
          style={{ alignItems: "start", marginBottom: "1.5rem" }}
        >
          {/* High Risk Areas - Moved to Left Column now since audit lifecycle is removed */}
          <div className={s.card} style={{ height: "100%" }}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Priority Attention Areas</h3>
              <span style={{ fontSize: "0.8rem", color: "#666" }}>
                LGA Risk Scorecard
              </span>
            </div>
            <div className={s.cardBody}>
              {riskByLga.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {riskByLga.map((lga) => (
                    <div
                      key={lga.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        background: "#fff1f2",
                        borderRadius: "0.5rem",
                        border: "1px solid #fecdd3",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "#881337" }}>
                          {lga.name} LGA
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#9f1239" }}>
                          {ZONES.find((z) => z.id === lga.zoneId)?.name} Zone
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            color: "#be123c",
                          }}
                        >
                          {lga.criticalCount} Critical
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#9f1239" }}>
                          {lga.highCount} High Risks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.emptyState}>
                  <CheckCircle
                    size={32}
                    style={{ color: "#10b981", marginBottom: "0.5rem" }}
                  />
                  <p>No critical risk areas identified.</p>
                </div>
              )}
            </div>
          </div>

          <div className={s.card} style={{ height: "100%" }}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Audit Status Snapshot</h3>
            </div>
            <div className={s.cardBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#0f172a",
                    }}
                  >
                    {auditsByStage.Fieldwork}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Currently in Fieldwork
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    background: "#fef2f2",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#ef4444",
                    }}
                  >
                    {criticalRisks.length}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#991b1b" }}>
                    Open Critical Issues
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    background: "#f0fdf4",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#16a34a",
                    }}
                  >
                    {auditsByStage.Completed}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#166534" }}>
                    Completed Audits
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    background: "#fffbeb",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#d97706",
                    }}
                  >
                    {auditsByStage.Reporting}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#92400e" }}>
                    Under Review
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Zone Performance Overview</h3>
          </div>
        </div>

        <div className={s.gridThreeCols}>
          {ZONES.map((zone) => {
            const zoneLgas = LGAS.filter((l) => zone.lgas.includes(l.id));
            // Calculate real progress for zone
            const zAudits = audits.filter((a) =>
              zoneLgas.map((l) => l.id).includes(a.lgaId),
            );
            const avgProgress =
              zAudits.length > 0
                ? Math.round(
                    zAudits.reduce((acc, curr) => acc + curr.progress, 0) /
                      zAudits.length,
                  )
                : 0;

            return (
              <div key={zone.id} className={s.zoneCard}>
                <div className={s.zoneHeader}>
                  <div>
                    <div className={s.zoneName}>{zone.name} Zone</div>
                    <div className={s.zoneLgaCount}>
                      {zone.lgas.length} LGA{zone.lgas.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {avgProgress}%
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      Avg. Progress
                    </div>
                  </div>
                </div>
                <div className={s.zoneBody}>
                  <div className={s.progressBar}>
                    <div
                      className={s.progressFill}
                      style={{
                        width: `${avgProgress}%`,
                        backgroundColor:
                          avgProgress > 75
                            ? "#10b981"
                            : avgProgress > 40
                              ? "#3b82f6"
                              : "#f59e0b",
                      }}
                    />
                  </div>
                  <ul className={s.lgaList}>
                    {zoneLgas.map((lga) => {
                      const a = audits.find((au) => au.lgaId === lga.id);
                      return (
                        <li key={lga.id} className={s.lgaItem}>
                          <span>{lga.name}</span>
                          <span
                            className={`${s.lgaStatus}`}
                            style={{
                              color:
                                a?.status === "Completed"
                                  ? "#166534"
                                  : a?.status === "Planning"
                                    ? "#854d0e"
                                    : "#1e40af",
                              background:
                                a?.status === "Completed"
                                  ? "#dcfce7"
                                  : a?.status === "Planning"
                                    ? "#fef9c3"
                                    : "#dbeafe",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                            }}
                          >
                            {a?.status || "Pending"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

          <div>
            <div className={s.card} style={{ marginBottom: "2rem" }}>
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
