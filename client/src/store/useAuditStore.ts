import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Audit,
  Task,
  Invitation,
  Mandate,
  MandateStatus,
  FinancialStatementItem,
  CompletionChecklistItem,
  CouncilType,
  NotificationLetter,
  Workpaper,
  AuditReport,
  AuditProgramme,
  ActivityLog,
  Zone,
  LGA,
  TaskStatus,
  LetterStatus,
  RiskMatrix,
  MaterialityThreshold,
  InternalControlTest,
  SubstantiveTest,
  FraudFlag,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  DocumentUpload,
  StageApproval,
  ProgrammeProcedure,
  FollowUpItem,
  LessonLearned,
  QualityReview,
  ExitConference,
  User,
  Notification,
  ProgrammeTemplate,
  AuditJournal,
  AuditComment,
  AuditWorkpaper,
  EntityProfile,
  IndependenceDeclaration,
  PreliminaryAnalytic,
  AuditStrategy,
  DocumentRequisition,
  ProcedureExecution,
  ProcedureEvidence,
  FieldworkException,
  ExceptionClassification,
  BankAccount,
  ContractFlag,
  VouchingChecklist,
  SiteVerification,
  FieldworkCompletionMemo,
  FieldworkWorkingPaper,
  BriefingRecord,
  EntryMeetingRecord,
} from "../types";
import type {
  AuditOutcome,
  TrialBalance,
  MaterialityCalc,
  StatementOfResponsibility,
  AuditReportDocument,
  AccountingPolicies,
  FinancialStatement,
  LgaAuditPackage,
} from "../types/auditOutcomes";
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
  SEED_RISK_MATRICES,
  SEED_MATERIALITY,
  SEED_CONTROL_TESTS,
  SEED_SUBSTANTIVE_TESTS,
  SEED_FRAUD_FLAGS,
  SEED_QUESTIONNAIRE_QUESTIONS,
  SEED_QUESTIONNAIRE_RESPONSES,
  SEED_DOCUMENT_UPLOADS,
  SEED_STAGE_APPROVALS,
  SEED_NOTIFICATIONS,
  PROGRAMME_TEMPLATES,
  SEED_AUDIT_JOURNALS,
  SEED_AUDIT_COMMENTS,
  SEED_FINANCIAL_STATEMENTS,
  SEED_COMPLETION_CHECKLIST,
  SEED_AUDIT_WORKPAPERS,
} from "../mock/data";
import {
  SEED_AUDIT_OUTCOMES_V2 as SEED_AUDIT_OUTCOMES,
  SEED_TRIAL_BALANCE_V2 as SEED_TRIAL_BALANCE,
  SEED_MATERIALITY_CALC_V2 as SEED_MATERIALITY_CALC,
  SEED_STATEMENT_OF_RESPONSIBILITY_V2 as SEED_STATEMENT_OF_RESPONSIBILITY,
  SEED_AUDIT_REPORT_STATE_V2 as SEED_AUDIT_REPORT_STATE,
  SEED_ACCOUNTING_POLICIES_V2 as SEED_ACCOUNTING_POLICIES,
  SEED_LGA_PACKAGES_V2,
  SEED_LGA_REPORTS_V2,
  SEED_LGA_FINANCIAL_STATEMENTS_V2,
} from "../mock/auditOutcomesData.v2";

import {
  SEED_CONSOL_SOFP,
  SEED_CONSOL_SOFPERF,
  SEED_CONSOL_CASHFLOW,
  SEED_CONSOL_NOTES,
} from "../mock/auditOutcomesData";

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

export interface AuditStore {
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
  questionnaireQuestions: QuestionnaireQuestion[];
  questionnaireResponses: QuestionnaireResponse[];
  documentUploads: DocumentUpload[];
  stageApprovals: StageApproval[];
  followUps: FollowUpItem[];
  lessonsLearned: LessonLearned[];
  qualityReviews: QualityReview[];
  exitConferences: ExitConference[];
  auditJournals: AuditJournal[];
  auditComments: AuditComment[];
  financialStatements: FinancialStatementItem[];
  completionChecklist: CompletionChecklistItem[];
  auditWorkpapers: AuditWorkpaper[];
  entityProfiles: EntityProfile[];
  independenceDeclarations: IndependenceDeclaration[];
  preliminaryAnalytics: PreliminaryAnalytic[];
  auditStrategies: AuditStrategy[];
  documentRequisitions: DocumentRequisition[];
  procedureExecutions: ProcedureExecution[];
  fieldworkExceptions: FieldworkException[];
  bankAccounts: BankAccount[];
  contractFlags: ContractFlag[];
  vouchingChecklists: VouchingChecklist[];
  siteVerifications: SiteVerification[];
  fieldworkMemos: FieldworkCompletionMemo[];
  fieldworkWorkingPapers: FieldworkWorkingPaper[];

