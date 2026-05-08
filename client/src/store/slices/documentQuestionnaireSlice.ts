import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  DocumentUpload,
  DocumentUploadStatus,
  StageApproval,
  InternalControlTest,
  SubstantiveTest,
  QuestionnaireResponse,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type DocumentQuestionnaireActions = Pick<
  AuditStore,
  | "saveQuestionnaireResponse"
  | "deleteQuestionnaireResponse"
  | "getAuditResponses"
  | "uploadDocument"
  | "reviewDocument"
  | "getDocumentsForLga"
  | "getDocumentsForMandate"
  | "submitStageApproval"
  | "reviewStageApproval"
  | "getAuditApprovals"
  | "addControlTest"
  | "addSubstantiveTest"
  | "getAuditControlTests"
  | "getAuditSubstantiveTests"
  | "getAuditFraudFlags"
>;

export function createDocumentQuestionnaireActions(
  set: SetFn,
  get: GetFn,
): DocumentQuestionnaireActions {
  return {
    saveQuestionnaireResponse: (data) => {
      const existing = get().questionnaireResponses.find(
        (r) => r.auditId === data.auditId && r.questionId === data.questionId,
      );
      if (existing) {
        set((s) => ({
          questionnaireResponses: s.questionnaireResponses.map((r) =>
            r.id === existing.id
              ? {
                  ...r,
                  answer: data.answer,
                  otherExplanation: data.otherExplanation,
                  answeredAt: now(),
                }
              : r,
          ),
        }));
      } else {
        const resp: QuestionnaireResponse = {
          ...data,
          id: `qr-${uid()}`,
          answeredAt: now(),
        };
        set((s) => ({
          questionnaireResponses: [...s.questionnaireResponses, resp],
        }));
      }
    },

    deleteQuestionnaireResponse: (auditId, questionId) =>
      set((s) => ({
        questionnaireResponses: s.questionnaireResponses.filter(
          (r) => !(r.auditId === auditId && r.questionId === questionId),
        ),
      })),

    getAuditResponses: (auditId) =>
      get().questionnaireResponses.filter((r) => r.auditId === auditId),

    uploadDocument: (data) => {
      const doc: DocumentUpload = { ...data, id: `doc-${uid()}` };
      set((s) => ({ documentUploads: [...s.documentUploads, doc] }));
      get().addToast({
        type: "success",
        title: "Document Uploaded",
        message: data.documentName,
      });
    },

    reviewDocument: (docId, reviewerId, approved, reason) =>
      set((s) => ({
        documentUploads: s.documentUploads.map((d) =>
          d.id === docId
            ? {
                ...d,
                status: (approved
                  ? "Approved"
                  : "Rejected") as DocumentUploadStatus,
                reviewedBy: reviewerId,
                reviewedAt: now(),
                ...(reason ? { rejectionReason: reason } : {}),
              }
            : d,
        ),
      })),

    getDocumentsForLga: (lgaId, mandateId) =>
      get().documentUploads.filter(
        (d) => d.lgaId === lgaId && d.mandateId === mandateId,
      ),

    getDocumentsForMandate: (mandateId) =>
      get().documentUploads.filter((d) => d.mandateId === mandateId),

    submitStageApproval: (data) => {
      const sa: StageApproval = {
        ...data,
        id: `sa-${uid()}`,
        submittedAt: now(),
      };
      set((s) => ({ stageApprovals: [...s.stageApprovals, sa] }));
      get().addToast({
        type: "info",
        title: "Stage Submitted for Approval",
        message: data.stage,
      });
    },

    reviewStageApproval: (id, reviewerId, approved, comments) =>
      set((s) => ({
        stageApprovals: s.stageApprovals.map((sa) =>
          sa.id === id
            ? {
                ...sa,
                status: approved
                  ? ("Approved" as const)
                  : ("Changes Requested" as const),
                reviewedBy: reviewerId,
                reviewedAt: now(),
                ...(comments ? { comments } : {}),
              }
            : sa,
        ),
      })),

    getAuditApprovals: (auditId) =>
      get().stageApprovals.filter((sa) => sa.auditId === auditId),

    addControlTest: (data) => {
      const test: InternalControlTest = {
        ...data,
        id: `ctrl-${uid()}`,
        testedAt: now(),
      };
      set((s) => ({ controlTests: [...s.controlTests, test] }));
      get().addToast({ type: "success", title: "Control Test Added" });
    },

    addSubstantiveTest: (data) => {
      const test: SubstantiveTest = {
        ...data,
        id: `sub-${uid()}`,
        performedAt: now(),
      };
      set((s) => ({ substantiveTests: [...s.substantiveTests, test] }));
      get().addToast({ type: "success", title: "Substantive Test Added" });
    },

    getAuditControlTests: (auditId) =>
      get().controlTests.filter((c) => c.auditId === auditId),

    getAuditSubstantiveTests: (auditId) =>
      get().substantiveTests.filter((st) => st.auditId === auditId),

    getAuditFraudFlags: (auditId) =>
      get().fraudFlags.filter((f) => f.auditId === auditId),
  };
}
