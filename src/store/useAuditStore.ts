import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Mandate,
  Audit,
  Task,
  Invitation,
  NotificationLetter,
  Workpaper,
  AuditReport,
  AuditProgramme,
  ActivityLog,
  Zone,
  LGA,
  MandateStatus,
  TaskStatus,
  InvitationStatus,
  LetterStatus,
  RiskMatrix,
  MaterialityThreshold,
  InternalControlTest,
  SubstantiveTest,
  FraudFlag,
  ScopeAgreement,
  ScopeAgreementRow,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  DocumentUpload,
  DocumentUploadStatus,
  StageApproval,
  ProgrammeProcedure,
  FollowUpItem,
  LessonLearned,
  QualityReview,
  ExitConference,
  User,
} from "../types";
import {
  ZONES,
  LGAS,
  MOCK_USERS,
  SEED_MANDATES,
  SEED_AUDITS,
  SEED_TASKS,
  SEED_INVITATIONS,
  SEED_LETTERS,
  SEED_WORKPAPERS,
  SEED_REPORTS,
  SEED_PROGRAMMES,
  SEED_ACTIVITY_LOG,
  NOTIFICATION_CHECKLIST,
  SEED_RISK_MATRICES,
  SEED_MATERIALITY,
  SEED_CONTROL_TESTS,
  SEED_SUBSTANTIVE_TESTS,
  SEED_FRAUD_FLAGS,
  SEED_SCOPE_AGREEMENTS,
  SEED_QUESTIONNAIRE_QUESTIONS,
  SEED_QUESTIONNAIRE_RESPONSES,
  SEED_DOCUMENT_UPLOADS,
  SEED_STAGE_APPROVALS,
} from "../mock/data";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: "danger" | "warning" | "info";
}

interface AuditStore {
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;

