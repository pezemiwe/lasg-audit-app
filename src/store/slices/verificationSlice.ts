import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  BankAccount,
  ContractFlag,
  VouchingChecklist,
  SiteVerification,
  FieldworkCompletionMemo,
  FieldworkWorkingPaper,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type VerificationActions = Pick<
  AuditStore,
  | "addBankAccount"
  | "updateBankAccount"
  | "getAuditBankAccounts"
  | "addContractFlag"
  | "getAuditContractFlags"
  | "addVouchingChecklist"
  | "updateVouchingChecklist"
  | "getExecutionVouchingChecklist"
  | "addSiteVerification"
  | "updateSiteVerification"
  | "getExecutionSiteVerification"
  | "createFieldworkMemo"
  | "updateFieldworkMemo"
  | "getAuditFieldworkMemo"
  | "generateWorkingPaper"
  | "updateFieldworkWorkingPaper"
  | "getAuditFieldworkWorkingPapers"
>;

export function createVerificationActions(
  set: SetFn,
  get: GetFn,
): VerificationActions {
  return {
    addBankAccount: (account) =>
      set((s) => ({
        bankAccounts: [
          ...s.bankAccounts,
          { ...account, id: uid() } as BankAccount,
        ],
      })),

    updateBankAccount: (id, updates) =>
      set((s) => ({
        bankAccounts: s.bankAccounts.map((b) =>
          b.id === id ? { ...b, ...updates } : b,
        ),
      })),

    getAuditBankAccounts: (auditId) =>
      get().bankAccounts.filter((b) => b.auditId === auditId),

    addContractFlag: (flag) =>
      set((s) => ({
        contractFlags: [
          ...s.contractFlags,
          { ...flag, id: uid() } as ContractFlag,
        ],
      })),

    getAuditContractFlags: (auditId) =>
      get().contractFlags.filter((f) => f.auditId === auditId),

    addVouchingChecklist: (checklist) =>
      set((s) => ({
        vouchingChecklists: [
          ...s.vouchingChecklists,
          { ...checklist, id: uid() } as VouchingChecklist,
        ],
      })),

    updateVouchingChecklist: (id, updates) =>
      set((s) => ({
        vouchingChecklists: s.vouchingChecklists.map((v) =>
          v.id === id ? { ...v, ...updates } : v,
        ),
      })),

    getExecutionVouchingChecklist: (executionId) =>
      get().vouchingChecklists.find(
        (v) => v.procedureExecutionId === executionId,
      ),

    addSiteVerification: (sv) =>
      set((s) => ({
        siteVerifications: [
          ...s.siteVerifications,
          { ...sv, id: uid() } as SiteVerification,
        ],
      })),

    updateSiteVerification: (id, updates) =>
      set((s) => ({
        siteVerifications: s.siteVerifications.map((v) =>
          v.id === id ? { ...v, ...updates } : v,
        ),
      })),

    getExecutionSiteVerification: (executionId) =>
      get().siteVerifications.find(
        (v) => v.procedureExecutionId === executionId,
      ),

    createFieldworkMemo: (memo) =>
      set((s) => ({
        fieldworkMemos: [
          ...s.fieldworkMemos,
          { ...memo, id: uid(), createdAt: now() } as FieldworkCompletionMemo,
        ],
      })),

    updateFieldworkMemo: (id, updates) =>
      set((s) => ({
        fieldworkMemos: s.fieldworkMemos.map((m) =>
          m.id === id ? { ...m, ...updates } : m,
        ),
      })),

    getAuditFieldworkMemo: (auditId) =>
      get().fieldworkMemos.find((m) => m.auditId === auditId),

    generateWorkingPaper: (executionId) => {
      const s = get();
      const pe = s.procedureExecutions.find((p) => p.id === executionId);
      if (!pe) return;
      const programme = s.programmes.find((p) => p.id === pe.programmeId);
      const procedure = programme?.procedures.find(
        (item) => item.id === pe.procedureId,
      );
      const existing = s.fieldworkWorkingPapers.find(
        (wp) => wp.procedureExecutionId === executionId,
      );
      const areaCode = pe.auditArea.replace(/[^A-Z]/g, "").slice(0, 3) || "GEN";
      const wpRef =
        procedure?.workpaperRef ||
        `WP-${areaCode}-${pe.procedureRef.split("-")[1] || "000"}`;
      const exceptions = s.fieldworkExceptions.filter((e) =>
        pe.exceptionIds.includes(e.id),
      );
      const indexedWorkpaperExists = s.auditWorkpapers.some(
        (wp) => wp.auditId === pe.auditId && wp.reference === wpRef,
      );
      const createdAt = now();
      const category =
        pe.natureOfTest === "Analytical"
          ? "Analytical Procedure"
          : "Supporting Schedule";

      set((st) => ({
        fieldworkWorkingPapers: existing
          ? st.fieldworkWorkingPapers
          : [
              ...st.fieldworkWorkingPapers,
              {
                id: uid(),
                auditId: pe.auditId,
                procedureExecutionId: executionId,
                reference: wpRef,
                title: pe.procedureDescription,
                auditArea: pe.auditArea,
                procedureDescription: pe.procedureDescription,
                workPerformed: pe.workPerformed,
                evidenceCodes: pe.evidence.map((ev) => ev.code),
                sampleDetails: pe.sampleSize
                  ? `Population: ${pe.populationSize}, Sample: ${pe.sampleSize}, Method: ${pe.samplingMethod || "N/A"}`
                  : undefined,
                resultsAndAnalysis: pe.conclusionNotes || "",
                conclusion: pe.conclusion || "No Exception",
                exceptionRefs: exceptions.map((e) => e.ref),
                preparedBy: pe.assignedTo,
                preparedAt: createdAt,
                reviewStatus: "Prepared",
              } as FieldworkWorkingPaper,
            ],
        auditWorkpapers: indexedWorkpaperExists
          ? st.auditWorkpapers
          : [
              ...st.auditWorkpapers,
              {
                id: `awp-${uid()}`,
                auditId: pe.auditId,
                reference: wpRef,
                title: pe.procedureDescription,
                category,
                section: pe.auditArea,
                preparedBy: pe.assignedTo,
                preparedAt: createdAt,
                status: "Prepared",
                notes: pe.conclusionNotes || undefined,
              },
            ],
      }));
    },

    updateFieldworkWorkingPaper: (id, updates) =>
      set((s) => ({
        fieldworkWorkingPapers: s.fieldworkWorkingPapers.map((wp) =>
          wp.id === id ? { ...wp, ...updates } : wp,
        ),
      })),

    getAuditFieldworkWorkingPapers: (auditId) =>
      get().fieldworkWorkingPapers.filter((wp) => wp.auditId === auditId),
  };
}
