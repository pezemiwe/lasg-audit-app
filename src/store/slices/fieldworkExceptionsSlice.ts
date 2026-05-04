import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { FieldworkException } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type FieldworkExceptionsActions = Pick<
  AuditStore,
  | "addFieldworkException"
  | "updateFieldworkException"
  | "removeFieldworkException"
  | "classifyException"
  | "escalateExceptionToHlg"
  | "getAuditFieldworkExceptions"
>;

export function createFieldworkExceptionsActions(
  set: SetFn,
  get: GetFn,
): FieldworkExceptionsActions {
  return {
    addFieldworkException: (exc) => {
      const s = get();
      const count =
        s.fieldworkExceptions.filter((e) => e.auditId === exc.auditId).length +
        1;
      const audit = s.audits.find((a) => a.id === exc.auditId);
      const lgaName =
        s.lgas
          .find((l) => l.id === audit?.lgaId)
          ?.name?.replace(/\s/g, "")
          .slice(0, 4)
          .toUpperCase() || "AUD";
      const ref = `EXC-${lgaName}-${audit?.year || "2024"}-${String(count).padStart(3, "0")}`;
      const newExc: FieldworkException = {
        ...exc,
        id: uid(),
        ref,
        raisedAt: now(),
      };
      set((st) => ({
        fieldworkExceptions: [...st.fieldworkExceptions, newExc],
        procedureExecutions: st.procedureExecutions.map((pe) =>
          pe.id === exc.procedureId
            ? {
                ...pe,
                exceptionIds: [...pe.exceptionIds, newExc.id],
                status: "Exception Raised" as const,
              }
            : pe,
        ),
      }));
    },

    updateFieldworkException: (id, updates) =>
      set((s) => ({
        fieldworkExceptions: s.fieldworkExceptions.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      })),

    removeFieldworkException: (id) =>
      set((s) => ({
        fieldworkExceptions: s.fieldworkExceptions.filter((e) => e.id !== id),
        procedureExecutions: s.procedureExecutions.map((pe) =>
          pe.exceptionIds.includes(id)
            ? {
                ...pe,
                exceptionIds: pe.exceptionIds.filter((eid) => eid !== id),
              }
            : pe,
        ),
      })),

    classifyException: (id, classification) =>
      set((s) => ({
        fieldworkExceptions: s.fieldworkExceptions.map((e) =>
          e.id === id
            ? { ...e, classification, status: "Classified" as const }
            : e,
        ),
      })),

    escalateExceptionToHlg: (id) =>
      set((s) => ({
        fieldworkExceptions: s.fieldworkExceptions.map((e) =>
          e.id === id
            ? {
                ...e,
                escalatedToHlg: true,
                escalatedAt: now(),
                status: "Escalated" as const,
              }
            : e,
        ),
      })),

    getAuditFieldworkExceptions: (auditId) =>
      get().fieldworkExceptions.filter((e) => e.auditId === auditId),
  };
}
