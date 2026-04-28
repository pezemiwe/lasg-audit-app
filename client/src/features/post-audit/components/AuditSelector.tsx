import React from "react";
import StatusBadge from "../../../components/UI/StatusBadge";
import { CheckCircle } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { Audit, LGA } from "../../../types";

interface Props {
  selectedAuditId: string;
  setSelectedAuditId: (id: string) => void;
  eligibleAudits: Audit[];
  lgas: LGA[];
  selectedAudit: Audit | undefined;
}

const AuditSelector: React.FC<Props> = ({
  selectedAuditId,
  setSelectedAuditId,
  eligibleAudits,
  lgas,
  selectedAudit,
}) => {
  return (
    <div className={s.card} style={{ marginBottom: "1.5rem" }}>
      <div className={s.cardBody} style={{ padding: "1.25rem" }}>
        <div className={s.formGrid} style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Select Completed Audit</label>
            <select
              className={s.formSelect}
              value={selectedAuditId}
              onChange={(e) => setSelectedAuditId(e.target.value)}
            >
              {eligibleAudits
                .sort((a) => (a.status === "Completed" ? -1 : 1))
                .map((a) => {
                  const lga = lgas.find((l) => l.id === a.lgaId);
                  return (
                    <option key={a.id} value={a.id}>
                      {lga?.name || a.lgaId} — {a.type} Audit {a.year} (
                      {a.status})
                    </option>
                  );
                })}
            </select>
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel}>Current Status</label>
            <div
              style={{
                paddingTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <StatusBadge
                label={selectedAudit?.status || ""}
                variant={
                  selectedAudit?.status === "Completed" ? "success" : "warning"
                }
              />
              {selectedAudit?.status === "Completed" && (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#16a34a",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <CheckCircle size={14} /> Finalized
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditSelector;
