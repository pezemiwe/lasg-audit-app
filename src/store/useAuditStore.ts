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
  AuditProgrammeSection,
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
  AuditJournal,
  AuditComment,
  FinancialStatementItem,
  CompletionChecklistItem,
  AuditWorkpaper,
  EntityProfile,
  IndependenceDeclaration,
  PreliminaryAnalytic,
  AuditStrategy,
  AnalyticFlag,
  DocumentRequisition,
  ProcedureExecution,
  ProcedureExecutionStatus,
  ProcedureEvidence,
  FieldworkException,
  ExceptionClassification,
  ReviewComment,
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
import { getSuggestedProcedures } from "../utils/auditLogic";

/* ─── Helpers for building section metadata ─── */
const RISK_KEY_RISKS: Record<string, string[]> = {
  "Revenue & Receipts": [
    "Revenue recognition at inappropriate times (cut-off errors)",
    "Fictitious revenue (existence)",
    "Unrecorded receipts (completeness)",
    "Manipulation of revenue figures to meet targets (fraud)",
  ],
  "Expenditure & Payments": [
    "Expenditure recorded without proper authorisation",
    "Fictitious or inflated payment vouchers",
    "Misclassification of expenditure heads",
    "Unrecorded liabilities at period end",
  ],
  "Payroll & Personnel Costs": [
    "Ghost workers on the payroll",
    "Incorrect salary computation or grade placement",
    "Unauthorised payroll changes",
    "Non-remittance of statutory deductions",
  ],
  "Bank & Cash Management": [
    "Unauthorised bank accounts",
    "Stale or fraudulent reconciling items",
    "Cash handling irregularities",
    "Inadequate controls over bank signatories",
  ],
  "Procurement & Contracts": [
    "Non-compliance with Public Procurement Act",
    "Contract splitting to avoid thresholds",
    "Conflict of interest in contract award",
    "Overpayment for goods/services not delivered",
  ],
  "Fixed Assets & Capital Projects": [
    "Unrecorded or fictitious assets",
    "Assets not physically verified",
    "Improper disposal without authorisation",
    "Capital projects not completed as per contract",
  ],
};

const buildDefaultKeyRisks = (sectionTitle: string): string[] =>
  RISK_KEY_RISKS[sectionTitle] ?? [
    "Risk of material misstatement in this area",
    "Potential non-compliance with applicable regulations",
    "Fraud risk: manipulation or misrepresentation",
  ];

const buildDefaultDocNotes = (sectionTitle: string): string =>
  `Document all procedures performed for ${sectionTitle}. Retain copies of key supporting documents (sample selections, confirmations, reconciliations). Cross-reference all evidence to the relevant workpaper.`;

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
  scopeAgreements: ScopeAgreement[];
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

  // ─── Audit Outcomes slice ───────────────────────────────
  auditOutcomes: AuditOutcome[];
  trialBalances: TrialBalance[];
  materialityCalcs: MaterialityCalc[];
  statementsOfResponsibility: StatementOfResponsibility[];
  auditReportDocuments: AuditReportDocument[];
  accountingPolicies: AccountingPolicies[];
  auditedFinancialStatements: FinancialStatement[];
  lgaAuditPackages: LgaAuditPackage[];

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

  /* ─── Audit Work Programme Deliverables ─── */
  addAuditJournal: (journal: Omit<AuditJournal, "id" | "createdAt">) => void;
  updateAuditJournal: (id: string, updates: Partial<AuditJournal>) => void;
  getAuditJournals: (auditId: string) => AuditJournal[];

  addAuditComment: (comment: Omit<AuditComment, "id" | "createdAt">) => void;
  updateAuditComment: (id: string, updates: Partial<AuditComment>) => void;
  getAuditComments: (auditId: string) => AuditComment[];

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

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

