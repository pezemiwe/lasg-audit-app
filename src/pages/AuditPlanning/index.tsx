import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditStore, type AuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import WorkProgrammeSection from "../../components/AuditPlanning/WorkProgrammeSection";
import type {
  RiskLevel,
  RiskMatrix,
  EntityProfile,
  AuditStrategy,
  AuditStrategyStatus,
  AnalyticFlag,
  PreliminaryAnalytic,
} from "../../types";
import {
  ClipboardList,
  Building2,
  BarChart3,
  Calculator,
  AlertTriangle,
  FileText,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Pencil,
  X,
  Save,
  Sparkles,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Info,
  Target,
  Layers,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const RISK_LEVELS: RiskLevel[] = ["Low", "Medium", "High", "Critical"];

const RISK_AREAS = [
  "Revenue & Receipts",
  "Expenditure & Payments",
  "Payroll & Personnel Costs",
  "Bank & Cash Management",
  "Procurement & Contracts",
  "Fixed Assets & Capital Projects",
  "Grants & Transfers",
  "Tax & Deductions",
];

const MATERIALITY_BASES = [
  "Total Revenue",
  "Total Expenditure",
  "Net Assets",
  "Total Assets",
  "Surplus/Deficit",
];

const FRAMEWORKS = [
  "IPSAS Accrual Basis",
  "IPSAS Cash Basis",
  "Modified Cash Basis",
  "Nigerian SAS",
];

const IT_SYSTEMS = [
  "SIFMIS",
  "IPPIS",
  "GIFMIS",
  "Manual Spreadsheets",
  "Custom ERP",
  "Sage",
  "QuickBooks",
];

const STEP_CONFIG = [
  {
    key: "entity",
    label: "Entity Understanding",
    icon: Building2,
    shortLabel: "Entity",
  },
  {
    key: "analytics",
    label: "Preliminary Analytics",
    icon: BarChart3,
    shortLabel: "Analytics",
  },
  {
    key: "materiality",
    label: "Materiality Determination",
    icon: Calculator,
    shortLabel: "Materiality",
  },
  {
    key: "risk",
    label: "Risk Assessment",
    icon: AlertTriangle,
    shortLabel: "Risk",
  },
  {
    key: "strategy",
    label: "Audit Strategy",
    icon: FileText,
    shortLabel: "Strategy",
  },
  {
    key: "programme",
    label: "Audit Programme",
    icon: BookOpen,
    shortLabel: "Programme",
  },
] as const;

type StepKey = (typeof STEP_CONFIG)[number]["key"];

const riskColor: Record<
  RiskLevel,
  { bg: string; text: string; border: string }
> = {
  Low: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  High: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  Critical: { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
};

const flagConfig: Record<
  AnalyticFlag,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Favorable: { bg: "#f0fdf4", text: "#166534", icon: TrendingDown },
  Adverse: { bg: "#fffbeb", text: "#92400e", icon: TrendingUp },
  Neutral: { bg: "#f8fafc", text: "#475569", icon: Minus },
  Investigate: { bg: "#fef2f2", text: "#991b1b", icon: Search },
};

const calculateOverallRisk = (
  inherent: RiskLevel,
  control: RiskLevel,
  detection: RiskLevel,
): RiskLevel => {
  const map: Record<RiskLevel, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };
  const avg = (map[inherent] + map[control] + map[detection]) / 3;
  if (avg >= 3.5) return "Critical";
  if (avg >= 2.5) return "High";
  if (avg >= 1.5) return "Medium";
  return "Low";
};

const fmtCurrency = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 0 });

const fmtPercent = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

const Card: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noPad?: boolean;
}> = ({ title, subtitle, actions, children, noPad }) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <div>
        <div className={s.cardTitle}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--text-3)",
              marginTop: "0.15rem",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {actions}
    </div>
    <div className={noPad ? undefined : s.cardBody}>{children}</div>
  </div>
);

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      fontSize: "0.72rem",
      fontWeight: 700,
      padding: "0.2rem 0.55rem",
      borderRadius: "4px",
      background: riskColor[level].bg,
      color: riskColor[level].text,
      border: `1px solid ${riskColor[level].border}`,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    }}
  >
    <Shield size={11} />
    {level}
  </span>
);

