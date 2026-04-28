import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import type { AuditStore } from "../../../store/useAuditStore";
import type {
  FieldworkException,
  ProcedureExecution,
  FieldworkCompletionMemo,
} from "../../../types";
import s from "../../../styles/pages.module.css";

export interface FieldworkCompletionModalProps {
  auditId: string;
  stats: {
    total: number;
    cleared: number;
    budgetedHours: number;
    loggedHours: number;
  };
  excStats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    totalImpact: number;
  };
  exceptions: FieldworkException[];
  executions: ProcedureExecution[];
  materiality: number;
  store: AuditStore;
  userId: string;
  lgaName: string;
  memo: FieldworkCompletionMemo | undefined;
  onClose: () => void;
}

const FieldworkCompletionModal: React.FC<FieldworkCompletionModalProps> = ({
  auditId,
  stats,
  excStats,
  exceptions,
  executions,
  materiality,
  store,
  userId,
  lgaName,
  memo,
  onClose,
}) => {
  const [scopeSummary, setScopeSummary] = useState(
    memo?.scopeSummary ||
      `${stats.total} procedures executed across all audit areas.`,
  );
  const [scopeLimitations, setScopeLimitations] = useState(
    memo?.scopeLimitations || "",
  );
  const [overallAssessment, setOverallAssessment] = useState(
    memo?.overallAssessment || "",
  );

  const queryCount = exceptions.filter(
    (e) => e.classification === "Proceed to Audit Query",
  ).length;
  const excSummary = `Critical: ${excStats.critical} | High: ${excStats.high} | Medium: ${excStats.medium} | Low: ${excStats.low}\nTotal: ${excStats.total} exceptions | Financial Exposure: ₦${(excStats.totalImpact / 1e6).toFixed(1)}M\nProceeding to Audit Queries: ${queryCount} exceptions queued`;

  const auditAreas = Array.from(new Set(executions.map((e) => e.auditArea)));
  const areaRows = auditAreas.map((area) => {
    const areaExecs = executions.filter((e) => e.auditArea === area);
    const cleared = areaExecs.filter(
      (e) => e.status === "Cleared" || e.status === "Locked",
    ).length;
    const areaExceptions = exceptions.filter((e) => e.auditArea === area);
    const criticalCount = areaExceptions.filter(
      (e) => e.severity === "Critical",
    ).length;
    return { area, total: areaExecs.length, cleared, criticalCount };
  });

  const derivePreliminaryOpinion =
    (): FieldworkCompletionMemo["preliminaryOpinion"] => {
      if (excStats.critical > 0 || excStats.totalImpact > materiality * 10)
        return "Adverse";
      if (excStats.high > 2 || excStats.totalImpact > materiality * 5)
        return "Qualified";
      if (excStats.medium > 0 || excStats.low > 0) return "Qualified";
      return "Unmodified";
    };

  const [preliminaryOpinion, setPreliminaryOpinion] = useState<
    FieldworkCompletionMemo["preliminaryOpinion"]
  >(memo?.preliminaryOpinion ?? derivePreliminaryOpinion());

  const handleSubmit = () => {
    if (!overallAssessment.trim()) {
      store.addToast({
        type: "warning",
        title: "Required",
        message: "Overall assessment is required",
      });
      return;
    }
    if (!memo) {
      store.createFieldworkMemo({
        auditId,
        scopeSummary,
        exceptionsSummary: excSummary,
        scopeLimitations,
        budgetedHours: stats.budgetedHours,
        actualHours: stats.loggedHours,
        overallAssessment,
        preliminaryOpinion,
        signedByLead: true,
        signedByLeadAt: new Date().toISOString(),
        signedBySupervisor: false,
      });
    } else {
      store.updateFieldworkMemo(memo.id, {
        scopeSummary,
        overallAssessment,
        scopeLimitations,
        preliminaryOpinion,
        signedByLead: true,
        signedByLeadAt: new Date().toISOString(),
      });
    }
    store.submitStageApproval({
      auditId,
      stage: "Fieldwork",
      status: "Pending",
      submittedBy: userId,
    });
    store.logActivity({
      userId,
      action: "SUBMIT_FIELDWORK",
      details: `Fieldwork completion memo submitted — ${stats.total} procedures, ${excStats.total} exceptions`,
      entityType: "fieldwork",
      entityId: auditId,
    });
    store.addToast({
      type: "success",
      title: "Fieldwork Submitted",
      message: "Completion memo signed and sent to Audit Supervisor",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "700px",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            background: "#f0fdf4",
          }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#15803d",
            }}
          >
            Fieldwork Completion Memorandum
          </div>
          <div
            style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.25rem" }}
          >
            {lgaName} — FY2024
          </div>
        </div>
        <div
          style={{
            padding: "1.5rem",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1rem",
              fontSize: "0.82rem",
            }}
          >
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#f8fafc",
                borderRadius: "0.35rem",
              }}
            >
              Procedures:{" "}
              <strong>
                {stats.cleared}/{stats.total}
              </strong>
            </div>
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#f8fafc",
                borderRadius: "0.35rem",
              }}
            >
              Hours:{" "}
              <strong>
                {stats.loggedHours.toFixed(1)}/{stats.budgetedHours}
              </strong>{" "}
              (
              {stats.budgetedHours > 0
                ? ((stats.loggedHours / stats.budgetedHours) * 100).toFixed(1)
                : 0}
              % utilised)
            </div>
          </div>

          <div
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.82rem",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {excSummary}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#64748b",
                marginBottom: "0.4rem",
              }}
            >
              Section 2 — Scope Coverage by Audit Area
            </div>
            <table
              style={{
                width: "100%",
                fontSize: "0.78rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Audit Area
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Cleared
                  </th>
                  <th
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Critical Exc.
                  </th>
                </tr>
              </thead>
              <tbody>
                {areaRows.map((r) => (
                  <tr key={r.area}>
                    <td
                      style={{
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {r.area}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {r.total}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        color: r.cleared === r.total ? "#15803d" : "#b45309",
                        fontWeight: 600,
                      }}
                    >
                      {r.cleared}/{r.total}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "0.3rem 0.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        color: r.criticalCount > 0 ? "#dc2626" : "#15803d",
                        fontWeight: r.criticalCount > 0 ? 700 : 400,
                      }}
                    >
                      {r.criticalCount > 0 ? r.criticalCount : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Scope Summary</label>
            <textarea
              className={s.formTextarea}
              value={scopeSummary}
              onChange={(e) => setScopeSummary(e.target.value)}
              rows={3}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Scope Limitations (if any)</label>
            <textarea
              className={s.formTextarea}
              value={scopeLimitations}
              onChange={(e) => setScopeLimitations(e.target.value)}
              rows={2}
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Audit Lead's Overall Assessment *
            </label>
            <textarea
              className={s.formTextarea}
              value={overallAssessment}
              onChange={(e) => setOverallAssessment(e.target.value)}
              rows={4}
              placeholder="Summary of fieldwork findings and professional opinion..."
            />
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>
              Section 7 — Preliminary Opinion
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.7rem",
                  color: "#2563eb",
                  fontWeight: 500,
                }}
              >
                (auto-suggested from exception severity)
              </span>
            </label>
            <select
              className={s.formSelect}
              value={preliminaryOpinion}
              onChange={(e) =>
                setPreliminaryOpinion(
                  e.target
                    .value as FieldworkCompletionMemo["preliminaryOpinion"],
                )
              }
            >
              <option value="Unmodified">Unmodified</option>
              <option value="Qualified">Qualified</option>
              <option value="Adverse">Adverse</option>
              <option value="Disclaimer">Disclaimer</option>
            </select>
            <div
              style={{
                marginTop: "0.35rem",
                fontSize: "0.72rem",
                color:
                  preliminaryOpinion === "Adverse"
                    ? "#dc2626"
                    : preliminaryOpinion === "Qualified"
                      ? "#b45309"
                      : "#15803d",
              }}
            >
              {preliminaryOpinion === "Unmodified" &&
                "Financials present a true and fair view in all material respects."}
              {preliminaryOpinion === "Qualified" &&
                "One or more material misstatements or scope limitations identified."}
              {preliminaryOpinion === "Adverse" &&
                "Financials are materially misstated and do not present a true and fair view."}
              {preliminaryOpinion === "Disclaimer" &&
                "Insufficient audit evidence to form an opinion."}
            </div>
          </div>

          {memo?.signedBySupervisor && (
            <div
              style={{
                padding: "0.75rem",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "0.5rem",
                fontSize: "0.82rem",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Supervisor Sign-off:</strong> Signed on{" "}
              {memo.signedBySupervisorAt
                ? new Date(memo.signedBySupervisorAt).toLocaleDateString(
                    "en-GB",
                  )
                : "—"}
              {memo.hlgAcknowledged ? (
                <span style={{ marginLeft: "1rem", color: "#15803d" }}>
                  ✅ HLG Acknowledged on{" "}
                  {memo.hlgAcknowledgedAt
                    ? new Date(memo.hlgAcknowledgedAt).toLocaleDateString(
                        "en-GB",
                      )
                    : "—"}
                </span>
              ) : (
                <span style={{ marginLeft: "1rem", color: "#b45309" }}>
                  ⏳ Awaiting HLG Acknowledgement
                </span>
              )}
            </div>
          )}

          <div className={s.formActions}>
            <button className={s.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button className={s.btnPrimary} onClick={handleSubmit}>
              <CheckCircle size={14} /> Sign & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldworkCompletionModal;
