import { useMemo } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import type { InternalControlTest } from "../../types";
import StatusBadge from "../../components/UI/StatusBadge";
import { MOCK_USERS } from "../../mock/data";
import s from "../../styles/pages.module.css";

interface ControlsDashboardProps {
  controlTests: InternalControlTest[];
  userId: string;
}

const userName = (id: string) =>
  MOCK_USERS.find((u) => u.id === id)?.name || id;

const ControlsDashboard: React.FC<ControlsDashboardProps> = ({
  controlTests,
  userId: _userId,
}) => {
  const stats = useMemo(() => {
    const total = controlTests.length;
    const effective = controlTests.filter(
      (ct) => ct.result === "Effective",
    ).length;
    const partial = controlTests.filter(
      (ct) => ct.result === "Partially Effective",
    ).length;
    const ineffective = controlTests.filter(
      (ct) => ct.result === "Ineffective",
    ).length;
    const untested = controlTests.filter((ct) => !ct.result).length;
    const withWeakness = controlTests.filter((ct) => ct.weakness).length;
    const effectivenessRate =
      total > 0 ? Math.round((effective / (total - untested || 1)) * 100) : 0;

    /* Group by area */
    const areas = [...new Set(controlTests.map((ct) => ct.controlArea))];
    const byArea = areas.map((area) => {
      const areaTests = controlTests.filter((ct) => ct.controlArea === area);
      return {
        area,
        total: areaTests.length,
        effective: areaTests.filter((ct) => ct.result === "Effective").length,
        partial: areaTests.filter((ct) => ct.result === "Partially Effective")
          .length,
        ineffective: areaTests.filter((ct) => ct.result === "Ineffective")
          .length,
        untested: areaTests.filter((ct) => !ct.result).length,
      };
    });

    /* Missing evidence reminders */
    const missingEvidence = controlTests.filter(
      (ct) => ct.result && !ct.testProcedure,
    );
    const staleTests = controlTests.filter((ct) => {
      if (!ct.testedAt) return false;
      const daysSince =
        (Date.now() - new Date(ct.testedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 30 && ct.result === "Partially Effective";
    });

    return {
      total,
      effective,
      partial,
      ineffective,
      untested,
      withWeakness,
      effectivenessRate,
      byArea,
      missingEvidence,
      staleTests,
    };
  }, [controlTests]);

  const resultColor = {
    Effective: "#15803d",
    "Partially Effective": "#d97706",
    Ineffective: "#dc2626",
  };
  const resultBg = {
    Effective: "#f0fdf4",
    "Partially Effective": "#fffbeb",
    Ineffective: "#fef2f2",
  };

  return (
    <div>
      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Tests",
            value: stats.total,
            icon: Shield,
            color: "#334155",
          },
          {
            label: "Effective",
            value: stats.effective,
            icon: CheckCircle,
            color: "#15803d",
          },
          {
            label: "Partial",
            value: stats.partial,
            icon: AlertTriangle,
            color: "#d97706",
          },
          {
            label: "Ineffective",
            value: stats.ineffective,
            icon: XCircle,
            color: "#dc2626",
          },
          {
            label: "Untested",
            value: stats.untested,
            icon: Clock,
            color: "#94a3b8",
          },
          {
            label: "Effectiveness",
            value: `${stats.effectivenessRate}%`,
            icon: TrendingUp,
            color:
              stats.effectivenessRate >= 80
                ? "#15803d"
                : stats.effectivenessRate >= 60
                  ? "#d97706"
                  : "#dc2626",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              padding: "0.75rem",
              background: "var(--bg-card, #fff)",
              border: "1px solid var(--border, rgba(0,0,0,0.1))",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <Icon size={16} style={{ color, marginBottom: "0.25rem" }} />
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#64748b",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Effectiveness by Area */}
      <div className={s.card} style={{ marginBottom: "1.5rem" }}>
        <div className={s.cardHeader}>
          <h4 className={s.cardTitle}>
            <BarChart3 size={16} /> Control Effectiveness by Area
          </h4>
        </div>
        <div className={s.cardBody}>
          {stats.byArea.length > 0 ? (
            stats.byArea.map((area) => {
              const tested = area.total - area.untested;
              const effRate =
                tested > 0 ? Math.round((area.effective / tested) * 100) : 0;
              return (
                <div key={area.area} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {area.area}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {tested}/{area.total} tested
                      </span>
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color:
                            effRate >= 80
                              ? "#15803d"
                              : effRate >= 60
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {effRate}%
                      </span>
                    </div>
                  </div>
                  {/* Stacked bar */}
                  <div
                    style={{
                      display: "flex",
                      height: "20px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    {area.effective > 0 && (
                      <div
                        style={{
                          width: `${(area.effective / area.total) * 100}%`,
                          background: "#22c55e",
                          transition: "width 0.3s",
                        }}
                        title={`Effective: ${area.effective}`}
                      />
                    )}
                    {area.partial > 0 && (
                      <div
                        style={{
                          width: `${(area.partial / area.total) * 100}%`,
                          background: "#f59e0b",
                          transition: "width 0.3s",
                        }}
                        title={`Partial: ${area.partial}`}
                      />
                    )}
                    {area.ineffective > 0 && (
                      <div
                        style={{
                          width: `${(area.ineffective / area.total) * 100}%`,
                          background: "#ef4444",
                          transition: "width 0.3s",
                        }}
                        title={`Ineffective: ${area.ineffective}`}
                      />
                    )}
                    {area.untested > 0 && (
                      <div
                        style={{
                          width: `${(area.untested / area.total) * 100}%`,
                          background: "#e2e8f0",
                          transition: "width 0.3s",
                        }}
                        title={`Untested: ${area.untested}`}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={s.emptyState}>
              <Shield size={32} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No control tests recorded</div>
              <div className={s.emptyDesc}>
                Add control tests to see the effectiveness dashboard
              </div>
            </div>
          )}
          {stats.byArea.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "0.75rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--border, rgba(0,0,0,0.08))",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#22c55e",
                    borderRadius: "2px",
                  }}
                />{" "}
                Effective
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#f59e0b",
                    borderRadius: "2px",
                  }}
                />{" "}
                Partial
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#ef4444",
                    borderRadius: "2px",
                  }}
                />{" "}
                Ineffective
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#e2e8f0",
                    borderRadius: "2px",
                  }}
                />{" "}
                Untested
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reminders / Alerts */}
      {(stats.missingEvidence.length > 0 ||
        stats.staleTests.length > 0 ||
        stats.byArea.some((a) => a.ineffective > 0)) && (
        <div
          className={s.card}
          style={{ marginBottom: "1.5rem", borderLeft: "4px solid #d97706" }}
        >
          <div className={s.cardHeader}>
            <h4 className={s.cardTitle}>
              <AlertTriangle size={16} /> Alerts & Reminders
            </h4>
          </div>
          <div className={s.cardBody}>
            {stats.missingEvidence.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  background: "#fffbeb",
                  borderRadius: "4px",
                }}
              >
                <FileText
                  size={14}
                  style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }}
                />
                <div style={{ fontSize: "0.82rem" }}>
                  <strong>{stats.missingEvidence.length} test(s)</strong> have
                  results but incomplete test procedures.
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#92400e",
                      marginTop: "0.2rem",
                    }}
                  >
                    {stats.missingEvidence
                      .slice(0, 3)
                      .map((ct) => ct.controlArea)
                      .join(", ")}
                    {stats.missingEvidence.length > 3 &&
                      ` +${stats.missingEvidence.length - 3} more`}
                  </div>
                </div>
              </div>
            )}
            {stats.staleTests.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  background: "#fef2f2",
                  borderRadius: "4px",
                }}
              >
                <Clock
                  size={14}
                  style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }}
                />
                <div style={{ fontSize: "0.82rem" }}>
                  <strong>
                    {stats.staleTests.length} partially effective control(s)
                  </strong>{" "}
                  tested over 30 days ago — consider re-testing.
                </div>
              </div>
            )}
            {stats.byArea
              .filter((a) => a.ineffective > 0)
              .map((area) => (
                <div
                  key={area.area}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    background: "#fef2f2",
                    borderRadius: "4px",
                  }}
                >
                  <XCircle
                    size={14}
                    style={{
                      color: "#dc2626",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>{area.area}:</strong> {area.ineffective} ineffective
                    control(s) — compensating controls or extended substantive
                    procedures required.
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Weaknesses Summary Table */}
      {stats.withWeakness > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h4 className={s.cardTitle}>
              <XCircle size={16} /> Identified Weaknesses
            </h4>
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
              {stats.withWeakness} weakness(es)
            </span>
          </div>
          <div className={s.cardBody}>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Control</th>
                    <th>Result</th>
                    <th>Weakness</th>
                    <th>Recommendation</th>
                    <th>Tester</th>
                  </tr>
                </thead>
                <tbody>
                  {controlTests
                    .filter((ct) => ct.weakness)
                    .map((ct) => (
                      <tr
                        key={ct.id}
                        style={{
                          background:
                            resultBg[ct.result as keyof typeof resultBg] ||
                            undefined,
                        }}
                      >
                        <td style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          {ct.controlArea}
                        </td>
                        <td style={{ fontSize: "0.82rem", maxWidth: "180px" }}>
                          {ct.controlDescription.substring(0, 80)}
                          {ct.controlDescription.length > 80 ? "…" : ""}
                        </td>
                        <td>
                          <StatusBadge
                            label={ct.result}
                            variant={
                              ct.result === "Effective"
                                ? "success"
                                : ct.result === "Ineffective"
                                  ? "error"
                                  : "warning"
                            }
                          />
                        </td>
                        <td
                          style={{
                            fontSize: "0.82rem",
                            color:
                              resultColor[
                                ct.result as keyof typeof resultColor
                              ] || "#475569",
                          }}
                        >
                          {ct.weakness}
                        </td>
                        <td style={{ fontSize: "0.82rem" }}>
                          {ct.recommendation || "—"}
                        </td>
                        <td style={{ fontSize: "0.75rem" }}>
                          {userName(ct.testedBy)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlsDashboard;
