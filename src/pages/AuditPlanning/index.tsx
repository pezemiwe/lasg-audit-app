import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import { calculateOverallRisk } from "../../utils/auditLogic";
import { WorkflowGate } from "../../components/UI/WorkflowGate";
import ps from "../../styles/pages.module.css";
import type { RiskLevel } from "../../types";

const RISK_COLOR: Record<
  RiskLevel,
  { bg: string; color: string; desc: string }
> = {
  Low: {
    bg: "#d1fae5",
    color: "#065f46",
    desc: "Unlikely to occur; minimal impact.",
  },
  Medium: {
    bg: "#fef3c7",
    color: "#92400e",
    desc: "Possible occurrence; moderate impact.",
  },
  High: {
    bg: "#fee2e2",
    color: "#991b1b",
    desc: "Likely to occur; significant impact.",
  },
  Critical: {
    bg: "#fce7f3",
    color: "#9d174d",
    desc: "Almost certain; severe impact.",
  },
};

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const c = RISK_COLOR[level];
  return (
    <span
      title={c.desc}
      style={{
        background: c.bg,
        color: c.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        cursor: "help",
      }}
    >
      {level}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    Identified: { bg: "#fee2e2", color: "#991b1b" },
    Mitigated: { bg: "#d1fae5", color: "#065f46" },
    Accepted: { bg: "#fef3c7", color: "#92400e" },
    Effective: { bg: "#d1fae5", color: "#065f46" },
    "Partially Effective": { bg: "#fef3c7", color: "#92400e" },
    Ineffective: { bg: "#fee2e2", color: "#991b1b" },
    Approved: { bg: "#d1fae5", color: "#065f46" },
    Completed: { bg: "#dbeafe", color: "#1e40af" },
    "In Progress": { bg: "#fef3c7", color: "#92400e" },
    Pending: { bg: "#f3f4f6", color: "#6b7280" },
  };
  const c = colors[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {status}
    </span>
  );
};

const Card: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, children, action }) => (
  <div className={ps.card}>
    <div className={ps.cardHeader}>
      <div>
        <div className={ps.cardTitle}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-3)",
              marginTop: "0.2rem",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className={ps.cardBody}>{children}</div>
  </div>
);

interface AuditPlanningProps {
  auditId?: string;
  embedded?: boolean;
}

