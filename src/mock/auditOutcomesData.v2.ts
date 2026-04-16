/* ==================================================================
   Seed data — Audit Outcomes (V2)
   ==================================================================

   KEY CHANGES vs v1:
   - Outcome now belongs to mandate-4 FY2023 (Completed audits) — realistic demo stage
   - All consolidated sub-documents arrive PRE-SIGNED by Lead + Supervisor
     (only the Auditor-General's final signature remains, for the demo moment)
   - Materiality is approved and locked
   - Trial Balance is uploaded and processed
   - LGA packages are generated for a representative sample (Ikeja, Alimosho,
     Mushin, Oshodi-Isolo, Kosofe, Agege, Apapa, Lagos Island, Eti-Osa, Surulere)
     so the "Local Government" toggle in the Audit Report tab isn't empty

   WHY audit year 2025:
   The consolidated financial statements from v1 are dated 31 December 2025
   with 2024 comparatives. Outcome references those records so all dates
   tie together. Demo narrative treats this as "the just-closed fiscal year".
   ================================================================== */

import type {
  AuditOutcome,
  TrialBalance,
  MaterialityCalc,
  StatementOfResponsibility,
  AuditReportDocument,
  AccountingPolicies,
  FinancialStatement,
  LgaAuditPackage,
  SignatureBlock,
  AuditReportSection,
} from "../types/auditOutcomes";

const NOW = new Date().toISOString();
const SIGNED_AT_LEAD = new Date(
  Date.now() - 14 * 24 * 60 * 60 * 1000,
).toISOString(); // 14 days ago
const SIGNED_AT_SUPERVISOR = new Date(
  Date.now() - 7 * 24 * 60 * 60 * 1000,
).toISOString(); // 7 days ago
const SIGNED_AT_TREASURER = new Date(
  Date.now() - 21 * 24 * 60 * 60 * 1000,
).toISOString(); // 21 days ago

const OUTCOME_ID = "ao-2025-lasg-consol";

/* Tiny, stable base64 PNG — a flat charcoal rectangle with a stylised signature
   mark. Looks like an initialled signature at thumbnail size. Used so the PDF
   renders with signature placeholders in them without requiring the user to
   actually sign on the canvas first. */
const STUB_SIG_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAYAAAA" +
  "7mwU7AAAAzklEQVRoge2ZQQ6CMBBFH9ILeA5P4j28gHeQQ3gDCO/gAuIFvIDe" +
  "wB0LkIAmphQGnPdWTTrz/sy0TAuGwIBfwcyASWdmZrUzYGZVoytgJknDZ1CS" +
  "JMEB1zAzJ5J+JC3GgZ0kwGP4GDBNwWNm9/hdQAa2ZlZEvcDWYLkYXNnsAbvM" +
  "bOm9gmjgIiReinz4IeklG7K3wVNk9xHwDPyl3HvMqQr4JDdB7glbOoDHgGnM" +
  "8EsS0V7oE2Q2ASYpJ/EaF6UGLCKJRkhJ/DwDXrxWaQJfMd4BKOBWWBdRU6kA" +
  "AAAASUVORK5CYII=";

/* ─── Pre-filled signatures ─── */

const SIG_TREASURER: SignatureBlock = {
  role: "TREASURER",
  name: "Mr. Bamidele Adekunle",
  title: "Treasurer, Consolidated Local Government Fund",
  signatureDataUrl: STUB_SIG_PNG,
  signedAt: SIGNED_AT_TREASURER,
};

const SIG_AUDIT_LEAD: SignatureBlock = {
  role: "AUDIT_LEAD",
  name: "Mr. Adewale Ogunjobi",
  title: "Audit Lead",
  signatureDataUrl: STUB_SIG_PNG,
  signedAt: SIGNED_AT_LEAD,
  signedById: "user-lead-1",
};

const SIG_SUPERVISOR: SignatureBlock = {
  role: "AUDIT_SUPERVISOR",
  name: "Mrs. Folashade Adekunle",
  title: "Audit Supervisor, Zone 1 (Ikeja)",
  signatureDataUrl: STUB_SIG_PNG,
  signedAt: SIGNED_AT_SUPERVISOR,
  signedById: "user-sup-ikeja",
};

/** Auditor-General signature block — deliberately unsigned (this is the demo moment). */
const SIG_AG_EMPTY: SignatureBlock = {
  role: "AUDITOR_GENERAL",
  name: "",
  title: "Auditor-General for Local Governments",
};

/* ─── TRIAL BALANCE ─── */

