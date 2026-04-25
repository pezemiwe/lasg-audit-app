import React from "react";
import { CheckCircle, FileSignature } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { ScopeAgreement, User } from "../../../types";
import { userName } from "../utils/helpers";

interface Props {
  auditScope: ScopeAgreement | undefined;
  users: User[];
}

const ScopeTab: React.FC<Props> = ({ auditScope, users }) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>Scope, Timeline & Sign-offs</h3>
    </div>
    <div className={s.cardBody}>
      {!auditScope ? (
        <div className={s.emptyState}>
          <FileSignature size={40} className={s.emptyIcon} />
          <div className={s.emptyTitle}>No Scope Agreement Found</div>
          <div className={s.emptyDesc}>
            The scope agreement for this audit has not been initialized.
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <div className={s.label}>Status</div>
                <StatusBadge label={auditScope.status} />
              </div>
              <div>
                <div className={s.label}>Total Duration</div>
                <div className={s.value}>{auditScope.totalWeeks} Weeks</div>
              </div>
              <div>
                <div className={s.label}>Created By</div>
                <div className={s.value}>
                  {userName(auditScope.createdBy, users)}
                </div>
              </div>
            </div>
          </div>

          <table className={s.dataTable}>
            <thead>
              <tr>
                <th>Audit Area</th>
                <th>Description</th>
                <th>Expectations</th>
                <th>Timeline</th>
                <th>Auditor Sign-off</th>
                <th>LGA Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {auditScope.rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.area}</td>
                  <td>{row.description}</td>
                  <td>{row.expectations}</td>
                  <td>{row.timelineWeeks} Weeks</td>
                  <td>
                    {row.auditorSignOff ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "#16a34a",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle size={14} />
                        {row.auditorSignOff.name}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.8rem",
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
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle size={14} />
                        {row.lgaSignOff.name}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.8rem",
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
      )}
    </div>
  </div>
);

export default ScopeTab;