  zones: Zone[];
  lgas: LGA[];
  mandates: Mandate[];
  audits: Audit[];
  tasks: Task[];
  invitations: Invitation[];
  letters: NotificationLetter[];
  workpapers: Workpaper[];
  reports: AuditReport[];
  programmes: AuditProgramme[];
  activityLog: ActivityLog[];
  riskMatrices: RiskMatrix[];
  materiality: MaterialityThreshold[];
  controlTests: InternalControlTest[];
  substantiveTests: SubstantiveTest[];
  fraudFlags: FraudFlag[];
  scopeAgreements: ScopeAgreement[];
  questionnaireQuestions: QuestionnaireQuestion[];
  questionnaireResponses: QuestionnaireResponse[];
  documentUploads: DocumentUpload[];
  stageApprovals: StageApproval[];
  followUps: FollowUpItem[];
  lessonsLearned: LessonLearned[];
  qualityReviews: QualityReview[];
  exitConferences: ExitConference[];
  toasts: ToastMessage[];
  modal: ModalState;

  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  openModal: (modal: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;

  createMandate: (
    mandate: Omit<Mandate, "id" | "createdAt" | "status">,
  ) => void;
  publishMandate: (id: string) => void;
  updateMandateStatus: (id: string, status: MandateStatus) => void;

  assignSupervisor: (zoneId: string, supervisorId: string) => void;
  unassignSupervisor: (zoneId: string) => void;

  assignLead: (
    lgaId: string,
    leadId: string,
    auditId: string,
    mandateId: string,
  ) => void;

  generateLetters: (mandateId: string) => void;
  sendLetter: (letterId: string) => void;
  sendAllLetters: (mandateId: string) => void;
  updateLetterStatus: (letterId: string, status: LetterStatus) => void;

  createAudit: (audit: Omit<Audit, "id">) => void;
  updateAuditStatus: (auditId: string, status: string) => void;
  updateAuditProgress: (auditId: string, progress: number) => void;

  createTask: (task: Omit<Task, "id">) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  assignTask: (taskId: string, userId: string) => void;

  sendInvitation: (
    invitation: Omit<Invitation, "id" | "sentAt" | "expiresAt" | "status">,
  ) => void;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;

  uploadWorkpaper: (workpaper: Omit<Workpaper, "id" | "uploadedAt">) => void;
  updateWorkpaperStatus: (
    wpId: string,
    status: Workpaper["status"],
    notes?: string,
  ) => void;

  createReport: (report: Omit<AuditReport, "id">) => void;
  submitReport: (reportId: string) => void;
  reviewReport: (
    reportId: string,
    reviewerId: string,
    approved: boolean,
  ) => void;

  createProgramme: (programme: Omit<AuditProgramme, "id">) => void;
  submitProgramme: (programmeId: string) => void;
  approveProgramme: (programmeId: string, approverId: string) => void;
  requestProgrammeRevision: (programmeId: string) => void;

  logActivity: (entry: Omit<ActivityLog, "id" | "timestamp">) => void;

  getUserInvitations: (userId: string) => Invitation[];
  getZoneAudits: (zoneId: string) => Audit[];
  getLgaAudit: (lgaId: string) => Audit | undefined;
  getAuditTasks: (auditId: string) => Task[];
  getUserTasks: (userId: string) => Task[];
  getAuditWorkpapers: (auditId: string) => Workpaper[];
  getAuditReports: (auditId: string) => AuditReport[];
  getAuditProgramme: (auditId: string) => AuditProgramme | undefined;
  getMandateLetters: (mandateId: string) => NotificationLetter[];
  getAuditRiskMatrices: (auditId: string) => RiskMatrix[];
  getAuditMateriality: (auditId: string) => MaterialityThreshold | undefined;
  getAuditControlTests: (auditId: string) => InternalControlTest[];
  getAuditSubstantiveTests: (auditId: string) => SubstantiveTest[];
  getAuditFraudFlags: (auditId: string) => FraudFlag[];
  addRiskMatrix: (rm: Omit<RiskMatrix, "id" | "createdAt">) => void;
  addFraudFlag: (ff: Omit<FraudFlag, "id" | "raisedAt">) => void;
  resolveFraudFlag: (id: string, resolution: string) => void;

  createScopeAgreement: (sa: Omit<ScopeAgreement, "id" | "createdAt">) => void;
  updateScopeAgreement: (id: string, updates: Partial<ScopeAgreement>) => void;
  signOffScope: (id: string, party: "auditor" | "lga", name: string) => void;
  addScopeRow: (
    agreementId: string,
    row: Omit<ScopeAgreementRow, "id">,
  ) => void;

  saveQuestionnaireResponse: (
    response: Omit<QuestionnaireResponse, "id" | "answeredAt">,
  ) => void;
  getAuditResponses: (auditId: string) => QuestionnaireResponse[];

  uploadDocument: (doc: Omit<DocumentUpload, "id">) => void;
  reviewDocument: (
    docId: string,
    reviewerId: string,
    approved: boolean,
    reason?: string,
  ) => void;
  getDocumentsForLga: (lgaId: string, mandateId: string) => DocumentUpload[];
  getDocumentsForMandate: (mandateId: string) => DocumentUpload[];

  submitStageApproval: (
    data: Omit<StageApproval, "id" | "submittedAt">,
  ) => void;
  reviewStageApproval: (
    id: string,
    reviewerId: string,
    approved: boolean,
    comments?: string,
  ) => void;
  getAuditApprovals: (auditId: string) => StageApproval[];

  addControlTest: (test: Omit<InternalControlTest, "id" | "testedAt">) => void;
  addSubstantiveTest: (
    test: Omit<SubstantiveTest, "id" | "performedAt">,
  ) => void;

  updateProgrammeProcedure: (
    programmeId: string,
    procedureId: string,
    updates: Partial<ProgrammeProcedure>,
  ) => void;

  /* ─── Post-Audit Actions ─── */
  addFollowUp: (item: Omit<FollowUpItem, "id" | "createdAt">) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUpItem>) => void;
  verifyFollowUp: (id: string, verifierId: string) => void;
  getAuditFollowUps: (auditId: string) => FollowUpItem[];
  addLesson: (lesson: Omit<LessonLearned, "id" | "submittedAt">) => void;
  getAuditLessons: (auditId: string) => LessonLearned[];
  addQualityReview: (review: Omit<QualityReview, "id" | "reviewedAt">) => void;
  getAuditQualityReview: (auditId: string) => QualityReview | undefined;
  addExitConference: (conf: Omit<ExitConference, "id" | "createdAt">) => void;
  getAuditExitConference: (auditId: string) => ExitConference | undefined;