import { createNotificationsActions } from "./slices/notificationsSlice";
import { createUiActions } from "./slices/uiSlice";
import { createAuditOutcomesActions } from "./slices/auditOutcomesSlice";
import { createScopeActions } from "./slices/scopeSlice";
import { createRiskActions } from "./slices/riskSlice";
import { createFieldworkExceptionsActions } from "./slices/fieldworkExceptionsSlice";

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
      scopeAgreements: [...SEED_SCOPE_AGREEMENTS],
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

      toasts: [],
      modal: { isOpen: false, title: "", message: "" },

      ...createUiActions(set, get),

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
        const { mandates, users } = get();
        const mandate = mandates.find((m) => m.id === id);
        get().logActivity({
          userId: mandate?.createdBy || "",
          action: "PUBLISH_MANDATE",
          details: `Published audit mandate: ${mandate?.title}`,
          entityType: "mandate",
          entityId: id,
        });
        // Notify every user in the system about the published mandate
        if (mandate) {
          get().addNotifications(
            users.map((u) => ({
              id: `notif-pub-${id}-${u.id}`,
              userId: u.id,
              type: "info" as const,
              title: "New Audit Mandate Published",
              message: `${mandate.title} has been published and is now active.`,
              isRead: false,
              timestamp: now(),
              relatedEntityId: id,
              relatedEntityType: "mandate" as const,
            })),
          );
        }
        get().addToast({
          type: "success",
          title: "Mandate Published",
          message:
            "The audit mandate is now active and all users have been notified",
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
                documentName: "Annual Financial Statements",
                description:
                  "Complete audited or unaudited financial statements for the preceding 3 fiscal years",
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
                documentName: "Staff Establishment and Payroll Records",
                description:
                  "Complete staff list with grades, positions, and 12-month payroll records",
                requiredFormat: "Excel",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-5`,
                lgaId,
                mandateId,
                documentName: "Revenue Collection Records",
                description:
                  "IGR collection records, receipts, and revenue schedules",
                requiredFormat: "Excel/PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-6`,
                lgaId,
                mandateId,
                documentName: "Capital Project Files",
                description:
                  "Contract documents, project files, and completion certificates for all capital projects",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-7`,
                lgaId,
                mandateId,
                documentName: "Procurement Records",
                description:
                  "Procurement documentation, bid evaluations, due process certificates, and contract awards",
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
                description:
                  "Complete fixed asset register with acquisition details, locations, and current values",
                requiredFormat: "Excel",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-9`,
                lgaId,
                mandateId,
                documentName: "Tenders Board Minutes",
                description:
                  "Minutes of Tenders Board and Finance Committee meetings for the audit period",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-10`,
                lgaId,
                mandateId,
                documentName: "Internal Audit Reports",
                description:
                  "Internal audit reports and management responses for the audit period",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-11`,
                lgaId,
                mandateId,
                documentName: "Cash Books and Ledgers",
                description:
                  "Complete cash books and general ledger for all LGA accounts",
                requiredFormat: "Excel",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-12`,
                lgaId,
                mandateId,
                documentName: "Previous Audit Reports",
                description:
                  "Previous external audit reports and management responses",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-13`,
                lgaId,
                mandateId,
                documentName: "Payment Vouchers",
                description:
                  "Payment vouchers and supporting expenditure documentation for the audit period",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-14`,
                lgaId,
                mandateId,
                documentName: "Budget Implementation Report",
                description:
                  "Quarterly and annual budget performance reports showing actual versus approved expenditure",
                requiredFormat: "PDF",
                status: "Not Uploaded",
                version: 1,
                dueDate,
              },
              {
                id: `doc-${mandateId}-${lgaId}-15`,
                lgaId,
                mandateId,
                documentName: "Management Letter Responses",
                description:
                  "LGA responses to previous audit management letters and outstanding audit queries",
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

      signOffDocuments: (auditId, userId) => {
        set((s) => {
          const newAudits = [...s.audits];
          const aIdx = newAudits.findIndex((a) => a.id === auditId);
          if (aIdx >= 0) {
            newAudits[aIdx] = {
              ...newAudits[aIdx],
              documentsSignedOff: true,
              documentsSignedOffAt: new Date().toISOString(),
              documentsSignedOffBy: userId,
            };
          }
          return { audits: newAudits };
        });
        get().addToast({
          type: "success",
          title: "Sign-off Complete",
          message: "All requested documents have been signed-off successfully.",
        });
      },

      ensureDocumentsExist: (mandateId, lgaId) => {
        set((s) => {
          const mandate = s.mandates.find((m) => m.id === mandateId);
          const dueDate = mandate?.endDate || new Date().toISOString();

          // Define the full list of Required Documents
          const allRequiredDocs: DocumentUpload[] = [
            {
              id: `doc-${mandateId}-${lgaId}-1`,
              lgaId,
              mandateId,
              documentName: "Annual Financial Statements",
              description:
                "Complete audited or unaudited financial statements for the preceding 3 fiscal years",
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
              documentName: "Staff Establishment and Payroll Records",
              description:
                "Complete staff list with grades, positions, and 12-month payroll records",
              requiredFormat: "Excel",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-5`,
              lgaId,
              mandateId,
              documentName: "Revenue Collection Records",
              description:
                "IGR collection records, receipts, and revenue schedules",
              requiredFormat: "Excel/PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-6`,
              lgaId,
              mandateId,
              documentName: "Capital Project Files",
              description:
                "Contract documents, project files, and completion certificates for all capital projects",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-7`,
              lgaId,
              mandateId,
              documentName: "Procurement Records",
              description:
                "Procurement documentation, bid evaluations, due process certificates, and contract awards",
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
              description:
                "Complete fixed asset register with acquisition details, locations, and current values",
              requiredFormat: "Excel",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-9`,
              lgaId,
              mandateId,
              documentName: "Tenders Board Minutes",
              description:
                "Minutes of Tenders Board and Finance Committee meetings for the audit period",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-10`,
              lgaId,
              mandateId,
              documentName: "Internal Audit Reports",
              description:
                "Internal audit reports and management responses for the audit period",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-11`,
              lgaId,
              mandateId,
              documentName: "Cash Books and Ledgers",
              description:
                "Complete cash books and general ledger for all LGA accounts",
              requiredFormat: "Excel",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-12`,
              lgaId,
              mandateId,
              documentName: "Previous Audit Reports",
              description:
                "Previous external audit reports and management responses",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-13`,
              lgaId,
              mandateId,
              documentName: "Payment Vouchers",
              description:
                "Payment vouchers and supporting expenditure documentation for the audit period",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-14`,
              lgaId,
              mandateId,
              documentName: "Budget Implementation Report",
              description:
                "Quarterly and annual budget performance reports showing actual versus approved expenditure",
              requiredFormat: "PDF",
              status: "Not Uploaded",
              version: 1,
              dueDate,
            },
            {
              id: `doc-${mandateId}-${lgaId}-15`,
              lgaId,
              mandateId,
              documentName: "Management Letter Responses",
              description:
                "LGA responses to previous audit management letters and outstanding audit queries",
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

          // Get docs running outside this mandate/lga context so we can keep them
          const otherDocs = s.documentUploads.filter(
            (d) => !(d.mandateId === mandateId && d.lgaId === lgaId),
          );

          const requiredNames = allRequiredDocs.map((r) => r.documentName);
          const validExistingDocs = existingDocs.filter((d) =>
            requiredNames.includes(d.documentName),
          );

          const missingDocs = allRequiredDocs.filter((req) => {
            const exists = validExistingDocs.some(
              (ex) => ex.documentName === req.documentName,
            );
            return !exists;
          });

          // If no docs are missing and none are obsolete, no-op
          if (
            missingDocs.length === 0 &&
            existingDocs.length === validExistingDocs.length
          )
            return {};

          return {
            documentUploads: [
              ...otherDocs,
              ...validExistingDocs,
              ...missingDocs,
            ],
          };
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

      assignLead: (lgaId, leadId, auditId, mandateId) => {
        set((s) => {
          // Check if an audit exists for this lga/mandate combination
          let updatedAudits = [...s.audits];
          const auditExists = updatedAudits.some((a) => a.id === auditId);

          if (auditExists) {
            updatedAudits = updatedAudits.map((a) =>
              a.id === auditId ? { ...a, leadId } : a,
            );
          } else {
            // Create a new audit object for this assignment
            updatedAudits.push({
              id: auditId,
              lgaId,
              type: "Financial",
              year: new Date().getFullYear(),
              status: "Pending",
              mandateId,
              leadId,
              progress: 0,
            });
          }

          return {
            lgas: s.lgas.map((l) =>
              l.id === lgaId ? { ...l, auditLeadId: leadId } : l,
            ),
            audits: updatedAudits,
            users: s.users.map((u) => (u.id === leadId ? { ...u, lgaId } : u)),
          };
        });
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

      ...createRiskActions(set),

      ...createScopeActions(set, get),

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

        /* Build risk-area sections from template */
        const sections: AuditProgrammeSection[] = template.sections.map(
          (sec) => ({
            id: `sec-${uid()}`,
            title: sec.title,
            auditObjectives: [sec.objective],
            riskLevel: sec.riskLevel,
            keyRisks: buildDefaultKeyRisks(sec.title),
            documentationNotes: buildDefaultDocNotes(sec.title),
            sortOrder: sec.sortOrder,
          }),
        );

        const programme: AuditProgramme = {
          id: `prog-${uid()}`,
          auditId,
          templateId,
          objectives,
          scope,
          methodology: template.methodology,
          riskAreas: template.sections.map((s) => s.title),
          sections,
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

      /* ─── Audit Work Programme Deliverables ─── */
      addAuditJournal: (data) => {
        const journal: AuditJournal = {
          ...data,
          id: `aj-${uid()}`,
          createdAt: now(),
        };
        set((s) => ({ auditJournals: [...s.auditJournals, journal] }));
        get().addToast({
          type: "success",
          title: "Audit Journal Added",
          message: journal.journalNumber,
        });
      },

      updateAuditJournal: (id, updates) =>
        set((s) => ({
          auditJournals: s.auditJournals.map((j) =>
            j.id === id ? { ...j, ...updates } : j,
          ),
        })),

      getAuditJournals: (auditId) =>
        get().auditJournals.filter((j) => j.auditId === auditId),

      addAuditComment: (data) => {
        const comment: AuditComment = {
          ...data,
          id: `ac-${uid()}`,
          createdAt: now(),
        };
        set((s) => ({ auditComments: [...s.auditComments, comment] }));
        get().addToast({
          type: "success",
          title: "Audit Comment Added",
          message: comment.referenceNumber,
        });
      },

      updateAuditComment: (id, updates) =>
        set((s) => ({
          auditComments: s.auditComments.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      getAuditComments: (auditId) =>
        get().auditComments.filter((c) => c.auditId === auditId),

      updateFinancialStatement: (id, updates) =>
        set((s) => ({
          financialStatements: s.financialStatements.map((f) =>
            f.id === id ? { ...f, ...updates } : f,
          ),
        })),

      getAuditFinancialStatements: (auditId) =>
        get().financialStatements.filter((f) => f.auditId === auditId),

      toggleCompletionItem: (id, userId) =>
        set((s) => ({
          completionChecklist: s.completionChecklist.map((c) =>
            c.id === id
              ? {
                  ...c,
                  completed: !c.completed,
                  completedBy: !c.completed ? userId : undefined,
                  completedAt: !c.completed ? now() : undefined,
                }
              : c,
          ),
        })),

      getAuditCompletionChecklist: (auditId) =>
        get().completionChecklist.filter((c) => c.auditId === auditId),

      addAuditWorkpaper: (data) => {
        const wp: AuditWorkpaper = { ...data, id: `awp-${uid()}` };
        set((s) => ({ auditWorkpapers: [...s.auditWorkpapers, wp] }));
        get().addToast({
          type: "success",
          title: "Workpaper Indexed",
          message: wp.reference,
        });
      },

      updateAuditWorkpaper: (id, updates) =>
        set((s) => ({
          auditWorkpapers: s.auditWorkpapers.map((w) =>
            w.id === id ? { ...w, ...updates } : w,
          ),
        })),

      getAuditWorkpaperIndex: (auditId) =>
        get().auditWorkpapers.filter((w) => w.auditId === auditId),

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

      saveEntityProfile: (data) => {
        set((s) => {
          const existing = s.entityProfiles.find(
            (p) => p.auditId === data.auditId,
          );
          const profile: EntityProfile = {
            ...data,
            id: existing ? existing.id : `ep-${uid()}`,
            createdAt: existing ? existing.createdAt : now(),
          };
          return {
            entityProfiles: existing
              ? s.entityProfiles.map((p) =>
                  p.auditId === data.auditId ? profile : p,
                )
              : [...s.entityProfiles, profile],
          };
        });
        get().addToast({ type: "success", title: "Entity Profile Saved" });
      },

      getEntityProfile: (auditId) =>
        get().entityProfiles.find((p) => p.auditId === auditId),

      addIndependenceDeclaration: (data) => {
        const decl: IndependenceDeclaration = { ...data, id: `ind-${uid()}` };
        set((s) => ({
          independenceDeclarations: [...s.independenceDeclarations, decl],
        }));
        get().addToast({
          type: "success",
          title: "Independence Declaration Filed",
        });
        get().logActivity({
          userId: data.auditorId,
          action: "INDEPENDENCE_DECLARATION",
          details: `${data.auditorName} filed independence declaration`,
          entityType: "audit",
          entityId: data.auditId,
        });
      },

      getIndependenceDeclarations: (auditId) =>
        get().independenceDeclarations.filter((d) => d.auditId === auditId),

      addPreliminaryAnalytic: (data) => {
        const analytic: PreliminaryAnalytic = {
          ...data,
          id: `pa-${uid()}`,
          createdAt: now(),
        };
        set((s) => ({
          preliminaryAnalytics: [...s.preliminaryAnalytics, analytic],
        }));
      },

      getAuditAnalytics: (auditId) =>
        get().preliminaryAnalytics.filter((a) => a.auditId === auditId),

      generatePreliminaryAnalytics: (auditId, preparedBy) => {
        const existing = get().preliminaryAnalytics.filter(
          (a) => a.auditId === auditId,
        );
        if (existing.length > 0) return;

        const computeFlag = (variance: number): AnalyticFlag => {
          if (variance > 15) return "Investigate";
          if (variance > 5) return "Adverse";
          if (variance < -5) return "Favorable";
          return "Neutral";
        };

        const metrics: Omit<PreliminaryAnalytic, "id" | "createdAt">[] = [
          {
            auditId,
            category: "Revenue",
            metric: "FAAC Allocation",
            priorYear: 2_850_000_000,
            currentYear: 3_120_000_000,
            variance: 270_000_000,
            variancePercent: 9.47,
            flag: "Neutral",
            preparedBy,
          },
          {
            auditId,
            category: "Revenue",
            metric: "Internally Generated Revenue (IGR)",
            priorYear: 680_000_000,
            currentYear: 540_000_000,
            variance: -140_000_000,
            variancePercent: -20.59,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Revenue",
            metric: "Grants & Transfers",
            priorYear: 320_000_000,
            currentYear: 410_000_000,
            variance: 90_000_000,
            variancePercent: 28.13,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Expenditure",
            metric: "Personnel Costs",
            priorYear: 1_750_000_000,
            currentYear: 1_920_000_000,
            variance: 170_000_000,
            variancePercent: 9.71,
            flag: "Adverse",
            preparedBy,
          },
          {
            auditId,
            category: "Expenditure",
            metric: "Overhead Costs",
            priorYear: 450_000_000,
            currentYear: 620_000_000,
            variance: 170_000_000,
            variancePercent: 37.78,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Expenditure",
            metric: "Capital Expenditure",
            priorYear: 980_000_000,
            currentYear: 850_000_000,
            variance: -130_000_000,
            variancePercent: -13.27,
            flag: "Favorable",
            preparedBy,
          },
          {
            auditId,
            category: "Balance Sheet",
            metric: "Total Assets",
            priorYear: 5_200_000_000,
            currentYear: 5_450_000_000,
            variance: 250_000_000,
            variancePercent: 4.81,
            flag: "Neutral",
            preparedBy,
          },
          {
            auditId,
            category: "Balance Sheet",
            metric: "Total Liabilities",
            priorYear: 1_100_000_000,
            currentYear: 1_580_000_000,
            variance: 480_000_000,
            variancePercent: 43.64,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Balance Sheet",
            metric: "Cash & Bank Balances",
            priorYear: 420_000_000,
            currentYear: 180_000_000,
            variance: -240_000_000,
            variancePercent: -57.14,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Ratio",
            metric: "Personnel Cost / Total Revenue",
            priorYear: 45,
            currentYear: 47,
            variance: 2,
            variancePercent: 4.44,
            flag: "Neutral",
            preparedBy,
          },
          {
            auditId,
            category: "Ratio",
            metric: "IGR / Total Revenue",
            priorYear: 18,
            currentYear: 13,
            variance: -5,
            variancePercent: -27.78,
            flag: "Investigate",
            preparedBy,
          },
          {
            auditId,
            category: "Ratio",
            metric: "Capital Execution Rate",
            priorYear: 72,
            currentYear: 58,
            variance: -14,
            variancePercent: -19.44,
            flag: "Adverse",
            preparedBy,
          },
        ];

        metrics.forEach((m) => {
          m.flag = computeFlag(Math.abs(m.variancePercent));
          get().addPreliminaryAnalytic(m);
        });

        get().addToast({
          type: "success",
          title: "Analytics Generated",
          message: `${metrics.length} preliminary analytics computed`,
        });
        get().logActivity({
          userId: preparedBy,
          action: "GENERATE_ANALYTICS",
          details: "Preliminary analytical procedures computed",
          entityType: "audit",
          entityId: auditId,
        });
      },

      updateAnalyticNote: (id, note) =>
        set((s) => ({
          preliminaryAnalytics: s.preliminaryAnalytics.map((a) =>
            a.id === id ? { ...a, investigationNote: note } : a,
          ),
        })),

      saveAuditStrategy: (data) => {
        set((s) => {
          const existing = s.auditStrategies.find(
            (st) => st.auditId === data.auditId,
          );
          const strategy: AuditStrategy = {
            ...data,
            id: existing ? existing.id : `strat-${uid()}`,
            createdAt: existing ? existing.createdAt : now(),
          };
          return {
            auditStrategies: existing
              ? s.auditStrategies.map((st) =>
                  st.auditId === data.auditId ? strategy : st,
                )
              : [...s.auditStrategies, strategy],
          };
        });
        get().addToast({ type: "success", title: "Audit Strategy Saved" });
      },

      getAuditStrategy: (auditId) =>
        get().auditStrategies.find((st) => st.auditId === auditId),

      updateAuditStrategy: (id, updates) =>
        set((s) => ({
          auditStrategies: s.auditStrategies.map((st) =>
            st.id === id ? { ...st, ...updates } : st,
          ),
        })),

      generateProgrammeFromRisks: (auditId, preparedBy) => {
        const s = get();
        const risks = s.riskMatrices.filter((r) => r.auditId === auditId);
        const mat = s.materiality.find((m) => m.auditId === auditId);
        if (risks.length === 0) {
          get().addToast({
            type: "error",
            title: "Cannot Generate Programme",
            message: "Add risk matrix entries first",
          });
          return;
        }
        const existing = s.programmes.find((p) => p.auditId === auditId);
        if (existing) {
          get().addToast({
            type: "info",
            title: "Programme Exists",
            message: "A programme already exists for this audit",
          });
          return;
        }

        const sections: AuditProgrammeSection[] = risks.map((risk, i) => ({
          id: `sec-${uid()}`,
          title: risk.area,
          auditObjectives: [`Obtain reasonable assurance over ${risk.area}`],
          riskLevel: risk.overallRisk,
          riskMatrixRef: risk.id,
          keyRisks: buildDefaultKeyRisks(risk.area),
          documentationNotes: buildDefaultDocNotes(risk.area),
          sortOrder: i + 1,
        }));

        const procedures: ProgrammeProcedure[] = risks.flatMap((risk) => {
          const suggested = getSuggestedProcedures(risk.area);
          return suggested.map((proc) => ({
            id: `proc-${uid()}`,
            area: risk.area,
            procedure: proc,
            status: "Not Started" as const,
          }));
        });

        const programme: AuditProgramme = {
          id: `prog-${uid()}`,
          auditId,
          objectives:
            "Express an opinion on the financial statements and ensure compliance with applicable laws and regulations",
          scope: risks.map((r) => r.area).join(", "),
          methodology:
            "Risk-based audit approach combining substantive and control testing",
          materialityReference: mat
            ? `Overall Materiality: ₦${mat.overallMateriality.toLocaleString()}`
            : undefined,
          riskAreas: risks.map((r) => r.area),
          sections,
          procedures,
          status: "Draft",
          preparedBy,
        };

        set((st) => ({ programmes: [...st.programmes, programme] }));
        get().addToast({
          type: "success",
          title: "Programme Auto-Generated",
          message: `${procedures.length} procedures from ${risks.length} risk areas`,
        });
        get().logActivity({
          userId: preparedBy,
          action: "GENERATE_PROGRAMME",
          details: `Auto-generated audit programme from risk matrix`,
          entityType: "audit",
          entityId: auditId,
        });
      },

      generateRequisitions: (auditId) => {
        const s = get();
        const prog = s.programmes.find((p) => p.auditId === auditId);
        if (!prog) return;
        const existing = s.documentRequisitions.filter(
          (r) => r.auditId === auditId,
        );
        if (existing.length > 0) return;
        const docMap: Record<
          string,
          { doc: string; area: string; procIds: string[] }
        > = {};
        const REQ_DOCS: Record<string, string[]> = {
          "Payroll & Personnel Costs": [
            "Nominal roll — Current FY",
            "Payroll schedules — all months",
            "Biometric register extract",
            "PAYE deduction schedules",
            "LIRS payment receipts",
            "Pension deduction schedules",
            "PFA remittance confirmations",
          ],
          "Revenue & Receipts": [
            "FAAC remittance advice — all months",
            "IGR collection schedule by revenue head",
            "Revenue cashbook / ledger",
          ],
          "Bank & Cash Management": [
            "Bank statements — all accounts FY",
            "Entity account listing (declared)",
            "Cashbook — all accounts",
          ],
          "Procurement & Contracts": [
            "Contract register FY",
            "Payment vouchers — full year",
            "Tender board minutes",
          ],
          "Fixed Assets & Capital Projects": [
            "Fixed asset register",
            "Capital project contract files",
            "Interim Payment Certificates",
          ],
          "Advances & Imprest": ["Advances register FY"],
          "Stores & Inventory": ["Stores ledger / inventory listing"],
          "Grants (UBEC / PHC)": [
            "Grant award letters / disbursement schedules",
            "Grant account bank statements",
            "Grant expenditure listing",
          ],
        };
        prog.procedures.forEach((proc) => {
          const area = proc.area;
          const docs = REQ_DOCS[area] || [];
          docs.forEach((doc) => {
            const key = `${area}::${doc}`;
            if (!docMap[key]) docMap[key] = { doc, area, procIds: [] };
            docMap[key].procIds.push(proc.id);
          });
        });
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        const deadlineStr = deadline.toISOString().split("T")[0];
        let idx = 1;
        const reqs: DocumentRequisition[] = Object.values(docMap).map(
          (entry) => ({
            id: uid(),
            auditId,
            ref: `REQ-${String(idx++).padStart(3, "0")}`,
            documentName: entry.doc,
            auditArea: entry.area,
            neededBy: deadlineStr,
            status: "Pending" as const,
            linkedProcedureIds: entry.procIds,
          }),
        );
        set((st) => ({
          documentRequisitions: [...st.documentRequisitions, ...reqs],
        }));
      },

      addDocumentRequisition: (req) =>
        set((s) => ({
          documentRequisitions: [
            ...s.documentRequisitions,
            { ...req, id: uid() },
          ],
        })),

      updateRequisitionStatus: (id, status, fileName, fileUrl) =>
        set((s) => ({
          documentRequisitions: s.documentRequisitions.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  ...(status === "Issued" ? { issuedAt: now() } : {}),
                  ...(status === "Received"
                    ? {
                        receivedAt: now(),
                        receivedFileName: fileName,
                        receivedFileUrl: fileUrl,
                      }
                    : {}),
                }
              : r,
          ),
        })),

      getAuditRequisitions: (auditId) =>
        get().documentRequisitions.filter((r) => r.auditId === auditId),

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
        const reqs = s.documentRequisitions.filter(
          (r) => r.auditId === auditId,
        );
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
        const areaCode =
          pe.auditArea.replace(/[^A-Z]/g, "").slice(0, 4) || "GEN";
        const evIdx = pe.evidence.length + 1;
        const code = `EV-${areaCode}-${pe.procedureRef.split("-")[1] || "000"}-${String.fromCharCode(64 + evIdx)}`;
        const newEv: ProcedureEvidence = {
          ...evidence,
          id: uid(),
          code,
        } as ProcedureEvidence;
        set((s) => ({
          procedureExecutions: s.procedureExecutions.map((p) =>
            p.id === executionId
              ? { ...p, evidence: [...p.evidence, newEv] }
              : p,
          ),
        }));
      },

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
                    s.users.find((u) => u.id === reviewerId)?.name ||
                    reviewerId,
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
            if (action === "Return")
              return {
                ...pe,
                status: "In Progress" as const,
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

      ...createFieldworkExceptionsActions(set, get),

      addBankAccount: (account) =>
        set((s) => ({
          bankAccounts: [...s.bankAccounts, { ...account, id: uid() }],
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
          contractFlags: [...s.contractFlags, { ...flag, id: uid() }],
        })),

      getAuditContractFlags: (auditId) =>
        get().contractFlags.filter((f) => f.auditId === auditId),

      addVouchingChecklist: (checklist) =>
        set((s) => ({
          vouchingChecklists: [
            ...s.vouchingChecklists,
            { ...checklist, id: uid() },
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
          siteVerifications: [...s.siteVerifications, { ...sv, id: uid() }],
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
            { ...memo, id: uid(), createdAt: now() },
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
        const existing = s.fieldworkWorkingPapers.find(
          (wp) => wp.procedureExecutionId === executionId,
        );
        if (existing) return;
        const areaCode =
          pe.auditArea.replace(/[^A-Z]/g, "").slice(0, 3) || "GEN";
        const wpRef = `WP-${areaCode}-${pe.procedureRef.split("-")[1] || "000"}`;
        const exceptions = s.fieldworkExceptions.filter((e) =>
          pe.exceptionIds.includes(e.id),
        );
        const wp: FieldworkWorkingPaper = {
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
          preparedAt: now(),
          reviewStatus: "Prepared",
        };
        set((st) => ({
          fieldworkWorkingPapers: [...st.fieldworkWorkingPapers, wp],
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

      // ─── Audit Outcomes actions ───────────────────────────
      ...createAuditOutcomesActions(set),
    }),
    {
      name: "audit-storage-v16",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { questionnaireQuestions, ...rest } = state;
        return rest as typeof state;
      },
    },
  ),
);