export const SEED_TRIAL_BALANCE_V2: TrialBalance = {
  id: "tb-2025-consol",
  auditOutcomeId: OUTCOME_ID,
  auditId: "audit-9", // completed audit under mandate-4
  currentYear: 2025,
  priorYear: 2024,
  fileName: "LASG_LG_Consolidated_TB_2025_vs_2024.xlsx",
  uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  uploadedBy: "user-lead-1",
  totalRevenue: 89_540_000_000,
  totalExpenditure: 78_190_000_000,
  profitBeforeTax: 11_350_000_000,
  totalAssets: 48_320_000_000,
  totalLiabilities: 16_070_000_000,
  lines: [
    {
      id: "tbl-1",
      ncoaCode: "110101",
      accountName: "Share of Federation Account",
      currentYear: 49_820_000_000,
      priorYear: 44_110_000_000,
      variance: 5_710_000_000,
      variancePct: 12.94,
      classification: "Revenue",
    },
    {
      id: "tbl-2",
      ncoaCode: "110102",
      accountName: "Share of Value Added Tax (VAT)",
      currentYear: 28_430_000_000,
      priorYear: 24_990_000_000,
      variance: 3_440_000_000,
      variancePct: 13.77,
      classification: "Revenue",
    },
    {
      id: "tbl-3",
      ncoaCode: "120204",
      accountName: "Fees General",
      currentYear: 3_840_000_000,
      priorYear: 2_970_000_000,
      variance: 870_000_000,
      variancePct: 29.29,
      classification: "Revenue",
    },
    {
      id: "tbl-4",
      ncoaCode: "210101",
      accountName: "Salaries and Wages",
      currentYear: 21_880_000_000,
      priorYear: 19_220_000_000,
      variance: 2_660_000_000,
      variancePct: 13.84,
      classification: "Expense",
    },
    {
      id: "tbl-5",
      ncoaCode: "220201",
      accountName: "Overhead Cost",
      currentYear: 8_640_000_000,
      priorYear: 7_910_000_000,
      variance: 730_000_000,
      variancePct: 9.23,
      classification: "Expense",
    },
    {
      id: "tbl-6",
      ncoaCode: "220701",
      accountName: "Transfers to SUBEB and Other LG Entities",
      currentYear: 38_720_000_000,
      priorYear: 32_140_000_000,
      variance: 6_580_000_000,
      variancePct: 20.47,
      classification: "Expense",
    },
    {
      id: "tbl-7",
      ncoaCode: "310101",
      accountName: "Cash and Cash Equivalent",
      currentYear: 14_280_000_000,
      priorYear: 11_540_000_000,
      variance: 2_740_000_000,
      variancePct: 23.74,
      classification: "Asset",
    },
    {
      id: "tbl-8",
      ncoaCode: "320101",
      accountName: "Property, Plant and Equipment (PPE)",
      currentYear: 22_110_000_000,
      priorYear: 19_450_000_000,
      variance: 2_660_000_000,
      variancePct: 13.68,
      classification: "Asset",
    },
    {
      id: "tbl-9",
      ncoaCode: "320301",
      accountName: "Intangible Assets (Advances)",
      currentYear: 11_930_000_000,
      priorYear: 12_880_000_000,
      variance: -950_000_000,
      variancePct: -7.38,
      classification: "Asset",
    },
    {
      id: "tbl-10",
      ncoaCode: "410101",
      accountName: "Deposits",
      currentYear: 9_220_000_000,
      priorYear: 8_760_000_000,
      variance: 460_000_000,
      variancePct: 5.25,
      classification: "Liability",
    },
    {
      id: "tbl-11",
      ncoaCode: "410401",
      accountName: "Payables (Accrued Expenses)",
      currentYear: 6_680_000_000,
      priorYear: 5_890_000_000,
      variance: 790_000_000,
      variancePct: 13.41,
      classification: "Liability",
    },
    {
      id: "tbl-12",
      ncoaCode: "430301",
      accountName: "Reserves",
      currentYear: 28_170_000_000,
      priorYear: 24_880_000_000,
      variance: 3_290_000_000,
      variancePct: 13.22,
      classification: "Equity",
    },
  ],
};

/* ─── MATERIALITY — approved and locked ─── */

const PBT = SEED_TRIAL_BALANCE_V2.profitBeforeTax; // 11.35bn

