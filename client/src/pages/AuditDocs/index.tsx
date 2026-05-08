import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import FindingsTab from "../../features/audit-docs/components/FindingsTab";
import WorkpapersTab from "../../features/audit-docs/components/WorkpapersTab";
import ReportsTab from "../../features/audit-docs/components/ReportsTab";
import CompletenessTab from "../../features/audit-docs/components/CompletenessTab";
import {
  FINDINGS,
  WORKPAPER_CHECKLIST,
} from "../../features/audit-docs/utils/auditDocsData";

const AuditDocs: React.FC = () => {
  const { user } = useAuth();
  const { audits, lgas, workpapers, reports } = useAuditStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    (searchParams.get("tab") as
      | "findings"
      | "workpapers"
      | "reports"
      | "completeness") || "findings";
  const setActiveTab = (
    id: "findings" | "workpapers" | "reports" | "completeness",
  ) =>
    setSearchParams(
      (prev) => {
        prev.set("tab", id);
        return prev;
      },
      { replace: true },
    );

  if (!user) return null;

  const myAudit =
    user.role === "AUDIT_LEAD"
      ? audits.find((a) => a.leadId === user.id)
      : audits[0];

  const auditId = myAudit?.id ?? "audit-1";
  const lgaName = lgas.find((l) => l.id === myAudit?.lgaId)?.name ?? "N/A";
  const auditWorkpapers = workpapers.filter((w) => w.auditId === auditId);
  const auditReports = reports.filter((r) => r.auditId === auditId);

  const complete = WORKPAPER_CHECKLIST.filter(
    (w) => w.status === "Complete",
  ).length;
  const completePct = Math.round((complete / WORKPAPER_CHECKLIST.length) * 100);

  const tabs = [
    { id: "findings" as const, label: "Findings & Recommendations" },
    { id: "workpapers" as const, label: "Working Papers" },
    { id: "reports" as const, label: "Audit Reports" },
    { id: "completeness" as const, label: "File Completeness" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
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
            Audit Documentation
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
            Documentation & Reporting
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            {lgaName}: Working papers, findings, audit reports and file
            completeness tracker.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {[
            { label: "Findings", value: FINDINGS.length, color: "#991b1b" },
            {
              label: "Workpapers",
              value: auditWorkpapers.length,
              color: "#1e40af",
            },
            {
              label: "File Complete",
              value: `${completePct}%`,
              color: completePct >= 80 ? "#065f46" : "#92400e",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "0.75rem 1rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "3px",
                textAlign: "center",
                minWidth: "90px",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid var(--border)",
          marginBottom: "2rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: "0.875rem",
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-3)",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "findings" && <FindingsTab />}
      {activeTab === "workpapers" && (
        <WorkpapersTab auditWorkpapers={auditWorkpapers} />
      )}
      {activeTab === "reports" && <ReportsTab auditReports={auditReports} />}
      {activeTab === "completeness" && (
        <CompletenessTab complete={complete} completePct={completePct} />
      )}
    </div>
  );
};

export default AuditDocs;
