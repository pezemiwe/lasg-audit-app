/* ==================================================================
   Audit Outcomes — Types
   Deliverables that produce the final Audited Financial Statement
   Compilation for Lagos State LGAs & LCDAs (the 500-page PDF).
   ================================================================== */

export type AuditOutcomeStatus =
  | "Draft"
  | "In Progress"
  | "Ready for Review"
  | "Approved"
  | "Final";

export type ReportType = "State Consolidated" | "Local Government";

/* ─── Trial Balance (2-year comparison for materiality) ─── */

export interface TrialBalanceLine {
  id: string;
  ncoaCode?: string;
  accountName: string;
  /** Dr (positive = debit) */
  currentYear: number;
  /** Dr (positive = debit) */
  priorYear: number;
  variance: number;
  variancePct: number;
  classification:
    | "Asset"
    | "Liability"
    | "Equity"
    | "Revenue"
    | "Expense"
    | "Unclassified";
}

export interface TrialBalance {
  id: string;
  auditOutcomeId: string;
  auditId: string;
  lgaId?: string; // null/undefined = consolidated
  currentYear: number;
  priorYear: number;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  lines: TrialBalanceLine[];
  /** Derived */
  totalRevenue: number;
  totalExpenditure: number;
  profitBeforeTax: number; // PBT used for materiality
  totalAssets: number;
  totalLiabilities: number;
}

/* ─── Materiality (your exact formula) ─── */

export interface MaterialityCalc {
  id: string;
  auditOutcomeId: string;
  auditId: string;
  profitBeforeTax: number;
  /** 5% of PBT */
  overallMateriality: number;
  overallPct: number; // 5
  /** 70% of overall */
  performanceMateriality: number;
  performancePct: number; // 70
  /** 70% × 5% of PBT (equivalently 5% of performance) */
  trivialMateriality: number;
  trivialPct: number; // 5 (of performance) — display only
  basis: "Profit Before Tax";
  rationale: string;
  preparedBy: string;
  preparedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  locked: boolean;
}

/* ─── Signatures ─── */

export interface SignatureBlock {
  role:
    | "AUDIT_LEAD"
    | "AUDIT_SUPERVISOR"
    | "AUDITOR_GENERAL"
    | "TREASURER"
    | "HEAD_OF_LGA";
  name: string;
  title: string;
  signatureDataUrl?: string; // base64 PNG of signature or initials
  signedAt?: string;
  signedById?: string; // user id if internal signer
}

/* ─── Statement of Financial Responsibility ─── */

export interface StatementOfResponsibility {
  id: string;
  auditOutcomeId: string;
  preamble: string;
  responsibilityText: string;
  treasurerSignature?: SignatureBlock;
  auditLeadSignature?: SignatureBlock;
  status: "Draft" | "Signed" | "Final";
  updatedAt: string;
}

/* ─── Re-usable section (header + description + recommendation + table/bullets) ─── */

export interface SectionTableCell {
  value: string;
}

export interface SectionTable {
  headers: string[];
  rows: SectionTableCell[][];
}

export interface AuditReportSection {
  id: string;
  order: number;
  header: string;
  description: string; // narrative/observation
  bullets?: string[]; // optional bullet list
  table?: SectionTable; // optional embedded table
  recommendation?: string;
}

/* ─── Audit Report (two types: State Consolidated vs LG) ─── */

export interface AuditReportDocument {
  id: string;
  auditOutcomeId: string;
  type: ReportType;
  lgaId?: string; // required when type === "Local Government"
  title: string;
  addressee: string; // e.g. "Members of the Lagos State House of Assembly"
  basisOfOpinion: string;
  opinion: "Unqualified" | "Qualified" | "Adverse" | "Disclaimer";
  sections: AuditReportSection[];
  auditLeadSignature?: SignatureBlock;
  auditSupervisorSignature?: SignatureBlock;
  auditorGeneralSignature?: SignatureBlock;
  status: AuditOutcomeStatus;
  approvedAt?: string;
  updatedAt: string;
}

/* ─── Accounting Policies (IPSAS Accrual) ─── */

export interface AccountingPolicyItem {
  id: string;
  order: number;
  title: string;
  body: string;
  bullets?: string[];
  table?: SectionTable;
}

export interface AccountingPolicies {
  id: string;
  auditOutcomeId: string;
  framework: string; // "IPSAS Accrual"
  policies: AccountingPolicyItem[];
  supervisorSignature?: SignatureBlock;
  status: AuditOutcomeStatus;
  updatedAt: string;
}

/* ─── Audited Financial Statements ─── */

export type FinancialStatementKind =
  | "StatementOfFinancialPosition"
  | "StatementOfFinancialPerformance"
  | "CashFlowStatement"
  | "NotesToTheAccounts";

export interface FinancialStatementRow {
  id: string;
  ncoaCode?: string;
  description: string;
  note?: string;
  currentYear: number | null;
  priorYear: number | null;
  /** sub-total flag — rendered in bold with totals */
  isSubtotal?: boolean;
  /** section header — no numbers, bold */
  isHeader?: boolean;
  /** indent level 0-3 */
  indent?: number;
}

export interface FinancialStatement {
  id: string;
  auditOutcomeId: string;
  lgaId?: string; // undefined = consolidated
  kind: FinancialStatementKind;
  title: string;
  currentYear: number;
  priorYear: number;
  rows: FinancialStatementRow[];
  /** For Notes only: collection of note numbers mapped to titles */
  noteRefs?: Array<{
    noteNumber: number;
    title: string;
    body?: string;
    table?: SectionTable;
  }>;
  preparedBy?: string;
  preparedAt?: string;
  status: AuditOutcomeStatus;
}

/* ─── LGA-Specific Audit Package (repeats for every LGA/LCDA) ─── */

export interface LgaAuditPackage {
  id: string;
  auditOutcomeId: string;
  lgaId: string;
  /** One per LGA: same shape as consolidated but scoped */
  report?: AuditReportDocument;
  sofp?: FinancialStatement;
  sofp_performance?: FinancialStatement;
  cashFlow?: FinancialStatement;
  notes?: FinancialStatement;
  included: boolean; // whether to include in the compilation
  status: AuditOutcomeStatus;
}

/* ─── Top-level container ─── */

export interface AuditOutcome {
  id: string;
  mandateId: string;
  /** The "lead" / parent audit — typically the state-level consolidation */
  auditId: string;
  auditYear: number;
  title: string;
  status: AuditOutcomeStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  /* Sub-documents (by id references) */
  trialBalanceIds: string[];
  materialityCalcId?: string;
  statementOfResponsibilityId?: string;
  auditReportIds: string[]; // state + each LG report
  accountingPoliciesId?: string;
  consolidatedSofpId?: string;
  consolidatedSofPerfId?: string;
  consolidatedCashFlowId?: string;
  consolidatedNotesId?: string;
  lgaPackageIds: string[];

  /* Compilation output */
  compiledPdfGeneratedAt?: string;
  compiledPageCount?: number;
}

/* ─── PDF compilation options ─── */

export interface CompilationOptions {
  auditOutcomeId: string;
  includeConsolidated: boolean;
  includedLgaIds: string[];
  fileName?: string;
}
