import React, { useEffect, useState } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import SignaturePad from "../../../components/AuditOutcomes/SignaturePad";
import type { AuditOutcome } from "../../../types/auditOutcomes";
import Card from "./Card";
import EmptyState from "./EmptyState";
import LabeledTextarea from "./LabeledTextarea";
import { primaryBtn } from "../utils/styles";

const ResponsibilityTab: React.FC<{
  outcome: AuditOutcome;
  canEdit: boolean;
}> = ({ outcome, canEdit }) => {
  const store = useAuditStore();
  const sor = store.statementsOfResponsibility?.find(
    (x) => x.id === outcome.statementOfResponsibilityId,
  );
  const [preamble, setPreamble] = useState(sor?.preamble || "");
  const [body, setBody] = useState(sor?.responsibilityText || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreamble(sor?.preamble || "");
      setBody(sor?.responsibilityText || "");
    }, 0);
    return () => clearTimeout(timer);
  }, [sor?.id, sor?.preamble, sor?.responsibilityText]);

  if (!sor) return <EmptyState title="Statement of Responsibility not found" />;

  const handleSave = () => {
    store.saveStatementOfResponsibility({
      ...sor,
      preamble,
      responsibilityText: body,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Card
      title="Statement of Financial Responsibility"
      subtitle="Treasurer and Audit Lead jointly acknowledge responsibility for preparation and fair presentation of the financial statements."
      actions={
        canEdit && (
          <button type="button" onClick={handleSave} style={primaryBtn}>
            Save
          </button>
        )
      }
    >
      <LabeledTextarea
        label="Preamble"
        value={preamble}
        onChange={setPreamble}
        rows={3}
        disabled={!canEdit}
      />
      <LabeledTextarea
        label="Responsibility Statement"
        value={body}
        onChange={setBody}
        rows={8}
        disabled={!canEdit}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 16,
        }}
      >
        <SignaturePad
          label="Treasurer"
          role="TREASURER"
          defaultTitle="Treasurer, Local Government Council"
          value={sor.treasurerSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveStatementOfResponsibility({
              ...sor,
              treasurerSignature: sig,
              updatedAt: new Date().toISOString(),
            })
          }
        />
        <SignaturePad
          label="Audit Lead"
          role="AUDIT_LEAD"
          defaultTitle="Audit Lead"
          value={sor.auditLeadSignature}
          disabled={!canEdit}
          onChange={(sig) =>
            store.saveStatementOfResponsibility({
              ...sor,
              auditLeadSignature: sig,
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </div>
    </Card>
  );
};

export default ResponsibilityTab;
