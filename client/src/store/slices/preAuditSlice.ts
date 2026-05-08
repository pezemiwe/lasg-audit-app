import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  EntityProfile,
  IndependenceDeclaration,
  PreliminaryAnalytic,
  AuditStrategy,
  AnalyticFlag,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type PreAuditActions = Pick<
  AuditStore,
  | "saveEntityProfile"
  | "getEntityProfile"
  | "addIndependenceDeclaration"
  | "getIndependenceDeclarations"
  | "addPreliminaryAnalytic"
  | "getAuditAnalytics"
  | "generatePreliminaryAnalytics"
  | "updateAnalyticNote"
  | "saveAuditStrategy"
  | "getAuditStrategy"
  | "updateAuditStrategy"
>;

export function createPreAuditActions(set: SetFn, get: GetFn): PreAuditActions {
  return {
    saveEntityProfile: (data) => {
      set((s) => {
        const existing = s.entityProfiles.find(
          (p) => p.auditId === data.auditId,
        );
        const profile: EntityProfile = {
          ...data,
          id: existing ? existing.id : `ep-${uid()}`,
          createdAt: existing ? existing.createdAt : now(),
        };
        return {
          entityProfiles: existing
            ? s.entityProfiles.map((p) =>
                p.auditId === data.auditId ? profile : p,
              )
            : [...s.entityProfiles, profile],
        };
      });
      get().addToast({ type: "success", title: "Entity Profile Saved" });
    },

    getEntityProfile: (auditId) =>
      get().entityProfiles.find((p) => p.auditId === auditId),

    addIndependenceDeclaration: (data) => {
      const decl: IndependenceDeclaration = { ...data, id: `ind-${uid()}` };
      set((s) => ({
        independenceDeclarations: [...s.independenceDeclarations, decl],
      }));
      get().addToast({
        type: "success",
        title: "Independence Declaration Filed",
      });
      get().logActivity({
        userId: data.auditorId,
        action: "INDEPENDENCE_DECLARATION",
        details: `${data.auditorName} filed independence declaration`,
        entityType: "audit",
        entityId: data.auditId,
      });
    },

    getIndependenceDeclarations: (auditId) =>
      get().independenceDeclarations.filter((d) => d.auditId === auditId),

    addPreliminaryAnalytic: (data) => {
      const analytic: PreliminaryAnalytic = {
        ...data,
        id: `pa-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({
        preliminaryAnalytics: [...s.preliminaryAnalytics, analytic],
      }));
    },

    getAuditAnalytics: (auditId) =>
      get().preliminaryAnalytics.filter((a) => a.auditId === auditId),

    generatePreliminaryAnalytics: (auditId, preparedBy) => {
      const existing = get().preliminaryAnalytics.filter(
        (a) => a.auditId === auditId,
      );
      if (existing.length > 0) return;

      const computeFlag = (variance: number): AnalyticFlag => {
        if (variance > 15) return "Investigate";
        if (variance > 5) return "Adverse";
        if (variance < -5) return "Favorable";
        return "Neutral";
      };

      const metrics: Omit<PreliminaryAnalytic, "id" | "createdAt">[] = [
        {
          auditId,
          category: "Revenue",
          metric: "FAAC Allocation",
          priorYear: 2_850_000_000,
          currentYear: 3_120_000_000,
          variance: 270_000_000,
          variancePercent: 9.47,
          flag: "Neutral",
          preparedBy,
        },
        {
          auditId,
          category: "Revenue",
          metric: "Internally Generated Revenue (IGR)",
          priorYear: 680_000_000,
          currentYear: 540_000_000,
          variance: -140_000_000,
          variancePercent: -20.59,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Revenue",
          metric: "Grants & Transfers",
          priorYear: 320_000_000,
          currentYear: 410_000_000,
          variance: 90_000_000,
          variancePercent: 28.13,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Expenditure",
          metric: "Personnel Costs",
          priorYear: 1_750_000_000,
          currentYear: 1_920_000_000,
          variance: 170_000_000,
          variancePercent: 9.71,
          flag: "Adverse",
          preparedBy,
        },
        {
          auditId,
          category: "Expenditure",
          metric: "Overhead Costs",
          priorYear: 450_000_000,
          currentYear: 620_000_000,
          variance: 170_000_000,
          variancePercent: 37.78,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Expenditure",
          metric: "Capital Expenditure",
          priorYear: 980_000_000,
          currentYear: 850_000_000,
          variance: -130_000_000,
          variancePercent: -13.27,
          flag: "Favorable",
          preparedBy,
        },
        {
          auditId,
          category: "Balance Sheet",
          metric: "Total Assets",
          priorYear: 5_200_000_000,
          currentYear: 5_450_000_000,
          variance: 250_000_000,
          variancePercent: 4.81,
          flag: "Neutral",
          preparedBy,
        },
        {
          auditId,
          category: "Balance Sheet",
          metric: "Total Liabilities",
          priorYear: 1_100_000_000,
          currentYear: 1_580_000_000,
          variance: 480_000_000,
          variancePercent: 43.64,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Balance Sheet",
          metric: "Cash & Bank Balances",
          priorYear: 420_000_000,
          currentYear: 180_000_000,
          variance: -240_000_000,
          variancePercent: -57.14,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Ratio",
          metric: "Personnel Cost / Total Revenue",
          priorYear: 45,
          currentYear: 47,
          variance: 2,
          variancePercent: 4.44,
          flag: "Neutral",
          preparedBy,
        },
        {
          auditId,
          category: "Ratio",
          metric: "IGR / Total Revenue",
          priorYear: 18,
          currentYear: 13,
          variance: -5,
          variancePercent: -27.78,
          flag: "Investigate",
          preparedBy,
        },
        {
          auditId,
          category: "Ratio",
          metric: "Capital Execution Rate",
          priorYear: 72,
          currentYear: 58,
          variance: -14,
          variancePercent: -19.44,
          flag: "Adverse",
          preparedBy,
        },
      ];

      metrics.forEach((m) => {
        m.flag = computeFlag(Math.abs(m.variancePercent));
        get().addPreliminaryAnalytic(m);
      });

      get().addToast({
        type: "success",
        title: "Analytics Generated",
        message: `${metrics.length} preliminary analytics computed`,
      });
      get().logActivity({
        userId: preparedBy,
        action: "GENERATE_ANALYTICS",
        details: "Preliminary analytical procedures computed",
        entityType: "audit",
        entityId: auditId,
      });
    },

    updateAnalyticNote: (id, note) =>
      set((s) => ({
        preliminaryAnalytics: s.preliminaryAnalytics.map((a) =>
          a.id === id ? { ...a, investigationNote: note } : a,
        ),
      })),

    saveAuditStrategy: (data) => {
      set((s) => {
        const existing = s.auditStrategies.find(
          (st) => st.auditId === data.auditId,
        );
        const strategy: AuditStrategy = {
          ...data,
          id: existing ? existing.id : `strat-${uid()}`,
          createdAt: existing ? existing.createdAt : now(),
        };
        return {
          auditStrategies: existing
            ? s.auditStrategies.map((st) =>
                st.auditId === data.auditId ? strategy : st,
              )
            : [...s.auditStrategies, strategy],
        };
      });
      get().addToast({ type: "success", title: "Audit Strategy Saved" });
    },

    getAuditStrategy: (auditId) =>
      get().auditStrategies.find((st) => st.auditId === auditId),

    updateAuditStrategy: (id, updates) =>
      set((s) => ({
        auditStrategies: s.auditStrategies.map((st) =>
          st.id === id ? { ...st, ...updates } : st,
        ),
      })),
  };
}
