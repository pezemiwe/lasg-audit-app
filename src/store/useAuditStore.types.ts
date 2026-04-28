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

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export interface ModalState {
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
