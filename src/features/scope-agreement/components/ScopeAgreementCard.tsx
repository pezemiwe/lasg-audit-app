import React from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Shield,
} from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { Audit, LGA, ScopeAgreement } from "../../../types";
import { statusVariant } from "../utils/statusVariant";
import AddScopeRowForm from "./AddScopeRowForm";

interface NewRow {
  area: string;
  description: string;
  timelineWeeks: number;
  expectations: string;
}

interface Props {
  agreement: ScopeAgreement;
  audit: Audit | undefined;
  lga: LGA | undefined;
  isExpanded: boolean;
  toggleExpanded: () => void;
  isAuditor: boolean;
  isLGA: boolean;
  showAddRow: boolean;
  setShowAddRow: (v: boolean) => void;
  newRow: NewRow;
  setNewRow: React.Dispatch<React.SetStateAction<NewRow>>;
  onAddRow: (agreementId: string) => void;
  onSignOff: (agreementId: string) => void;
}

const ScopeAgreementCard: React.FC<Props> = ({
  agreement,
  audit,
  lga,
  isExpanded,
  toggleExpanded,
  isAuditor,
  isLGA,
  showAddRow,
  setShowAddRow,
  newRow,
  setNewRow,
  onAddRow,
  onSignOff,
}) => {
  const allAuditorSigned = agreement.rows.every((r) => r.auditorSignOff);
  const allLgaSigned = agreement.rows.every((r) => r.lgaSignOff);

  return (
    <div className={s.card}>
      <div
        className={s.cardHeader}
        style={{ cursor: "pointer" }}
        onClick={toggleExpanded}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h3 className={s.cardTitle}>
            {lga?.name || agreement.lgaId} — {audit?.type} Audit ({audit?.year})
          </h3>
          <StatusBadge
            label={agreement.status}
            variant={statusVariant(agreement.status)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-3)",
              fontWeight: 600,
            }}
          >
            {agreement.totalWeeks} weeks total | {agreement.rows.length} scope
            areas
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className={s.cardBody}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Description</th>
                  <th>Timeline</th>
                  <th>Expectations</th>
                  <th>Auditor Sign-Off</th>
                  <th>Council Sign-Off</th>
                </tr>
              </thead>
              <tbody>
                {agreement.rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.area}</td>
                    <td>{row.description}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {row.timelineWeeks} weeks
                    </td>
                    <td>{row.expectations}</td>
                    <td>
                      {row.auditorSignOff ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            color: "#16a34a",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={14} />
                          {row.auditorSignOff.name}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--text-3)",
                          }}
                        >
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {row.lgaSignOff ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            color: "#16a34a",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={14} />
                          {row.lgaSignOff.name}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--text-3)",
                          }}
                        >
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isAuditor && showAddRow && (
            <AddScopeRowForm
              newRow={newRow}
              setNewRow={setNewRow}
              onCancel={() => setShowAddRow(false)}
              onSave={() => onAddRow(agreement.id)}
            />
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {isAuditor && !showAddRow && (
                <button
                  className={s.btnOutline}
                  onClick={() => setShowAddRow(true)}
                >
                  <Plus size={14} /> Add Scope Area
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {isAuditor && !allAuditorSigned && (
                <button
                  className={s.btnPrimary}
                  onClick={() => onSignOff(agreement.id)}
                >
                  <Shield size={14} /> Auditor Sign-Off
                </button>
              )}
              {isLGA && !allLgaSigned && allAuditorSigned && (
                <button
                  className={s.btnPrimary}
                  onClick={() => onSignOff(agreement.id)}
                >
                  <Shield size={14} /> Council Sign-Off
                </button>
              )}
              {allAuditorSigned && allLgaSigned && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#16a34a",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  <CheckCircle2 size={16} /> Fully Approved
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScopeAgreementCard;