export const SEED_MATERIALITY_CALC_V2: MaterialityCalc = {
  id: "mat-2025-lasg",
  auditOutcomeId: OUTCOME_ID,
  auditId: "audit-9",
  profitBeforeTax: PBT,
  overallMateriality: Math.round(PBT * 0.05),
  overallPct: 5,
  performanceMateriality: Math.round(PBT * 0.05 * 0.7),
  performancePct: 70,
  trivialMateriality: Math.round(PBT * 0.05 * 0.7 * 0.05),
  trivialPct: 5,
  basis: "Profit Before Tax",
  rationale:
    "Profit Before Tax (surplus for the period) is the primary benchmark because users of LGA financial statements focus on operating results and stewardship. 5% of PBT is within the normal range for public-sector benchmarks (ISSAI 1320; ISA 320). Performance materiality is set at 70% of overall to reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds overall materiality. Clearly trivial is set at 5% of performance materiality.",
  preparedBy: "user-lead-1",
  preparedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  approvedBy: "user-sup-ikeja",
  approvedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  locked: true,
};

/* ─── STATEMENT OF RESPONSIBILITY — signed ─── */

export const SEED_STATEMENT_OF_RESPONSIBILITY_V2: StatementOfResponsibility = {
  id: "sor-2025-lasg",
  auditOutcomeId: OUTCOME_ID,
  preamble:
    "The Financial Statements of the Local Government Councils of Lagos State for the year ended 31st December, 2025 have been prepared in accordance with the International Public Sector Accounting Standards (IPSAS) Accrual framework and the accounting policies set out in these statements.",
  responsibilityText:
    "The Treasurers of the Local Government Councils are responsible for the preparation and fair presentation of the Financial Statements in accordance with the Finance (Control and Management) Act and applicable Financial Memoranda, including the design, implementation and maintenance of internal control relevant to the preparation of Financial Statements that are free from material misstatement, whether due to fraud or error.\n\nIt is the statutory responsibility of the Auditor-General for Local Governments to form an independent opinion, based on the audit, on the Financial Statements and the underlying records, and to report thereon to the Lagos State House of Assembly in accordance with the Lagos State Audit Law.",
  treasurerSignature: SIG_TREASURER,
  auditLeadSignature: SIG_AUDIT_LEAD,
  status: "Signed",
  updatedAt: NOW,
};

/* ─── AUDIT REPORT — Lead & Supervisor signed; AG awaiting ─── */

const STATE_REPORT_SECTIONS: AuditReportSection[] = [
  {
    id: "sec-1",
    order: 1,
    header: "Revenue",
    description:
      "During the year ended 31st December, 2025, the Local Government Councils of Lagos State realised revenue of approximately ₦89.54bn. Of this amount, ₦85.70bn was received as statutory allocations from the Federation Account, representing approximately 96% of total revenue, while the balance of ₦3.84bn (approx. 4%) was from Internally Generated Revenue (IGR).",
    recommendation:
      "There remains significant over-dependence on Federation Account allocations. Councils are advised to develop and implement IGR strategies — property tenement enumeration, daily market charges automation, digital tax receipts — to diversify revenue and strengthen fiscal autonomy.",
  },
  {
    id: "sec-2",
    order: 2,
    header: "Completeness of JAAC Allocations",
    description:
      "During the period under review, statutory allocations from the Federation Account to the Councils were transferred through the State–Local Government Joint Account Allocation Committee (JAAC) and were completely received and included in the Councils' respective Financial Statements for the year ended 31st December, 2025.",
  },
  {
    id: "sec-3",
    order: 3,
    header: "Expenditure",
    description:
      "The expenditures of the Councils for the year were applied to Salaries and Wages (~28%), Overhead (~11%), Transfers to SUBEB and other LG Entities (~49%), and Capital Expenditures (~12%).",
    bullets: [
      "Salaries and Wages: ₦21.88bn",
      "Overhead Costs: ₦8.64bn",
      "Transfers to SUBEB and LG Entities: ₦38.72bn",
      "Capital Expenditures: ₦9.00bn",
    ],
  },
  {
    id: "sec-4",
    order: 4,
    header: "Cash and Cash Equivalents",
    description:
      "The cash and cash equivalents of the Local Government Councils as at 31st December, 2025 amounted to ₦14.28bn. During the period under review, the majority of Councils prepared monthly bank reconciliation statements; however, several Councils did not consistently prepare or retain reconciliation statements in line with Financial Memoranda 19:23-30.",
    recommendation:
      "All Councils are advised to prepare and retain monthly bank reconciliation statements. In subsequent audits, the preparation of Bank Reconciliation Statements and presentation of Bank Statements will be a pre-condition for acceptance of the Council's financial records for audit.",
  },
  {
    id: "sec-5",
    order: 5,
    header: "Advances",
    description:
      "Unretired advances of the Local Government Councils as at 31st December, 2025 stood at ₦11.93bn. In spite of reminders in previous reports and circular letters, advances granted to Council officials as working advances were not fully retired as at year-end, contrary to F.M. 16.16. Advances represent approximately 24.69% of total assets of the Councils in the State.",
    recommendation:
      "The Heads of Local Government Administration and the Treasurers are called upon to, without further delay, retire ALL outstanding working advances in accordance with F.M. 16.16 so as to ascertain the true financial position of the Councils.",
  },
  {
    id: "sec-6",
    order: 6,
    header: "Staff and Payroll Controls",
    description:
      "Physical verification of staff was conducted across selected Councils. Sample verification procedures identified minor discrepancies between nominal roll, payroll and physically sighted personnel in a small number of cases, which have been communicated to the respective Councils for remediation.",
    recommendation:
      "All Councils should complete annual biometric staff verification and reconcile nominal roll to payroll prior to year-end close.",
  },
];

