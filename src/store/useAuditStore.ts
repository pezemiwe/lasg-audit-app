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
  Notification,
  ProgrammeTemplate,
  CouncilType,
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
  SEED_NOTIFICATIONS,
  PROGRAMME_TEMPLATES,
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
  notifications: Notification[];
  addNotification: (
    notif: Omit<Notification, "id" | "isRead" | "timestamp">,
  ) => void;
  addNotifications: (
    notifs: Omit<Notification, "id" | "isRead" | "timestamp">[],
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  clearNotifications: (userId: string) => void;

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
  acceptMandate: (mandateId: string, lgaId: string) => void;
  ensureDocumentsExist: (mandateId: string, lgaId: string) => void;

  addSupervisor: (zoneId: string, supervisorId: string) => void;
  removeSupervisor: (zoneId: string, supervisorId: string) => void;

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
  updateAuditEntryMeeting: (
    auditId: string,
    date: string,
    notes: string,
  ) => void;
  updateAuditTimelines: (
    auditId: string,
    timelines: Record<string, { startDate: string; endDate: string }>,
  ) => void;

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
  setAuditMateriality: (
    data: Omit<MaterialityThreshold, "id" | "createdAt">,
  ) => void;
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
  deleteQuestionnaireResponse: (auditId: string, questionId: string) => void;
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

  /* ─── Council & Programme Template Helpers ─── */
  programmeTemplates: ProgrammeTemplate[];
  getCouncilsByType: (type?: CouncilType) => LGA[];
  getLgaCount: () => number;
  getLcdaCount: () => number;
  getTotalCouncilCount: () => number;
  getParentLga: (lcdaId: string) => LGA | undefined;
  getChildLcdas: (lgaId: string) => LGA[];
  createProgrammeFromTemplate: (
    templateId: string,
    auditId: string,
    preparedBy: string,
    objectives: string,
    scope: string,
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
      notifications: [...SEED_NOTIFICATIONS],
      addNotification: (data) =>
        set((s) => ({
          notifications: [
            {
              ...data,
              id: `notif-${uid()}`,
              isRead: false,
              timestamp: now(),
            },
            ...s.notifications,
          ],
        })),
      addNotifications: (notifs) =>
        set((s) => ({
          notifications: [
            ...notifs.map((n, i) => ({
              ...n,
              id: `notif-${uid()}-${i}`,
              isRead: false,
              timestamp: now(),
            })),
            ...s.notifications,
          ],
        })),
      markNotificationAsRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        })),
      markAllNotificationsAsRead: (userId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n,
          ),
        })),
      clearNotifications: (userId) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.userId !== userId),
        })),

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

      acceptMandate: (mandateId, lgaId) => {
        set((s) => {
          // Check if documents already exist for this mandate/LGA to avoid duplicates
          const existingDocs = s.documentUploads.some(
            (d) => d.mandateId === mandateId && d.lgaId === lgaId,
          );

          let newDocs = s.documentUploads;

          if (!existingDocs) {
            const mandate = s.mandates.find((m) => m.id === mandateId);
            const dueDate = mandate?.endDate || new Date().toISOString();

            const requiredDocs: DocumentUpload[] = [
              {
                id: `doc-${mandateId}-${lgaId}-1`,
                lgaId,
                mandateId,
                documentName: "Annual Financial Statement",
                description: "Audited financial statements for the fiscal year",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-2`,
                lgaId,
                mandateId,
                documentName: "Appropriation Law / Approved Budget",
                description: "Approved budget and appropriation bill",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-3`,
                lgaId,
                mandateId,
                documentName: "Trial Balance",
                description: "Consolidated trial balance",
                requiredFormat: "Excel/PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-4`,
                lgaId,
                mandateId,
                documentName: "Cash Books & Bank Reconciliation",
                description:
                  "All cash books and bank reconciliation statements",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-5`,
                lgaId,
                mandateId,
                documentName: "Revenue Receipts & Payment Vouchers",
                description: "Sample of revenue receipts and PVs",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-6`,
                lgaId,
                mandateId,
                documentName: "Payroll Records",
                description: "Staff payroll records for the audit period",
                requiredFormat: "Excel/PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-7`,
                lgaId,
                mandateId,
                documentName: "Contract Awards & Procurement Files",
                description:
                  "Details of contracts awarded and procurement processes",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-8`,
                lgaId,
                mandateId,
                documentName: "Fixed Asset Register",
                description: "Current register of fixed assets",
                requiredFormat: "Excel",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-9`,
                lgaId,
                mandateId,
                documentName: "Internal Audit Reports",
                description: "Reports from internal audit unit",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-10`,
                lgaId,
                mandateId,
                documentName: "Executive Committee Minutes",
                description:
                  "Minutes of meetings held by the Executive Committee",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
            ];
            newDocs = [...s.documentUploads, ...requiredDocs];
          }

          return {
            documentUploads: newDocs,
            mandates: s.mandates.map((m) => {
              if (m.id === mandateId) {
                const accepted = m.acceptedByLgas || [];
                if (!accepted.includes(lgaId)) {
                  return { ...m, acceptedByLgas: [...accepted, lgaId] };
                }
              }
              return m;
            }),
          };
        });
        get().addToast({
          type: "success",
          title: "Mandate Accepted",
          message:
            "Mandate accepted. Please proceed to the Document Portal to upload required files.",
        });
      },

      addSupervisor: (zoneId, supervisorId) => {
        set((s) => ({
          zones: s.zones.map((z) => {
            if (z.id === zoneId) {
              const current = z.supervisorIds || [];
              if (current.includes(supervisorId)) return z;
              return { ...z, supervisorIds: [...current, supervisorId] };
            }
            return z;
          }),
        }));
        get().addToast({
          type: "success",
          title: "Supervisor Added",
          message: `Supervisor assigned to zone`,
        });
      },

      ensureDocumentsExist: (mandateId, lgaId) => {
        set((s) => {
          const mandate = s.mandates.find((m) => m.id === mandateId);
          const dueDate = mandate?.endDate || new Date().toISOString();

          // Define the full list of 10 Required Documents
          const allRequiredDocs: DocumentUpload[] = [
            {
              id: `doc-${mandateId}-${lgaId}-1`,
              lgaId,
              mandateId,
              documentName: "Annual Financial Statements",
              description:
                "Complete audited or unaudited financial statements for the period.",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-2`,
              lgaId,
              mandateId,
              documentName: "Approved Budget",
              description:
                "Current and preceding year approved budget documents",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-3`,
              lgaId,
              mandateId,
              documentName: "Bank Statements",
              description:
                "Bank statements for all LGA accounts covering 12 months",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-4`,
              lgaId,
              mandateId,
              documentName: "Trial Balance",
              description: "Consolidated trial balance for the fiscal year",
              requiredFormat: "Excel/PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-5`,
              lgaId,
              mandateId,
              documentName: "Payment Vouchers",
              description: "Sampled payment vouchers above threshold",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-6`,
              lgaId,
              mandateId,
              documentName: "Contract Register",
              description:
                "Register of all contracts awarded during the period",
              requiredFormat: "Excel/PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-7`,
              lgaId,
              mandateId,
              documentName: "Asset Register",
              description: "Updated register of fixed assets and properties",
              requiredFormat: "Excel",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-8`,
              lgaId,
              mandateId,
              documentName: "Payroll Schedule",
              description: "Monthly payroll summary and nominal roll",
              requiredFormat: "Excel",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-9`,
              lgaId,
              mandateId,
              documentName: "Executive Committee Minutes",
              description:
                "Minutes of meetings involving key financial decisions",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-10`,
              lgaId,
              mandateId,
              documentName: "Internal Audit Report",
              description: "Quarterly internal audit reports for the period",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
          ];

          // Filter out documents that already exist (by name match or duplicate ID checks)
          const existingDocs = s.documentUploads.filter(
            (d) => d.mandateId === mandateId && d.lgaId === lgaId,
          );

          const missingDocs = allRequiredDocs.filter((req) => {
            // Check if a document with this name already exists for this mandate/LGA
            // Also check somewhat fuzzy to avoid "Annual Financial Statement" vs "Statements" duplicates if desired
            // But here we rely on exact match or we'll just have duplicates which is better than missing docs
            const exists = existingDocs.some(
              (ex) => ex.documentName === req.documentName,
            );
            return !exists;
          });

          if (missingDocs.length === 0) return {}; // All good

          // Force update with new docs
          if (missingDocs.length > 0) {
            get().addToast({
              type: "info",
              title: "System Update",
              message: `Added ${missingDocs.length} missing required documents for this mandate.`,
            });
          }

          return { documentUploads: [...s.documentUploads, ...missingDocs] };
        });
      },

      removeSupervisor: (zoneId, supervisorId) =>
        set((s) => ({
          zones: s.zones.map((z) => {
            if (z.id === zoneId && z.supervisorIds) {
              return {
                ...z,
                supervisorIds: z.supervisorIds.filter(
                  (id) => id !== supervisorId,
                ),
              };
            }
            return z;
          }),
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
        const { lgas, letters: existing, mandates } = get();
        const mandate = mandates.find((m) => m.id === mandateId);
        if (!mandate) return;

        const alreadyGenerated = existing.filter(
          (l) => l.mandateId === mandateId,
        );
        const lgaIds = new Set(alreadyGenerated.map((l) => l.lgaId));
        const newLetters: NotificationLetter[] = lgas
          .filter((l) => !lgaIds.has(l.id))
          .map((lga) => {
            const date = new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const content = `
**OFFICE OF THE STATE AUDITOR-GENERAL**  
Lagos State Government  
  
${date}  
  
The Chairman,  
${lga.name} Local Government,  
Lagos State.  
  
**Attention:** ${lga.contactName || "Council Manager"}  
  
**RE: NOTIFICATION OF AUDIT ENGAGEMENT - ${mandate.title.toUpperCase()} (FY ${mandate.auditYear})**  
  
In accordance with the provisions of the **Lagos State Audit Law (2015)** and the relevant sections of the **Constitution of the Federal Republic of Nigeria (1999 as amended)**, this letter serves to formally notify you of the commencement of the statutory audit exercise for the ${mandate.auditYear} financial year.  
  
**Objective:**  
The primary objective of this audit is to express an opinion on the financial statements of the Local Government and to ensure compliance with relevant laws and regulations.  
  
**Scope of Audit:**  
${mandate.scope}  
  
**Audit Period:**  
The audit will cover the period from **${new Date(mandate.startDate).toLocaleDateString()}** to **${new Date(mandate.endDate).toLocaleDateString()}**.  
  
**Requirements:**  
To facilitate a smooth and efficient audit process, you are required to prepare the attached list of documents and make them available to the audit team upon their arrival. Please ensure that key personnel, including the Council Treasurer, Head of Human Resources, and other relevant officers, are available for interviews and clarifications.  
  
We anticipate your full cooperation to enable the timely completion of this exercise.  
  
Yours faithfully,  
  
**(Signed)**  
  
**State Auditor-General**  
Lagos State
`.trim();

            return {
              id: `letter-${uid()}-${lga.id}`,
              lgaId: lga.id,
              mandateId,
              status: "Draft" as LetterStatus,
              checklist: [...NOTIFICATION_CHECKLIST],
              content,
            };
          });
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
          message: "Notification letters sent to all Council contacts",
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

      setAuditMateriality: (data) => {
        set((s) => {
          const existing = s.materiality.find(
            (m) => m.auditId === data.auditId,
          );
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

      deleteQuestionnaireResponse: (auditId, questionId) => {
        set((s) => ({
          questionnaireResponses: s.questionnaireResponses.filter(
            (r) => !(r.auditId === auditId && r.questionId === questionId),
          ),
        }));
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

      /* ─── Council & Programme Template Helpers ─── */
      programmeTemplates: [...PROGRAMME_TEMPLATES],

      getCouncilsByType: (type) => {
        const all = get().lgas;
        if (!type) return all;
        return all.filter((c) => (c.councilType || "LGA") === type);
      },

      getLgaCount: () =>
        get().lgas.filter((c) => !c.councilType || c.councilType === "LGA")
          .length,

      getLcdaCount: () =>
        get().lgas.filter((c) => c.councilType === "LCDA").length,

      getTotalCouncilCount: () => get().lgas.length,

      getParentLga: (lcdaId) => {
        const lcda = get().lgas.find((c) => c.id === lcdaId);
        if (!lcda?.parentLgaId) return undefined;
        return get().lgas.find((c) => c.id === lcda.parentLgaId);
      },

      getChildLcdas: (lgaId) =>
        get().lgas.filter((c) => c.parentLgaId === lgaId),

      createProgrammeFromTemplate: (
        templateId,
        auditId,
        preparedBy,
        objectives,
        scope,
      ) => {
        const template = PROGRAMME_TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        const procedures: ProgrammeProcedure[] = template.sections.flatMap(
          (section) =>
            section.procedures.map((proc) => ({
              ...proc,
              id: `proc-${uid()}`,
              status: "Not Started" as const,
              assignedTo: undefined,
              evidenceUploaded: false,
            })),
        );

        const programme: AuditProgramme = {
          id: `prog-${uid()}`,
          auditId,
          templateId,
          objectives,
          scope,
          methodology: template.methodology,
          riskAreas: template.sections.map((s) => s.title),
          procedures,
          status: "Draft",
          preparedBy,
        };

        set((s) => ({ programmes: [...s.programmes, programme] }));
        get().addToast({
          type: "success",
          title: "Programme Generated",
          message: `Created from "${template.name}" template with ${procedures.length} procedures`,
        });
      },

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
      name: "audit-storage-v3",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
