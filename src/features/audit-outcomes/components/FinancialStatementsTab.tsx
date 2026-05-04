import React, { useEffect, useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import type {
  AuditOutcome,
  FinancialStatement,
  FinancialStatementRow,
  FinancialStatementKind,
} from "../../../types/auditOutcomes";
import Card from "./Card";
import EmptyState from "./EmptyState";
import SegmentedBtn from "./SegmentedBtn";
import { cellInput, primaryBtn, td, th } from "../utils/styles";

const FS_SUBTABS: Array<{ key: FinancialStatementKind; label: string }> = [
  {
    key: "StatementOfFinancialPosition",
    label: "Statement of Financial Position",
  },
  {
    key: "StatementOfFinancialPerformance",
    label: "Statement of Financial Performance",
  },
  { key: "CashFlowStatement", label: "Cash Flow Statement" },
  { key: "NotesToTheAccounts", label: "Notes to the Accounts" },
];

const FinancialStatementEditor: React.FC<{
  fs: FinancialStatement;
  canEdit: boolean;
  onSave: (fs: FinancialStatement) => void;
}> = ({ fs, canEdit, onSave }) => {
  const [rows, setRows] = useState<FinancialStatementRow[]>(fs.rows);
  useEffect(() => {
    const timer = setTimeout(() => setRows(fs.rows), 0);
    return () => clearTimeout(timer);
  }, [fs.id, fs.rows]);

  const handleCell = (
    id: string,
    field: keyof FinancialStatementRow,
    v: unknown,
  ) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: v } : r)));
  };

  const handleSave = () => onSave({ ...fs, rows });

  if (fs.kind === "NotesToTheAccounts") {
    return (
      <div>
        <p style={{ fontSize: "0.85rem", color: "#475569" }}>
          Notes are generated automatically from the trial balance schedules
          (Notes 1–8). Narrative overrides can be provided per-note below.
        </p>
        {(fs.noteRefs || []).map((n) => (
          <div
            key={n.noteNumber}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "0.9rem 1rem",
              marginBottom: 10,
              background: "#ffffff",
            }}
          >
            <strong
              style={{
                fontSize: "0.85rem",
                color: "#0f172a",
                display: "block",
                marginBottom: 4,
              }}
            >
              Note {n.noteNumber}: {n.title}
            </strong>
            {n.body && (
              <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                {n.body}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "600px",
            borderCollapse: "collapse",
            fontSize: "0.82rem",
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={th}>Description</th>
              <th style={th}>Note</th>
              <th style={{ ...th, textAlign: "right" }}>
                {fs.currentYear} (₦)
              </th>
              <th style={{ ...th, textAlign: "right" }}>{fs.priorYear} (₦)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                style={{
                  background: r.isHeader
                    ? "#f8fafc"
                    : r.isSubtotal
                      ? "#fafaf9"
                      : "transparent",
                  fontWeight: r.isHeader || r.isSubtotal ? 700 : 400,
                  color: r.isHeader ? "#0f172a" : "#334155",
                }}
              >
                <td
                  style={{
                    ...td,
                    paddingLeft: `${0.6 + (r.indent ?? 0) * 0.8}rem`,
                    textAlign: "left",
                  }}
                >
                  {canEdit && !r.isHeader ? (
                    <input
                      value={r.description}
                      onChange={(e) =>
                        handleCell(r.id, "description", e.target.value)
                      }
                      style={cellInput}
                    />
                  ) : (
                    r.description
                  )}
                </td>
                <td style={td}>{r.note || ""}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  {r.isHeader ? (
                    ""
                  ) : canEdit ? (
                    <input
                      type="number"
                      value={r.currentYear ?? 0}
                      onChange={(e) =>
                        handleCell(r.id, "currentYear", Number(e.target.value))
                      }
                      style={{ ...cellInput, textAlign: "right" }}
                    />
                  ) : (
                    (r.currentYear ?? 0).toLocaleString("en-NG")
                  )}
                </td>
                <td style={{ ...td, textAlign: "right" }}>
                  {r.isHeader ? (
                    ""
                  ) : canEdit ? (
                    <input
                      type="number"
                      value={r.priorYear ?? 0}
                      onChange={(e) =>
                        handleCell(r.id, "priorYear", Number(e.target.value))
                      }
                      style={{ ...cellInput, textAlign: "right" }}
                    />
                  ) : (
                    (r.priorYear ?? 0).toLocaleString("en-NG")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={handleSave}
          style={{ ...primaryBtn, marginTop: 14 }}
        >
          Save Statement
        </button>
      )}
    </div>
  );
};

const FinancialStatementsTab: React.FC<{
  outcome: AuditOutcome;
  canEdit: boolean;
}> = ({ outcome, canEdit }) => {
  const store = useAuditStore();
  const [subtab, setSubtab] = useState<FinancialStatementKind>(
    "StatementOfFinancialPosition",
  );

  const kindToId: Record<FinancialStatementKind, string | undefined> = {
    StatementOfFinancialPosition: outcome.consolidatedSofpId,
    StatementOfFinancialPerformance: outcome.consolidatedSofPerfId,
    CashFlowStatement: outcome.consolidatedCashFlowId,
    NotesToTheAccounts: outcome.consolidatedNotesId,
  };

  const fs = store.auditedFinancialStatements?.find(
    (f) => f.id === kindToId[subtab],
  );

  return (
    <Card
      title="Audited Financial Statements (Consolidated)"
      subtitle="The four pillars of the audited accounts. Values are pre-populated from the trial balance; adjust as required for audit adjustments."
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {FS_SUBTABS.map((t) => (
          <SegmentedBtn
            key={t.key}
            active={subtab === t.key}
            onClick={() => setSubtab(t.key)}
          >
            {t.label}
          </SegmentedBtn>
        ))}
      </div>
      {fs ? (
        <FinancialStatementEditor
          fs={fs}
          canEdit={canEdit}
          onSave={(next) => store.saveFinancialStatement(next)}
        />
      ) : (
        <EmptyState title="Statement not yet generated" />
      )}
    </Card>
  );
};

export default FinancialStatementsTab;