export const SEED_AUDIT_REPORT_STATE_V2: AuditReportDocument = {
  id: "arpt-state-2025",
  auditOutcomeId: OUTCOME_ID,
  type: "State Consolidated",
  title:
    "General Disclosures and Observations on the Consolidated Accounts of the Local Government Councils of Lagos State for the Year Ended 31st December, 2025",
  addressee: "Members of the Lagos State House of Assembly",
  basisOfOpinion:
    "The audit was conducted in accordance with the International Standards on Auditing (ISA) as applicable to the public sector, International Organisation of Supreme Audit Institutions (INTOSAI) Auditing Standards, the Lagos State Audit Law, and the Lagos State Local Government Law (as amended). The audit included examination on a test basis of evidence relevant to the figures disclosed in the Financial Statements. It also included an assessment of the significant estimates and judgments made by the Councils in the preparation of the Financial Statements, and whether the accounting policies were appropriate in the Councils' circumstances, consistently applied and adequately disclosed. The audit was planned and performed to obtain all information and explanations considered necessary to have reasonable assurance that the Financial Statements are free from material misstatements.",
  opinion: "Unqualified",
  sections: STATE_REPORT_SECTIONS,
  auditLeadSignature: SIG_AUDIT_LEAD,
  auditSupervisorSignature: SIG_SUPERVISOR,
  auditorGeneralSignature: SIG_AG_EMPTY, // ← demo moment
  status: "Ready for Review",
  updatedAt: NOW,
};

/* ─── ACCOUNTING POLICIES — supervisor-signed ─── */

export const SEED_ACCOUNTING_POLICIES_V2: AccountingPolicies = {
  id: "ap-2025-lasg",
  auditOutcomeId: OUTCOME_ID,
  framework: "IPSAS Accrual",
  policies: [
    {
      id: "ap-1",
      order: 1,
      title: "Measurement Basis",
      body: "These General-Purpose Financial Statements (GPFS) have been prepared under the historical cost convention and in accordance with IPSAS and other applicable standards as defined by relevant statutes.",
    },
    {
      id: "ap-2",
      order: 2,
      title: "Basis of Accounting",
      body: "These GPFS have been prepared under the Accrual Basis of Accounting.",
    },
    {
      id: "ap-3",
      order: 3,
      title: "Accounting Period",
      body: "The accounting year (fiscal year) is from 1st January to 31st December in line with the National Treasury Circular. Each accounting year is divided into 12 calendar months (periods).",
    },
    {
      id: "ap-4",
      order: 4,
      title: "Reporting Currency",
      body: "The GPFS were prepared in the Nigerian Naira (₦).",
    },
    {
      id: "ap-5",
      order: 5,
      title: "Comparative Information",
      body: "The General-Purpose Financial Statements disclosed all numerical information relating to the previous period.",
    },
    {
      id: "ap-6",
      order: 6,
      title: "Revenue Recognition",
      body: "Revenue from non-exchange transactions such as fees, taxes and fines is recognised when they are collected and the asset recognition criteria are met. Revenue from exchange transactions is shown net of tax, returns, rebates and discounts.",
    },
    {
      id: "ap-7",
      order: 7,
      title: "Cash and Cash Equivalents",
      body: "Cash and Cash Equivalents means cash balances on hand, held in bank accounts, demand deposits and other highly liquid investments with an original maturity of three (3) months or less, readily convertible to known amounts of cash and subject to insignificant risk of changes in value.",
    },
    {
      id: "ap-8",
      order: 8,
      title: "Property, Plant and Equipment",
      body: "PPE are stated at historical cost less accumulated depreciation and any impairment losses. Depreciation is charged on a straight-line basis over the expected useful life of each class of asset.",
      table: {
        headers: ["Item of PPE", "Depreciation Rate"],
        rows: [
          [{ value: "Buildings" }, { value: "2%" }],
          [{ value: "Infrastructure" }, { value: "5%" }],
          [{ value: "Plant and Machinery" }, { value: "10%" }],
          [{ value: "Transportation Equipment" }, { value: "20%" }],
          [{ value: "Office Equipment" }, { value: "25%" }],
          [{ value: "Furniture and Fittings" }, { value: "20%" }],
        ],
      },
    },
    {
      id: "ap-9",
      order: 9,
      title: "Advances",
      body: "The Financial Memoranda 16.16 requires that all advances granted to staff of Local Government Councils to execute projects, procure goods or services on behalf of the Councils are retired before the end of the financial year. Where circumstances cause an advance given close to year-end or an outstanding balance unretired, such an advance is reported in the Statement of Financial Position.",
    },
    {
      id: "ap-10",
      order: 10,
      title: "Statement of Cash Flow",
      body: "This statement was prepared using the direct method in accordance with the format provided in the GPFS. The cash flow statement consists of three sections: Operating Activities, Investing Activities and Financing Activities.",
    },
  ],
  supervisorSignature: SIG_SUPERVISOR,
  status: "Approved",
  updatedAt: NOW,
};

