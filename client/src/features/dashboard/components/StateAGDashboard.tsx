import React from "react";
import type { NavigateFunction } from "react-router-dom";
import {
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  Activity,
} from "lucide-react";
import { ZONES, LGAS } from "../../../mock/data";
import { useAuditStore } from "../../../store/useAuditStore";
import type { Audit, FraudFlag } from "../../../types";
import s from "../../../styles/pages.module.css";

interface StateAGDashboardProps {
  audits: Audit[];
  fraudFlags: FraudFlag[];
  navigate: NavigateFunction;
}

const StateAGDashboard: React.FC<StateAGDashboardProps> = ({
  audits,
  fraudFlags,
  navigate,
}) => {
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

  // Group Risks by Council (LGA/LCDA)
  const riskByLga = LGAS.map((lga) => {
    const lgaAudits = audits.filter((a) => a.lgaId === lga.id).map((a) => a.id);
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
            High-level monitoring, risk assessment, and progress tracking across
            Lagos State
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
            <div className={s.kpiValue}>{LGAS.length} Councils</div>
            <div className={s.kpiMeta}>
              {
                LGAS.filter((l) => !l.councilType || l.councilType === "LGA")
                  .length
              }{" "}
              LGAs + {LGAS.filter((l) => l.councilType === "LCDA").length} LCDAs
              across 5 zones
            </div>
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
                    audits.reduce((s, a) => s + a.progress, 0) / audits.length,
                  )
                : 0}
              %
            </div>
            <div className={s.kpiMeta}>Overall audit progress</div>
          </div>
        </div>
      </div>

      {(() => {
        const outcome =
          audits.length > 0
            ? useAuditStore
                .getState()
                .auditOutcomes?.find(
                  (o) =>
                    o.status === "Ready for Review" ||
                    o.status === "In Progress",
                )
            : undefined;
        const stateReport = outcome
          ? useAuditStore
              .getState()
              .auditReportDocuments?.find(
                (r) =>
                  r.type === "State Consolidated" &&
                  outcome.auditReportIds.includes(r.id),
              )
          : undefined;
        const awaitingAG =
          stateReport &&
          stateReport.auditLeadSignature?.signedAt &&
          stateReport.auditSupervisorSignature?.signedAt &&
          !stateReport.auditorGeneralSignature?.signedAt;

        if (!awaitingAG || !outcome) return null;

        return (
          <div
            style={{
              background: "linear-gradient(90deg, #064e3b 0%, #059669 100%)",
              color: "white",
              borderRadius: 8,
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: "2rem",
              boxShadow: "0 4px 12px rgba(6, 78, 59, 0.25)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  opacity: 0.85,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Action Required
              </div>
              <div
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {outcome.title}: Ready for your sign-off
              </div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                Audit Lead and Audit Supervisor have completed review and
                approval. Your signature is the final gate before compilation.
              </div>
            </div>
            <button
              onClick={() => navigate("/audit-outcomes")}
              style={{
                padding: "0.75rem 1.25rem",
                background: "white",
                color: "#064e3b",
                border: "none",
                borderRadius: 6,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              Review &amp; Sign →
            </button>
          </div>
        );
      })()}

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
              Council Risk Scorecard
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
                        {lga.name} {lga.councilType === "LCDA" ? "LCDA" : "LGA"}
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
                    {
                      zoneLgas.filter(
                        (l) => !l.councilType || l.councilType === "LGA",
                      ).length
                    }{" "}
                    LGA
                    {zoneLgas.filter(
                      (l) => !l.councilType || l.councilType === "LGA",
                    ).length !== 1
                      ? "s"
                      : ""}
                    , {zoneLgas.filter((l) => l.councilType === "LCDA").length}{" "}
                    LCDA
                    {zoneLgas.filter((l) => l.councilType === "LCDA").length !==
                    1
                      ? "s"
                      : ""}
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

export default StateAGDashboard;