const AuditPlanning: React.FC<AuditPlanningProps> = ({ auditId, embedded }) => {
  const { user } = useAuth();
  const {
    audits,
    lgas,
    programmes,
    riskMatrices,
    materiality,
    controlTests,
    zones,
  } = useAuditStore();
  const addRiskMatrix = useAuditStore((st) => st.addRiskMatrix);
  const addToast = useAuditStore((st) => st.addToast);
  const [activeTab, setActiveTab] = useState<
    "risk" | "materiality" | "entity" | "programme"
  >("entity");
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [riskForm, setRiskForm] = useState({
    area: "",
    inherentRisk: "Medium" as RiskLevel,
    controlRisk: "Medium" as RiskLevel,
    detectionRisk: "Medium" as RiskLevel,
    overallRisk: "Medium" as RiskLevel,
    mitigationPlan: "",
  });

  // Risk state initialized with defaults

  // Let's use the handler approach. We'll modify the handleChange function instead.

  if (!user) return null;

  const myAudits = auditId
    ? audits.filter((a) => a.id === auditId)
    : user.role === "AUDIT_LEAD"
      ? audits.filter((a) => a.leadId === user.id)
      : audits;

  const myAudit = myAudits[0];
  const derivedAuditId = myAudit?.id ?? "audit-1";
  const lga = lgas.find((l) => l.id === myAudit?.lgaId);
  const lgaName = lga?.name ?? "N/A";
  const zone = zones.find((z) => z.id === lga?.zoneId);

  const auditRisks = riskMatrices.filter((r) => r.auditId === derivedAuditId);
  const auditMat = materiality.find((m) => m.auditId === derivedAuditId);
  // const auditControls = controlTests.filter((c) => c.auditId === derivedAuditId);
  void controlTests; // suppress unused warning
  const auditProg = programmes.find((p) => p.auditId === derivedAuditId);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);

  const tabs = [
    { id: "entity" as const, label: "Entity Understanding" },
    { id: "risk" as const, label: "Risk Matrix" },
    { id: "materiality" as const, label: "Materiality" },
    { id: "programme" as const, label: "Audit Programme" },
  ];

  return (
    <div
      style={
        embedded
          ? { margin: "0 auto", width: "100%" }
          : { padding: "2rem", maxWidth: "1200px", margin: "0 auto" }
      }
    >
      {!embedded && (
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--primary)",
                marginBottom: "0.5rem",
              }}
            >
              Audit Planning
            </div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Planning Phase
            </h1>
            <p
              style={{
                color: "var(--text-3)",
                marginTop: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              {lgaName} LGA — Risk assessment, materiality determination, and
              audit programme preparation.
            </p>
          </div>
          {myAudit && <StatusBadge status={myAudit.status} />}
        </div>
      )}

      <div className={ps.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${ps.tabBtn} ${activeTab === tab.id ? ps.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "entity" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Main Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <Card
              title="Executive Summary"
              subtitle={`Overview of ${lgaName} Local Government Area`}
            >
              <div
                style={{
                  padding: "1.5rem",
                  lineHeight: 1.7,
                  color: "var(--text-2)",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: 0, marginBottom: "1rem" }}>
                  <strong>{lgaName} LGA</strong> is situated in the{" "}
                  {zone?.name || "West"} Senatorial District of Lagos State.
                  Established in 1982, it serves a population of approximately
                  450,000 residents. The LGA is characterized by significant
                  commercial activities and a growing residential base.
                </p>
                <p style={{ margin: 0 }}>
                  The Council is led by an Executive Chairman and supported by a
                  Legislative Arm comprising 7 Councilors. Key operational areas
                  include Health, Education, Environment, and Works &
                  Infrastructure.
                </p>
              </div>
            </Card>

            <Card
              title="Financial Performance (Prior Year)"
              subtitle="Key financial indicators extracted from 2023 Audited Accounts"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  padding: "1.5rem",
                }}
              >
                {[
                  {
                    label: "Total Revenue",
                    value: "₦4,250,000,000",
                    change: "+12%",
                    positive: true,
                  },
                  {
                    label: "Total Expenditure",
                    value: "₦3,800,000,000",
                    change: "+15%",
                    positive: false,
                  },
                  {
                    label: "Surplus / (Deficit)",
                    value: "₦450,000,000",
                    change: "-5%",
                    positive: false,
                  },
                  {
                    label: "IGR Contribution",
                    value: "18%",
                    change: "+2%",
                    positive: true,
                  },
                  {
                    label: "Personnel Costs",
                    value: "45% of Recurrent",
                    change: "0%",
                    positive: true,
                  },
                  {
                    label: "Capital Execution",
                    value: "62%",
                    change: "-10%",
                    positive: false,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "var(--bg)",
                      padding: "1rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-3)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: stat.positive ? "#059669" : "#d97706",
                        fontWeight: 600,
                      }}
                    >
                      {stat.change} vs Prior Year
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="IT Environment Assessment">
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
                      Systems In Use
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.2rem",
                        color: "var(--text-2)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <li style={{ marginBottom: "0.5rem" }}>
                        Oralce Financials (General Ledger)
                      </li>
                      <li style={{ marginBottom: "0.5rem" }}>
                        IPPIS (Payroll Management)
                      </li>
                      <li style={{ marginBottom: "0.5rem" }}>
                        CloudTax (Revenue Collection)
                      </li>
                      <li>Microsoft Excel (Budgeting & Ad-hoc)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
                      Control Environment
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        "Access Controls: Weak",
                        "Backups: Monthly",
                        "Network Security: Standard",
                      ].map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "#f3f4f6",
                            padding: "0.3rem 0.6rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            color: "#4b5563",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <Card title="Governance Structure">
              <div style={{ padding: "1rem" }}>
                {[
                  { role: "Chairman", name: "Hon. Adewale Baku" },
                  { role: "Vice Chairman", name: "Hon. Mrs. Cole" },
                  { role: "Council Manager", name: "Mr. John Doe" },
                  { role: "Council Treasurer", name: "Mrs. Jane Smith" },
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "var(--bg-2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {p.name}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--text-3)" }}
                      >
                        {p.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Prior Audit Opinions">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { year: "2023", opinion: "Qualified", color: "#d97706" },
                  { year: "2022", opinion: "Unqualified", color: "#059669" },
                  { year: "2021", opinion: "Qualified", color: "#d97706" },
                ].map((h) => (
                  <div
                    key={h.year}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {h.year}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "10px",
                        background: h.color,
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {h.opinion}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "risk" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Risk Heatmap Summary - MOCKED Visual */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <Card
              title="Risk Exposure Summary"
              subtitle="Distribution of identified risks"
            >
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  gap: "2rem",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem" }}>Critical Risks</span>
                    <span style={{ fontWeight: 700, color: "#991b1b" }}>
                      {
                        auditRisks.filter((r) => r.overallRisk === "Critical")
                          .length
                      }
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem" }}>High Risks</span>
                    <span style={{ fontWeight: 700, color: "#9d174d" }}>
                      {
                        auditRisks.filter((r) => r.overallRisk === "High")
                          .length
                      }
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem" }}>Medium Risks</span>
                    <span style={{ fontWeight: 700, color: "#92400e" }}>
                      {
                        auditRisks.filter((r) => r.overallRisk === "Medium")
                          .length
                      }
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "100px",
                    background: "var(--border)",
                  }}
                ></div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text-3)",
                    }}
                  >
                    Highest Risk Area
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    Revenue Collection
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-2)",
                      marginTop: "0.5rem",
                    }}
                  >
                    Due to significant cash handling and weak reconciliation
                    controls.
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Risk Strategy">
              <div style={{ padding: "1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    color: "var(--text-2)",
                    margin: 0,
                  }}
                >
                  Based on the risk assessment, the audit strategy will focus
                  heavily on <strong>Substantive Testing</strong> for Revenue
                  and Expenditure cycles.
                  <br />
                  <br />
                  We will adopt a <strong>Combined Approach</strong> (Controls +
                  Substantive) for Payroll, as controls appear partially
                  effective.
                </p>
              </div>
            </Card>

            <Card title="Defined Risk Levels">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  padding: "1.5rem",
                }}
              >
                {Object.entries(RISK_COLOR).map(([level, meta]) => (
                  <div
                    key={level}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ width: "80px" }}>
                      <RiskBadge level={level as RiskLevel} />
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
                      {meta.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card
            title="Risk Assessment Matrix"
            subtitle={`${auditRisks.length} risk(s) identified for ${lgaName} LGA`}
            action={
              !showRiskForm &&
              user?.role !== "STATE_AUDITOR_GENERAL" &&
              user?.role !== "AUDITOR_GENERAL_FEDERATION" ? (
                <button
                  onClick={() => setShowRiskForm(true)}
                  style={{
                    background: "#064e3b",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  + Add Risk
                </button>
              ) : undefined
            }
          >
            {showRiskForm && (
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: "2px solid var(--border)",
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                  }}
                >
                  New Risk Entry
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-3)",
                        display: "block",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Area
                    </label>
                    <input
                      value={riskForm.area}
                      onChange={(e) =>
                        setRiskForm({ ...riskForm, area: e.target.value })
                      }
                      placeholder="e.g. Revenue Collection"
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.75rem",
                        border: "1.5px solid var(--border)",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                  {(
                    [
                      "inherentRisk",
                      "controlRisk",
                      "detectionRisk",
                      "overallRisk",
                    ] as const
                  ).map((field) => {
                    const isAuto = field === "overallRisk";
                    return (
                      <div key={field}>
                        <label
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-3)",
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.35rem",
                          }}
                        >
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (s) => s.toUpperCase())}
                          {isAuto && (
                            <span
                              style={{
                                color: "var(--primary)",
                                fontSize: "0.65rem",
                                border: "1px solid var(--primary)",
                                padding: "0 4px",
                                borderRadius: "2px",
                              }}
                            >
                              AUTO
                            </span>
                          )}
                        </label>
                        <select
                          value={riskForm[field]}
                          disabled={isAuto}
                          onChange={(e) => {
                            const val = e.target.value as RiskLevel;
                            const newState = { ...riskForm, [field]: val };
                            if (
                              field === "inherentRisk" ||
                              field === "controlRisk"
                            ) {
                              newState.overallRisk = calculateOverallRisk(
                                newState.inherentRisk,
                                newState.controlRisk,
                              );
                            }
                            setRiskForm(newState);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.6rem 0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            background: isAuto ? "var(--bg-2)" : "var(--bg)",
                            cursor: isAuto ? "not-allowed" : "pointer",
                            fontWeight: isAuto ? 700 : 400,
                          }}
                        >
                          {(
                            ["Low", "Medium", "High", "Critical"] as RiskLevel[]
                          ).map((lv) => (
                            <option key={lv} value={lv}>
                              {lv}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                  <div style={{ gridColumn: "1/-1" }}>
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-3)",
                        display: "block",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Mitigation Plan
                    </label>
                    <textarea
                      value={riskForm.mitigationPlan}
                      onChange={(e) =>
                        setRiskForm({
                          ...riskForm,
                          mitigationPlan: e.target.value,
                        })
                      }
                      placeholder="Describe the planned mitigation approach"
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.75rem",
                        border: "1.5px solid var(--border)",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        minHeight: "60px",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    onClick={() => setShowRiskForm(false)}
                    style={{
                      padding: "0.5rem 1rem",
                      border: "1.5px solid var(--border)",
                      borderRadius: "4px",
                      background: "transparent",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!riskForm.area.trim()) {
                        addToast({ type: "error", title: "Area is required" });
                        return;
                      }
                      addRiskMatrix({
                        auditId: derivedAuditId,
                        area: riskForm.area,
                        inherentRisk: riskForm.inherentRisk,
                        controlRisk: riskForm.controlRisk,
                        detectionRisk: riskForm.detectionRisk,
                        overallRisk: riskForm.overallRisk,
                        mitigationPlan: riskForm.mitigationPlan,
                        status: "Open",
                        preparedBy: user?.name || "",
                      });
                      setRiskForm({
                        area: "",
                        inherentRisk: "Medium",
                        controlRisk: "Medium",
                        detectionRisk: "Medium",
                        overallRisk: "High",
                        mitigationPlan: "",
                      });
                      setShowRiskForm(false);
                      addToast({ type: "success", title: "Risk Entry Added" });
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#064e3b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add Risk
                  </button>
                </div>
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.83rem",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--bg)" }}>
                    {[
                      "Area",
                      "Inherent Risk",
                      "Control Risk",
                      "Detection Risk",
                      "Overall Risk",
                      "Status",
                      "Mitigation Plan",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--text-3)",
                          borderBottom: "1px solid var(--border)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditRisks.map((risk, i) => (
                    <tr
                      key={risk.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: i % 2 === 0 ? "transparent" : "var(--bg)",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {risk.area}
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <RiskBadge level={risk.inherentRisk} />
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <RiskBadge level={risk.controlRisk} />
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <RiskBadge level={risk.detectionRisk} />
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <RiskBadge level={risk.overallRisk} />
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <StatusBadge status={risk.status} />
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          color: "var(--text-2)",
                          maxWidth: "200px",
                          lineHeight: 1.5,
                        }}
                      >
                        {risk.mitigationPlan}
                      </td>
                    </tr>
                  ))}
                  {auditRisks.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "var(--text-3)",
                        }}
                      >
                        No risk matrix entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "materiality" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "1.5rem",
          }}
        >
          {auditMat ? (
            <>
              <Card
                title="Materiality Thresholds"
                subtitle={`${lgaName} LGA · FY 2024/2025`}
              >
                <div
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {[
                    { label: "Basis", value: auditMat.basis },
                    {
                      label: "Basis Amount",
                      value: formatCurrency(auditMat.basisAmount),
                    },
                    {
                      label: "Percentage Applied",
                      value: `${auditMat.percentage}%`,
                    },
                    {
                      label: "Overall Materiality",
                      value: formatCurrency(auditMat.overallMateriality),
                      highlight: true,
                    },
                    {
                      label: "Performance Materiality",
                      value: formatCurrency(auditMat.performanceMateriality),
                      highlight: true,
                    },
                    {
                      label: "Clearly Trivial Threshold",
                      value: formatCurrency(auditMat.clearlyTrivialThreshold),
                    },
                    { label: "Prepared By", value: auditMat.preparedBy },
                    {
                      label: "Approved By",
                      value: auditMat.approvedBy ?? "Pending approval",
                    },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{ fontSize: "0.8rem", color: "var(--text-3)" }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: highlight ? 800 : 600,
                          color: highlight ? "var(--primary)" : "var(--text)",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Materiality Framework"
                subtitle="ISA 320 — Materiality in Planning and Performing an Audit"
              >
                <div style={{ padding: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-2)",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Materiality is determined using Total Revenue as the basis,
                    consistent with public sector audit practice under ISSAI
                    300. Performance materiality is set at 75% of overall
                    materiality to reduce the probability that uncorrected
                    misstatements exceed overall materiality.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {[
                      {
                        level: "Overall Materiality",
                        pct: 100,
                        color: "#064e3b",
                        value: auditMat.overallMateriality,
                      },
                      {
                        level: "Performance Materiality",
                        pct: 75,
                        color: "#c8930a",
                        value: auditMat.performanceMateriality,
                      },
                      {
                        level: "Clearly Trivial",
                        pct: 10,
                        color: "#6b7280",
                        value: auditMat.clearlyTrivialThreshold,
                      },
                    ].map((item) => (
                      <div key={item.level}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.4rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.825rem",
                              fontWeight: 600,
                              color: "var(--text)",
                            }}
                          >
                            {item.level}
                          </span>
                          <span
                            style={{
                              fontSize: "0.825rem",
                              fontWeight: 700,
                              color: item.color,
                            }}
                          >
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "var(--border)",
                            borderRadius: "2px",
                            height: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${item.pct}%`,
                              height: "100%",
                              background: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div style={{ gridColumn: "1/-1" }}>
              <Card title="Materiality">
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-3)",
                    fontSize: "0.875rem",
                  }}
                >
                  Materiality thresholds have not been set for this engagement
                  yet.
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === "programme" && (
        <Card
          title="Audit Programme"
          subtitle={`${lgaName} LGA — Approved audit procedures and assignments`}
        >
          {auditProg ? (
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "Programme Status",
                    value: <StatusBadge status={auditProg.status} />,
                  },
                  {
                    label: "Total Procedures",
                    value: `${auditProg.procedures?.length ?? 0}`,
                  },
                  { label: "Prepared By", value: auditProg.preparedBy },
                  {
                    label: "Approved By",
                    value: auditProg.approvedBy ?? "Pending",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      padding: "1rem 1.25rem",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      minWidth: "140px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "var(--text-3)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "var(--text)",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {auditProg.procedures && auditProg.procedures.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.83rem",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "var(--bg)" }}>
                        {[
                          "#",
                          "Area",
                          "Procedure",
                          "Assigned To",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "left",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              color: "var(--text-3)",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {auditProg.procedures.map((proc, i) => (
                        <tr
                          key={proc.id}
                          style={{
                            borderBottom: "1px solid var(--border)",
                            background:
                              i % 2 === 0 ? "transparent" : "var(--bg)",
                          }}
                        >
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-3)",
                              fontWeight: 600,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              fontWeight: 600,
                              color: "var(--text)",
                            }}
                          >
                            {proc.area}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-2)",
                              lineHeight: 1.5,
                              maxWidth: "280px",
                            }}
                          >
                            {proc.procedure}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-2)",
                            }}
                          >
                            {proc.assignedTo || "—"}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <StatusBadge
                              status={
                                proc.status === "Completed"
                                  ? "Completed"
                                  : proc.status === "In Progress"
                                    ? "In Progress"
                                    : "Pending"
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(!auditProg.procedures || auditProg.procedures.length === 0) && (
                <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
                  No procedures defined yet.
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-3)",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                No audit programme found for this engagement.
              </p>
              <p style={{ fontSize: "0.8rem" }}>
                The audit lead can create a programme from the Workpapers
                section.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

const AuditPlanningWrapper: React.FC<AuditPlanningProps> = (props) => (
  <WorkflowGate phase="planning">
    <AuditPlanning {...props} />
  </WorkflowGate>
);

export default AuditPlanningWrapper;
