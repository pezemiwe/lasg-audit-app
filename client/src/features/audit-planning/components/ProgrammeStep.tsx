import React from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, RiskMatrix } from "../../../types";
import { BookOpen, ChevronRight, Sparkles, Layers } from "lucide-react";
import WorkProgrammeSection from "../../../components/AuditPlanning/WorkProgrammeSection";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import RiskBadge from "./RiskBadge";

const ProgrammeStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  programme: AuditStore["programmes"][0] | undefined;
  risks: RiskMatrix[];
  store: AuditStore;
  user: User;
}> = ({ audit, lgaName, programme, risks, store, user }) => {
  if (programme) {
    return <WorkProgrammeSection auditId={audit.id} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PlanningCard
        title="Audit Programme Generation"
        subtitle="ISA 300.9 - The auditor shall develop an audit plan"
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
      </PlanningCard>

      {risks.length > 0 && (
        <PlanningCard
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
        </PlanningCard>
      )}
    </div>
  );
};

export default ProgrammeStep;
