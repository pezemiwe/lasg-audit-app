import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { FileSignature, Plus } from "lucide-react";
import s from "../../styles/pages.module.css";
import ScopeKpis from "../../features/scope-agreement/components/ScopeKpis";
import ScopeAgreementCard from "../../features/scope-agreement/components/ScopeAgreementCard";

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
    const agreement = scopeAgreements.find((sa) => sa.id === agreementId);
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

      <ScopeKpis scopeAgreements={scopeAgreements} />

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
        return (
          <ScopeAgreementCard
            key={agreement.id}
            agreement={agreement}
            audit={audit}
            lga={lga}
            isExpanded={isExpanded}
            toggleExpanded={() =>
              setExpandedId(isExpanded ? null : agreement.id)
            }
            isAuditor={isAuditor}
            isLGA={isLGA}
            showAddRow={showAddRow && isExpanded}
            setShowAddRow={setShowAddRow}
            newRow={newRow}
            setNewRow={setNewRow}
            onAddRow={handleAddRow}
            onSignOff={handleSignOff}
          />
        );
      })}
    </div>
  );
};

export default ScopeAgreementPage;
