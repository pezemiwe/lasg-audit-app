import { uid } from "../storeUtils";
import type { AuditStore } from "../useAuditStore.types";
import type { Audit, BriefingRecord, EntryMeetingRecord } from "../../types";

type SetFn = (updater: (state: AuditStore) => Partial<AuditStore>) => void;
type GetFn = () => AuditStore;

export type AuditActions = Pick<
  AuditStore,
  | "createAudit"
  | "updateAuditStatus"
  | "updateAuditProgress"
  | "updateAuditEntryMeeting"
  | "updateAuditTimelines"
  | "proposeAuditTimelines"
  | "approveAuditTimelines"
  | "addBriefingRecord"
  | "addEntryMeetingRecord"
  | "computeAuditProgress"
  | "getZoneAudits"
  | "getLgaAudit"
>;

export function createAuditActions(set: SetFn, get: GetFn): AuditActions {
  return {
    createAudit: (audit) => {
      const newAudit: Audit = { ...audit, id: `audit-${uid()}` };
      set((s) => ({ audits: [...s.audits, newAudit] }));
    },

    updateAuditStatus: (auditId, status) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId ? { ...a, status: status as Audit["status"] } : a,
        ),
      })),

    updateAuditProgress: (auditId, progress) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId ? { ...a, progress } : a,
        ),
      })),

    updateAuditEntryMeeting: (auditId, date, notes) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId
            ? { ...a, entryMeetingDate: date, entryMeetingNotes: notes }
            : a,
        ),
      })),

    updateAuditTimelines: (auditId, timelines) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId ? { ...a, phaseTimelines: timelines } : a,
        ),
      })),

    proposeAuditTimelines: (auditId, timelines) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId
            ? { ...a, proposedTimelines: timelines, timelinesApproved: false }
            : a,
        ),
      })),

    approveAuditTimelines: (auditId) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId && a.proposedTimelines
            ? {
                ...a,
                phaseTimelines: a.proposedTimelines,
                proposedTimelines: undefined,
                timelinesApproved: true,
              }
            : a,
        ),
      })),

    addBriefingRecord: (auditId, record) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId
            ? {
                ...a,
                briefings: [
                  ...(a.briefings ?? []),
                  {
                    ...record,
                    id: `brief-${Date.now()}`,
                    recordedAt: new Date().toISOString(),
                  } as BriefingRecord,
                ],
              }
            : a,
        ),
      })),

    addEntryMeetingRecord: (auditId, record) =>
      set((s) => ({
        audits: s.audits.map((a) =>
          a.id === auditId
            ? {
                ...a,
                entryMeetings: [
                  ...(a.entryMeetings ?? []),
                  {
                    ...record,
                    auditId,
                    id: `em-${Date.now()}`,
                    recordedAt: new Date().toISOString(),
                  } as EntryMeetingRecord,
                ],
              }
            : a,
        ),
      })),

    computeAuditProgress: (auditId) => {
      const s = get();
      const audit = s.audits.find((a) => a.id === auditId);
      if (!audit) return 0;

      const approvals = s.stageApprovals.filter((a) => a.auditId === auditId);
      const preAuditApproved = approvals.some(
        (a) => a.stage === "Pre-Audit" && a.status === "Approved",
      );
      const planningApproved = approvals.some(
        (a) => a.stage === "Planning" && a.status === "Approved",
      );
      const fieldworkApproved = approvals.some(
        (a) => a.stage === "Fieldwork" && a.status === "Approved",
      );
      const reportApproved = s.reports.some(
        (r) =>
          r.auditId === auditId &&
          (r.status === "Approved" || r.status === "Final"),
      );

      const docs = s.documentUploads.filter((d) => d.lgaId === audit.lgaId);
      const docProgress =
        docs.length > 0
          ? docs.filter((d) => d.status === "Approved").length / docs.length
          : 0;

      const controlsDone =
        s.controlTests.filter((c) => c.auditId === auditId).length > 0;
      const substDone = s.substantiveTests.filter(
        (st) => st.auditId === auditId && st.status === "Completed",
      ).length;
      const substTotal = s.substantiveTests.filter(
        (st) => st.auditId === auditId,
      ).length;
      const fieldworkProgress = substTotal > 0 ? substDone / substTotal : 0;

      const workpapersDone = s.workpapers.filter(
        (w) =>
          w.auditId === auditId &&
          (w.status === "Approved" || w.status === "Reviewed"),
      ).length;
      const workpapersTotal = s.workpapers.filter(
        (w) => w.auditId === auditId,
      ).length;
      const docuProgress =
        workpapersTotal > 0 ? workpapersDone / workpapersTotal : 0;

      let total = 0;
      total += (preAuditApproved ? 1 : docProgress * 0.7) * 10;
      total += (planningApproved ? 1 : 0) * 15;
      total +=
        (fieldworkApproved
          ? 1
          : (controlsDone ? 0.3 : 0) + fieldworkProgress * 0.7) * 25;
      total += docuProgress * 25;
      total += (reportApproved ? 1 : 0) * 20;
      total += (audit.status === "Completed" ? 1 : 0) * 5;

      return Math.round(Math.min(100, total));
    },

    getZoneAudits: (zoneId) => {
      const zoneLgas = get()
        .lgas.filter((l) => l.zoneId === zoneId)
        .map((l) => l.id);
      return get().audits.filter((a) => zoneLgas.includes(a.lgaId));
    },

    getLgaAudit: (lgaId) => get().audits.find((a) => a.lgaId === lgaId),
  };
}
