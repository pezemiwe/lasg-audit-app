import { uid, now } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { Workpaper, AuditReport, ActivityLog } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type WorkpaperReportActions = Pick<
  AuditStore,
  | "uploadWorkpaper"
  | "updateWorkpaperStatus"
  | "createReport"
  | "submitReport"
  | "reviewReport"
  | "logActivity"
  | "getAuditWorkpapers"
  | "getAuditReports"
>;

export function createWorkpaperReportActions(
  set: SetFn,
  get: GetFn,
): WorkpaperReportActions {
  return {
    uploadWorkpaper: (data) => {
      const wp: Workpaper = { ...data, id: `wp-${uid()}`, uploadedAt: now() };
      set((s) => ({ workpapers: [...s.workpapers, wp] }));
      get().addToast({
        type: "success",
        title: "Workpaper Uploaded",
        message: data.title,
      });
    },

    updateWorkpaperStatus: (wpId, status, notes) =>
      set((s) => ({
        workpapers: s.workpapers.map((w) =>
          w.id === wpId
            ? { ...w, status, ...(notes ? { reviewerNotes: notes } : {}) }
            : w,
        ),
      })),

    createReport: (data) => {
      const report: AuditReport = { ...data, id: `report-${uid()}` };
      set((s) => ({ reports: [...s.reports, report] }));
      get().addToast({ type: "success", title: "Report Created" });
    },

    submitReport: (reportId) =>
      set((s) => ({
        reports: s.reports.map((r) =>
          r.id === reportId
            ? { ...r, status: "Submitted" as const, submittedAt: now() }
            : r,
        ),
      })),

    reviewReport: (reportId, reviewerId, approved) =>
      set((s) => ({
        reports: s.reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: approved
                  ? ("Approved" as const)
                  : ("Revision Required" as const),
                reviewedBy: reviewerId,
                reviewedAt: now(),
              }
            : r,
        ),
      })),

    logActivity: (entry) => {
      const log: ActivityLog = {
        ...entry,
        id: `log-${uid()}`,
        timestamp: now(),
      };
      set((s) => ({ activityLog: [log, ...s.activityLog] }));
    },

    getAuditWorkpapers: (auditId) =>
      get().workpapers.filter((w) => w.auditId === auditId),

    getAuditReports: (auditId) =>
      get().reports.filter((r) => r.auditId === auditId),
  };
}