  computeAuditProgress: (auditId: string) => number;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

export const useAuditStore = create(
  persist<AuditStore>(
    (set, get) => ({
      users: [...MOCK_USERS],
      addUser: (user: Omit<User, "id">) =>
        set((s) => ({
          users: [...s.users, { ...user, id: uid() } as User],
        })),
      updateUser: (id: string, updates: Partial<User>) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      zones: ZONES,
      lgas: LGAS,
      mandates: [...SEED_MANDATES],
      audits: [...SEED_AUDITS],
      tasks: [...SEED_TASKS],
      invitations: [...SEED_INVITATIONS],
      letters: [...SEED_LETTERS],
      workpapers: [...SEED_WORKPAPERS],
      reports: [...SEED_REPORTS],
      programmes: [...SEED_PROGRAMMES],
      activityLog: [...SEED_ACTIVITY_LOG],
      riskMatrices: [...SEED_RISK_MATRICES],
      materiality: [...SEED_MATERIALITY],
      controlTests: [...SEED_CONTROL_TESTS],
      substantiveTests: [...SEED_SUBSTANTIVE_TESTS],
      fraudFlags: [...SEED_FRAUD_FLAGS],
      scopeAgreements: [...SEED_SCOPE_AGREEMENTS],
      questionnaireQuestions: [...SEED_QUESTIONNAIRE_QUESTIONS],
      questionnaireResponses: [...SEED_QUESTIONNAIRE_RESPONSES],
      documentUploads: [...SEED_DOCUMENT_UPLOADS],
      stageApprovals: [...SEED_STAGE_APPROVALS],
      followUps: [],
      lessonsLearned: [],
      qualityReviews: [],
      exitConferences: [],
      toasts: [],
      modal: { isOpen: false, title: "", message: "" },

      addToast: (toast) => {
        const id = uid();
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 5000);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      openModal: (modal) => set({ modal: { ...modal, isOpen: true } }),

      closeModal: () => set((s) => ({ modal: { ...s.modal, isOpen: false } })),

      createMandate: (data) => {
        const mandate: Mandate = {
          ...data,
          id: `mandate-${uid()}`,
          createdAt: now(),
          status: "Draft",
        };
        set((s) => ({ mandates: [...s.mandates, mandate] }));
        get().logActivity({
          userId: data.createdBy,
          action: "CREATE_MANDATE",
          details: `Created audit mandate: ${mandate.title}`,
          entityType: "mandate",
          entityId: mandate.id,
        });
        get().addToast({
          type: "success",
          title: "Mandate Created",
          message: `"${mandate.title}" saved as draft`,
        });
      },

      publishMandate: (id) => {
        set((s) => ({
          mandates: s.mandates.map((m) =>
            m.id === id
              ? { ...m, status: "Published" as const, publishedAt: now() }
              : m,
          ),
        }));
        const mandate = get().mandates.find((m) => m.id === id);
        get().logActivity({
          userId: mandate?.createdBy || "",
          action: "PUBLISH_MANDATE",
          details: `Published audit mandate: ${mandate?.title}`,
          entityType: "mandate",
          entityId: id,
        });
        get().addToast({
          type: "success",
          title: "Mandate Published",
          message: "The audit mandate is now active",
        });
      },

      updateMandateStatus: (id, status) =>
        set((s) => ({
          mandates: s.mandates.map((m) => (m.id === id ? { ...m, status } : m)),
        })),

      assignSupervisor: (zoneId, supervisorId) => {
        set((s) => ({
          zones: s.zones.map((z) =>
            z.id === zoneId ? { ...z, supervisorId } : z,
          ),
        }));
        get().addToast({
          type: "success",
          title: "Supervisor Assigned",
          message: `Zone assignment confirmed`,
        });
      },

      unassignSupervisor: (zoneId) =>
        set((s) => ({
          zones: s.zones.map((z) =>
            z.id === zoneId ? { ...z, supervisorId: undefined } : z,
          ),
        })),

      // Update store logic to also update user record when lead is assigned
      assignLead: (lgaId, leadId, auditId, mandateId) => {
        set((s) => ({
          lgas: s.lgas.map((l) =>
            l.id === lgaId ? { ...l, auditLeadId: leadId } : l,
          ),
          audits: s.audits.map((a) =>
            a.id === auditId ? { ...a, leadId } : a,
          ),
          // Optionally update the user's lgaId
          users: s.users.map((u) => (u.id === leadId ? { ...u, lgaId } : u)),
        }));
        get().sendInvitation({
          userId: leadId,
          role: "AUDIT_LEAD",
          lgaId,
          auditId,
          mandateId,
        });
        get().addToast({
          type: "success",
          title: "Lead Assigned",
          message: "Invitation sent to Audit Lead",
        });
      },

      generateLetters: (mandateId) => {
        const { lgas, letters: existing } = get();
        const alreadyGenerated = existing.filter(
          (l) => l.mandateId === mandateId,
        );
        const lgaIds = new Set(alreadyGenerated.map((l) => l.lgaId));
        const newLetters: NotificationLetter[] = lgas
          .filter((l) => !lgaIds.has(l.id))
          .map((lga) => ({
            id: `letter-${uid()}-${lga.id}`,
            lgaId: lga.id,
            mandateId,
            status: "Draft" as LetterStatus,
            checklist: [...NOTIFICATION_CHECKLIST],
          }));
        set((s) => ({ letters: [...s.letters, ...newLetters] }));
        get().addToast({
          type: "success",
          title: "Letters Generated",
          message: `${newLetters.length} notification letters prepared`,
        });
      },

      sendLetter: (letterId) =>
        set((s) => ({
          letters: s.letters.map((l) =>
            l.id === letterId
              ? { ...l, status: "Sent" as LetterStatus, sentAt: now() }
              : l,
          ),
        })),

      sendAllLetters: (mandateId) => {
        set((s) => ({
          letters: s.letters.map((l) =>
            l.mandateId === mandateId && l.status === "Draft"
              ? { ...l, status: "Sent" as LetterStatus, sentAt: now() }
              : l,
          ),
        }));
        get().addToast({
          type: "success",
          title: "All Letters Dispatched",
          message: "Notification letters sent to all LGA contacts",
        });
      },

      updateLetterStatus: (letterId, status) =>
        set((s) => ({
          letters: s.letters.map((l) =>
            l.id === letterId
              ? {
                  ...l,
                  status,
                  ...(status === "Acknowledged"
                    ? { acknowledgedAt: now() }
                    : {}),
                  ...(status === "Documents Received"
                    ? { documentsReceivedAt: now() }
                    : {}),
                }
              : l,
          ),
        })),

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

      createTask: (task) => {
        const newTask: Task = { ...task, id: `task-${uid()}` };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
      },

      updateTaskStatus: (taskId, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status,
                  ...(status === "Completed" ? { completedAt: now() } : {}),
                }
              : t,
          ),
        })),

