import React, { useState } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, EntityProfile } from "../../../types";
import { AlertTriangle, FileText, Plus, Pencil, X, Save, Info } from "lucide-react";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import InfoRow from "./InfoRow";
import { FRAMEWORKS, IT_SYSTEMS } from "../constants";

const EntityUnderstandingStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  profile: EntityProfile | undefined;
  store: AuditStore;
  user: User;
}> = ({ audit, lgaName, profile, store, user }) => {
  const lga = store.lgas.find((l) => l.id === audit.lgaId);
  const zone = store.zones.find((z) => z.id === lga?.zoneId);

  const [editing, setEditing] = useState(!profile);
  const [form, setForm] = useState<Omit<EntityProfile, "id" | "createdAt">>({
    auditId: audit.id,
    entityName: profile?.entityName || lgaName,
    councilType: profile?.councilType || lga?.councilType || "LGA",
    zoneId: profile?.zoneId || lga?.zoneId || "",
    establishedYear: profile?.establishedYear || 1976,
    population: profile?.population || 350000,
    chairmanName: profile?.chairmanName || "",
    treasurerName: profile?.treasurerName || "",
    councilManagerName: profile?.councilManagerName || "",
    internalAuditorName: profile?.internalAuditorName || "",
    financialFramework: profile?.financialFramework || "IPSAS Cash Basis",
    priorYearOpinion: profile?.priorYearOpinion || "Qualified",
    priorYearFindings: profile?.priorYearFindings || [
      "Inadequate documentation for capital expenditure",
      "Weak internal controls over revenue collection",
    ],
    itSystems: profile?.itSystems || ["Manual Spreadsheets"],
    itControlEnvironment: profile?.itControlEnvironment || "Adequate",
    internalAuditEffectiveness:
      profile?.internalAuditEffectiveness || "Partially Effective",
    keyActivities: profile?.keyActivities || [
      "Road & infrastructure maintenance",
      "Primary healthcare delivery",
      "Basic education support",
      "Waste management",
    ],
    significantChanges: profile?.significantChanges || "",
    preparedBy: user.id,
  });

  const [newFinding, setNewFinding] = useState("");
  const [newActivity, setNewActivity] = useState("");

  const handleSave = () => {
    store.saveEntityProfile(form);
    setEditing(false);
    store.logActivity({
      userId: user.id,
      action: "SAVE_ENTITY_PROFILE",
      details: `Entity understanding completed for ${lgaName}`,
      entityType: "audit",
      entityId: audit.id,
    });
  };

  if (!editing && profile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <PlanningCard
          title={`Entity Profile - ${profile.entityName}`}
          subtitle={`${profile.councilType} | ${zone?.name || ""} Zone | FY ${audit.year}`}
          actions={
            <button className={s.btnOutline} onClick={() => setEditing(true)}>
              <Pencil size={14} /> Edit Profile
            </button>
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            <InfoRow label="Council Type" value={profile.councilType} />
            <InfoRow label="Zone" value={zone?.name || "-"} />
            <InfoRow
              label="Established"
              value={String(profile.establishedYear)}
            />
            <InfoRow
              label="Population (est.)"
              value={profile.population.toLocaleString()}
            />
            <InfoRow
              label="Chairman / Council Manager"
              value={profile.chairmanName || "-"}
            />
            <InfoRow label="Treasurer" value={profile.treasurerName || "-"} />
            <InfoRow
              label="Internal Auditor"
              value={profile.internalAuditorName || "-"}
            />
          </div>
        </PlanningCard>

        <div className={s.gridTwoCols}>
          <PlanningCard
            title="Financial Reporting Framework"
            subtitle="ISA 315 - Applicable Framework"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  {profile.financialFramework}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                  Applied for FY {audit.year} financial statements
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <InfoRow
                label="Prior Year Opinion"
                value={profile.priorYearOpinion}
              />
              <InfoRow
                label="IT Control Environment"
                value={profile.itControlEnvironment}
              />
              <InfoRow
                label="Internal Audit"
                value={profile.internalAuditEffectiveness}
              />
            </div>
          </PlanningCard>

          <PlanningCard
            title="IT Systems & Environment"
            subtitle="Technology infrastructure assessment"
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {profile.itSystems.map((sys, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    padding: "0.3rem 0.65rem",
                    borderRadius: "4px",
                    background: "#f0f9ff",
                    color: "#0369a1",
                    border: "1px solid #bae6fd",
                  }}
                >
                  {sys}
                </span>
              ))}
            </div>
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                background:
                  profile.itControlEnvironment === "Strong"
                    ? "#f0fdf4"
                    : profile.itControlEnvironment === "Weak"
                      ? "#fef2f2"
                      : "#fffbeb",
                border: `1px solid ${
                  profile.itControlEnvironment === "Strong"
                    ? "#bbf7d0"
                    : profile.itControlEnvironment === "Weak"
                      ? "#fecaca"
                      : "#fde68a"
                }`,
                fontSize: "0.82rem",
              }}
            >
              <strong>Assessment:</strong> IT control environment rated as{" "}
              <strong>{profile.itControlEnvironment}</strong>. This will{" "}
              {profile.itControlEnvironment === "Strong"
                ? "support reliance on IT-dependent controls"
                : profile.itControlEnvironment === "Weak"
                  ? "require extensive substantive testing"
                  : "require targeted IT control testing"}
              .
            </div>
          </PlanningCard>
        </div>

        <PlanningCard
          title="Prior Year Findings Carried Forward"
          subtitle="ISA 315 - Previous audit observations requiring follow-up"
        >
          {profile.priorYearFindings.length === 0 ? (
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-3)",
                fontStyle: "italic",
              }}
            >
              No prior year findings recorded
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {profile.priorYearFindings.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    background: "#fefce8",
                  }}
                >
                  <AlertTriangle
                    size={16}
                    style={{
                      color: "#d97706",
                      flexShrink: 0,
                      marginTop: "0.1rem",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text)",
                      lineHeight: 1.5,
                    }}
                  >
                    {f}
                  </div>
                </div>
              ))}
            </div>
          )}
        </PlanningCard>

        <PlanningCard title="Key Activities & Significant Changes">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {profile.keyActivities.map((a, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "4px",
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #a7f3d0",
                }}
              >
                {a}
              </span>
            ))}
          </div>
          {profile.significantChanges && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                background: "#fefce8",
                border: "1px solid #fde68a",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              <strong>Significant Changes:</strong> {profile.significantChanges}
            </div>
          )}
        </PlanningCard>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PlanningCard
        title="Entity Understanding - Data Collection"
        subtitle="ISA 315: Obtain understanding of the entity and its environment"
      >
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <Info
            size={16}
            style={{ color: "#2563eb", flexShrink: 0, marginTop: "0.15rem" }}
          />
          <div
            style={{ fontSize: "0.82rem", color: "#1e40af", lineHeight: 1.6 }}
          >
            Complete the entity profile below to establish the foundation for
            risk assessment and audit planning. This information drives the
            preliminary analytics and risk matrix in subsequent steps.
          </div>
        </div>

        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Entity Name</label>
            <div
              className={s.formInput}
              style={{
                background: "#f8fafc",
                color: "#475569",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              {form.entityName}
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Council Type</label>
            <div
              className={s.formInput}
              style={{
                background: "#f8fafc",
                color: "#475569",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              {form.councilType === "LGA"
                ? "Local Government Area (LGA)"
                : "Local Council Development Area (LCDA)"}
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Year Established</label>
            <div
              className={s.formInput}
              style={{
                background: "#f8fafc",
                color: "#475569",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              {form.establishedYear}
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Population (Est.)</label>
            <input
              type="number"
              className={s.formInput}
              value={form.population}
              onChange={(e) =>
                setForm((f) => ({ ...f, population: Number(e.target.value) }))
              }
              placeholder="Estimated population size"
            />
          </div>
        </div>
      </PlanningCard>

      <PlanningCard
        title="Key Personnel"
        subtitle="Officers involved in financial management"
      >
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Chairman / Council Manager</label>
            <input
              className={s.formInput}
              value={form.chairmanName}
              onChange={(e) =>
                setForm((f) => ({ ...f, chairmanName: e.target.value }))
              }
              placeholder="Name of Chairman or Council Manager"
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Treasurer</label>
            <input
              className={s.formInput}
              value={form.treasurerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, treasurerName: e.target.value }))
              }
              placeholder="Name of Council Treasurer"
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Internal Auditor</label>
            <input
              className={s.formInput}
              value={form.internalAuditorName}
              onChange={(e) =>
                setForm((f) => ({ ...f, internalAuditorName: e.target.value }))
              }
              placeholder="Name of Internal Auditor"
            />
          </div>
        </div>
      </PlanningCard>

      <div className={s.gridTwoCols}>
        <PlanningCard title="Financial Reporting Framework">
          <div className={s.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={s.formLabel}>Applicable Framework</label>
            <select
              className={s.formSelect}
              value={form.financialFramework}
              onChange={(e) =>
                setForm((f) => ({ ...f, financialFramework: e.target.value }))
              }
            >
              {FRAMEWORKS.map((fw) => (
                <option key={fw} value={fw}>
                  {fw}
                </option>
              ))}
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Prior Year Audit Opinion</label>
            <select
              className={s.formSelect}
              value={form.priorYearOpinion}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  priorYearOpinion: e.target
                    .value as EntityProfile["priorYearOpinion"],
                }))
              }
            >
              <option value="Unqualified">Unqualified (Clean)</option>
              <option value="Qualified">Qualified</option>
              <option value="Adverse">Adverse</option>
              <option value="Disclaimer">Disclaimer of Opinion</option>
            </select>
          </div>
        </PlanningCard>

        <PlanningCard title="IT Environment Assessment">
          <div className={s.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={s.formLabel}>IT Systems in Use</label>
            <div className={s.formCheckGroup}>
              {IT_SYSTEMS.map((sys) => (
                <label key={sys} className={s.formCheck}>
                  <input
                    type="checkbox"
                    checked={form.itSystems.includes(sys)}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        itSystems: e.target.checked
                          ? [...f.itSystems, sys]
                          : f.itSystems.filter((s) => s !== sys),
                      }));
                    }}
                  />
                  {sys}
                </label>
              ))}
            </div>
          </div>
          <div className={s.formGroup} style={{ marginBottom: "1rem" }}>
            <label className={s.formLabel}>IT Control Environment</label>
            <select
              className={s.formSelect}
              value={form.itControlEnvironment}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  itControlEnvironment: e.target
                    .value as EntityProfile["itControlEnvironment"],
                }))
              }
            >
              <option value="Strong">Strong</option>
              <option value="Adequate">Adequate</option>
              <option value="Weak">Weak</option>
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Internal Audit Effectiveness</label>
            <select
              className={s.formSelect}
              value={form.internalAuditEffectiveness}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  internalAuditEffectiveness: e.target
                    .value as EntityProfile["internalAuditEffectiveness"],
                }))
              }
            >
              <option value="Effective">Effective</option>
              <option value="Partially Effective">Partially Effective</option>
              <option value="Ineffective">Ineffective</option>
            </select>
          </div>
        </PlanningCard>
      </div>

      <PlanningCard
        title="Prior Year Findings"
        subtitle="Carry forward unresolved observations from prior audit"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {form.priorYearFindings.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                borderRadius: "4px",
                border: "1px solid var(--border)",
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "#d97706", flexShrink: 0 }}
              />
              <span style={{ flex: 1, fontSize: "0.85rem" }}>{f}</span>
              <button
                className={s.btnIcon}
                onClick={() =>
                  setForm((fm) => ({
                    ...fm,
                    priorYearFindings: fm.priorYearFindings.filter(
                      (_, idx) => idx !== i,
                    ),
                  }))
                }
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className={s.formInput}
            style={{ flex: 1 }}
            placeholder="Add prior year finding..."
            value={newFinding}
            onChange={(e) => setNewFinding(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newFinding.trim()) {
                setForm((f) => ({
                  ...f,
                  priorYearFindings: [
                    ...f.priorYearFindings,
                    newFinding.trim(),
                  ],
                }));
                setNewFinding("");
              }
            }}
          />
          <button
            className={s.btnPrimary}
            disabled={!newFinding.trim()}
            onClick={() => {
              if (newFinding.trim()) {
                setForm((f) => ({
                  ...f,
                  priorYearFindings: [
                    ...f.priorYearFindings,
                    newFinding.trim(),
                  ],
                }));
                setNewFinding("");
              }
            }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </PlanningCard>

      <PlanningCard title="Key Activities & Significant Changes">
        <div className={s.formGroup} style={{ marginBottom: "1rem" }}>
          <label className={s.formLabel}>Key Activities / Services</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {form.keyActivities.map((a, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "4px",
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #a7f3d0",
                }}
              >
                {a}
                <X
                  size={12}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      keyActivities: f.keyActivities.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                />
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className={s.formInput}
              style={{ flex: 1 }}
              placeholder="Add key activity..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newActivity.trim()) {
                  setForm((f) => ({
                    ...f,
                    keyActivities: [...f.keyActivities, newActivity.trim()],
                  }));
                  setNewActivity("");
                }
              }}
            />
            <button
              className={s.btnOutline}
              disabled={!newActivity.trim()}
              onClick={() => {
                if (newActivity.trim()) {
                  setForm((f) => ({
                    ...f,
                    keyActivities: [...f.keyActivities, newActivity.trim()],
                  }));
                  setNewActivity("");
                }
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <div className={s.formGroup}>
          <label className={s.formLabel}>
            Significant Changes During the Period
          </label>
          <textarea
            className={s.formTextarea}
            value={form.significantChanges}
            onChange={(e) =>
              setForm((f) => ({ ...f, significantChanges: e.target.value }))
            }
            placeholder="Note any changes in leadership, legislation, funding, organisational structure, or operational scope that may affect the audit..."
          />
        </div>
      </PlanningCard>

      <div className={s.formActions}>
        {profile && (
          <button className={s.btnSecondary} onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
        <button className={s.btnPrimary} onClick={handleSave}>
          <Save size={14} /> Save Entity Profile
        </button>
      </div>
    </div>
  );
};

export default EntityUnderstandingStep;
