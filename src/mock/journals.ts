import type {
  AuditJournal,
  AuditComment,
} from "../types";

export const SEED_AUDIT_JOURNALS: AuditJournal[] = [
  {
    id: "aj-1",
    auditId: "audit-1",
    journalNumber: "AJE-001",
    type: "Adjusting",
    description:
      "To correct under-accrual of salary arrears for Q4 2025 — 47 staff members with confirmed outstanding entitlements per HR records.",
    entries: [
      {
        account: "Personnel Costs — Salary Arrears",
        debit: 15_450_000,
        credit: 0,
      },
      {
        account: "Accrued Liabilities — Staff Costs",
        debit: 0,
        credit: 15_450_000,
      },
    ],
    netEffect: 15_450_000,
    affectedArea: "Payroll & Personnel Costs",
    preparedBy: "user-auditor-1",
    reviewedBy: "user-lead-1",
    status: "Agreed",
    createdAt: "2026-03-10T09:00:00Z",
    workpaperRef: "WP-PAY-03",
  },
  {
    id: "aj-2",
    auditId: "audit-1",
    journalNumber: "AJE-002",
    type: "Adjusting",
    description:
      "To write down impaired capital project costs — Community Health Centre project abandoned at 35% completion.",
    entries: [
      {
        account: "Impairment Loss — Capital Projects",
        debit: 28_700_000,
        credit: 0,
      },
      {
        account: "Work-in-Progress — Capital Projects",
        debit: 0,
        credit: 28_700_000,
      },
    ],
    netEffect: 28_700_000,
    affectedArea: "Fixed Assets & Capital Projects",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    status: "Proposed",
    createdAt: "2026-03-11T10:30:00Z",
    workpaperRef: "WP-AST-05",
  },
  {
    id: "aj-3",
    auditId: "audit-1",
    journalNumber: "RJE-001",
    type: "Reclassifying",
    description:
      "To reclassify capital grant incorrectly posted to recurrent revenue — SUBEB Education Grant FY2025.",
    entries: [
      { account: "Recurrent Revenue — Grants", debit: 42_000_000, credit: 0 },
      { account: "Capital Revenue — Grants", debit: 0, credit: 42_000_000 },
    ],
    netEffect: 0,
    affectedArea: "Revenue & Receipts",
    preparedBy: "user-auditor-1",
    status: "Posted",
    createdAt: "2026-03-12T14:00:00Z",
    workpaperRef: "WP-REV-02",
  },
  {
    id: "aj-4",
    auditId: "audit-1",
    journalNumber: "AJE-003",
    type: "Adjusting",
    description:
      "To record unrecorded creditors identified from post-year-end payment testing (12 invoices dated prior to year end).",
    entries: [
      {
        account: "Works & Maintenance Expenditure",
        debit: 8_350_000,
        credit: 0,
      },
      {
        account: "Accounts Payable — Trade Creditors",
        debit: 0,
        credit: 8_350_000,
      },
    ],
    netEffect: 8_350_000,
    affectedArea: "Expenditure & Payments",
    preparedBy: "user-auditor-2",
    status: "Draft",
    createdAt: "2026-03-13T11:00:00Z",
  },
  {
    id: "aj-5",
    auditId: "audit-1",
    journalNumber: "PJE-001",
    type: "Passed",
    description:
      "Unadjusted difference: Minor classification variance in stationery vs office supplies below clearly trivial threshold.",
    entries: [
      { account: "Office Supplies", debit: 125_000, credit: 0 },
      { account: "Stationery Expense", debit: 0, credit: 125_000 },
    ],
    netEffect: 0,
    affectedArea: "Expenditure & Payments",
    preparedBy: "user-lead-1",
    status: "Waived",
    createdAt: "2026-03-14T09:30:00Z",
    workpaperRef: "WP-EXP-08",
  },
];

