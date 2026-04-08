export type Role =
  | "SYSTEM_ADMIN"
  | "STATE_AUDITOR_GENERAL"
  | "AUDIT_SUPERVISOR"
  | "AUDIT_LEAD"
  | "TEAM_AUDITOR"
  | "AUDITOR_GENERAL_FEDERATION"
  | "HEAD_OF_LOCAL_GOVERNMENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  zoneId?: string;
  lgaId?: string;
  specialisations?: AuditType[];
  workload?: number;
  experience?: string[];
  phone?: string;
}

export type ZoneName = "Ikeja" | "Lagos Island" | "Ikorodu" | "Badagry" | "Epe";

export type CouncilType = "LGA" | "LCDA";

export interface Zone {
  id: string;
  name: ZoneName;
  supervisorIds?: string[];
  lgas: string[];
}

export interface LGA {
  id: string;
  name: string;
  zoneId: string;
  councilType?: CouncilType;
  parentLgaId?: string;
  auditLeadId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  documentsSubmitted?: boolean;
}

export type AuditType = "Financial" | "Performance" | "Compliance" | "Combined";

export type AuditStatus =
  | "Pending"
  | "Pre-Audit"
  | "Planning"
  | "Fieldwork"
  | "Review"
  | "Reporting"
  | "Post-Audit"
  | "Completed";

export type MandateStatus = "Draft" | "Published" | "Active" | "Completed";

export interface Mandate {
  id: string;
  title: string;
  auditYear: number;
  scope: string;
  objectives: string;
  timelines: string;
  startDate: string;
  endDate: string;
  auditTypes: AuditType[];
  status: MandateStatus;
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
  auditorGeneralSignature?: string;
  acceptedByLgas?: string[];
}

export type AuditPhase =
  | "Pre-Audit"
  | "Planning"
  | "Fieldwork"
  | "Review"
  | "Reporting"
  | "Post-Audit";

export interface PhaseTimeline {
  startDate: string;
  endDate: string;
}

export interface Audit {
  id: string;
  lgaId: string;
  type: AuditType;
  year: number;
  status: AuditStatus;
  startDate?: string;
  endDate?: string;
  phaseTimelines?: Partial<Record<AuditPhase, PhaseTimeline>>;
  mandateId: string;
  leadId?: string;
  teamIds?: string[];
  progress: number;
  entryMeetingDate?: string;
  entryMeetingNotes?: string;
}

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type AuditAssertion =
  | "Existence/Occurrence"
  | "Completeness"
  | "Accuracy/Valuation"
  | "Rights & Obligations"
  | "Presentation & Disclosure"
  | "Cut-off";

export interface RiskMatrix {
  id: string;
  auditId: string;
  area: string;
  inherentRisk: RiskLevel;
  controlRisk: RiskLevel;
  detectionRisk: RiskLevel;
  overallRisk: RiskLevel;
  mitigationPlan: string;
  status: "Open" | "Mitigated" | "Accepted";
  preparedBy: string;
  createdAt: string;
}

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: string;
  link?: string;
  relatedEntityId?: string;
  relatedEntityType?: "mandate" | "audit" | "report" | "document" | "system";
}

export interface MaterialityThreshold {
  id: string;
  auditId: string;
  overallMateriality: number;
  performanceMateriality: number;
  clearlyTrivialThreshold: number;
  basis: string;
  basisAmount: number;
  percentage: number;
  preparedBy: string;
  approvedBy?: string;
  createdAt: string;
}

export type ControlTestResult =
  | "Effective"
  | "Partially Effective"
  | "Ineffective"
  | "Not Tested";

export interface InternalControlTest {
  id: string;
  auditId: string;
  controlArea: string;
  controlDescription: string;
  testProcedure: string;
  result: ControlTestResult;
  weakness?: string;
  recommendation?: string;
  testedBy: string;
  testedAt: string;
}

export type SubstantiveTestArea =
  | "Revenue"
  | "Expenditure"
  | "Assets"
  | "Liabilities"
  | "Payroll"
  | "Bank"
  | "Procurement";

export interface SubstantiveTest {
  id: string;
  auditId: string;
  area: SubstantiveTestArea;
  procedure: string;
  populationSize: number;
  sampleSize: number;
  exceptionCount: number;
  exceptionAmount: number;
  conclusion: string;
  performedBy: string;
  performedAt: string;
  evidenceFiles?: {
    name: string;
    url: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
  }[];
  status: "Pending" | "In Progress" | "Completed" | "Escalated";
}

