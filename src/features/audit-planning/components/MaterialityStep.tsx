import React, { useState, useMemo } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, PreliminaryAnalytic } from "../../../types";
import { Save } from "lucide-react";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import { MATERIALITY_BASES } from "../constants";
import { fmtCurrency } from "../utils/format";

const MaterialityStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  materialityData: AuditStore["materiality"][0] | undefined;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: User;
}> = ({ audit, materialityData, analytics, store, user }) => {
  const totalRevenue = useMemo(() => {
    const rev = analytics.filter((a) => a.category === "Revenue");
    return rev.reduce((sum, r) => sum + r.currentYear, 0);
  }, [analytics]);

  const [basis, setBasis] = useState(materialityData?.basis || "Total Revenue");
  const [basisAmount, setBasisAmount] = useState(
    materialityData?.basisAmount || totalRevenue || 4_070_000_000,
  );
  const [percentage, setPercentage] = useState(
    materialityData?.percentage || 2,
  );
  const [perfPct, setPerfPct] = useState(
    materialityData
      ? Math.round(
          (materialityData.performanceMateriality /
            materialityData.overallMateriality) *
            100,
        )
      : 75,
  );

  const overallMateriality = Math.round(basisAmount * (percentage / 100));
  const performanceMateriality = Math.round(
    overallMateriality * (perfPct / 100),
  );
  const trivialThreshold = Math.round(overallMateriality * 0.05);

  const handleSave = () => {
    store.setAuditMateriality({
      auditId: audit.id,
      basis,
      basisAmount,
      percentage,
      overallMateriality,
      performanceMateriality,
      clearlyTrivialThreshold: trivialThreshold,
      preparedBy: user.id,
    });
    store.logActivity({
      userId: user.id,
      action: "SET_MATERIALITY",
      details: `Materiality set: ${fmtCurrency(overallMateriality)} (${percentage}% of ${basis})`,
      entityType: "audit",
      entityId: audit.id,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PlanningCard
        title="Materiality Determination"
        subtitle="ISA 320 - Materiality in Planning and Performing an Audit"
      >
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            marginBottom: "1.5rem",
            fontSize: "0.82rem",
            color: "#1e40af",
            lineHeight: 1.6,
          }}
        >
          Materiality is the magnitude of misstatements that, individually or in
          aggregate, could reasonably be expected to influence the economic
          decisions of users. The auditor sets materiality at both the overall
          and performance levels.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div>
            <div className={s.formGroup} style={{ marginBottom: "1.25rem" }}>
              <label className={s.formLabel}>Benchmark / Basis</label>
              <select
                className={s.formSelect}
                value={basis}
                onChange={(e) => setBasis(e.target.value)}
              >
                {MATERIALITY_BASES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className={s.formGroup} style={{ marginBottom: "1.25rem" }}>
              <label className={s.formLabel}>Basis Amount (₦)</label>
              <input
                type="number"
                className={s.formInput}
                value={basisAmount}
                onChange={(e) => setBasisAmount(Number(e.target.value))}
              />
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  marginTop: "0.25rem",
                }}
              >
                {fmtCurrency(basisAmount)}
              </div>
            </div>
            <div className={s.formGroup} style={{ marginBottom: "1.25rem" }}>
              <label className={s.formLabel}>Materiality Percentage (%)</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.25}
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {percentage}%
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  marginTop: "0.15rem",
                }}
              >
                Typical range: 1-2% for revenue/expenditure, 2-5% for assets
              </div>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Performance Materiality (%)</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <input
                  type="range"
                  min={50}
                  max={90}
                  step={5}
                  value={perfPct}
                  onChange={(e) => setPerfPct(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {perfPct}%
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-3)",
                  marginTop: "0.15rem",
                }}
              >
                Set lower (50-60%) for higher-risk entities; higher (75-85%) for
                lower-risk
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #bbf7d0",
                borderRadius: "6px",
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#166534",
                  marginBottom: "0.5rem",
                }}
              >
                Overall Materiality
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#064e3b",
                  letterSpacing: "-0.02em",
                }}
              >
                {fmtCurrency(overallMateriality)}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#166534",
                  marginTop: "0.25rem",
                }}
              >
                {percentage}% of {basis} ({fmtCurrency(basisAmount)})
              </div>
            </div>

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
                  borderRadius: "6px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#1e40af",
                    marginBottom: "0.3rem",
                  }}
                >
                  Performance Materiality
                </div>
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#1e3a8a",
                  }}
                >
                  {fmtCurrency(performanceMateriality)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#3b82f6" }}>
                  {perfPct}% of overall
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "6px",
                  background: "#fefce8",
                  border: "1px solid #fde68a",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#92400e",
                    marginBottom: "0.3rem",
                  }}
                >
                  Clearly Trivial
                </div>
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#78350f",
                  }}
                >
                  {fmtCurrency(trivialThreshold)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#d97706" }}>
                  5% of overall
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "1.25rem",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                background: "#f8fafc",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                color: "var(--text-2)",
              }}
            >
              <strong>Interpretation:</strong> Misstatements individually
              exceeding <strong>{fmtCurrency(overallMateriality)}</strong> are
              considered material. Audit procedures are designed to detect
              misstatements exceeding{" "}
              <strong>{fmtCurrency(performanceMateriality)}</strong>. Items
              below <strong>{fmtCurrency(trivialThreshold)}</strong> are deemed
              clearly trivial and will not be accumulated.
            </div>
          </div>
        </div>
      </PlanningCard>

      <div className={s.formActions}>
        <button className={s.btnPrimary} onClick={handleSave}>
          <Save size={14} /> Save Materiality
        </button>
      </div>
    </div>
  );
};

export default MaterialityStep;
