import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  FileText,
  BookOpen,
  LineChart,
  Package,
  FileCheck,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { useSimulatedLoading } from "../../hooks/useSimulatedLoading";
import PageSkeleton from "../../components/UI/PageSkeleton";
import s from "../../styles/pages.module.css";
import TrialBalanceTab from "../../features/audit-outcomes/components/TrialBalanceTab";
import MaterialityTab from "../../features/audit-outcomes/components/MaterialityTab";
import ResponsibilityTab from "../../features/audit-outcomes/components/ResponsibilityTab";
import AuditReportTab from "../../features/audit-outcomes/components/AuditReportTab";
import PoliciesTab from "../../features/audit-outcomes/components/PoliciesTab";
import FinancialStatementsTab from "../../features/audit-outcomes/components/FinancialStatementsTab";
import CompileTab from "../../features/audit-outcomes/components/CompileTab";
import {
  isTabComplete,
  type TabKey,
} from "../../features/audit-outcomes/utils/tabComplete";

const TABS: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  {
    key: "trial-balance",
    label: "Trial Balance",
    icon: <FileSpreadsheet size={15} />,
  },
  { key: "materiality", label: "Materiality", icon: <Calculator size={15} /> },
  {
    key: "responsibility",
    label: "Responsibility",
    icon: <ShieldCheck size={15} />,
  },
  { key: "report", label: "Audit Report", icon: <FileText size={15} /> },
  {
    key: "policies",
    label: "Accounting Policies",
    icon: <BookOpen size={15} />,
  },
  {
    key: "statements",
    label: "Financial Statements",
    icon: <LineChart size={15} />,
  },
  { key: "compile", label: "Compile & Generate", icon: <Package size={15} /> },
];

const AuditOutcomesPage: React.FC = () => {
  const isLoading = useSimulatedLoading(500);
  const { user } = useAuth();
  const store = useAuditStore();

  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>(
    store.auditOutcomes?.[0]?.id ?? "",
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) || "trial-balance";
  const setActiveTab = useCallback(
    (key: TabKey) =>
      setSearchParams(
        (prev) => {
          prev.set("tab", key);
          return prev;
        },
        { replace: true },
      ),
    [setSearchParams],
  );

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1180);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1180);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const outcome = useMemo(
    () => store.auditOutcomes?.find((o) => o.id === selectedOutcomeId),
    [store.auditOutcomes, selectedOutcomeId],
  );

  const role = user?.role;
  const canEditResponsibility =
    role === "AUDIT_LEAD" || role === "SYSTEM_ADMIN";
  const canEditReport =
    role === "AUDIT_LEAD" ||
    role === "AUDIT_SUPERVISOR" ||
    role === "STATE_AUDITOR_GENERAL" ||
    role === "SYSTEM_ADMIN";
  const canEditPolicies =
    role === "AUDIT_SUPERVISOR" || role === "SYSTEM_ADMIN";
  const canApproveMateriality =
    role === "AUDIT_SUPERVISOR" ||
    role === "STATE_AUDITOR_GENERAL" ||
    role === "SYSTEM_ADMIN";

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!outcome || !user) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className={s.pageTitle}>Audit Outcomes</div>
        <div className={s.pageSubtitle}>
          No audit outcome available. Complete an audit to Reporting stage to
          begin compilation.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.25rem 1.5rem" }}>
      <div className={s.pageHeader}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              color: "#064e3b",
              background: "#d1fae5",
              padding: "0.2rem 0.5rem",
              borderRadius: 3,
              marginBottom: 8,
            }}
          >
            <FileCheck size={12} /> Audit Outcomes
          </div>
          <div className={s.pageTitle}>{outcome.title}</div>
          <div className={s.pageSubtitle}>
            Year of Audit: {outcome.auditYear} | Status:{" "}
            <strong>{outcome.status}</strong>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isSmallScreen
            ? "1fr"
            : "minmax(0, 220px) minmax(0, 1fr)",
          gap: 16,
        }}
      >
        <aside
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "#ffffff",
            padding: isSmallScreen ? "0.75rem 1rem" : "1rem",
            display: isSmallScreen ? "flex" : "block",
            flexWrap: isSmallScreen ? "wrap" : "nowrap",
            gap: isSmallScreen ? 12 : undefined,
            alignItems: isSmallScreen ? "center" : undefined,
            height: "fit-content",
            position: "sticky",
            top: 20,
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: isSmallScreen ? 0 : 10,
              marginRight: isSmallScreen ? 8 : 0,
            }}
          >
            {isSmallScreen ? "Outcome" : "Active Outcome"}
          </div>
          <select
            value={selectedOutcomeId}
            onChange={(e) => setSelectedOutcomeId(e.target.value)}
            style={{
              width: isSmallScreen ? "auto" : "100%",
              flex: isSmallScreen ? "0 0 auto" : undefined,
              padding: "0.5rem 0.6rem",
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              fontSize: "0.85rem",
              marginBottom: isSmallScreen ? 0 : 16,
            }}
          >
            {store.auditOutcomes?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.auditYear}: {o.title.slice(0, 40)}
              </option>
            ))}
          </select>

          {isSmallScreen && (
            <div
              style={{
                width: "1px",
                height: 24,
                background: "#e2e8f0",
                margin: "0 8px",
              }}
            />
          )}

          {!isSmallScreen && (
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Sections
            </div>
          )}
          <nav
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "row" : "column",
              gap: isSmallScreen ? 8 : 2,
              flex: isSmallScreen ? 1 : undefined,
              overflowX: isSmallScreen ? "auto" : "visible",
              paddingBottom: isSmallScreen ? 4 : 0,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {TABS.map((t) => {
              const done = isTabComplete(t.key, outcome, store);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0.55rem 0.7rem",
                    border: "none",
                    borderRadius: 4,
                    background:
                      activeTab === t.key
                        ? "#f0fdf4"
                        : isSmallScreen
                          ? "#f8fafc"
                          : "transparent",
                    color: activeTab === t.key ? "#064e3b" : "#475569",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === t.key ? 600 : 500,
                    textAlign: "left",
                    cursor: "pointer",
                    whiteSpace: isSmallScreen ? "nowrap" : "normal",
                    flexShrink: isSmallScreen ? 0 : undefined,
                  }}
                >
                  {t.icon}
                  <span style={{ flex: isSmallScreen ? "none" : 1 }}>
                    {t.label}
                  </span>
                  {done ? (
                    <Check size={14} color="#16a34a" />
                  ) : (
                    <ChevronRight size={12} color="#94a3b8" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div style={{ minWidth: 0 }}>
          <section>
            {activeTab === "trial-balance" && (
              <TrialBalanceTab outcome={outcome} userId={user.id} />
            )}
            {activeTab === "materiality" && (
              <MaterialityTab
                outcome={outcome}
                userId={user.id}
                canApprove={canApproveMateriality}
              />
            )}
            {activeTab === "responsibility" && (
              <ResponsibilityTab
                outcome={outcome}
                canEdit={canEditResponsibility}
              />
            )}
            {activeTab === "report" && (
              <AuditReportTab outcome={outcome} canEdit={canEditReport} />
            )}
            {activeTab === "policies" && (
              <PoliciesTab outcome={outcome} canEdit={canEditPolicies} />
            )}
            {activeTab === "statements" && (
              <FinancialStatementsTab
                outcome={outcome}
                canEdit={canEditReport}
              />
            )}
            {activeTab === "compile" && <CompileTab outcome={outcome} />}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuditOutcomesPage;
