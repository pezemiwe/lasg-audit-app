import React from "react";
import { AlertCircle } from "lucide-react";
import { useAuditStore } from "../../../store/useAuditStore";
import MaterialityCalculator from "../../../components/AuditOutcomes/MaterialityCalculator";
import type { AuditOutcome } from "../../../types/auditOutcomes";
import EmptyState from "./EmptyState";

const MaterialityTab: React.FC<{
  outcome: AuditOutcome;
  userId: string;
  canApprove: boolean;
}> = ({ outcome, userId, canApprove }) => {
  const store = useAuditStore();
  const tb = store.trialBalances?.find((x) =>
    outcome.trialBalanceIds.includes(x.id),
  );
  const existing = store.materialityCalcs?.find(
    (x) => x.id === outcome.materialityCalcId,
  );

  if (!tb) {
    return (
      <EmptyState
        icon={<AlertCircle size={28} />}
        title="Upload a Trial Balance first"
        message="Materiality derives from Profit Before Tax computed from the trial balance."
      />
    );
  }

  return (
    <MaterialityCalculator
      auditOutcomeId={outcome.id}
      auditId={outcome.auditId}
      userId={userId}
      profitBeforeTax={tb.profitBeforeTax}
      existing={existing}
      canApprove={canApprove}
      onSave={(calc) => store.setMaterialityCalc(calc)}
      onApprove={() =>
        existing && store.approveMateriality(existing.id, userId)
      }
    />
  );
};

export default MaterialityTab;
