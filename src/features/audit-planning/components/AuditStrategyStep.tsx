import React, { useState } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, RiskMatrix, EntityProfile, AuditStrategy, AuditStrategyStatus } from "../../../types";
import { AlertTriangle, ChevronRight, Plus, Pencil, X, Save, Shield, Target } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import { fmtCurrency } from "../utils/format";

const StrategySection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div style={{ marginBottom: "0.5rem" }}>
    <div
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#059669",
        marginBottom: "0.6rem",
        paddingBottom: "0.35rem",
        borderBottom: "1px solid #d1fae5",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const AuditStrategyStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  strategy: AuditStrategy | undefined;
  risks: RiskMatrix[];
  materialityData: AuditStore["materiality"][0] | undefined;
  entityProfile: EntityProfile | undefined;
  store: AuditStore;
  user: User;
}> = ({ audit, lgaName, strategy, risks, materialityData, store, user }) => {
  const [editing, setEditing] = useState(!strategy);
  const lead = store.users.find((u) => u.id === audit.leadId);
  const team = store.users.filter((u) => (audit.teamIds || []).includes(u.id));

  const highRiskAreas = risks.filter(
    (r) => r.overallRisk === "High" || r.overallRisk === "Critical",
  );
  const [form, setForm] = useState<Omit<AuditStrategy, "id" | "createdAt">>({
    auditId: audit.id,
    overallApproach:
      strategy?.overallApproach ||
      (highRiskAreas.length > 2 ? "Substantive" : "Combined"),
    keyAuditMatters:
      strategy?.keyAuditMatters || highRiskAreas.map((r) => r.area),
    relatedPartyConsiderations:
      strategy?.relatedPartyConsiderations ||
      "Review transactions with related parties per ISA 550 requirements",
    goingConcernAssessment:
      strategy?.goingConcernAssessment ||
      "No significant going concern indicators identified based on preliminary assessment",
    fraudRiskFactors: strategy?.fraudRiskFactors || [
      "Risk of management override of controls (presumed per ISA 240)",
      "Revenue recognition risk",
    ],
    significantRiskAreas:
      strategy?.significantRiskAreas || highRiskAreas.map((r) => r.area),
    plannedStartDate:
      strategy?.plannedStartDate ||
      audit.startDate ||
      new Date().toISOString().slice(0, 10),
    plannedEndDate: strategy?.plannedEndDate || audit.endDate || "",
    teamComposition:
      strategy?.teamComposition ||
      `Lead: ${lead?.name || "TBD"}${team.length > 0 ? `, Team: ${team.map((t) => t.name).join(", ")}` : ""}`,
    supervisionPlan:
      strategy?.supervisionPlan ||
      "Weekly progress reviews with field team; bi-weekly supervisor check-ins",
    status: strategy?.status || "Draft",
    preparedBy: user.id,
  });

  const [newKAM, setNewKAM] = useState("");
  const [newFraud, setNewFraud] = useState("");

  const handleSave = () => {
    store.saveAuditStrategy(form);
    setEditing(false);
    store.logActivity({
      userId: user.id,
      action: "SAVE_STRATEGY",
      details: `Audit strategy document saved for ${lgaName}`,
      entityType: "audit",
      entityId: audit.id,
    });
  };

  if (!editing && strategy) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "2px solid var(--border)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.5rem 2rem",
              background: "#064e3b",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                }}
              >
                Overall Audit Strategy
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  opacity: 0.8,
                  marginTop: "0.2rem",
                }}
              >
                {lgaName} - FY {audit.year} | ISA 300.7
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "4px",
                  padding: "0.4rem 0.85rem",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Pencil size={13} /> Edit
              </button>
              <StatusBadge
                label={strategy.status}
                variant={
                  strategy.status === "Approved"
                    ? "success"
                    : strategy.status === "Under Review"
                      ? "info"
                      : "default"
                }
              />
            </div>
          </div>

          <div style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <StrategySection title="Overall Audit Approach">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    fontWeight: 700,
                    color: "#065f46",
                  }}
                >
                  <Target size={16} />
                  {strategy.overallApproach} Approach
                </div>
              </StrategySection>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                marginBottom: "2rem",
              }}
            >
              <StrategySection title="Key Audit Matters">
                {strategy.keyAuditMatters.map((k, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <ChevronRight
                      size={14}
                      style={{
                        color: "#059669",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    <span style={{ fontSize: "0.85rem" }}>{k}</span>
                  </div>
                ))}
              </StrategySection>

              <StrategySection title="Significant Risk Areas">
                {strategy.significantRiskAreas.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <AlertTriangle
                      size={14}
                      style={{
                        color: "#dc2626",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    <span style={{ fontSize: "0.85rem" }}>{r}</span>
                  </div>
                ))}
              </StrategySection>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                marginBottom: "2rem",
              }}
            >
              <StrategySection title="Fraud Risk Factors (ISA 240)">
                {strategy.fraudRiskFactors.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Shield
                      size={14}
                      style={{
                        color: "#d97706",
                        flexShrink: 0,
                        marginTop: "0.15rem",
                      }}
                    />
                    <span style={{ fontSize: "0.85rem" }}>{f}</span>
                  </div>
                ))}
              </StrategySection>

              <div>
                <StrategySection title="Materiality Reference">
                  {materialityData ? (
                    <div
                      style={{
                        padding: "0.75rem",
                        borderRadius: "4px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        Overall:{" "}
                        <strong>
                          {fmtCurrency(materialityData.overallMateriality)}
                        </strong>
                      </div>
                      <div>
                        Performance:{" "}
                        <strong>
                          {fmtCurrency(materialityData.performanceMateriality)}
                        </strong>
                      </div>
                      <div>
                        Trivial:{" "}
                        <strong>
                          {fmtCurrency(materialityData.clearlyTrivialThreshold)}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-3)",
                        fontStyle: "italic",
                      }}
                    >
                      Materiality not yet determined
                    </div>
                  )}
                </StrategySection>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                marginBottom: "2rem",
              }}
            >
              <StrategySection title="Related Party Considerations (ISA 550)">
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                  {strategy.relatedPartyConsiderations}
                </p>
              </StrategySection>
              <StrategySection title="Going Concern Assessment (ISA 570)">
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                  {strategy.goingConcernAssessment}
                </p>
              </StrategySection>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              <StrategySection title="Engagement Timeline">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <div>
                    <strong>Start:</strong>{" "}
                    {strategy.plannedStartDate
                      ? new Date(strategy.plannedStartDate).toLocaleDateString()
                      : "TBD"}
                  </div>
                  <div>
                    <strong>End:</strong>{" "}
                    {strategy.plannedEndDate
                      ? new Date(strategy.plannedEndDate).toLocaleDateString()
                      : "TBD"}
                  </div>
                </div>
              </StrategySection>
              <StrategySection title="Team & Supervision">
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                  {strategy.teamComposition}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-3)",
                    marginTop: "0.5rem",
                  }}
                >
                  {strategy.supervisionPlan}
                </p>
              </StrategySection>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PlanningCard
        title="Audit Strategy - Configuration"
        subtitle="ISA 300.7 - The auditor shall establish an overall audit strategy"
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
          The overall audit strategy sets the scope, timing, and direction of
          the audit. It is assembled from the entity understanding, preliminary
          analytics, materiality determination, and risk assessment performed in
          the previous steps.
        </div>

        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Overall Approach</label>
            <select
              className={s.formSelect}
              value={form.overallApproach}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  overallApproach: e.target
                    .value as AuditStrategy["overallApproach"],
                }))
              }
            >
              <option value="Substantive">Substantive</option>
              <option value="Combined">
                Combined (Controls + Substantive)
              </option>
              <option value="Controls-Based">Controls-Based</option>
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Status</label>
            <select
              className={s.formSelect}
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as AuditStrategyStatus,
                }))
              }
            >
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Planned Start Date</label>
            <input
              type="date"
              className={s.formInput}
              value={form.plannedStartDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, plannedStartDate: e.target.value }))
              }
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Planned End Date</label>
            <input
              type="date"
              className={s.formInput}
              value={form.plannedEndDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, plannedEndDate: e.target.value }))
              }
            />
          </div>
        </div>
      </PlanningCard>

      <div className={s.gridTwoCols}>
        <PlanningCard title="Key Audit Matters">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {form.keyAuditMatters.map((k, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.65rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={{ flex: 1, fontSize: "0.85rem" }}>{k}</span>
                <button
                  className={s.btnIcon}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      keyAuditMatters: f.keyAuditMatters.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className={s.formInput}
              style={{ flex: 1, fontSize: "0.82rem" }}
              placeholder="Add key audit matter..."
              value={newKAM}
              onChange={(e) => setNewKAM(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newKAM.trim()) {
                  setForm((f) => ({
                    ...f,
                    keyAuditMatters: [...f.keyAuditMatters, newKAM.trim()],
                  }));
                  setNewKAM("");
                }
              }}
            />
            <button
              className={s.btnOutline}
              disabled={!newKAM.trim()}
              onClick={() => {
                if (newKAM.trim()) {
                  setForm((f) => ({
                    ...f,
                    keyAuditMatters: [...f.keyAuditMatters, newKAM.trim()],
                  }));
                  setNewKAM("");
                }
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </PlanningCard>

        <PlanningCard title="Fraud Risk Factors (ISA 240)">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {form.fraudRiskFactors.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.65rem",
                  borderRadius: "4px",
                  border: "1px solid #fde68a",
                  background: "#fffbeb",
                }}
              >
                <Shield size={13} style={{ color: "#d97706", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "0.85rem" }}>{f}</span>
                <button
                  className={s.btnIcon}
                  onClick={() =>
                    setForm((fm) => ({
                      ...fm,
                      fraudRiskFactors: fm.fraudRiskFactors.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className={s.formInput}
              style={{ flex: 1, fontSize: "0.82rem" }}
              placeholder="Add fraud risk factor..."
              value={newFraud}
              onChange={(e) => setNewFraud(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newFraud.trim()) {
                  setForm((f) => ({
                    ...f,
                    fraudRiskFactors: [...f.fraudRiskFactors, newFraud.trim()],
                  }));
                  setNewFraud("");
                }
              }}
            />
            <button
              className={s.btnOutline}
              disabled={!newFraud.trim()}
              onClick={() => {
                if (newFraud.trim()) {
                  setForm((f) => ({
                    ...f,
                    fraudRiskFactors: [...f.fraudRiskFactors, newFraud.trim()],
                  }));
                  setNewFraud("");
                }
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </PlanningCard>
      </div>

      <PlanningCard title="Related Party Considerations (ISA 550)">
        <textarea
          className={s.formTextarea}
          value={form.relatedPartyConsiderations}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              relatedPartyConsiderations: e.target.value,
            }))
          }
          placeholder="Document related party considerations..."
        />
      </PlanningCard>
      <PlanningCard title="Going Concern Assessment (ISA 570)">
        <textarea
          className={s.formTextarea}
          value={form.goingConcernAssessment}
          onChange={(e) =>
            setForm((f) => ({ ...f, goingConcernAssessment: e.target.value }))
          }
          placeholder="Document going concern assessment..."
        />
      </PlanningCard>

      <PlanningCard title="Team Composition & Supervision Plan">
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Team Composition</label>
            <textarea
              className={s.formTextarea}
              value={form.teamComposition}
              onChange={(e) =>
                setForm((f) => ({ ...f, teamComposition: e.target.value }))
              }
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Supervision Plan</label>
            <textarea
              className={s.formTextarea}
              value={form.supervisionPlan}
              onChange={(e) =>
                setForm((f) => ({ ...f, supervisionPlan: e.target.value }))
              }
            />
          </div>
        </div>
      </PlanningCard>

      <div className={s.formActions}>
        {strategy && (
          <button className={s.btnSecondary} onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
        <button className={s.btnPrimary} onClick={handleSave}>
          <Save size={14} /> Save Audit Strategy
        </button>
      </div>
    </div>
  );
};
export default AuditStrategyStep;