export interface FraudFlag {
  id: string;
  auditId: string;
  indicator: string;
  description: string;
  area: string;
  raisedBy: string;
  raisedAt: string;
  severity: RiskLevel;
  status:
    | "Open"
    | "Under Investigation"
    | "Escalated"
    | "Resolved"
    | "Dismissed";
  resolution?: string;
  resolvedAt?: string;
}

export type TaskStatus = "Pending" | "In Progress" | "Review" | "Completed";

export interface Task {
  id: string;
  auditId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
}

export type InvitationStatus = "Pending" | "Accepted" | "Declined" | "Expired";

export interface Invitation {
  id: string;
  userId: string;
  role: "AUDIT_SUPERVISOR" | "AUDIT_LEAD" | "TEAM_AUDITOR";
  zoneId?: string;
  lgaId?: string;
  auditId?: string;
  mandateId: string;
  status: InvitationStatus;
  sentAt: string;
  expiresAt: string;
  acceptedAt?: string;
  tasks?: string[];
}

export type LetterStatus =
  | "Draft"
  | "Sent"
  | "Acknowledged"
  | "Documents Received";

export interface NotificationLetter {
  id: string;
  lgaId: string;
  mandateId: string; // Keep as string, maybe optional?
  status: LetterStatus;
  type?: string;
  title?: string;
  date?: string;
  sentAt?: string;
  acknowledgedAt?: string;
  documentsReceivedAt?: string;
  checklist?: string[]; // Make optional
  content?: string;
}

export interface Workpaper {
  id: string;
  auditId: string;
  taskId: string;
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved" | "Revision Required";
  reviewerNotes?: string;
  fileName: string;
  fileSize: string;
}

export type ReportStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Revision Required"
  | "Approved"
  | "Final";

export interface AuditReport {
  id: string;
  auditId: string;
  title: string;
  type: "Preliminary" | "Draft" | "Final" | "Consolidated";
  status: ReportStatus;
  preparedBy: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  findings: Finding[];
  lgaResponse?: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
  managementResponse?: string;
  status: "Open" | "Addressed" | "Closed";
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  entityType: string;
  entityId: string;
}

export interface AuditProgrammeSection {
  id: string;
  title: string;
  auditObjectives: string[];
  riskLevel: RiskLevel;
  riskMatrixRef?: string;
  keyRisks: string[];
  documentationNotes: string;
  sortOrder: number;
}

export interface AuditProgramme {
  id: string;
  auditId: string;
  templateId?: string;
  objectives: string;
  scope: string;
  methodology?: string;
  materialityReference?: string;
  riskAreas: string[];
  sections?: AuditProgrammeSection[];
  procedures: ProgrammeProcedure[];
  status:
    | "Draft"
    | "Submitted"
    | "Under Review"
    | "Approved"
    | "Revision Required";
  preparedBy: string;
  reviewedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  revisionNotes?: string;
}

export interface ProgrammeProcedure {
  id: string;
  area: string;
  procedure: string;
  assertion?: AuditAssertion;
  natureOfTest?:
    | "Substantive"
    | "Control"
    | "Analytical"
    | "Inquiry"
    | "Observation"
    | "Inspection";
  expectedEvidence?: string;
  sampleSize?: string;
  assignedTo?: string;
  status: "Not Started" | "In Progress" | "Completed" | "N/A";
  evidenceUploaded?: boolean;
  workpaperRef?: string;
  findings?: string;
  completedAt?: string;
}

export type ScopeAgreementStatus =
  | "Draft"
  | "Pending LGA"
  | "Changes Requested"
  | "Fully Approved";

export interface ScopeAgreementRow {
  id: string;
  area: string;
  description: string;
  timelineWeeks: number;
  expectations: string;
  auditorSignOff?: { name: string; timestamp: string };
  lgaSignOff?: { name: string; timestamp: string };
  lgaComment?: string;
}

export interface ScopeAgreement {
  id: string;
  auditId: string;
  lgaId: string;
  rows: ScopeAgreementRow[];
  status: ScopeAgreementStatus;
  createdBy: string;
  createdAt: string;
  totalWeeks: number;
}

export type QuestionType =
  | "multiple-choice"
  | "open-ended"
  | "document-confirmation"
  | "risk-scoring"
  | "dynamic-table";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionnaireQuestion {
  id: string;
  section: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  minWords?: number;
  maxWords?: number;
}