/* ─── FINANCIAL STATEMENTS (consolidated) — same as v1 ─── */
/* Re-export from the v1 file to avoid duplication */

export {
  SEED_CONSOL_SOFP as SEED_CONSOL_SOFP_V2,
  SEED_CONSOL_SOFPERF as SEED_CONSOL_SOFPERF_V2,
  SEED_CONSOL_CASHFLOW as SEED_CONSOL_CASHFLOW_V2,
  SEED_CONSOL_NOTES as SEED_CONSOL_NOTES_V2,
} from "./auditOutcomesData";

/* ─── Per-LGA packages (10 representative councils) ─── */

const REPRESENTATIVE_LGAS: Array<{ id: string; name: string; weight: number }> =
  [
    { id: "lga-1", name: "Ikeja", weight: 0.066 },
    { id: "lga-2", name: "Alimosho", weight: 0.083 },
    { id: "lga-3", name: "Agege", weight: 0.052 },
    { id: "lga-4", name: "Mushin", weight: 0.058 },
    { id: "lga-5", name: "Oshodi-Isolo", weight: 0.051 },
    { id: "lga-6", name: "Kosofe", weight: 0.058 },
    { id: "lga-7", name: "Somolu", weight: 0.043 },
    { id: "lga-8", name: "Ifako-Ijaiye", weight: 0.04 },
    { id: "lga-9", name: "Badagry", weight: 0.038 },
    { id: "lga-10", name: "Ojo", weight: 0.05 },
  ];

/**
 * Build a per-LGA audit report by scaling the state-level observations to a
 * specific council. The narrative structure matches — only Council-specific
 * facts differ.
 */
const buildLgaReport = (
  lgaId: string,
  lgaName: string,
  weight: number,
): AuditReportDocument => ({
  id: `arpt-lg-${lgaId}-2025`,
  auditOutcomeId: OUTCOME_ID,
  type: "Local Government",
  lgaId,
  title: `Management Letter on the Accounts of ${lgaName} Local Government Council for the Year Ended 31st December, 2025`,
  addressee: `The Chairman and Members, ${lgaName} Local Government Council`,
  basisOfOpinion: `The audit of the ${lgaName} Local Government Council was conducted in accordance with International Standards on Auditing (ISA) as applicable to the public sector, INTOSAI Auditing Standards, and the Lagos State Audit Law. The audit covered the period 1st January, 2025 to 31st December, 2025.`,
  opinion: "Unqualified",
  sections: [
    {
      id: `${lgaId}-s1`,
      order: 1,
      header: "Revenue",
      description: `The Council realised total revenue of approximately ₦${((89_540_000_000 * weight) / 1_000_000_000).toFixed(2)}bn during the year, comprising statutory allocations and internally generated revenue. This represented an increase over the prior year.`,
    },
    {
      id: `${lgaId}-s2`,
      order: 2,
      header: "Expenditure Analysis",
      description: `Total expenditure for the year was approximately ₦${((78_190_000_000 * weight) / 1_000_000_000).toFixed(2)}bn. Payroll absorbed the largest share, followed by transfers to SUBEB.`,
    },
    {
      id: `${lgaId}-s3`,
      order: 3,
      header: "Cash Position",
      description: `Cash and bank balances at year-end stood at approximately ₦${((14_280_000_000 * weight) / 1_000_000_000).toFixed(2)}bn. Bank reconciliations were prepared monthly and reviewed by the Treasurer.`,
      recommendation:
        "Continue the practice of monthly reconciliation and ensure the Internal Auditor signs off on each reconciliation before end-of-month close.",
    },
    {
      id: `${lgaId}-s4`,
      order: 4,
      header: "Advances and Retirements",
      description: `Unretired advances at year-end amounted to ₦${((11_930_000_000 * weight) / 1_000_000_000).toFixed(2)}bn. Management has been notified and remediation plans submitted.`,
      recommendation:
        "Enforce strict adherence to F.M. 16.16. All advances outstanding at year-end should be retired or formally written back.",
    },
  ],
  auditLeadSignature: SIG_AUDIT_LEAD,
  auditSupervisorSignature: SIG_SUPERVISOR,
  auditorGeneralSignature: SIG_AG_EMPTY,
  status: "Ready for Review",
  updatedAt: NOW,
});