const AuditPlanning: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useAuditStore();

  const currentStep = (searchParams.get("step") as StepKey) || "entity";
  const stepIdx = STEP_CONFIG.findIndex((sc) => sc.key === currentStep);

  const setStep = useCallback(
    (key: StepKey) => setSearchParams({ step: key }),
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
      return store.audits.filter(
        (a) =>
          a.leadId === user.id &&
          (a.status === "Planning" || a.status === "Pre-Audit"),
      );
    if (user.role === "TEAM_AUDITOR")
      return store.audits.filter(
        (a) =>
          (a.teamIds || []).includes(user.id) &&
          (a.status === "Planning" || a.status === "Pre-Audit"),
      );
    if (user.role === "HEAD_OF_LOCAL_GOVERNMENT")
      return store.audits.filter(
        (a) =>
          a.lgaId === user.lgaId &&
          (a.status === "Planning" || a.status === "Pre-Audit"),
      );
    return [];
  }, [user, store.audits, store.zones, store.lgas]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    myAudits[0]?.id || "",
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
  const strategy = audit ? store.getAuditStrategy(audit.id) : undefined;
  const programme = audit ? store.getAuditProgramme(audit.id) : undefined;

  const stepCompletion = useMemo(
    () => ({
      entity: !!entityProfile,
      analytics: analytics.length > 0,
      materiality: !!materialityData,
      risk: risks.length > 0,
      strategy: !!strategy,
      programme: !!programme,
    }),
    [entityProfile, analytics, materialityData, risks, strategy, programme],
  );

  const completedCount = Object.values(stepCompletion).filter(Boolean).length;

  if (!user) return null;

  if (myAudits.length === 0) {
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
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <div className={s.pageTitle}>Audit Planning</div>
          <div className={s.pageSubtitle}>
            ISA 300 — Planning an Audit of Financial Statements
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                  {name} — FY {a.year}
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          {currentStep === "analytics" && (
            <PreliminaryAnalyticsStep
              audit={audit}
              lgaName={lgaName}
              analytics={analytics}
              store={store}
              user={user}
            />
          )}
          {currentStep === "materiality" && (
            <MaterialityStep
              audit={audit}
              lgaName={lgaName}
              materialityData={materialityData}
              analytics={analytics}
              store={store}
              user={user}
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
            />
          )}
          {currentStep === "strategy" && (
            <AuditStrategyStep
              audit={audit}
              lgaName={lgaName}
              strategy={strategy}
              risks={risks}
              materialityData={materialityData}
              entityProfile={entityProfile}
              store={store}
              user={user}
            />
          )}
          {currentStep === "programme" && (
            <ProgrammeStep
              audit={audit}
              lgaName={lgaName}
              programme={programme}
              risks={risks}
              store={store}
              user={user}
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

const EntityUnderstandingStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  profile: EntityProfile | undefined;
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
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
        <Card
          title={`Entity Profile — ${profile.entityName}`}
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
            <InfoRow label="Zone" value={zone?.name || "—"} />
            <InfoRow
              label="Established"
              value={String(profile.establishedYear)}
            />
            <InfoRow
              label="Population (est.)"
              value={profile.population.toLocaleString()}
            />
            <InfoRow label="Chairman" value={profile.chairmanName || "—"} />
            <InfoRow label="Treasurer" value={profile.treasurerName || "—"} />
            <InfoRow
              label="Council Manager"
              value={profile.councilManagerName || "—"}
            />
            <InfoRow
              label="Internal Auditor"
              value={profile.internalAuditorName || "—"}
            />
          </div>
        </Card>

        <div className={s.gridTwoCols}>
          <Card
            title="Financial Reporting Framework"
            subtitle="ISA 315 — Applicable Framework"
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
          </Card>

          <Card
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
          </Card>
        </div>

        <Card
          title="Prior Year Findings Carried Forward"
          subtitle="ISA 315 — Previous audit observations requiring follow-up"
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
        </Card>

        <Card title="Key Activities & Significant Changes">
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
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card
        title="Entity Understanding — Data Collection"
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
            <input
              className={s.formInput}
              value={form.entityName}
              onChange={(e) =>
                setForm((f) => ({ ...f, entityName: e.target.value }))
              }
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Council Type</label>
            <select
              className={s.formSelect}
              value={form.councilType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  councilType: e.target.value as "LGA" | "LCDA",
                }))
              }
            >
              <option value="LGA">Local Government Area (LGA)</option>
              <option value="LCDA">
                Local Council Development Area (LCDA)
              </option>
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Year Established</label>
            <input
              type="number"
              className={s.formInput}
              value={form.establishedYear}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  establishedYear: Number(e.target.value),
                }))
              }
            />
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
            />
          </div>
        </div>
      </Card>

      <Card
        title="Key Personnel"
        subtitle="Officers involved in financial management"
      >
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Chairman</label>
            <input
              className={s.formInput}
              value={form.chairmanName}
              onChange={(e) =>
                setForm((f) => ({ ...f, chairmanName: e.target.value }))
              }
              placeholder="Name of LGA Chairman"
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
            <label className={s.formLabel}>Council Manager</label>
            <input
              className={s.formInput}
              value={form.councilManagerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, councilManagerName: e.target.value }))
              }
              placeholder="Name of Council Manager"
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
      </Card>

      <div className={s.gridTwoCols}>
        <Card title="Financial Reporting Framework">
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
        </Card>

        <Card title="IT Environment Assessment">
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
        </Card>
      </div>

      <Card
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
      </Card>

      <Card title="Key Activities & Significant Changes">
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
      </Card>

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

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div
    className={s.detailRow}
    style={{ borderBottom: "none", padding: "0.35rem 0" }}
  >
    <div className={s.detailLabel} style={{ width: "140px" }}>
      {label}
    </div>
    <div className={s.detailValue}>{value}</div>
  </div>
);

const PreliminaryAnalyticsStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}> = ({ audit, lgaName, analytics, store, user }) => {
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const hasAnalytics = analytics.length > 0;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(analytics.map((a) => a.category)));
    return ["all", ...cats];
  }, [analytics]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return analytics;
    return analytics.filter((a) => a.category === activeCategory);
  }, [analytics, activeCategory]);

  const flagCounts = useMemo(() => {
    const counts = { Investigate: 0, Adverse: 0, Favorable: 0, Neutral: 0 };
    analytics.forEach((a) => {
      counts[a.flag]++;
    });
    return counts;
  }, [analytics]);

  const handleGenerate = () => {
    store.generatePreliminaryAnalytics(audit.id, user.id);
  };

  if (!hasAnalytics) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Card
          title="Preliminary Analytical Procedures"
          subtitle="ISA 520 — Analytical Procedures as Risk Assessment"
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
            Preliminary analytics compare the current year financial data
            against prior year figures, budgets, and industry benchmarks to
            identify areas of significant variance that may indicate risk of
            material misstatement.
          </div>
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <BarChart3
              size={48}
              style={{ color: "#d1d5db", marginBottom: "1rem" }}
            />
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.95rem",
                marginBottom: "0.5rem",
              }}
            >
              No Analytics Generated Yet
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-3)",
                marginBottom: "1.5rem",
                maxWidth: "400px",
                margin: "0 auto 1.5rem",
              }}
            >
              Generate preliminary analytics based on available financial data
              for {lgaName}. The system will compute year-on-year variances and
              flag items requiring investigation.
            </div>
            <button className={s.btnPrimary} onClick={handleGenerate}>
              <Sparkles size={14} /> Generate Preliminary Analytics
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        className={s.kpiRow}
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {(
          ["Investigate", "Adverse", "Favorable", "Neutral"] as AnalyticFlag[]
        ).map((flag) => {
          const cfg = flagConfig[flag];
          const FlagIcon = cfg.icon;
          return (
            <div key={flag} className={s.kpiCard}>
              <div
                className={s.kpiIcon}
                style={{
                  background: cfg.bg,
                  color: cfg.text,
                  border: `1px solid ${cfg.bg}`,
                }}
              >
                <FlagIcon size={22} />
              </div>
              <div>
                <div className={s.kpiLabel}>{flag}</div>
                <div className={s.kpiValue}>{flagCounts[flag]}</div>
                <div className={s.kpiMeta}>
                  {flag === "Investigate"
                    ? "Requires follow-up"
                    : flag === "Adverse"
                      ? "Unfavorable trend"
                      : flag === "Favorable"
                        ? "Positive movement"
                        : "Within expectations"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card
        title="Analytical Results"
        subtitle={`${analytics.length} metrics analysed for ${lgaName}`}
        actions={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={
                  activeCategory === cat ? s.filterChipActive : s.filterChip
                }
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        }
        noPad
      >
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Prior Year</th>
                <th style={{ textAlign: "right" }}>Current Year</th>
                <th style={{ textAlign: "right" }}>Variance</th>
                <th style={{ textAlign: "right" }}>% Change</th>
                <th>Flag</th>
                <th>Auditor Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const cfg = flagConfig[a.flag];
                const FlagIcon = cfg.icon;
                const isRatio = a.category === "Ratio";
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.metric}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "3px",
                          background: "#f1f5f9",
                          color: "#475569",
                        }}
                      >
                        {a.category}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {isRatio ? `${a.priorYear}%` : fmtCurrency(a.priorYear)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {isRatio
                        ? `${a.currentYear}%`
                        : fmtCurrency(a.currentYear)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontFamily: "monospace",
                        color: a.variance >= 0 ? "#059669" : "#dc2626",
                      }}
                    >
                      {a.variance >= 0 ? "+" : ""}
                      {isRatio ? `${a.variance}pp` : fmtCurrency(a.variance)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        color:
                          Math.abs(a.variancePercent) > 15
                            ? "#dc2626"
                            : "var(--text)",
                      }}
                    >
                      {fmtPercent(a.variancePercent)}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: cfg.bg,
                          color: cfg.text,
                          textTransform: "uppercase",
                        }}
                      >
                        <FlagIcon size={11} />
                        {a.flag}
                      </span>
                    </td>
                    <td>
                      {noteEditing === a.id ? (
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <input
                            className={s.formInput}
                            style={{
                              fontSize: "0.78rem",
                              padding: "0.3rem 0.5rem",
                              width: "180px",
                            }}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                store.updateAnalyticNote(a.id, noteText);
                                setNoteEditing(null);
                              }
                            }}
                          />
                          <button
                            className={s.btnIcon}
                            onClick={() => {
                              store.updateAnalyticNote(a.id, noteText);
                              setNoteEditing(null);
                            }}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            color: a.investigationNote
                              ? "var(--text)"
                              : "#94a3b8",
                            textAlign: "left",
                            padding: "0.2rem",
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={a.investigationNote || "Click to add note"}
                          onClick={() => {
                            setNoteEditing(a.id);
                            setNoteText(a.investigationNote || "");
                          }}
                        >
                          {a.investigationNote || "Add note..."}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Investigation Summary"
        subtitle="Items flagged for further audit attention"
      >
        {analytics.filter((a) => a.flag === "Investigate").length === 0 ? (
          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--text-3)",
              fontStyle: "italic",
            }}
          >
            No items flagged for investigation
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {analytics
              .filter((a) => a.flag === "Investigate")
              .map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      color: "#991b1b",
                      flexShrink: 0,
                      marginTop: "0.15rem",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {a.metric}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#7f1d1d" }}>
                      Variance of {fmtPercent(a.variancePercent)} ({a.category})
                      — requires explanation from management and may indicate
                      elevated risk of material misstatement.
                    </div>
                    {a.investigationNote && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem",
                          borderRadius: "3px",
                          background: "#fff",
                          border: "1px solid #fecaca",
                          fontSize: "0.78rem",
                        }}
                      >
                        <strong>Note:</strong> {a.investigationNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const MaterialityStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  materialityData: AuditStore["materiality"][0] | undefined;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
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
      <Card
        title="Materiality Determination"
        subtitle="ISA 320 — Materiality in Planning and Performing an Audit"
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
      </Card>

      <div className={s.formActions}>
        <button className={s.btnPrimary} onClick={handleSave}>
          <Save size={14} /> Save Materiality
        </button>
      </div>
    </div>
  );
};

const RiskMatrixStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  risks: RiskMatrix[];
  analytics: PreliminaryAnalytic[];
  materialityData: AuditStore["materiality"][0] | undefined;
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}> = ({ audit, risks, analytics, store, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [area, setArea] = useState(RISK_AREAS[0]);
  const [inherent, setInherent] = useState<RiskLevel>("Medium");
  const [control, setControl] = useState<RiskLevel>("Medium");
  const [detection, setDetection] = useState<RiskLevel>("Medium");
  const [mitigation, setMitigation] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "heatmap">("table");

  const investigateItems = analytics.filter((a) => a.flag === "Investigate");

  const overall = calculateOverallRisk(inherent, control, detection);

  const handleAdd = () => {
    store.addRiskMatrix({
      auditId: audit.id,
      area,
      inherentRisk: inherent,
      controlRisk: control,
      detectionRisk: detection,
      overallRisk: overall,
      mitigationPlan: mitigation,
      status: "Open",
      preparedBy: user.id,
    });
    store.logActivity({
      userId: user.id,
      action: "ADD_RISK",
      details: `Risk entry added: ${area} (${overall})`,
      entityType: "audit",
      entityId: audit.id,
    });
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setArea(RISK_AREAS[0]);
    setInherent("Medium");
    setControl("Medium");
    setDetection("Medium");
    setMitigation("");
  };

  const riskCounts = useMemo(() => {
    const c = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    risks.forEach((r) => c[r.overallRisk]++);
    return c;
  }, [risks]);

  const heatmapData = useMemo(() => {
    const grid: Record<string, Record<string, RiskMatrix[]>> = {};
    const levels = ["Low", "Medium", "High", "Critical"];
    levels.forEach((ir) => {
      grid[ir] = {};
      levels.forEach((cr) => {
        grid[ir][cr] = risks.filter(
          (r) => r.inherentRisk === ir && r.controlRisk === cr,
        );
      });
    });
    return grid;
  }, [risks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        className={s.kpiRow}
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {RISK_LEVELS.map((level) => (
          <div key={level} className={s.kpiCard}>
            <div
              className={s.kpiIcon}
              style={{
                background: riskColor[level].bg,
                color: riskColor[level].text,
                border: `1px solid ${riskColor[level].border}`,
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div className={s.kpiLabel}>{level} Risk</div>
              <div className={s.kpiValue}>{riskCounts[level]}</div>
              <div className={s.kpiMeta}>
                {risks.length > 0
                  ? `${Math.round((riskCounts[level] / risks.length) * 100)}% of total`
                  : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {investigateItems.length > 0 && risks.length === 0 && (
        <Card
          title="Risk Indicators from Analytics"
          subtitle="Items flagged during preliminary analytics that may inform risk entries"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {investigateItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "4px",
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Search size={14} style={{ color: "#991b1b" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {item.metric}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#7f1d1d" }}>
                      {fmtPercent(item.variancePercent)} variance
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "3px",
                    background: "#fef2f2",
                    color: "#991b1b",
                  }}
                >
                  Investigate
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card
        title="Risk Assessment Matrix"
        subtitle="ISA 315 — Identifying and Assessing the Risks of Material Misstatement"
        actions={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={
                viewMode === "table" ? s.filterChipActive : s.filterChip
              }
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              className={
                viewMode === "heatmap" ? s.filterChipActive : s.filterChip
              }
              onClick={() => setViewMode("heatmap")}
            >
              Heat Map
            </button>
            {!showForm && (
              <button
                className={s.btnPrimary}
                onClick={() => setShowForm(true)}
              >
                <Plus size={14} /> Add Risk
              </button>
            )}
          </div>
        }
        noPad={viewMode === "table" && !showForm}
      >
        {showForm && (
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--border)",
              background: "#fafafa",
            }}
          >
            <div className={s.formGrid}>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>Risk Area</label>
                <select
                  className={s.formSelect}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  {RISK_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Inherent Risk</label>
                <select
                  className={s.formSelect}
                  value={inherent}
                  onChange={(e) => setInherent(e.target.value as RiskLevel)}
                >
                  {RISK_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Control Risk</label>
                <select
                  className={s.formSelect}
                  value={control}
                  onChange={(e) => setControl(e.target.value as RiskLevel)}
                >
                  {RISK_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Detection Risk</label>
                <select
                  className={s.formSelect}
                  value={detection}
                  onChange={(e) => setDetection(e.target.value as RiskLevel)}
                >
                  {RISK_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Computed Overall Risk</label>
                <div style={{ paddingTop: "0.5rem" }}>
                  <RiskBadge level={overall} />
                </div>
              </div>
              <div className={s.formGroupFull}>
                <label className={s.formLabel}>
                  Mitigation / Audit Response
                </label>
                <textarea
                  className={s.formTextarea}
                  value={mitigation}
                  onChange={(e) => setMitigation(e.target.value)}
                  placeholder="Describe the planned audit response to this risk..."
                />
              </div>
            </div>
            <div className={s.formActions}>
              <button className={s.btnSecondary} onClick={resetForm}>
                Cancel
              </button>
              <button
                className={s.btnPrimary}
                onClick={handleAdd}
                disabled={!mitigation.trim()}
              >
                <Plus size={14} /> Add Risk Entry
              </button>
            </div>
          </div>
        )}

        {viewMode === "table" && (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Inherent</th>
                  <th>Control</th>
                  <th>Detection</th>
                  <th>Overall</th>
                  <th>Response / Mitigation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {risks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "var(--text-3)",
                      }}
                    >
                      No risk entries yet. Add risk areas to build the
                      assessment matrix.
                    </td>
                  </tr>
                ) : (
                  risks.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.area}</td>
                      <td>
                        <RiskBadge level={r.inherentRisk} />
                      </td>
                      <td>
                        <RiskBadge level={r.controlRisk} />
                      </td>
                      <td>
                        <RiskBadge level={r.detectionRisk} />
                      </td>
                      <td>
                        <RiskBadge level={r.overallRisk} />
                      </td>
                      <td style={{ fontSize: "0.82rem", maxWidth: "250px" }}>
                        {r.mitigationPlan}
                      </td>
                      <td>
                        <StatusBadge
                          label={r.status}
                          variant={
                            r.status === "Mitigated"
                              ? "success"
                              : r.status === "Accepted"
                                ? "info"
                                : "warning"
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "heatmap" && (
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-3)",
                marginBottom: "1rem",
              }}
            >
              Rows = Inherent Risk | Columns = Control Risk | Numbers = count of
              risk entries
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px repeat(4, 1fr)",
                gap: "2px",
              }}
            >
              <div />
              {RISK_LEVELS.map((l) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    padding: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: riskColor[l].text,
                  }}
                >
                  {l}
                </div>
              ))}
              {[...RISK_LEVELS].reverse().map((ir) => (
                <React.Fragment key={ir}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: riskColor[ir].text,
                      paddingRight: "0.5rem",
                    }}
                  >
                    {ir}
                  </div>
                  {RISK_LEVELS.map((cr) => {
                    const items = heatmapData[ir]?.[cr] || [];
                    const severity =
                      RISK_LEVELS.indexOf(ir) + RISK_LEVELS.indexOf(cr) >= 4
                        ? "Critical"
                        : RISK_LEVELS.indexOf(ir) + RISK_LEVELS.indexOf(cr) >= 2
                          ? "High"
                          : "Medium";
                    return (
                      <div
                        key={cr}
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          borderRadius: "4px",
                          background:
                            items.length > 0
                              ? riskColor[severity].bg
                              : "#f8fafc",
                          border: `1px solid ${items.length > 0 ? riskColor[severity].border : "#e2e8f0"}`,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color:
                            items.length > 0
                              ? riskColor[severity].text
                              : "#d1d5db",
                          minHeight: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={items.map((i) => i.area).join(", ")}
                      >
                        {items.length || "—"}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-3)",
                marginTop: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              ← Control Risk →
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const AuditStrategyStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  strategy: AuditStrategy | undefined;
  risks: RiskMatrix[];
  materialityData: AuditStore["materiality"][0] | undefined;
  entityProfile: EntityProfile | undefined;
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
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
                {lgaName} — FY {audit.year} | ISA 300.7
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
      <Card
        title="Audit Strategy — Configuration"
        subtitle="ISA 300.7 — The auditor shall establish an overall audit strategy"
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
      </Card>

      <div className={s.gridTwoCols}>
        <Card title="Key Audit Matters">
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
        </Card>

        <Card title="Fraud Risk Factors (ISA 240)">
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
        </Card>
      </div>

      <Card title="Related Party Considerations (ISA 550)">
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
      </Card>
      <Card title="Going Concern Assessment (ISA 570)">
        <textarea
          className={s.formTextarea}
          value={form.goingConcernAssessment}
          onChange={(e) =>
            setForm((f) => ({ ...f, goingConcernAssessment: e.target.value }))
          }
          placeholder="Document going concern assessment..."
        />
      </Card>

      <Card title="Team Composition & Supervision Plan">
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
      </Card>

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

const ProgrammeStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  programme: AuditStore["programmes"][0] | undefined;
  risks: RiskMatrix[];
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}> = ({ audit, lgaName, programme, risks, store, user }) => {
  if (programme) {
    return <WorkProgrammeSection auditId={audit.id} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card
        title="Audit Programme Generation"
        subtitle="ISA 300.9 — The auditor shall develop an audit plan"
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
          The audit programme translates the overall strategy and risk
          assessment into specific audit procedures. It can be auto-generated
          from the risk matrix or created from a standard template.
        </div>

        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <BookOpen
            size={48}
            style={{ color: "#d1d5db", marginBottom: "1rem" }}
          />
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              marginBottom: "0.5rem",
            }}
          >
            No Audit Programme Created Yet
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--text-3)",
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
            }}
          >
            Generate the audit programme automatically from the risk matrix
            entries, or create one from a standard template.
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className={s.btnPrimary}
              disabled={risks.length === 0}
              onClick={() =>
                store.generateProgrammeFromRisks(audit.id, user.id)
              }
            >
              <Sparkles size={14} /> Generate from Risk Matrix
              {risks.length === 0 && (
                <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>
                  {" "}
                  (add risks first)
                </span>
              )}
            </button>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {store.programmeTemplates.map((t) => (
                <button
                  key={t.id}
                  className={s.btnOutline}
                  onClick={() =>
                    store.createProgrammeFromTemplate(
                      t.id,
                      audit.id,
                      user.id,
                      `Express an opinion on the financial statements of ${lgaName}`,
                      `All financial operations of ${lgaName} for FY ${audit.year}`,
                    )
                  }
                >
                  <Layers size={14} /> {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {risks.length > 0 && (
        <Card
          title="Risk Areas to Programme Mapping"
          subtitle="Preview of how risks will map to audit procedures"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {risks.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <RiskBadge level={r.overallRisk} />
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {r.area}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <ChevronRight size={13} />
                  Will generate procedures
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuditPlanning;
