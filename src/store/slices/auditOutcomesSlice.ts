import { now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { AuditOutcome } from "../../types/auditOutcomes";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;

export type AuditOutcomesActions = Pick<
  AuditStore,
  | "uploadTrialBalance"
  | "removeTrialBalance"
  | "setMaterialityCalc"
  | "approveMateriality"
  | "saveStatementOfResponsibility"
  | "saveAuditReportDocument"
  | "saveAccountingPolicies"
  | "saveFinancialStatement"
  | "upsertLgaAuditPackage"
  | "markCompilationComplete"
>;

export function createAuditOutcomesActions(set: SetFn): AuditOutcomesActions {
  return {
    uploadTrialBalance: (tb) =>
      set((s) => {
        const existing = s.trialBalances.find((x) => x.id === tb.id);
        const trialBalances = existing
          ? s.trialBalances.map((x) => (x.id === tb.id ? tb : x))
          : [...s.trialBalances, tb];
        const auditOutcomes = s.auditOutcomes.map((o) =>
          o.id === tb.auditOutcomeId
            ? {
                ...o,
                trialBalanceIds: Array.from(
                  new Set([...o.trialBalanceIds, tb.id]),
                ),
                updatedAt: now(),
              }
            : o,
        );
        return { trialBalances, auditOutcomes };
      }),

    removeTrialBalance: (id) =>
      set((s) => ({
        trialBalances: s.trialBalances.filter((t) => t.id !== id),
        auditOutcomes: s.auditOutcomes.map((o) => ({
          ...o,
          trialBalanceIds: o.trialBalanceIds.filter((x) => x !== id),
        })),
      })),

    setMaterialityCalc: (calc) =>
      set((s) => {
        const existing = s.materialityCalcs.find((x) => x.id === calc.id);
        const materialityCalcs = existing
          ? s.materialityCalcs.map((x) => (x.id === calc.id ? calc : x))
          : [...s.materialityCalcs, calc];
        const auditOutcomes = s.auditOutcomes.map((o) =>
          o.id === calc.auditOutcomeId
            ? { ...o, materialityCalcId: calc.id, updatedAt: now() }
            : o,
        );
        return { materialityCalcs, auditOutcomes };
      }),

    approveMateriality: (id, userId) =>
      set((s) => ({
        materialityCalcs: s.materialityCalcs.map((m) =>
          m.id === id
            ? { ...m, approvedBy: userId, approvedAt: now(), locked: true }
            : m,
        ),
      })),

    saveStatementOfResponsibility: (sor) =>
      set((s) => {
        const existing = s.statementsOfResponsibility.find(
          (x) => x.id === sor.id,
        );
        const statementsOfResponsibility = existing
          ? s.statementsOfResponsibility.map((x) => (x.id === sor.id ? sor : x))
          : [...s.statementsOfResponsibility, sor];
        const auditOutcomes = s.auditOutcomes.map((o) =>
          o.id === sor.auditOutcomeId
            ? {
                ...o,
                statementOfResponsibilityId: sor.id,
                updatedAt: now(),
              }
            : o,
        );
        return { statementsOfResponsibility, auditOutcomes };
      }),

    saveAuditReportDocument: (doc) =>
      set((s) => {
        const existing = s.auditReportDocuments.find((x) => x.id === doc.id);
        const auditReportDocuments = existing
          ? s.auditReportDocuments.map((x) => (x.id === doc.id ? doc : x))
          : [...s.auditReportDocuments, doc];
        const auditOutcomes = s.auditOutcomes.map((o) =>
          o.id === doc.auditOutcomeId
            ? {
                ...o,
                auditReportIds: Array.from(
                  new Set([...o.auditReportIds, doc.id]),
                ),
                updatedAt: now(),
              }
            : o,
        );
        return { auditReportDocuments, auditOutcomes };
      }),

    saveAccountingPolicies: (ap) =>
      set((s) => {
        const existing = s.accountingPolicies.find((x) => x.id === ap.id);
        const accountingPolicies = existing
          ? s.accountingPolicies.map((x) => (x.id === ap.id ? ap : x))
          : [...s.accountingPolicies, ap];
        const auditOutcomes = s.auditOutcomes.map((o) =>
          o.id === ap.auditOutcomeId
            ? { ...o, accountingPoliciesId: ap.id, updatedAt: now() }
            : o,
        );
        return { accountingPolicies, auditOutcomes };
      }),

    saveFinancialStatement: (fs) =>
      set((s) => {
        const existing = s.auditedFinancialStatements.find(
          (x) => x.id === fs.id,
        );
        const auditedFinancialStatements = existing
          ? s.auditedFinancialStatements.map((x) => (x.id === fs.id ? fs : x))
          : [...s.auditedFinancialStatements, fs];
        const auditOutcomes = s.auditOutcomes.map((o) => {
          if (o.id !== fs.auditOutcomeId) return o;
          const patch: Partial<AuditOutcome> = {};
          if (fs.kind === "StatementOfFinancialPosition")
            patch.consolidatedSofpId = fs.id;
          else if (fs.kind === "StatementOfFinancialPerformance")
            patch.consolidatedSofPerfId = fs.id;
          else if (fs.kind === "CashFlowStatement")
            patch.consolidatedCashFlowId = fs.id;
          else if (fs.kind === "NotesToTheAccounts")
            patch.consolidatedNotesId = fs.id;
          return { ...o, ...patch, updatedAt: now() };
        });
        return { auditedFinancialStatements, auditOutcomes };
      }),

    upsertLgaAuditPackage: (pkg) =>
      set((s) => {
        const existing = s.lgaAuditPackages.find((x) => x.id === pkg.id);
        return {
          lgaAuditPackages: existing
            ? s.lgaAuditPackages.map((x) => (x.id === pkg.id ? pkg : x))
            : [...s.lgaAuditPackages, pkg],
        };
      }),

    markCompilationComplete: (outcomeId, pageCount) =>
      set((s) => ({
        auditOutcomes: s.auditOutcomes.map((o) =>
          o.id === outcomeId
            ? {
                ...o,
                compiledPdfGeneratedAt: now(),
                compiledPageCount: pageCount,
                status: "Final",
                updatedAt: now(),
              }
            : o,
        ),
      })),
  };
}