export interface QuestionnaireResponse {
  id: string;
  auditId: string;
  questionId: string;
  section: string;
  answer: string;
  answeredBy: string;
  answeredAt: string;
}

export type DocumentUploadStatus =
  | "Not Uploaded"
  | "Uploaded"
  | "Approved"
  | "Rejected";

export interface DocumentUpload {
  id: string;
  lgaId: string;
  mandateId: string;
  documentName: string;
  description: string;
  requiredFormat: string;
  status: DocumentUploadStatus;
  fileName?: string;
  fileSize?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  version: number;
  dueDate: string;
}

export type ApprovalStage =
  | "Pre-Audit"
  | "Planning"
  | "Fieldwork"
  | "Reporting"
  | "Post-Audit";

export interface StageApproval {
  id: string;
  auditId: string;
  stage: ApprovalStage;
  status: "Pending" | "Approved" | "Changes Requested" | "Rejected";
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

export interface AuditProgressWeights {
  preAudit: number;
  planning: number;
  fieldwork: number;
  documentation: number;
  reporting: number;
  postAudit: number;
}

/* ─── Post-Audit Types ─── */

export type FollowUpStatus =
  | "Open"
  | "In Progress"
  | "Implemented"
  | "Verified"
  | "Overdue";

export interface FollowUpItem {
  id: string;
  auditId: string;
  findingId: string;
  findingTitle: string;
  recommendation: string;
  responsibleParty: string;
  targetDate: string;
  status: FollowUpStatus;
  implementationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  evidence?: string;
  createdAt: string;
}

export type LessonCategory =
  | "Process Improvement"
  | "Risk Management"
  | "Resource Allocation"
  | "Methodology"
  | "Communication"
  | "Technology";

export interface LessonLearned {
  id: string;
  auditId: string;
  category: LessonCategory;
  title: string;
  description: string;
  impact: "Positive" | "Negative";
  actionRequired: string;
  submittedBy: string;
  submittedAt: string;
}

export type QualityRating = 1 | 2 | 3 | 4 | 5;

export interface QualityReview {
  id: string;
  auditId: string;
  overallRating: QualityRating;
  planningQuality: QualityRating;
  fieldworkQuality: QualityRating;
  reportingQuality: QualityRating;
  teamPerformance: QualityRating;
  timelinessRating: QualityRating;
  strengths: string;
  improvements: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface ExitConference {
  id: string;
  auditId: string;
  date: string;
  attendees: string[];
  agendaItems: string[];
  keyDiscussions: string;
  agreedActions: string;
  lgaRepresentative: string;
  auditRepresentative: string;
  minutesApproved: boolean;
  createdBy: string;
  createdAt: string;
}

/* ─── Standardised Audit Work Programme Templates ─── */

export interface ProgrammeTemplateSection {
  title: string;
  objective: string;
  riskLevel: RiskLevel;
  procedures: Omit<
    ProgrammeProcedure,
    "id" | "assignedTo" | "status" | "evidenceUploaded"
  >[];
  sortOrder: number;
}

export interface ProgrammeTemplate {
  id: string;
  name: string;
  auditType: AuditType;
  description: string;
  methodology: string;
  sections: ProgrammeTemplateSection[];
}

/* ─── Audit Work Programme Deliverables (Big Four Standard) ─── */

export type AuditJournalType =
  | "Adjusting"
  | "Reclassifying"
  | "Proposed"
  | "Passed";

export type AuditJournalStatus =
  | "Draft"
  | "Proposed"
  | "Agreed"
  | "Posted"
  | "Waived";

export interface AuditJournalEntry {
  account: string;
  debit: number;
  credit: number;
}

export interface AuditJournal {
  id: string;
  auditId: string;
  journalNumber: string;
  type: AuditJournalType;
  description: string;
  entries: AuditJournalEntry[];
  netEffect: number;
  affectedArea: string;
  preparedBy: string;
  reviewedBy?: string;
  status: AuditJournalStatus;
  createdAt: string;
  workpaperRef?: string;
}

export type AuditCommentSeverity = "Low" | "Medium" | "High" | "Critical";

export type AuditCommentStatus =
  | "Draft"
  | "Discussed"
  | "Agreed"
  | "Resolved"
  | "Reported";

export interface AuditComment {
  id: string;
  auditId: string;
  referenceNumber: string;
  title: string;
  observation: string;
  criteria: string;
  cause: string;
  effect: string;
  recommendation: string;
  managementResponse?: string;
  severity: AuditCommentSeverity;
  status: AuditCommentStatus;
  responsibleParty?: string;
  targetDate?: string;
  preparedBy: string;
  reviewedBy?: string;
  createdAt: string;
}

export type FinancialStatementType =
  | "Statement of Financial Position"
  | "Statement of Financial Performance"
  | "Cash Flow Statement"
  | "Statement of Changes in Net Assets/Equity"
  | "Notes to the Financial Statements"
  | "Budget vs Actual Comparison";

export type FinancialStatementStatus =
  | "Not Received"
  | "Received"
  | "Under Review"
  | "Adjusted"
  | "Final";

export interface FinancialStatementItem {
  id: string;
  auditId: string;
  statementType: FinancialStatementType;
  status: FinancialStatementStatus;
  draftReceivedDate?: string;
  adjustmentsCount: number;
  adjustmentsAmount: number;
  reviewedBy?: string;
  finalDate?: string;
  notes?: string;
}

export type CompletionSection =
  | "Going Concern"
  | "Subsequent Events"
  | "Management Representations"
  | "Analytical Review"
  | "Independence & Ethics"
  | "Quality Control"
  | "File Assembly"
  | "Communication with Governance"
  | "Laws & Regulations"
  | "Related Parties";

export interface CompletionChecklistItem {
  id: string;
  auditId: string;
  section: CompletionSection;
  item: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  reference?: string;
  notes?: string;
}

export type WorkpaperCategory =
  | "Lead Schedule"
  | "Supporting Schedule"
  | "Reconciliation"
  | "Confirmation"
  | "Analytical Procedure"
  | "Representation Letter"
  | "Minutes & Correspondence"
  | "Permanent File"
  | "Planning Memorandum"
  | "Completion Memorandum";

export interface AuditWorkpaper {
  id: string;
  auditId: string;
  reference: string;
  title: string;
  category: WorkpaperCategory;
  section: string;
  preparedBy: string;
  preparedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  status: "Draft" | "Prepared" | "Reviewed" | "Final";
  crossReferences?: string[];
  notes?: string;
}

export interface EntityProfile {
  id: string;
  auditId: string;
  entityName: string;
  councilType: CouncilType;
  zoneId: string;
  establishedYear: number;
  population: number;
  chairmanName: string;
  treasurerName: string;
  councilManagerName: string;
  internalAuditorName: string;
  financialFramework: string;
  priorYearOpinion: "Unqualified" | "Qualified" | "Adverse" | "Disclaimer";
  priorYearFindings: string[];
  itSystems: string[];
  itControlEnvironment: "Strong" | "Adequate" | "Weak";
  internalAuditEffectiveness:
    | "Effective"
    | "Partially Effective"
    | "Ineffective";
  keyActivities: string[];
  significantChanges: string;
  preparedBy: string;
  createdAt: string;
}

export interface IndependenceDeclaration {
  id: string;
  auditId: string;
  auditorId: string;
  auditorName: string;
  confirmed: boolean;
  threats: string[];
  safeguards: string[];
  declarationDate: string;
}

export type AnalyticFlag = "Favorable" | "Adverse" | "Neutral" | "Investigate";

export interface PreliminaryAnalytic {
  id: string;
  auditId: string;
  category: "Revenue" | "Expenditure" | "Balance Sheet" | "Ratio";
  metric: string;
  priorYear: number;
  currentYear: number;
  variance: number;
  variancePercent: number;
  flag: AnalyticFlag;
  investigationNote?: string;
  preparedBy: string;
  createdAt: string;
}

export type AuditStrategyStatus = "Draft" | "Under Review" | "Approved";

export interface AuditStrategy {
  id: string;
  auditId: string;
  overallApproach: "Substantive" | "Combined" | "Controls-Based";
  keyAuditMatters: string[];
  relatedPartyConsiderations: string;
  goingConcernAssessment: string;
  fraudRiskFactors: string[];
  significantRiskAreas: string[];
  plannedStartDate: string;
  plannedEndDate: string;
  teamComposition: string;
  supervisionPlan: string;
  status: AuditStrategyStatus;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  createdAt: string;
}

export type RequisitionStatus =
  | "Pending"
  | "Issued"
  | "Received"
  | "Overdue"
  | "Waived";

export interface DocumentRequisition {
  id: string;
  auditId: string;
  ref: string;
  documentName: string;
  auditArea: string;
  neededBy: string;
  status: RequisitionStatus;
  issuedAt?: string;
  receivedAt?: string;
  receivedFileName?: string;
  receivedFileUrl?: string;
  linkedProcedureIds: string[];
}

export type ProcedureExecutionStatus =
  | "Locked"
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Reviewed"
  | "Cleared"
  | "Exception Raised"
  | "Limitation";

export interface ProcedureTimeEntry {
  id: string;
  startedAt: string;
  stoppedAt?: string;
  minutes: number;
}

export interface ProcedureEvidence {
  id: string;
  code: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  documentType:
    | "Schedule"
    | "Confirmation"
    | "Invoice"
    | "Photograph"
    | "System Extract"
    | "Reconciliation"
    | "Letter"
    | "Receipt"
    | "Register"
    | "Other";
  linkedRequisitionId?: string;
}

export interface SampleItem {
  id: string;
  reference: string;
  description: string;
  amount?: number;
  selected: boolean;
  tested: boolean;
  result?: string;
  notes?: string;
}

export interface ProcedureExecution {
  id: string;
  auditId: string;
  programmeId: string;
  procedureId: string;
  procedureRef: string;
  procedureDescription: string;
  auditArea: string;
  assertions: AuditAssertion[];
  riskRating: RiskLevel;
  assignedTo: string;
  dueDate: string;
  status: ProcedureExecutionStatus;
  budgetedHours: number;
  timeEntries: ProcedureTimeEntry[];
  loggedHours: number;
  evidence: ProcedureEvidence[];
  workPerformed: string;
  samplingMethod?: "Random" | "Judgement" | "Systematic";
  populationSize?: number;
  sampleSize?: number;
  sampleItems?: SampleItem[];
  conclusion?:
    | "No Exception"
    | "Exception Raised"
    | "Inconclusive"
    | "Limitation";
  conclusionNotes?: string;
  exceptionIds: string[];
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComments?: ReviewComment[];
  clearedBy?: string;
  clearedAt?: string;
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export type ExceptionSeverity = "Low" | "Medium" | "High" | "Critical";

export type ExceptionClassification =
  | "Proceed to Audit Query"
  | "Resolved — No Query"
  | "Limitation"
  | "Below Materiality";

export interface FieldworkException {
  id: string;
  auditId: string;
  ref: string;
  procedureId: string;
  procedureRef: string;
  auditArea: string;
  exceptionType: string;
  assertionAffected: AuditAssertion;
  severity: ExceptionSeverity;
  finding: string;
  evidenceCodes: string[];
  financialImpact: number;
  qualitativeImpact: string;
  status: "Open" | "Under Review" | "Classified" | "Escalated";
  classification?: ExceptionClassification;
  raisedBy: string;
  raisedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  potentialAuditQuery: boolean;
  notes: string;
  escalatedToHlg: boolean;
  escalatedAt?: string;
}

export type BankConfirmationStatus =
  | "Not Issued"
  | "Issued"
  | "Response Received"
  | "Overdue"
  | "Second Request";

export interface BankAccount {
  id: string;
  auditId: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  declaredByEntity: boolean;
  confirmedByBank: boolean;
  cashbookBalance: number;
  confirmedBalance?: number;
  confirmationStatus: BankConfirmationStatus;
  confirmationIssuedAt?: string;
  confirmationReceivedAt?: string;
  responseFileUrl?: string;
  liens?: string;
  otherAccounts?: string;
  discrepancy?: number;
}

export interface ReconciliationRow {
  id: string;
  month: string;
  sourceA: number;
  sourceB: number;
  sourceC?: number;
  differenceAB: number;
  differenceAC?: number;
  explanation: string;
  flagged: boolean;
}

export interface ContractFlag {
  id: string;
  auditId: string;
  flagType:
    | "Potential Splitting"
    | "Threshold Breach"
    | "Repeat Vendor"
    | "Just Below Threshold";
  vendorName: string;
  contractCount: number;
  period: string;
  totalValue: number;
  individualValues: number[];
  risk: RiskLevel;
  investigated: boolean;
  notes: string;
}

export interface VouchingChecklist {
  id: string;
  procedureExecutionId: string;
  contractDescription: string;
  vendorName: string;
  contractValue: number;
  contractDate: string;
  items: VouchingChecklistItem[];
  paymentSupported: "Yes" | "No" | "Partial" | "";
  deliveryConfirmed: "Yes" | "No" | "";
  approvalChainComplete: "Yes" | "No" | "";
}

export interface VouchingChecklistItem {
  id: string;
  documentName: string;
  required: boolean;
  status: "Found" | "Not Found" | "N/A" | "";
  fileUrl?: string;
  uploadedAt?: string;
}

export interface SiteVerification {
  id: string;
  procedureExecutionId: string;
  projectName: string;
  contractorName: string;
  contractValue: number;
  claimedCompletion: number;
  amountPaid: number;
  gpsCoordinates?: string;
  visitDate: string;
  auditorPresent: string;
  physicalCondition:
    | "Excellent"
    | "Good"
    | "Fair"
    | "Poor"
    | "Not Found"
    | "Not Commenced"
    | "";
  auditorCompletion: number;
  descriptionOfFindings: string;
  photos: ProcedureEvidence[];
  discrepancyAmount: number;
  exceptionLogged: boolean;
}

export interface AdvanceItem {
  id: string;
  ref: string;
  officerName: string;
  purpose: string;
  amount: number;
  dateIssued: string;
  daysOutstanding: number;
  retired: boolean;
  retiredDate?: string;
  ageBand: "< 3 months" | "3–6 months" | "6–12 months" | "> 1 year";
  endOfYearAdvance: boolean;
  flagged: boolean;
}

export interface StockCountItem {
  id: string;
  itemName: string;
  unit: string;
  ledgerBalance: number;
  physicalCount?: number;
  difference?: number;
  notes: string;
  flagged: boolean;
}

export type GrantExpenditureEligibility =
  | "Eligible"
  | "Ineligible"
  | "Unclear"
  | "";

export interface GrantExpenditure {
  id: string;
  description: string;
  amount: number;
  eligibility: GrantExpenditureEligibility;
  notes: string;
}

export interface StaffVerificationItem {
  id: string;
  name: string;
  department: string;
  gradeLevel: string;
  physicallySighted: "Yes" | "No" | "";
  confirmationMethod?:
    | "ID Card"
    | "Payslip"
    | "Supervisor Identification"
    | "Biometric Scan";
  notSightedReason?:
    | "On Leave with Documentation"
    | "Absent without Explanation"
    | "Does Not Exist"
    | "Referred for Investigation";
  notes: string;
  photoUrl?: string;
}

export interface DeductionRemittanceRow {
  id: string;
  month: string;
  payeDeducted: number;
  payeRemitted: number;
  payeDifference: number;
  pensionDeducted: number;
  pensionRemitted: number;
  pensionDifference: number;
  flagged: boolean;
}

export interface IGRChainItem {
  id: string;
  receiptRef: string;
  revenueHead: string;
  amount: number;
  assessmentNotice: "Traced" | "Not Found" | "Broken" | "";
  revenueReceipt: "Traced" | "Not Found" | "Broken" | "";
  dailySummary: "Traced" | "Not Found" | "Broken" | "";
  bankPayinSlip: "Traced" | "Not Found" | "Broken" | "";
  bankStatementCredit: "Traced" | "Not Found" | "Broken" | "";
  chainComplete: boolean;
}

export interface FieldworkCompletionMemo {
  id: string;
  auditId: string;
  scopeSummary: string;
  exceptionsSummary: string;
  scopeLimitations: string;
  budgetedHours: number;
  actualHours: number;
  overallAssessment: string;
  signedByLead: boolean;
  signedByLeadAt?: string;
  signedBySupervisor: boolean;
  signedBySupervisorAt?: string;
  hlgAcknowledged?: boolean;
  hlgAcknowledgedAt?: string;
  preliminaryOpinion?: "Unmodified" | "Qualified" | "Adverse" | "Disclaimer";
  createdAt: string;
}

export interface FieldworkWorkingPaper {
  id: string;
  auditId: string;
  procedureExecutionId: string;
  reference: string;
  title: string;
  auditArea: string;
  procedureDescription: string;
  workPerformed: string;
  evidenceCodes: string[];
  sampleDetails?: string;
  resultsAndAnalysis: string;
  conclusion: string;
  exceptionRefs: string[];
  preparedBy: string;
  preparedAt: string;
  reviewStatus:
    | "Prepared"
    | "Under Review"
    | "Reviewed by Lead"
    | "Returned"
    | "Cleared by Supervisor";
  reviewedByLead?: string;
  reviewedByLeadAt?: string;
  clearedBySupervisor?: string;
  clearedBySupervisorAt?: string;
}