      assignTask: (taskId, userId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, assignedTo: userId } : t,
          ),
        })),

      sendInvitation: (data) => {
        const invitation: Invitation = {
          ...data,
          id: `inv-${uid()}`,
          status: "Pending",
          sentAt: now(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        };
        set((s) => ({ invitations: [...s.invitations, invitation] }));
      },

      acceptInvitation: (invitationId) => {
        set((s) => ({
          invitations: s.invitations.map((i) =>
            i.id === invitationId
              ? {
                  ...i,
                  status: "Accepted" as InvitationStatus,
                  acceptedAt: now(),
                }
              : i,
          ),
        }));
        get().addToast({ type: "success", title: "Assignment Accepted" });
      },

      declineInvitation: (invitationId) => {
        set((s) => ({
          invitations: s.invitations.map((i) =>
            i.id === invitationId
              ? { ...i, status: "Declined" as InvitationStatus }
              : i,
          ),
        }));
        get().addToast({ type: "info", title: "Assignment Declined" });
      },

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

      createProgramme: (data) => {
        const prog: AuditProgramme = { ...data, id: `prog-${uid()}` };
        set((s) => ({ programmes: [...s.programmes, prog] }));
        get().addToast({ type: "success", title: "Audit Programme Created" });
      },

      submitProgramme: (programmeId) =>
        set((s) => ({
          programmes: s.programmes.map((p) =>
            p.id === programmeId
              ? { ...p, status: "Submitted" as const, submittedAt: now() }
              : p,
          ),
        })),

      approveProgramme: (programmeId, approverId) =>
        set((s) => ({
          programmes: s.programmes.map((p) =>
            p.id === programmeId
              ? {
                  ...p,
                  status: "Approved" as const,
                  approvedBy: approverId,
                  approvedAt: now(),
                }
              : p,
          ),
        })),

      requestProgrammeRevision: (programmeId) =>
        set((s) => ({
          programmes: s.programmes.map((p) =>
            p.id === programmeId
              ? { ...p, status: "Revision Required" as const }
              : p,
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

      getUserInvitations: (userId) =>
        get().invitations.filter((i) => i.userId === userId),

      getZoneAudits: (zoneId) => {
        const zoneLgas = get()
          .lgas.filter((l) => l.zoneId === zoneId)
          .map((l) => l.id);
        return get().audits.filter((a) => zoneLgas.includes(a.lgaId));
      },

      getLgaAudit: (lgaId) => get().audits.find((a) => a.lgaId === lgaId),

      getAuditTasks: (auditId) =>
        get().tasks.filter((t) => t.auditId === auditId),

      getUserTasks: (userId) =>
        get().tasks.filter((t) => t.assignedTo === userId),

      getAuditWorkpapers: (auditId) =>
        get().workpapers.filter((w) => w.auditId === auditId),

      getAuditReports: (auditId) =>
        get().reports.filter((r) => r.auditId === auditId),

      getAuditProgramme: (auditId) =>
        get().programmes.find((p) => p.auditId === auditId),

      getMandateLetters: (mandateId) =>
        get().letters.filter((l) => l.mandateId === mandateId),

      getAuditRiskMatrices: (auditId) =>
        get().riskMatrices.filter((r) => r.auditId === auditId),

      getAuditMateriality: (auditId) =>
        get().materiality.find((m) => m.auditId === auditId),

      getAuditControlTests: (auditId) =>
        get().controlTests.filter((c) => c.auditId === auditId),

      getAuditSubstantiveTests: (auditId) =>
        get().substantiveTests.filter((st) => st.auditId === auditId),

      getAuditFraudFlags: (auditId) =>
        get().fraudFlags.filter((f) => f.auditId === auditId),

      addRiskMatrix: (rm) => {
        const record: RiskMatrix = {
          ...rm,
          id: `rm-${uid()}`,
          createdAt: now(),
        };
        set((s) => ({ riskMatrices: [...s.riskMatrices, record] }));
      },

      addFraudFlag: (ff) => {
        const record: FraudFlag = { ...ff, id: `ff-${uid()}`, raisedAt: now() };
        set((s) => ({ fraudFlags: [...s.fraudFlags, record] }));
      },

      resolveFraudFlag: (id, resolution) => {
        set((s) => ({
          fraudFlags: s.fraudFlags.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: "Resolved" as const,
                  resolution,
                  resolvedAt: now(),
                }
              : f,
          ),
        }));
      },

      createScopeAgreement: (data) => {
        const sa: ScopeAgreement = {
          ...data,
          id: `scope-${uid()}`,
          createdAt: now(),
        };
        set((s) => ({ scopeAgreements: [...s.scopeAgreements, sa] }));
        get().addToast({ type: "success", title: "Scope Agreement Created" });
      },

      updateScopeAgreement: (id, updates) =>
        set((s) => ({
          scopeAgreements: s.scopeAgreements.map((sa) =>
            sa.id === id ? { ...sa, ...updates } : sa,
          ),
        })),

      signOffScope: (id, party, name) => {
        set((s) => ({
          scopeAgreements: s.scopeAgreements.map((sa) => {
            if (sa.id !== id) return sa;
            const signOff = { name, timestamp: now() };
            const updatedRows = sa.rows.map((r) =>
              party === "auditor"
                ? { ...r, auditorSignOff: signOff }
                : { ...r, lgaSignOff: signOff },
            );
            const allSigned = updatedRows.every(
              (r) => r.auditorSignOff && r.lgaSignOff,
            );
            return {
              ...sa,
              rows: updatedRows,
              status: allSigned
                ? ("Fully Approved" as const)
                : ("Pending LGA" as const),
            };
          }),
        }));
        get().addToast({
          type: "success",
          title: `${party === "auditor" ? "Auditor" : "LGA"} Sign-Off Recorded`,
        });
      },

      addScopeRow: (agreementId, row) => {
        const newRow: ScopeAgreementRow = { ...row, id: `sr-${uid()}` };
        set((s) => ({
          scopeAgreements: s.scopeAgreements.map((sa) => {
            if (sa.id !== agreementId) return sa;
            const rows = [...sa.rows, newRow];
            return {
              ...sa,
              rows,
              totalWeeks: rows.reduce((sum, r) => sum + r.timelineWeeks, 0),
            };
          }),
        }));
      },

      saveQuestionnaireResponse: (data) => {
        const existing = get().questionnaireResponses.find(
          (r) => r.auditId === data.auditId && r.questionId === data.questionId,
        );
        if (existing) {
          set((s) => ({
            questionnaireResponses: s.questionnaireResponses.map((r) =>
              r.id === existing.id
                ? { ...r, answer: data.answer, answeredAt: now() }
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

      updateProgrammeProcedure: (programmeId, procedureId, updates) =>
        set((s) => ({
          programmes: s.programmes.map((p) =>
            p.id === programmeId
              ? {
                  ...p,
                  procedures: p.procedures.map((proc) =>
                    proc.id === procedureId ? { ...proc, ...updates } : proc,
                  ),
                }
              : p,
          ),
        })),

      /* ─── Post-Audit Actions ─── */
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
        get().addToast({
          type: "success",
          title: "Exit Conference Recorded",
        });
      },

      getAuditExitConference: (auditId) =>
        get().exitConferences.find((c) => c.auditId === auditId),

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
    }),
    {
      name: "audit-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
