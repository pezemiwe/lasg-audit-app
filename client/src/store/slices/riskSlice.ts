import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { RiskMatrix } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;

export type RiskActions = Pick<
  AuditStore,
  "addRiskMatrix" | "updateRiskMatrix" | "clearAllMitigations"
>;

export function createRiskActions(set: SetFn): RiskActions {
  return {
    addRiskMatrix: (rm) => {
      const record: RiskMatrix = {
        ...rm,
        id: `rm-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ riskMatrices: [...s.riskMatrices, record] }));
    },

    updateRiskMatrix: (id, updates) => {
      set((s) => ({
        riskMatrices: s.riskMatrices.map((rm) =>
          rm.id === id ? { ...rm, ...updates } : rm,
        ),
      }));
    },

    clearAllMitigations: (auditId) => {
      set((s) => ({
        riskMatrices: s.riskMatrices.map((rm) =>
          rm.auditId === auditId ? { ...rm, mitigationPlan: "" } : rm,
        ),
      }));
    },
  };
}