/**
 * Build a per-LGA Statement of Financial Position by weighting consolidated
 * figures. This is a reasonable demo approximation — real audited per-LGA
 * statements come from each council's own ledger, not a pro-rata split.
 */
const buildLgaSofp = (
  lgaId: string,
  lgaName: string,
  weight: number,
): FinancialStatement => ({
  id: `fs-sofp-${lgaId}-2025`,
  auditOutcomeId: OUTCOME_ID,
  lgaId,
  kind: "StatementOfFinancialPosition",
  title: `${lgaName} — Statement of Financial Position as at 31st December, 2025`,
  currentYear: 2025,
  priorYear: 2024,
  status: "Approved",
  rows: [
    {
      id: `${lgaId}-r1`,
      description: "ASSETS",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-r2`,
      description: "Current Assets",
      isHeader: true,
      indent: 1,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-r3`,
      ncoaCode: "310101",
      description: "Cash and Cash Equivalent",
      note: "6",
      currentYear: Math.round(14_280_000_000 * weight),
      priorYear: Math.round(11_540_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r4`,
      ncoaCode: "310801",
      description: "Prepayments",
      note: "6",
      currentYear: Math.round(210_000_000 * weight),
      priorYear: Math.round(163_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r5`,
      description: "Total Current Assets",
      isSubtotal: true,
      currentYear: Math.round(14_490_000_000 * weight),
      priorYear: Math.round(11_703_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-r6`,
      description: "Non-Current Assets",
      isHeader: true,
      indent: 1,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-r7`,
      ncoaCode: "320101",
      description: "Property, Plant and Equipment (PPE)",
      note: "6",
      currentYear: Math.round(22_110_000_000 * weight),
      priorYear: Math.round(19_450_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r8`,
      ncoaCode: "320301",
      description: "Intangible Assets (Advances)",
      note: "6",
      currentYear: Math.round(11_930_000_000 * weight),
      priorYear: Math.round(12_880_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r9`,
      description: "Total Non-Current Assets",
      isSubtotal: true,
      currentYear: Math.round(34_040_000_000 * weight),
      priorYear: Math.round(32_330_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-r10`,
      description: "TOTAL ASSETS",
      isSubtotal: true,
      currentYear: Math.round(48_530_000_000 * weight),
      priorYear: Math.round(44_033_000_000 * weight),
    },
    {
      id: `${lgaId}-r11`,
      description: "LIABILITIES",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-r12`,
      ncoaCode: "410101",
      description: "Deposits",
      note: "7",
      currentYear: Math.round(9_220_000_000 * weight),
      priorYear: Math.round(8_760_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r13`,
      ncoaCode: "410401",
      description: "Payables (Accrued Expenses)",
      note: "7",
      currentYear: Math.round(6_680_000_000 * weight),
      priorYear: Math.round(5_890_000_000 * weight),
      indent: 2,
    },
    {
      id: `${lgaId}-r14`,
      description: "TOTAL LIABILITIES",
      isSubtotal: true,
      currentYear: Math.round(15_900_000_000 * weight),
      priorYear: Math.round(14_650_000_000 * weight),
    },
    {
      id: `${lgaId}-r15`,
      description: "NET ASSETS",
      isSubtotal: true,
      currentYear: Math.round(32_630_000_000 * weight),
      priorYear: Math.round(29_383_000_000 * weight),
    },
  ],
});

/** Minimal per-LGA performance statement */
const buildLgaSofPerf = (
  lgaId: string,
  lgaName: string,
  weight: number,
): FinancialStatement => ({
  id: `fs-sofperf-${lgaId}-2025`,
  auditOutcomeId: OUTCOME_ID,
  lgaId,
  kind: "StatementOfFinancialPerformance",
  title: `${lgaName} — Statement of Financial Performance for the Year Ended 31st December, 2025`,
  currentYear: 2025,
  priorYear: 2024,
  status: "Approved",
  rows: [
    {
      id: `${lgaId}-p1`,
      description: "REVENUE",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-p2`,
      ncoaCode: "110101",
      description: "Share of Federation Account",
      note: "1",
      currentYear: Math.round(49_820_000_000 * weight),
      priorYear: Math.round(44_110_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p3`,
      ncoaCode: "110102",
      description: "Share of Value Added Tax (VAT)",
      note: "1",
      currentYear: Math.round(28_430_000_000 * weight),
      priorYear: Math.round(24_990_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p4`,
      ncoaCode: "120204",
      description: "Internally Generated Revenue",
      note: "2",
      currentYear: Math.round(3_840_000_000 * weight),
      priorYear: Math.round(2_970_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p5`,
      description: "TOTAL REVENUE",
      isSubtotal: true,
      currentYear: Math.round(89_540_000_000 * weight),
      priorYear: Math.round(79_050_000_000 * weight),
    },
    {
      id: `${lgaId}-p6`,
      description: "EXPENDITURE",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-p7`,
      ncoaCode: "210101",
      description: "Salaries and Wages",
      note: "3",
      currentYear: Math.round(21_880_000_000 * weight),
      priorYear: Math.round(19_220_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p8`,
      ncoaCode: "220201",
      description: "Overhead Cost",
      note: "3",
      currentYear: Math.round(8_640_000_000 * weight),
      priorYear: Math.round(7_910_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p9`,
      ncoaCode: "220701",
      description: "Transfers to SUBEB and Other LG Entities",
      note: "4",
      currentYear: Math.round(38_720_000_000 * weight),
      priorYear: Math.round(32_140_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p10`,
      description: "Capital Expenditure",
      note: "5",
      currentYear: Math.round(8_950_000_000 * weight),
      priorYear: Math.round(8_620_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-p11`,
      description: "TOTAL EXPENDITURE",
      isSubtotal: true,
      currentYear: Math.round(78_190_000_000 * weight),
      priorYear: Math.round(67_890_000_000 * weight),
    },
    {
      id: `${lgaId}-p12`,
      description: "SURPLUS FOR THE YEAR",
      isSubtotal: true,
      currentYear: Math.round(11_350_000_000 * weight),
      priorYear: Math.round(11_160_000_000 * weight),
    },
  ],
});

/** Minimal per-LGA cashflow statement */
const buildLgaCashFlow = (
  lgaId: string,
  lgaName: string,
  weight: number,
): FinancialStatement => ({
  id: `fs-cashflow-${lgaId}-2025`,
  auditOutcomeId: OUTCOME_ID,
  lgaId,
  kind: "CashFlowStatement",
  title: `${lgaName} — Cash Flow Statement for the Year Ended 31st December, 2025`,
  currentYear: 2025,
  priorYear: 2024,
  status: "Approved",
  rows: [
    {
      id: `${lgaId}-c1`,
      description: "CASH FLOW FROM OPERATING ACTIVITIES",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-c2`,
      description: "Total Receipts",
      currentYear: Math.round(89_540_000_000 * weight),
      priorYear: Math.round(79_050_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-c3`,
      description: "Total Payments (Recurrent)",
      currentYear: -Math.round(69_240_000_000 * weight),
      priorYear: -Math.round(59_270_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-c4`,
      description: "Net Cash from Operating Activities",
      isSubtotal: true,
      currentYear: Math.round(20_300_000_000 * weight),
      priorYear: Math.round(19_780_000_000 * weight),
    },
    {
      id: `${lgaId}-c5`,
      description: "CASH FLOW FROM INVESTING ACTIVITIES",
      isHeader: true,
      currentYear: null,
      priorYear: null,
    },
    {
      id: `${lgaId}-c6`,
      description: "Capital Expenditure",
      currentYear: -Math.round(8_950_000_000 * weight),
      priorYear: -Math.round(8_620_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-c7`,
      description: "Net Movement in Cash",
      isSubtotal: true,
      currentYear: Math.round(11_350_000_000 * weight),
      priorYear: Math.round(11_160_000_000 * weight),
    },
    {
      id: `${lgaId}-c8`,
      description: "Cash at Start of Year",
      currentYear: Math.round(11_540_000_000 * weight),
      priorYear: Math.round(5_840_000_000 * weight),
      indent: 1,
    },
    {
      id: `${lgaId}-c9`,
      description: "Cash at End of Year",
      isSubtotal: true,
      currentYear: Math.round(22_890_000_000 * weight),
      priorYear: Math.round(17_000_000_000 * weight),
    },
  ],
});

/** Minimal per-LGA notes — light version, just a few items */
const buildLgaNotes = (lgaId: string, lgaName: string): FinancialStatement => ({
  id: `fs-notes-${lgaId}-2025`,
  auditOutcomeId: OUTCOME_ID,
  lgaId,
  kind: "NotesToTheAccounts",
  title: `${lgaName} — Notes to the Accounts`,
  currentYear: 2025,
  priorYear: 2024,
  status: "Approved",
  rows: [],
  noteRefs: [
    {
      noteNumber: 1,
      title: "Statutory Allocations",
      body: `Statutory allocations comprise the Council's share of the Federation Account, Value Added Tax and Excess Crude, received through the State-Local Government Joint Account Allocation Committee (JAAC).`,
    },
    {
      noteNumber: 2,
      title: "Internally Generated Revenue",
      body: "Comprises fees, licences, fines, sales, earnings and rent collected directly by the Council during the year.",
    },
    {
      noteNumber: 3,
      title: "Personnel and Overhead Costs",
      body: "Salaries and wages are recognised on the accrual basis. Overhead includes utilities, stationery, maintenance and other recurrent operational costs.",
    },
    {
      noteNumber: 4,
      title: "Transfers to SUBEB and Other Entities",
      body: "Transfers made from statutory allocations to the State Universal Basic Education Board and other Local Government entities during the year.",
    },
    {
      noteNumber: 5,
      title: "Capital Expenditure",
      body: "Analysis of additions to Land & Building, Infrastructure, Furniture & Fittings and Intangible Assets during the year.",
    },
    {
      noteNumber: 6,
      title: "Assets",
      body: "Composition of current and non-current assets as at year-end, including Cash, PPE and advances outstanding.",
    },
    {
      noteNumber: 7,
      title: "Liabilities",
      body: "Composition of current and non-current liabilities as at year-end.",
    },
    {
      noteNumber: 8,
      title: "Reserves",
      body: "Movements in the Council's reserves and accumulated surpluses during the year.",
    },
  ],
});

/**
 * Generate the full package (report + 4 FS) for each representative LGA.
 * Exported both as the constructed packages and the FS records themselves
 * so the store can seed both collections.
 */
export const SEED_LGA_REPORTS_V2: AuditReportDocument[] =
  REPRESENTATIVE_LGAS.map(({ id, name, weight }) =>
    buildLgaReport(id, name, weight),
  );

export const SEED_LGA_FINANCIAL_STATEMENTS_V2: FinancialStatement[] =
  REPRESENTATIVE_LGAS.flatMap(({ id, name, weight }) => [
    buildLgaSofp(id, name, weight),
    buildLgaSofPerf(id, name, weight),
    buildLgaCashFlow(id, name, weight),
    buildLgaNotes(id, name),
  ]);

export const SEED_LGA_PACKAGES_V2: LgaAuditPackage[] = REPRESENTATIVE_LGAS.map(
  ({ id, name, weight }) => ({
    id: `lgp-${id}-2025`,
    auditOutcomeId: OUTCOME_ID,
    lgaId: id,
    report: buildLgaReport(id, name, weight),
    sofp: buildLgaSofp(id, name, weight),
    sofp_performance: buildLgaSofPerf(id, name, weight),
    cashFlow: buildLgaCashFlow(id, name, weight),
    notes: buildLgaNotes(id, name),
    included: true,
    status: "Approved",
  }),
);

/* ─── Top-level outcome (V2) ─── */

export const SEED_AUDIT_OUTCOMES_V2: AuditOutcome[] = [
  {
    id: OUTCOME_ID,
    mandateId: "mandate-4", // FY2023 mandate — Completed cycle
    auditId: "audit-9",
    auditYear: 2025,
    title: "Lagos State Local Governments — Audited Financial Statements 2025",
    status: "Ready for Review",
    createdBy: "user-lead-1",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: NOW,
    trialBalanceIds: [SEED_TRIAL_BALANCE_V2.id],
    materialityCalcId: SEED_MATERIALITY_CALC_V2.id,
    statementOfResponsibilityId: SEED_STATEMENT_OF_RESPONSIBILITY_V2.id,
    auditReportIds: [
      SEED_AUDIT_REPORT_STATE_V2.id,
      ...SEED_LGA_REPORTS_V2.map((r) => r.id),
    ],
    accountingPoliciesId: SEED_ACCOUNTING_POLICIES_V2.id,
    consolidatedSofpId: "fs-sofp-2025",
    consolidatedSofPerfId: "fs-sofperf-2025",
    consolidatedCashFlowId: "fs-cashflow-2025",
    consolidatedNotesId: "fs-notes-2025",
    lgaPackageIds: SEED_LGA_PACKAGES_V2.map((p) => p.id),
  },
];
