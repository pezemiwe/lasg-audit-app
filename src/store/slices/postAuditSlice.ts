import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type {
  FollowUpItem,
  LessonLearned,
  QualityReview,
  ExitConference,
} from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type PostAuditActions = Pick<
  AuditStore,
  | "addFollowUp"
  | "updateFollowUp"
  | "verifyFollowUp"
  | "getAuditFollowUps"
  | "addLesson"
  | "getAuditLessons"
  | "addQualityReview"
  | "getAuditQualityReview"
  | "addExitConference"
  | "getAuditExitConference"
>;

export function createPostAuditActions(
  set: SetFn,
  get: GetFn,
): PostAuditActions {
  return {
    addFollowUp: (data) => {
      const item: FollowUpItem = {
        ...data,
        id: `fu-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ followUps: [...s.followUps, item] }));
      get().addToast({ type: "success", title: "Follow-Up Item Created" });
    },

    updateFollowUp: (id, updates) =>
      set((s) => ({
        followUps: s.followUps.map((f) =>
          f.id === id ? { ...f, ...updates } : f,
        ),
      })),

    verifyFollowUp: (id, verifierId) => {
      set((s) => ({
        followUps: s.followUps.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "Verified" as const,
                verifiedBy: verifierId,
                verifiedAt: now(),
              }
            : f,
        ),
      }));
      get().addToast({ type: "success", title: "Follow-Up Verified" });
    },

    getAuditFollowUps: (auditId) =>
      get().followUps.filter((f) => f.auditId === auditId),

    addLesson: (data) => {
      const lesson: LessonLearned = {
        ...data,
        id: `ll-${uid()}`,
        submittedAt: now(),
      };
      set((s) => ({ lessonsLearned: [...s.lessonsLearned, lesson] }));
      get().addToast({ type: "success", title: "Lesson Recorded" });
    },

    getAuditLessons: (auditId) =>
      get().lessonsLearned.filter((l) => l.auditId === auditId),

    addQualityReview: (data) => {
      const review: QualityReview = {
        ...data,
        id: `qr-${uid()}`,
        reviewedAt: now(),
      };
      set((s) => ({ qualityReviews: [...s.qualityReviews, review] }));
      get().addToast({ type: "success", title: "Quality Review Submitted" });
    },

    getAuditQualityReview: (auditId) =>
      get().qualityReviews.find((q) => q.auditId === auditId),

    addExitConference: (data) => {
      const conf: ExitConference = {
        ...data,
        id: `ec-${uid()}`,
        createdAt: now(),
      };
      set((s) => ({ exitConferences: [...s.exitConferences, conf] }));
      get().addToast({ type: "success", title: "Exit Conference Recorded" });
    },

    getAuditExitConference: (auditId) =>
      get().exitConferences.find((c) => c.auditId === auditId),
  };
}
