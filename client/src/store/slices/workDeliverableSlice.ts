import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  AuditJournal,
  AuditComment,
  AuditWorkpaper,
  MaterialityThreshold,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type WorkDeliverableActions = Pick<
  AuditStore,
  | "addAuditJournal"
  | "updateAuditJournal"
  | "getAuditJournals"
  | "addAuditComment"
  | "updateAuditComment"
  | "getAuditComments"
  | "updateFinancialStatement"
  | "getAuditFinancialStatements"
  | "toggleCompletionItem"
  | "getAuditCompletionChecklist"
  | "addAuditWorkpaper"
  | "updateAuditWorkpaper"
  | "getAuditWorkpaperIndex"
  | "setAuditMateriality"
  | "getAuditMateriality"
  | "getMandateLetters"
  | "getAuditRiskMatrices"
>;

export function createWorkDeliverableActions(
  set: SetFn,
  get: GetFn,
): WorkDeliverableActions {
  return {
    addAuditJournal: (data) => {
      const journal: AuditJournal = {
        ...data,
        id: `aj-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ auditJournals: [...s.auditJournals, journal] }));
      get().addToast({
        type: "success",
        title: "Audit Journal Added",
        message: journal.journalNumber,
      });
    },

    updateAuditJournal: (id, updates) =>
      set((s) => ({
        auditJournals: s.auditJournals.map((j) =>
          j.id === id ? { ...j, ...updates } : j,
        ),
      })),

    getAuditJournals: (auditId) =>
      get().auditJournals.filter((j) => j.auditId === auditId),

    addAuditComment: (data) => {
      const comment: AuditComment = {
        ...data,
        id: `ac-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ auditComments: [...s.auditComments, comment] }));
      get().addToast({
        type: "success",
        title: "Audit Comment Added",
        message: comment.referenceNumber,
      });
    },

    updateAuditComment: (id, updates) =>
      set((s) => ({
        auditComments: s.auditComments.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),

    getAuditComments: (auditId) =>
      get().auditComments.filter((c) => c.auditId === auditId),

    updateFinancialStatement: (id, updates) =>
      set((s) => ({
        financialStatements: s.financialStatements.map((f) =>
          f.id === id ? { ...f, ...updates } : f,
        ),
      })),

    getAuditFinancialStatements: (auditId) =>
      get().financialStatements.filter((f) => f.auditId === auditId),

    toggleCompletionItem: (id, userId) =>
      set((s) => ({
        completionChecklist: s.completionChecklist.map((c) =>
          c.id === id
            ? {
                ...c,
                completed: !c.completed,
                completedBy: !c.completed ? userId : undefined,
                completedAt: !c.completed ? now() : undefined,
              }
            : c,
        ),
      })),

    getAuditCompletionChecklist: (auditId) =>
      get().completionChecklist.filter((c) => c.auditId === auditId),

    addAuditWorkpaper: (data) => {
      const wp: AuditWorkpaper = { ...data, id: `awp-${uid()}` };
      set((s) => ({ auditWorkpapers: [...s.auditWorkpapers, wp] }));
      get().addToast({
        type: "success",
        title: "Workpaper Indexed",
        message: wp.reference,
      });
    },

    updateAuditWorkpaper: (id, updates) =>
      set((s) => ({
        auditWorkpapers: s.auditWorkpapers.map((w) =>
          w.id === id ? { ...w, ...updates } : w,
        ),
      })),

    getAuditWorkpaperIndex: (auditId) =>
      get().auditWorkpapers.filter((w) => w.auditId === auditId),

    setAuditMateriality: (data) => {
      set((s) => {
        const existing = s.materiality.find((m) => m.auditId === data.auditId);
        const newItem: MaterialityThreshold = {
          ...data,
          id: existing ? existing.id : `mat-${uid()}`,
          createdAt: existing ? existing.createdAt : new Date().toISOString(),
        };
        return {
          materiality: existing
            ? s.materiality.map((m) =>
                m.auditId === data.auditId ? newItem : m,
              )
            : [...s.materiality, newItem],
        };
      });
      get().addToast({
        type: "success",
        title: "Materiality Saved",
        message: "Materiality thresholds have been updated.",
      });
    },

    getAuditMateriality: (auditId) =>
      get().materiality.find((m) => m.auditId === auditId),

    getMandateLetters: (mandateId) =>
      get().letters.filter((l) => l.mandateId === mandateId),

    getAuditRiskMatrices: (auditId) =>
      get().riskMatrices.filter((r) => r.auditId === auditId),
  };
}
