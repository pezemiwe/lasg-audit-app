import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  FileSignature,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const statusVariant = (status: string) => {
  switch (status) {
    case "Fully Approved":
      return "success" as const;
    case "Pending LGA":
      return "warning" as const;
    case "Changes Requested":
      return "error" as const;
    default:
      return "default" as const;
  }
};

interface ScopeAgreementPageProps {
  auditId?: string;
  embedded?: boolean;
}

const ScopeAgreementPage: React.FC<ScopeAgreementPageProps> = ({
  auditId,
  embedded,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const scopeAgreements = useAuditStore((st) => st.scopeAgreements);
  const createScopeAgreement = useAuditStore((st) => st.createScopeAgreement);
  const signOffScope = useAuditStore((st) => st.signOffScope);
  const addScopeRow = useAuditStore((st) => st.addScopeRow);
  const addToast = useAuditStore((st) => st.addToast);

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || audits[0]?.id || "",
  );

  React.useEffect(() => {
    if (auditId) setSelectedAuditId(auditId);
  }, [auditId]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRow, setNewRow] = useState({
    area: "",
    description: "",
    timelineWeeks: 2,
    expectations: "",
  });

  const isAuditor =
    user?.role === "AUDIT_LEAD" || user?.role === "AUDIT_SUPERVISOR";
  // AG can view but typically does not edit detailed scope rows
  // const isAG =
  //   user?.role === "STATE_AUDITOR_GENERAL" ||
  //   user?.role === "AUDITOR_GENERAL_FEDERATION";
  const isLGA = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";

  const relevantAgreements = useMemo(() => {
    if (isLGA && user?.lgaId) {
      return scopeAgreements.filter((sa) => sa.lgaId === user.lgaId);
    }
    if (selectedAuditId) {
      return scopeAgreements.filter((sa) => sa.auditId === selectedAuditId);
    }
    return scopeAgreements;
  }, [scopeAgreements, selectedAuditId, isLGA, user]);

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);

  const handleCreateAgreement = () => {
    if (!selectedAudit) return;
    createScopeAgreement({
      auditId: selectedAudit.id,
      lgaId: selectedAudit.lgaId,
      rows: [
        {
          id: `sr-init-${Date.now()}`,
          area: "Financial Records",
          description:
            "Review of all financial statements, ledgers, and supporting documentation",
          timelineWeeks: 3,
          expectations:
            "All financial records for the audit period to be made available",
        },
        {
          id: `sr-init2-${Date.now()}`,
          area: "Internal Controls",
          description:
            "Assessment of internal control environment and key control activities",
          timelineWeeks: 2,
          expectations:
            "Access to policies, procedures, and key control documentation",
        },
      ],
      status: "Draft",
      createdBy: user?.id || "",
      totalWeeks: 5,
    });
  };

  const handleAddRow = (agreementId: string) => {
    if (!newRow.area || !newRow.description) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Area and description are required",
      });
      return;
    }
    addScopeRow(agreementId, {
      area: newRow.area,
      description: newRow.description,
      timelineWeeks: newRow.timelineWeeks,
      expectations: newRow.expectations,
    });
    setNewRow({
      area: "",
      description: "",
      timelineWeeks: 2,
      expectations: "",
    });
    setShowAddRow(false);
  };

  const handleSignOff = (agreementId: string) => {
    const agreement = scopeAgreements.find((s) => s.id === agreementId);
    if (!agreement) return;

    if (agreement.rows.length === 0) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Cannot sign off on an empty scope. Add at least one area.",
      });
      return;
    }

    const party = isLGA ? "lga" : "auditor";
    signOffScope(agreementId, party, user?.name || "");

    if (party === "auditor") {
      addToast({
        type: "info",
        title: "Signed Off",
        message: "Waiting for LGA counter-signature.",
      });
    } else {
      addToast({
        type: "success",
        title: "Agreement Finalized",
        message: "Scope agreement fully executed. Fieldwork enabled.",
      });
    }
  };

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Scope & Timeline Agreement</h1>
            <p className={s.pageSubtitle}>
              Establish audit scope, timelines, and expectations with formal
              dual-party sign-off
            </p>
          </div>
          <span className={s.pageBadge}>
            <FileSignature size={12} /> Scope Agreement
          </span>
        </div>
      )}

      {!isLGA && !embedded && (
        <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
          <select
            className={s.formSelect}
            value={selectedAuditId}
            onChange={(e) => setSelectedAuditId(e.target.value)}
            style={{ width: 320 }}
          >
            {audits.map((a) => {
              const lga = lgas.find((l) => l.id === a.lgaId);
              return (
                <option key={a.id} value={a.id}>
                  {lga?.name || a.lgaId} — {a.type} Audit ({a.year})
                </option>
              );
            })}
          </select>
          {relevantAgreements.length === 0 && (
            <button className={s.btnPrimary} onClick={handleCreateAgreement}>
              <Plus size={14} /> Create Scope Agreement
            </button>
          )}
        </div>
      )}

      {embedded && relevantAgreements.length === 0 && !isLGA && (
        <div style={{ marginBottom: "1.5rem" }}>
          <button className={s.btnPrimary} onClick={handleCreateAgreement}>
            <Plus size={14} /> Create Scope Agreement
          </button>
        </div>
      )}

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <FileSignature size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total Agreements</div>
            <div className={s.kpiValue}>{scopeAgreements.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Fully Approved</div>
            <div className={s.kpiValue}>
              {
                scopeAgreements.filter((sa) => sa.status === "Fully Approved")
                  .length
              }
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Sign-Off</div>
            <div className={s.kpiValue}>
              {
                scopeAgreements.filter(
                  (sa) => sa.status === "Pending LGA" || sa.status === "Draft",
                ).length
              }
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Changes Requested</div>
            <div className={s.kpiValue}>
              {
                scopeAgreements.filter(
                  (sa) => sa.status === "Changes Requested",
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {relevantAgreements.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileSignature size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Scope Agreements</div>
              <div className={s.emptyDesc}>
                {isAuditor
                  ? "Select an audit and create a scope agreement to define audit boundaries with the council."
                  : "No scope agreements have been created for your council yet."}
              </div>
            </div>
          </div>
        </div>
      )}

      {relevantAgreements.map((agreement) => {
        const audit = audits.find((a) => a.id === agreement.auditId);
        const lga = lgas.find((l) => l.id === agreement.lgaId);
        const isExpanded = expandedId === agreement.id;
        const allAuditorSigned = agreement.rows.every((r) => r.auditorSignOff);
        const allLgaSigned = agreement.rows.every((r) => r.lgaSignOff);

        return (
          <div key={agreement.id} className={s.card}>
            <div
              className={s.cardHeader}
              style={{ cursor: "pointer" }}
              onClick={() => setExpandedId(isExpanded ? null : agreement.id)}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <h3 className={s.cardTitle}>
                  {lga?.name || agreement.lgaId} — {audit?.type} Audit (
                  {audit?.year})
                </h3>
                <StatusBadge
                  label={agreement.status}
                  variant={statusVariant(agreement.status)}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-3)",
                    fontWeight: 600,
                  }}
                >
                  {agreement.totalWeeks} weeks total | {agreement.rows.length}{" "}
                  scope areas
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
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

                {isAuditor && showAddRow && expandedId === agreement.id && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.25rem",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Add Scope Area
                    </div>
                    <div className={s.formGrid}>
                      <div className={s.formGroup}>
                        <label className={s.formLabel}>Area</label>
                        <input
                          className={s.formInput}
                          value={newRow.area}
                          onChange={(e) =>
                            setNewRow({ ...newRow, area: e.target.value })
                          }
                          placeholder="e.g. Procurement"
                        />
                      </div>
                      <div className={s.formGroup}>
                        <label className={s.formLabel}>Timeline (weeks)</label>
                        <input
                          className={s.formInput}
                          type="number"
                          min={1}
                          value={newRow.timelineWeeks}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              timelineWeeks: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className={s.formGroupFull}>
                        <label className={s.formLabel}>Description</label>
                        <textarea
                          className={s.formTextarea}
                          value={newRow.description}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the scope of work for this area"
                        />
                      </div>
                      <div className={s.formGroupFull}>
                        <label className={s.formLabel}>Expectations</label>
                        <textarea
                          className={s.formTextarea}
                          value={newRow.expectations}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              expectations: e.target.value,
                            })
                          }
                          placeholder="Describe expectations from the auditee"
                        />
                      </div>
                    </div>
                    <div className={s.formActions}>
                      <button
                        className={s.btnSecondary}
                        onClick={() => setShowAddRow(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={s.btnPrimary}
                        onClick={() => handleAddRow(agreement.id)}
                      >
                        Add Row
                      </button>
                    </div>
                  </div>
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
                        onClick={() => handleSignOff(agreement.id)}
                      >
                        <Shield size={14} /> Auditor Sign-Off
                      </button>
                    )}
                    {isLGA && !allLgaSigned && allAuditorSigned && (
                      <button
                        className={s.btnPrimary}
                        onClick={() => handleSignOff(agreement.id)}
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
      })}
    </div>
  );
};

export default ScopeAgreementPage;