  // â”€â”€â”€ Audit Outcomes slice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  auditOutcomes: AuditOutcome[];
  trialBalances: TrialBalance[];
  materialityCalcs: MaterialityCalc[];
  statementsOfResponsibility: StatementOfResponsibility[];
  auditReportDocuments: AuditReportDocument[];
  accountingPolicies: AccountingPolicies[];
  auditedFinancialStatements: FinancialStatement[];
  lgaAuditPackages: LgaAuditPackage[];

  /** arDocType selected in Analytical Review step, persisted per audit */
  auditDocSources: Record<string, "fs" | "tb">;
  setAuditDocSource: (auditId: string, source: "fs" | "tb") => void;

  uploadTrialBalance: (tb: TrialBalance) => void;
  removeTrialBalance: (id: string) => void;
  setMaterialityCalc: (calc: MaterialityCalc) => void;
  approveMateriality: (id: string, userId: string) => void;
  saveStatementOfResponsibility: (sor: StatementOfResponsibility) => void;
  saveAuditReportDocument: (doc: AuditReportDocument) => void;
  saveAccountingPolicies: (ap: AccountingPolicies) => void;
  saveFinancialStatement: (fs: FinancialStatement) => void;
  upsertLgaAuditPackage: (pkg: LgaAuditPackage) => void;
  markCompilationComplete: (outcomeId: string, pageCount: number) => void;

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
  signOffDocuments: (auditId: string, userId: string) => void;

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
  proposeAuditTimelines: (
    auditId: string,
    timelines: Record<string, { startDate: string; endDate: string }>,
  ) => void;
  approveAuditTimelines: (auditId: string) => void;
  addBriefingRecord: (
    auditId: string,
    record: Omit<BriefingRecord, "id" | "recordedAt">,
  ) => void;
  addEntryMeetingRecord: (
    auditId: string,
    record: Omit<EntryMeetingRecord, "id" | "recordedAt" | "auditId">,
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
  updateRiskMatrix: (id: string, updates: Partial<RiskMatrix>) => void;
  clearAllMitigations: (auditId: string) => void;
  addFraudFlag: (ff: Omit<FraudFlag, "id" | "raisedAt">) => void;
  resolveFraudFlag: (id: string, resolution: string) => void;

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

  /* â”€â”€â”€ Council & Programme Template Helpers â”€â”€â”€ */
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

  /* â”€â”€â”€ Audit Work Programme Deliverables â”€â”€â”€ */
  addAuditJournal: (journal: Omit<AuditJournal, "id" | "createdAt">) => void;
  updateAuditJournal: (id: string, updates: Partial<AuditJournal>) => void;
  getAuditJournals: (auditId: string) => AuditJournal[];

  addAuditComment: (comment: Omit<AuditComment, "id" | "createdAt">) => void;
  updateAuditComment: (id: string, updates: Partial<AuditComment>) => void;
  getAuditComments: (auditId: string) => AuditComment[];

  initFinancialStatements: (auditId: string) => void;
  updateFinancialStatement: (
    id: string,
    updates: Partial<FinancialStatementItem>,
  ) => void;
  getAuditFinancialStatements: (auditId: string) => FinancialStatementItem[];

  toggleCompletionItem: (id: string, userId: string) => void;
  getAuditCompletionChecklist: (auditId: string) => CompletionChecklistItem[];

  addAuditWorkpaper: (wp: Omit<AuditWorkpaper, "id">) => void;
  updateAuditWorkpaper: (id: string, updates: Partial<AuditWorkpaper>) => void;
  getAuditWorkpaperIndex: (auditId: string) => AuditWorkpaper[];

  /* â”€â”€â”€ Post-Audit Actions â”€â”€â”€ */
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

  saveEntityProfile: (profile: Omit<EntityProfile, "id" | "createdAt">) => void;
  getEntityProfile: (auditId: string) => EntityProfile | undefined;
  addIndependenceDeclaration: (
    decl: Omit<IndependenceDeclaration, "id">,
  ) => void;
  getIndependenceDeclarations: (auditId: string) => IndependenceDeclaration[];
  addPreliminaryAnalytic: (
    analytic: Omit<PreliminaryAnalytic, "id" | "createdAt">,
  ) => void;
  getAuditAnalytics: (auditId: string) => PreliminaryAnalytic[];
  generatePreliminaryAnalytics: (auditId: string, preparedBy: string) => void;
  updateAnalyticNote: (id: string, note: string) => void;
  saveAuditStrategy: (
    strategy: Omit<AuditStrategy, "id" | "createdAt">,
  ) => void;
  getAuditStrategy: (auditId: string) => AuditStrategy | undefined;
  updateAuditStrategy: (id: string, updates: Partial<AuditStrategy>) => void;
  generateProgrammeFromRisks: (auditId: string, preparedBy: string) => void;

  generateRequisitions: (auditId: string) => void;
  addDocumentRequisition: (req: Omit<DocumentRequisition, "id">) => void;
  updateRequisitionStatus: (
    id: string,
    status: DocumentRequisition["status"],
    fileName?: string,
    fileUrl?: string,
  ) => void;
  getAuditRequisitions: (auditId: string) => DocumentRequisition[];

  initProcedureExecutions: (auditId: string) => void;
  getProcedureExecutions: (auditId: string) => ProcedureExecution[];
  getProcedureExecution: (id: string) => ProcedureExecution | undefined;
  updateProcedureExecution: (
    id: string,
    updates: Partial<ProcedureExecution>,
  ) => void;
  addProcedureEvidence: (
    executionId: string,
    evidence: Omit<ProcedureEvidence, "id" | "code">,
  ) => void;
  removeProcedureEvidence: (executionId: string, evidenceId: string) => void;
  addProcedureTimeEntry: (executionId: string, minutes: number) => void;
  submitProcedureForReview: (executionId: string) => void;
  reviewProcedure: (
    executionId: string,
    reviewerId: string,
    action: "Clear" | "Return" | "Extend",
    comments?: string,
  ) => void;
  clearProcedure: (executionId: string, supervisorId: string) => void;

  addFieldworkException: (
    exc: Omit<FieldworkException, "id" | "ref" | "raisedAt">,
  ) => void;
  updateFieldworkException: (
    id: string,
    updates: Partial<FieldworkException>,
  ) => void;
  removeFieldworkException: (id: string) => void;
  classifyException: (
    id: string,
    classification: ExceptionClassification,
  ) => void;
  escalateExceptionToHlg: (id: string) => void;
  getAuditFieldworkExceptions: (auditId: string) => FieldworkException[];

  addBankAccount: (account: Omit<BankAccount, "id">) => void;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  getAuditBankAccounts: (auditId: string) => BankAccount[];

  addContractFlag: (flag: Omit<ContractFlag, "id">) => void;
  getAuditContractFlags: (auditId: string) => ContractFlag[];

  addVouchingChecklist: (checklist: Omit<VouchingChecklist, "id">) => void;
  updateVouchingChecklist: (
    id: string,
    updates: Partial<VouchingChecklist>,
  ) => void;
  getExecutionVouchingChecklist: (
    executionId: string,
  ) => VouchingChecklist | undefined;

  addSiteVerification: (sv: Omit<SiteVerification, "id">) => void;
  updateSiteVerification: (
    id: string,
    updates: Partial<SiteVerification>,
  ) => void;
  getExecutionSiteVerification: (
    executionId: string,
  ) => SiteVerification | undefined;

  createFieldworkMemo: (
    memo: Omit<FieldworkCompletionMemo, "id" | "createdAt">,
  ) => void;
  updateFieldworkMemo: (
    id: string,
    updates: Partial<FieldworkCompletionMemo>,
  ) => void;
  getAuditFieldworkMemo: (
    auditId: string,
  ) => FieldworkCompletionMemo | undefined;

  generateWorkingPaper: (executionId: string) => void;
  updateFieldworkWorkingPaper: (
    id: string,
    updates: Partial<FieldworkWorkingPaper>,
  ) => void;
  getAuditFieldworkWorkingPapers: (auditId: string) => FieldworkWorkingPaper[];
}

import { createNotificationsActions } from "./slices/notificationsSlice";
import { createUiActions } from "./slices/uiSlice";
import { createAuditOutcomesActions } from "./slices/auditOutcomesSlice";
import { createRiskActions } from "./slices/riskSlice";
import { createFieldworkExceptionsActions } from "./slices/fieldworkExceptionsSlice";
// riskSlice and fieldworkExceptionsSlice are used in the store spread below
import { createMandateActions } from "./slices/mandateSlice";
import { createAuditActions } from "./slices/auditSlice";
import { createProgrammeActions } from "./slices/programmeSlice";
import { createTaskInvitationActions } from "./slices/taskInvitationSlice";
import { createWorkpaperReportActions } from "./slices/workpaperReportSlice";
import { createDocumentQuestionnaireActions } from "./slices/documentQuestionnaireSlice";
import { createWorkDeliverableActions } from "./slices/workDeliverableSlice";
import { createPostAuditActions } from "./slices/postAuditSlice";
import { createPreAuditActions } from "./slices/preAuditSlice";
import { createRequisitionActions } from "./slices/requisitionSlice";
import { createProcedureExecutionActions } from "./slices/procedureExecutionSlice";
import { createVerificationActions } from "./slices/verificationSlice";

// --- Jide Johnson Patch ---
const jide = MOCK_USERS.find(
  (u) =>
    u.role === "AUDIT_LEAD" &&
    u.name &&
    u.name.includes("Jide") &&
    u.name.includes("Johnson"),
);
if (jide) {
  SEED_AUDITS.forEach((a) => {
    a.leadId = jide.id;
  });
  LGAS.forEach((l) => {
    l.auditLeadId = jide.id;
  });
}
// --------------------------

export const useAuditStore = create(
  persist<AuditStore>(
    (set, get) => ({
      notifications: [...SEED_NOTIFICATIONS],
      ...createNotificationsActions(set),

      users: [...MOCK_USERS],
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
      questionnaireQuestions: [...SEED_QUESTIONNAIRE_QUESTIONS],
      questionnaireResponses: [...SEED_QUESTIONNAIRE_RESPONSES],
      documentUploads: [...SEED_DOCUMENT_UPLOADS],
      stageApprovals: [...SEED_STAGE_APPROVALS],
      followUps: [],
      lessonsLearned: [],
      qualityReviews: [],
      exitConferences: [],
      auditJournals: [...SEED_AUDIT_JOURNALS],
      auditComments: [...SEED_AUDIT_COMMENTS],
      financialStatements: [...SEED_FINANCIAL_STATEMENTS],
      completionChecklist: [...SEED_COMPLETION_CHECKLIST],
      auditWorkpapers: [...SEED_AUDIT_WORKPAPERS],
      entityProfiles: [],
      independenceDeclarations: [],
      preliminaryAnalytics: [],
      auditStrategies: [],
      documentRequisitions: [],
      procedureExecutions: [],
      fieldworkExceptions: [],
      bankAccounts: [],
      contractFlags: [],
      vouchingChecklists: [],
      siteVerifications: [],
      fieldworkMemos: [],
      fieldworkWorkingPapers: [],

      auditOutcomes: [...SEED_AUDIT_OUTCOMES],
      trialBalances: [SEED_TRIAL_BALANCE],
      materialityCalcs: [SEED_MATERIALITY_CALC],
      statementsOfResponsibility: [SEED_STATEMENT_OF_RESPONSIBILITY],
      auditReportDocuments: [SEED_AUDIT_REPORT_STATE, ...SEED_LGA_REPORTS_V2],
      accountingPolicies: [SEED_ACCOUNTING_POLICIES],
      auditedFinancialStatements: [
        SEED_CONSOL_SOFP,
        SEED_CONSOL_SOFPERF,
        SEED_CONSOL_CASHFLOW,
        SEED_CONSOL_NOTES,
        ...SEED_LGA_FINANCIAL_STATEMENTS_V2,
      ],
      lgaAuditPackages: [...SEED_LGA_PACKAGES_V2],
      auditDocSources: {},
      programmeTemplates: [...PROGRAMME_TEMPLATES],

      setAuditDocSource: (auditId, source) =>
        set((s) => ({
          auditDocSources: { ...s.auditDocSources, [auditId]: source },
        })),

      toasts: [],
      modal: { isOpen: false, title: "", message: "" },

      ...createUiActions(set, get),
      ...createMandateActions(set, get),
      ...createAuditActions(set, get),
      ...createProgrammeActions(set, get),
      ...createTaskInvitationActions(set, get),
      ...createWorkpaperReportActions(set, get),
      ...createDocumentQuestionnaireActions(set, get),
      ...createWorkDeliverableActions(set, get),
      ...createPostAuditActions(set, get),
      ...createPreAuditActions(set, get),
      ...createRequisitionActions(set, get),
      ...createProcedureExecutionActions(set, get),
      ...createVerificationActions(set, get),
      ...createRiskActions(set),
      ...createFieldworkExceptionsActions(set, get),

      // ─── Audit Outcomes actions ──────────────────────────────
      ...createAuditOutcomesActions(set),
    }),
    {
      name: "audit-storage-v16",
      version: 21,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        const state = persistedState as AuditStore;
        if (version < 17) {
          return {
            ...state,
            auditJournals: [],
            auditComments: [],
            auditWorkpapers: [],
            reports: [],
          };
        }
        if (version < 18) {
          return {
            ...state,
            auditWorkpapers: [],
          };
        }
        if (version < 21) {
          // Re-seed users and audits so every audit lead (curated, primary
          // LGA generated, and bench) has at least one audit in My Audits.
          return {
            ...state,
            users: [...MOCK_USERS],
            audits: [...SEED_AUDITS],
          };
        }
        return state;
      },
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { questionnaireQuestions, ...rest } = state;
        return rest as typeof state;
      },
    },
  ),
);
