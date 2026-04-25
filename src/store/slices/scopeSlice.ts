import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { ScopeAgreement, ScopeAgreementRow } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type ScopeActions = Pick<
  AuditStore,
  | "createScopeAgreement"
  | "updateScopeAgreement"
  | "signOffScope"
  | "addScopeRow"
>;

export function createScopeActions(set: SetFn, get: GetFn): ScopeActions {
  return {
    createScopeAgreement: (data) => {
      const sa: ScopeAgreement = {
        ...data,
        id: `scope-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ scopeAgreements: [...s.scopeAgreements, sa] }));
      get().addToast({ type: "success", title: "Scope Agreement Created" });
    },

    updateScopeAgreement: (id, updates) =>
      set((s) => ({
        scopeAgreements: s.scopeAgreements.map((sa) =>
          sa.id === id ? { ...sa, ...updates } : sa,
        ),
      })),

    signOffScope: (id, party, name) => {
      set((s) => ({
        scopeAgreements: s.scopeAgreements.map((sa) => {
          if (sa.id !== id) return sa;
          const signOff = { name, timestamp: now() };
          const updatedRows = sa.rows.map((r) =>
            party === "auditor"
              ? { ...r, auditorSignOff: signOff }
              : { ...r, lgaSignOff: signOff },
          );
          const allSigned = updatedRows.every(
            (r) => r.auditorSignOff && r.lgaSignOff,
          );
          return {
            ...sa,
            rows: updatedRows,
            status: allSigned
              ? ("Fully Approved" as const)
              : ("Pending LGA" as const),
          };
        }),
      }));
      get().addToast({
        type: "success",
        title: `${party === "auditor" ? "Auditor" : "LGA"} Sign-Off Recorded`,
      });
    },

    addScopeRow: (agreementId, row) => {
      const newRow: ScopeAgreementRow = { ...row, id: `sr-${uid()}` };
      set((s) => ({
        scopeAgreements: s.scopeAgreements.map((sa) => {
          if (sa.id !== agreementId) return sa;
          const rows = [...sa.rows, newRow];
          return {
            ...sa,
            rows,
            totalWeeks: rows.reduce((sum, r) => sum + r.timelineWeeks, 0),
          };
        }),
      }));
    },
  };
}
