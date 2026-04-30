import React from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import TrialBalanceUpload from "../../../components/AuditOutcomes/TrialBalanceUpload";
import type { AuditOutcome } from "../../../types/auditOutcomes";
import Card from "./Card";

const TrialBalanceTab: React.FC<{ outcome: AuditOutcome; userId: string }> = ({
  outcome,
  userId,
}) => {
  const store = useAuditStore();
  const existing = store.trialBalances?.find((tb) =>
    outcome.trialBalanceIds.includes(tb.id),
  );

  return (
    <Card
      title="Trial Balance: Current & Prior Year"
      subtitle={`Upload unaudited trial balance for Year ${outcome.auditYear} with ${outcome.auditYear - 1} comparatives. The engine parses NCOA-coded account lines, classifies them, and derives PBT for materiality.`}
    >
      <TrialBalanceUpload
        auditOutcomeId={outcome.id}
        auditId={outcome.auditId}
        userId={userId}
        currentYear={outcome.auditYear}
        priorYear={outcome.auditYear - 1}
        existing={existing}
        onUploaded={(tb) => store.uploadTrialBalance(tb)}
        onReset={() => {
          if (existing) store.removeTrialBalance(existing.id);
        }}
      />
    </Card>
  );
};

export default TrialBalanceTab;