export const SEED_AUDIT_COMMENTS: AuditComment[] = [
  {
    id: "ac-1",
    auditId: "audit-1",
    referenceNumber: "MC-2025-001",
    title: "Inadequate Bank Reconciliation Procedures",
    observation:
      "Bank reconciliation statements for 3 of 7 council bank accounts were not prepared for 4 consecutive months (August–November 2025). Outstanding items on remaining reconciliations included stale cheques older than 6 months totalling ₦12.4M.",
    criteria:
      "Financial Regulation 1606 requires monthly reconciliation of all bank accounts. ISA 330 mandates testing of reconciliation controls.",
    cause:
      "Vacancy in treasury reconciliation officer position since June 2025 with no interim cover arranged.",
    effect:
      "Increased risk of undetected errors or misappropriation in bank transactions. ₦12.4M in stale items may represent unrealisable amounts.",
    recommendation:
      "Management should (1) immediately fill the reconciliation officer vacancy, (2) complete all outstanding reconciliations within 30 days, (3) investigate and write off confirmed stale items with proper approval.",
    managementResponse:
      "Noted. Recruitment process initiated. All reconciliations will be brought up to date by end of Q1 2026.",
    severity: "High",
    status: "Agreed",
    responsibleParty: "Treasurer",
    targetDate: "2026-06-30",
    preparedBy: "user-auditor-1",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "ac-2",
    auditId: "audit-1",
    referenceNumber: "MC-2025-002",
    title: "Non-Compliance with Procurement Due Process",
    observation:
      "8 out of 15 contracts sampled (53%) above ₦5M threshold lacked Due Process certification from the Bureau of Public Procurement prior to award. Total value of non-compliant contracts: ₦187M.",
    criteria:
      "Public Procurement Act 2007, Sections 16 & 28 require prior certification for all contracts above threshold.",
    cause:
      "Pressure to meet project delivery timelines led to bypassing the certification process. Lack of internal monitoring mechanism for procurement compliance.",
    effect:
      "Council exposed to legal liability. Value for money not assured for ₦187M in expenditure. Potential for fraud or collusion.",
    recommendation:
      "Management should (1) enforce mandatory Due Process certification as a pre-condition for payment, (2) implement a procurement compliance checklist in the ERP system, (3) conduct compliance training for all procurement officers.",
    severity: "Critical",
    status: "Discussed",
    responsibleParty: "Head of Procurement",
    targetDate: "2026-07-31",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-09T14:00:00Z",
  },
  {
    id: "ac-3",
    auditId: "audit-1",
    referenceNumber: "MC-2025-003",
    title: "Weak Controls Over IGR Collection",
    observation:
      "Manual receipt books still in use for 40% of IGR collection points. No reconciliation between receipt books and bank deposits at 6 out of 10 revenue collection points.",
    criteria:
      "Lagos State Revenue Administration Law requires electronic receipting. Financial Regulation 406 requires daily reconciliation of collections.",
    cause:
      "Incomplete rollout of the automated revenue collection platform. Budget constraints delayed procurement of POS devices at satellite offices.",
    effect:
      "Revenue leakage estimated at ₦15-25M annually based on analytical comparison with comparable councils. ₦8.2M variance between receipts issued and bank lodgements remains unexplained.",
    recommendation:
      "Complete the electronic receipting rollout across all collection points. Investigate the ₦8.2M unexplained variance and hold responsible officers accountable.",
    severity: "High",
    status: "Agreed",
    responsibleParty: "Revenue Manager",
    targetDate: "2026-09-30",
    preparedBy: "user-lead-1",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "ac-4",
    auditId: "audit-1",
    referenceNumber: "MC-2025-004",
    title: "Ghost Worker Indicators in Payroll Data",
    observation:
      "Biometric cross-reference analysis identified 12 employees on the payroll who have no biometric attendance records for 6+ consecutive months. Combined annual salary cost: ₦18.6M. Additionally, 3 employees have identical bank account numbers for salary remittance.",
    criteria:
      "Civil Service Rules require regular attendance monitoring. ISA 240 requires assessment of fraud indicators.",
    cause:
      "Biometric attendance system not linked to payroll processing. Manual payroll preparation without automated validation checks.",
    effect:
      "Potential payroll fraud exposure of up to ₦18.6M per annum. Identical bank accounts may indicate ghost workers or diversion of funds.",
    recommendation:
      "Immediately suspend salary payments for flagged employees pending physical verification. Integrate biometric system with payroll module. Refer findings to anti-corruption unit for investigation.",
    managementResponse:
      "Payments suspended for investigation. Full verification exercise to be conducted within 60 days.",
    severity: "Critical",
    status: "Reported",
    responsibleParty: "Head of HR / Internal Audit",
    targetDate: "2026-05-31",
    preparedBy: "user-auditor-2",
    reviewedBy: "user-lead-1",
    createdAt: "2026-03-11T11:00:00Z",
  },
  {
    id: "ac-5",
    auditId: "audit-1",
    referenceNumber: "MC-2025-005",
    title: "Fixed Asset Register Deficiencies",
    observation:
      "Asset register last updated in March 2024. Physical verification revealed 23 assets not in register (reverse testing) and 15 register items could not be physically located. No depreciation schedule maintained.",
    criteria:
      "IPSAS 17 requires maintenance of complete and accurate asset registers with systematic depreciation. Financial Regulation 2601 requires annual asset verification.",
    cause:
      "No dedicated asset management officer. Last comprehensive asset verification conducted 3 years ago.",
    effect:
      "Financial statements may be materially misstated for property, plant and equipment. Risk of asset theft or misuse undetected.",
    recommendation:
      "Commission a comprehensive asset verification and update the register. Appoint a dedicated asset management officer. Implement depreciation policy per IPSAS 17.",
    severity: "Medium",
    status: "Draft",
    responsibleParty: "Stores Officer / Accounting",
    preparedBy: "user-auditor-1",
    createdAt: "2026-03-12T15:00:00Z",
  },
];

