import React, { useEffect, useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import SignaturePad from "../../../components/AuditOutcomes/SignaturePad";
import SectionBuilder, {
  type EditableSection,
} from "../../../components/AuditOutcomes/SectionBuilder";
import type { AuditOutcome } from "../../../types/auditOutcomes";
import Card from "./Card";
import EmptyState from "./EmptyState";
import { primaryBtn } from "../utils/styles";

const PoliciesTab: React.FC<{ outcome: AuditOutcome; canEdit: boolean }> = ({
  outcome,
  canEdit,
}) => {
  const store = useAuditStore();
  const ap = store.accountingPolicies?.find(
    (x) => x.id === outcome.accountingPoliciesId,
  );
  const [sections, setSections] = useState<EditableSection[]>(
    ap?.policies.map((p) => ({
      id: p.id,
      order: p.order,
      header: p.title,
      description: p.body,
      bullets: p.bullets,
      table: p.table,
    })) || [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSections(
        ap?.policies.map((p) => ({
          id: p.id,
          order: p.order,
          header: p.title,
          description: p.body,
          bullets: p.bullets,
          table: p.table,
        })) || [],
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [ap?.id, ap?.policies]);

  if (!ap) return <EmptyState title="Accounting Policies not found" />;

  const handleSave = () => {
    store.saveAccountingPolicies({
      ...ap,
      policies: sections.map((s, i) => ({
        id: s.id,
        order: i + 1,
        title: s.header,
        body: s.description,
        bullets: s.bullets,
        table: s.table,
      })),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Card
      title="Accounting Policies: IPSAS Accrual"
      subtitle="The Audit Supervisor drafts, reviews and signs off the accounting policies applied in preparing the consolidated financial statements."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save Policies
          </button>
        )
      }
    >
      <SectionBuilder
        sections={sections}
        onChange={setSections}
        showRecommendation={false}
        headerLabel="Policy Title"
        descriptionLabel="Policy Body"
        readOnly={!canEdit}
      />

      <div style={{ marginTop: 18 }}>
        <SignaturePad
          label="Audit Supervisor Sign-off"
          role="AUDIT_SUPERVISOR"
          defaultTitle="Audit Supervisor"
          value={ap.supervisorSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveAccountingPolicies({
              ...ap,
              supervisorSignature: sig,
              status: "Approved",
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </div>
    </Card>
  );
};

export default PoliciesTab;
