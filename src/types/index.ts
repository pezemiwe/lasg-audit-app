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

export interface AuditProgramme {
  id: string;
  auditId: string;
  objectives: string;
  scope: string;
  riskAreas: string[];
  procedures: ProgrammeProcedure[];
  status: "Draft" | "Submitted" | "Approved" | "Revision Required";
  preparedBy: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ProgrammeProcedure {
  id: string;
  area: string;
  procedure: string;
  assignedTo?: string;
  status: "Not Started" | "In Progress" | "Completed";
  evidenceUploaded?: boolean;
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
