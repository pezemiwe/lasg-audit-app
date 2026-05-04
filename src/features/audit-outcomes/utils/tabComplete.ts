import type { AuditOutcome } from "../../../types/auditOutcomes";
import type { useAuditStore } from "../../../store/useAuditStore";

export type TabKey =
  | "trial-balance"
  | "materiality"
  | "responsibility"
  | "report"
  | "policies"
  | "statements"
  | "compile";

type StoreT = ReturnType<typeof useAuditStore.getState>;

export function isTabComplete(
  tab: TabKey,
  outcome: AuditOutcome,
  store: StoreT,
): boolean {
  switch (tab) {
    case "trial-balance":
      return outcome.trialBalanceIds.length > 0;
    case "materiality":
      return !!outcome.materialityCalcId;
    case "responsibility": {
      const sor = store.statementsOfResponsibility?.find(
        (x) => x.id === outcome.statementOfResponsibilityId,
      );
      return (
        !!sor?.treasurerSignature?.signedAt &&
        !!sor?.auditLeadSignature?.signedAt
      );
    }
    case "report": {
      const rpt = store.auditReportDocuments?.find((x) =>
        outcome.auditReportIds.includes(x.id),
      );
      return !!rpt?.auditorGeneralSignature?.signedAt;
    }
    case "policies": {
      const ap = store.accountingPolicies?.find(
        (x) => x.id === outcome.accountingPoliciesId,
      );
      return !!ap?.supervisorSignature?.signedAt;
    }
    case "statements":
      return (
        !!outcome.consolidatedSofpId &&
        !!outcome.consolidatedSofPerfId &&
        !!outcome.consolidatedCashFlowId &&
        !!outcome.consolidatedNotesId
      );
    case "compile":
      return !!outcome.compiledPdfGeneratedAt;
    default:
      return false;
  }
}
