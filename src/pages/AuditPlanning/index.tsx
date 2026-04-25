import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { ClipboardList, ChevronRight, ChevronLeft, Check } from "lucide-react";
import s from "../../styles/pages.module.css";
import {
  STEP_CONFIG,
  type StepKey,
  type ArDocType,
} from "../../features/audit-planning/constants";
import EntityUnderstandingStep from "../../features/audit-planning/components/EntityUnderstandingStep";
import AnalyticalReviewStep from "../../features/audit-planning/components/AnalyticalReviewStep";
import RiskMatrixStep from "../../features/audit-planning/components/RiskMatrixStep";

interface AuditPlanningProps {
  auditId?: string;
  embedded?: boolean;
}

const AuditPlanning: React.FC<AuditPlanningProps> = ({
  auditId: propAuditId,
  embedded,
}) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useAuditStore();

  const currentStep = (searchParams.get("step") as StepKey) || "entity";
  const stepIdx = STEP_CONFIG.findIndex((sc) => sc.key === currentStep);

  const setStep = useCallback(
    (key: StepKey) =>
      setSearchParams(
        (prev) => {
          prev.set("step", key);
          return prev;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

  const myAudits = useMemo(() => {
    if (!user) return [];
    if (user.role === "SYSTEM_ADMIN" || user.role === "STATE_AUDITOR_GENERAL")
      return store.audits.filter(
        (a) => a.status === "Planning" || a.status === "Pre-Audit",
      );
    if (user.role === "AUDIT_SUPERVISOR") {
      const zone = store.zones.find((z) =>
        (z.supervisorIds || []).includes(user.id),
      );
      if (!zone) return [];
      const lgaIds = store.lgas
        .filter((l) => l.zoneId === zone.id)
        .map((l) => l.id);
      return store.audits.filter(
        (a) =>
          lgaIds.includes(a.lgaId) &&
          (a.status === "Planning" || a.status === "Pre-Audit"),
      );
    }
    if (user.role === "AUDIT_LEAD")
      return store.audits.filter((a) => a.leadId === user.id);
    if (user.role === "TEAM_AUDITOR")
      return store.audits.filter((a) => (a.teamIds || []).includes(user.id));
    if (user.role === "HEAD_OF_LOCAL_GOVERNMENT")
      return store.audits.filter(
        (a) =>
          a.lgaId === user.lgaId &&
          (a.status === "Planning" || a.status === "Pre-Audit"),
      );
    return store.audits;
  }, [user, store.audits, store.zones, store.lgas]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    propAuditId || myAudits[0]?.id || "",
  );
  const audit = store.audits.find((a) => a.id === selectedAuditId);
  const lgaName = audit
    ? store.lgas.find((l) => l.id === audit.lgaId)?.name || "Unknown"
    : "";

  const entityProfile = audit ? store.getEntityProfile(audit.id) : undefined;
  const analytics = useMemo(
    () => (audit ? store.getAuditAnalytics(audit.id) : []),
    [audit, store],
  );
  const materialityData = audit
    ? store.getAuditMateriality(audit.id)
    : undefined;
  const risks = useMemo(
    () => (audit ? store.getAuditRiskMatrices(audit.id) : []),
    [audit, store],
  );
  const stepCompletion = useMemo(
    () => ({
      entity: !!entityProfile,
      "analytical-review": analytics.length > 0 || !!materialityData,
      risk: risks.length > 0,
    }),
    [entityProfile, analytics, materialityData, risks],
  );

  const completedCount = Object.values(stepCompletion).filter(Boolean).length;

  const [arDocType, setArDocType] = useState<ArDocType | null>(null);
  const [arPhase, setArPhase] = useState<"select" | "imported">("select");

  if (!user) return null;

  if (myAudits.length === 0 && !embedded) {
    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <div className={s.pageTitle}>Audit Planning</div>
            <div className={s.pageSubtitle}>
              No audits currently in the planning phase
            </div>
          </div>
        </div>
        <div className={s.emptyState}>
          <ClipboardList size={48} className={s.emptyIcon} />
          <div className={s.emptyTitle}>No Planning Engagements</div>
          <div className={s.emptyDesc}>
            Audits will appear here once they enter the Planning phase
          </div>
        </div>
      </div>
    );
  } else if (myAudits.length === 0 && embedded) {
    return null;
  }

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <div className={s.pageTitle}>Audit Planning</div>
            <div className={s.pageSubtitle}>
              ISA 300 - Planning an Audit of Financial Statements
            </div>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <select
              className={s.formSelect}
              value={selectedAuditId}
              onChange={(e) => setSelectedAuditId(e.target.value)}
              style={{ minWidth: "220px" }}
            >
              {myAudits.map((a) => {
                const name =
                  store.lgas.find((l) => l.id === a.lgaId)?.name || a.lgaId;
                return (
                  <option key={a.id} value={a.id}>
                    {name} - FY {a.year}
                  </option>
                );
              })}
            </select>
            <span className={s.pageBadge}>
              <ClipboardList size={13} />
              {completedCount}/{STEP_CONFIG.length} Steps
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          padding: "0.75rem 1rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          marginBottom: "2rem",
          overflowX: "auto",
        }}
      >
        {STEP_CONFIG.map((step, i) => {
          const done = stepCompletion[step.key];
          const active = currentStep === step.key;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.key}>
              {i > 0 && (
                <div
                  style={{
                    flex: "1 1 20px",
                    height: "2px",
                    background:
                      done || stepCompletion[STEP_CONFIG[i - 1].key]
                        ? "#059669"
                        : "var(--border)",
                    minWidth: "12px",
                    maxWidth: "60px",
                  }}
                />
              )}
              <button
                onClick={() => setStep(step.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "6px",
                  border: active
                    ? "2px solid #059669"
                    : "1.5px solid transparent",
                  background: active
                    ? "#ecfdf5"
                    : done
                      ? "#f0fdf4"
                      : "transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: done
                      ? "#059669"
                      : active
                        ? "#ecfdf5"
                        : "#f1f5f9",
                    color: done ? "#fff" : active ? "#059669" : "#94a3b8",
                    border: done
                      ? "none"
                      : `1.5px solid ${active ? "#059669" : "#e2e8f0"}`,
                    flexShrink: 0,
                  }}
                >
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: active ? "#059669" : "#94a3b8",
                    }}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: active ? 700 : 500,
                      color: active
                        ? "#064e3b"
                        : done
                          ? "#166534"
                          : "var(--text-2)",
                    }}
                  >
                    {step.shortLabel}
                  </div>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {!audit ? (
        <div className={s.emptyState}>
          <div className={s.emptyTitle}>Select an audit engagement above</div>
        </div>
      ) : (
        <>
          {currentStep === "entity" && (
            <EntityUnderstandingStep
              audit={audit}
              lgaName={lgaName}
              profile={entityProfile}
              store={store}
              user={user}
            />
          )}
          {currentStep === "analytical-review" && (
            <AnalyticalReviewStep
              audit={audit}
              lgaName={lgaName}
              analytics={analytics}
              materialityData={materialityData}
              store={store}
              user={user}
              arDocType={arDocType}
              setArDocType={setArDocType}
              arPhase={arPhase}
              setArPhase={setArPhase}
            />
          )}
          {currentStep === "risk" && (
            <RiskMatrixStep
              audit={audit}
              lgaName={lgaName}
              risks={risks}
              analytics={analytics}
              materialityData={materialityData}
              store={store}
              user={user}
              arDocType={arDocType}
            />
          )}
        </>
      )}

      {audit && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className={s.btnSecondary}
            disabled={stepIdx === 0}
            onClick={() => stepIdx > 0 && setStep(STEP_CONFIG[stepIdx - 1].key)}
          >
            <ChevronLeft size={16} />
            Previous Step
          </button>
          <button
            className={s.btnPrimary}
            disabled={stepIdx === STEP_CONFIG.length - 1}
            onClick={() =>
              stepIdx < STEP_CONFIG.length - 1 &&
              setStep(STEP_CONFIG[stepIdx + 1].key)
            }
          >
            Next Step
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditPlanning;
