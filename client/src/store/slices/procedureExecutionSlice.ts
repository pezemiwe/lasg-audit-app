import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  ProcedureExecution,
  ProcedureEvidence,
  ProcedureExecutionStatus,
  ReviewComment,
  RiskMatrix,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type ProcedureExecutionActions = Pick<
  AuditStore,
  | "initProcedureExecutions"
  | "getProcedureExecutions"
  | "getProcedureExecution"
  | "updateProcedureExecution"
  | "addProcedureEvidence"
  | "removeProcedureEvidence"
  | "addProcedureTimeEntry"
  | "submitProcedureForReview"
  | "reviewProcedure"
  | "clearProcedure"
>;

export function createProcedureExecutionActions(
  set: SetFn,
  get: GetFn,
): ProcedureExecutionActions {
  return {
    initProcedureExecutions: (auditId) => {
      const s = get();
      const prog = s.programmes.find((p) => p.auditId === auditId);
      if (!prog) return;
      const existing = s.procedureExecutions.filter(
        (pe) => pe.auditId === auditId,
      );
      if (existing.length > 0) return;

      const risks = s.riskMatrices.filter((r) => r.auditId === auditId);
      const riskMap: Record<string, RiskMatrix> = {};
      risks.forEach((r) => {
        riskMap[r.area] = r;
      });

      const reqs = s.documentRequisitions.filter((r) => r.auditId === auditId);
      const refCounters: Record<string, number> = {};

      const executions: ProcedureExecution[] = prog.procedures.map((proc) => {
        const areaPrefix =
          proc.area.replace(/[^A-Z]/g, "").slice(0, 4) || "GEN";
        refCounters[areaPrefix] = (refCounters[areaPrefix] || 0) + 1;
        const ref = `${areaPrefix}-${String(refCounters[areaPrefix]).padStart(3, "0")}`;
        const linkedReqs = reqs.filter((r) =>
          r.linkedProcedureIds.includes(proc.id),
        );
        const allReceived =
          linkedReqs.length === 0 ||
          linkedReqs.every((r) => r.status === "Received");
        const risk = riskMap[proc.area];
        const budgetedHours =
          risk?.overallRisk === "Critical"
            ? 8
            : risk?.overallRisk === "High"
              ? 6
              : risk?.overallRisk === "Medium"
                ? 4
                : 2;
        return {
          id: uid(),
          auditId,
          programmeId: prog.id,
          procedureId: proc.id,
          procedureRef: ref,
          procedureDescription: proc.procedure,
          auditArea: proc.area,
          assertions: proc.assertion ? [proc.assertion] : [],
          riskRating: risk?.overallRisk || ("Medium" as const),
          assignedTo: proc.assignedTo || "",
          dueDate: new Date(Date.now() + 14 * 86400000)
            .toISOString()
            .split("T")[0],
          status: (allReceived
            ? "Not Started"
            : "Locked") as ProcedureExecutionStatus,
          budgetedHours,
          timeEntries: [],
          loggedHours: 0,
          evidence: [],
          workPerformed: "",
          exceptionIds: [],
          createdAt: now(),
        };
      });
      set((st) => ({
        procedureExecutions: [...st.procedureExecutions, ...executions],
      }));
    },

    getProcedureExecutions: (auditId) =>
      get().procedureExecutions.filter((pe) => pe.auditId === auditId),

    getProcedureExecution: (id) =>
      get().procedureExecutions.find((pe) => pe.id === id),

    updateProcedureExecution: (id, updates) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((pe) =>
          pe.id === id ? { ...pe, ...updates } : pe,
        ),
      })),

    addProcedureEvidence: (executionId, evidence) => {
      const pe = get().procedureExecutions.find((p) => p.id === executionId);
      if (!pe) return;
      const areaCode = pe.auditArea.replace(/[^A-Z]/g, "").slice(0, 4) || "GEN";
      const evIdx = pe.evidence.length + 1;
      const code = `EV-${areaCode}-${pe.procedureRef.split("-")[1] || "000"}-${String.fromCharCode(64 + evIdx)}`;
      const newEv: ProcedureEvidence = {
        ...evidence,
        id: uid(),
        code,
      } as ProcedureEvidence;
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((p) =>
          p.id === executionId ? { ...p, evidence: [...p.evidence, newEv] } : p,
        ),
      }));
    },

    removeProcedureEvidence: (executionId, evidenceId) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((p) =>
          p.id === executionId
            ? {
                ...p,
                evidence: p.evidence.filter((ev) => ev.id !== evidenceId),
              }
            : p,
        ),
      })),

    addProcedureTimeEntry: (executionId, minutes) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((pe) =>
          pe.id === executionId
            ? {
                ...pe,
                timeEntries: [
                  ...pe.timeEntries,
                  { id: uid(), startedAt: now(), minutes },
                ],
                loggedHours: pe.loggedHours + minutes / 60,
              }
            : pe,
        ),
      })),

    submitProcedureForReview: (executionId) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((pe) =>
          pe.id === executionId
            ? { ...pe, status: "Submitted" as const, submittedAt: now() }
            : pe,
        ),
      })),

    reviewProcedure: (executionId, reviewerId, action, comments) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((pe) => {
          if (pe.id !== executionId) return pe;
          const comment: ReviewComment | undefined = comments
            ? {
                id: uid(),
                authorId: reviewerId,
                authorName:
                  s.users.find((u) => u.id === reviewerId)?.name || reviewerId,
                authorRole:
                  s.users.find((u) => u.id === reviewerId)?.role ||
                  "AUDIT_LEAD",
                message: comments,
                timestamp: now(),
                resolved: false,
              }
            : undefined;
          const existingComments = pe.reviewComments || [];
          if (action === "Clear")
            return {
              ...pe,
              status: "Reviewed" as const,
              reviewedBy: reviewerId,
              reviewedAt: now(),
              reviewComments: comment
                ? [...existingComments, comment]
                : existingComments,
            };
          return {
            ...pe,
            status: "In Progress" as const,
            reviewComments: comment
              ? [...existingComments, comment]
              : existingComments,
          };
        }),
      })),

    clearProcedure: (executionId, supervisorId) =>
      set((s) => ({
        procedureExecutions: s.procedureExecutions.map((pe) =>
          pe.id === executionId
            ? {
                ...pe,
                status: "Cleared" as const,
                clearedBy: supervisorId,
                clearedAt: now(),
              }
            : pe,
        ),
      })),
  };
}
