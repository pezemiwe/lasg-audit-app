import type {
  QuestionnaireQuestion,
  QuestionnaireResponse,
} from "../types";

export const SEED_QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  // â•â•â• Understanding the Entity (ISA 315) â•â•â•
  {
    id: "q-1",
    section: "Understanding the Entity",
    question: "What is the LGA's organizational structure?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Well-defined with clear reporting lines",
        value: "well_defined",
      },
      {
        label: "Partially defined — some gaps in reporting lines",
        value: "partial",
      },
      { label: "Poorly defined — no formal organogram", value: "poor" },
    ],
  },
  {
    id: "q-2",
    section: "Understanding the Entity",
    question: "What are the LGA's primary funding sources?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Federal Allocation", value: "federal_allocation" },
      { label: "State Allocation", value: "state_allocation" },
      { label: "Internally Generated Revenue", value: "igr" },
      { label: "Grants & Donor Funding", value: "grants" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-3",
    section: "Understanding the Entity",
    question:
      "Has the LGA's organizational chart been reviewed and confirmed current?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Current and comprehensive", value: "yes_current" },
      { label: "Yes — Available but outdated", value: "yes_outdated" },
      { label: "No — Organizational chart not available", value: "no" },
    ],
  },
  {
    id: "q-4",
    section: "Understanding the Entity",
    question:
      "What is the approximate total staff strength (permanent + casual)?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Under 500", value: "under_500" },
      { label: "500 – 1,000", value: "500_1000" },
      { label: "1,000 – 2,000", value: "1000_2000" },
      { label: "Over 2,000", value: "over_2000" },
    ],
  },
  {
    id: "q-5",
    section: "Understanding the Entity",
    question:
      "Has the LGA undergone significant structural or leadership changes in the last 24 months?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Major leadership change", value: "yes_major" },
      { label: "Yes — Minor restructuring only", value: "yes_minor" },
      { label: "No — Stable structure", value: "no" },
    ],
  },
  {
    id: "q-6",
    section: "Understanding the Entity",
    question:
      "How does the current year's approved budget compare to the previous year?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Increased by more than 20%", value: "increase_20plus" },
      { label: "Increased by 5–20%", value: "increase_5_20" },
      { label: "Roughly the same (±5%)", value: "same" },
      { label: "Decreased", value: "decreased" },
    ],
  },
  {
    id: "q-7",
    section: "Understanding the Entity",
    question: "Are the LGA's enabling law/bye-laws reviewed and up to date?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Reviewed within the last 3 years", value: "yes_recent" },
      { label: "No — Last reviewed over 5 years ago", value: "no_old" },
      { label: "Unknown — Not verified", value: "unknown" },
    ],
  },
  {
    id: "q-8",
    section: "Understanding the Entity",
    question: "How does the LGA receive and account for JAAC allocations?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Direct credit to dedicated account with proper reconciliation",
        value: "dedicated_reconciled",
      },
      {
        label: "Direct credit but reconciliation is irregular",
        value: "dedicated_irregular",
      },
      { label: "Commingled with other funds", value: "commingled" },
    ],
  },

  // â•â•â• Key Accounting Systems â•â•â•
  {
    id: "q-9",
    section: "Key Accounting Systems",
    question: "Does the LGA use accounting software for financial management?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Fully automated", value: "yes_full" },
      { label: "Yes — Partially automated", value: "yes_partial" },
      { label: "No — Manual system only", value: "no" },
    ],
  },
  {
    id: "q-10",
    section: "Key Accounting Systems",
    question: "How is revenue collected and receipted?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Centralized with pre-numbered receipts and daily reconciliation",
        value: "centralized_good",
      },
      {
        label: "Decentralized collection points with periodic reconciliation",
        value: "decentralized",
      },
      { label: "No formal receipt system in place", value: "no_system" },
    ],
  },
  {
    id: "q-11",
    section: "Key Accounting Systems",
    question: "How is the payroll processed?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Automated payroll system with biometric verification",
        value: "automated_biometric",
      },
      {
        label: "Automated payroll without biometric verification",
        value: "automated_no_bio",
      },
      { label: "Manual payroll processing", value: "manual" },
    ],
  },
  {
    id: "q-12",
    section: "Key Accounting Systems",
    question: "What accounting basis does the LGA adopt?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Cash Basis (IPSAS Cash)", value: "cash" },
      { label: "Accrual Basis (IPSAS Accrual)", value: "accrual" },
      { label: "Modified Cash Basis", value: "modified_cash" },
      { label: "Modified Accrual Basis", value: "modified_accrual" },
    ],
  },
  {
    id: "q-13",
    section: "Key Accounting Systems",
    question: "Are bank reconciliation statements prepared regularly?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Monthly, by a preparer with independent reviewer",
        value: "yes_monthly",
      },
      { label: "Yes — Quarterly", value: "yes_quarterly" },
      { label: "Irregularly — No fixed schedule", value: "irregular" },
      { label: "No — Not performed", value: "no" },
    ],
  },
  {
    id: "q-14",
    section: "Key Accounting Systems",
    question: "How are petty cash advances controlled?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Imprest system with approved limits and prompt retirement",
        value: "imprest_good",
      },
      {
        label: "Imprest system but retirements are frequently delayed",
        value: "imprest_delayed",
      },
      { label: "No formal petty cash controls", value: "no_controls" },
    ],
  },
  {
    id: "q-15",
    section: "Key Accounting Systems",
    question: "Are audited accounts for the last three fiscal years available?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — All three years available and filed", value: "yes_all" },
      { label: "Yes — Partially (1-2 years only)", value: "yes_partial" },
      { label: "No — Accounts are in arrears", value: "no" },
    ],
  },

  // â•â•â• Internal Control Environment (ISA 315/330) â•â•â•
  {
    id: "q-16",
    section: "Internal Control Environment",
    question: "Rate the overall internal control environment of the LGA.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Strong — Well-designed and operating effectively", value: "1" },
      { label: "Adequate — Generally effective with minor gaps", value: "2" },
      {
        label: "Moderate — Some significant weaknesses identified",
        value: "3",
      },
      { label: "Weak — Multiple material weaknesses present", value: "4" },
      {
        label: "Very Weak — Controls are largely absent or ineffective",
        value: "5",
      },
    ],
  },
  {
    id: "q-17",
    section: "Internal Control Environment",
    question: "Is there a functional internal audit unit within the LGA?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Active and reports regularly", value: "yes_active" },
      { label: "Yes — Exists but not fully functional", value: "yes_limited" },
      { label: "No — No internal audit function", value: "no" },
    ],
  },
  {
    id: "q-18",
    section: "Internal Control Environment",
    question:
      "Is segregation of duties maintained for financial transactions (authorisation, custody, recording)?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Fully segregated across all functions",
        value: "yes_full",
      },
      { label: "Partially — Some functions are combined", value: "partial" },
      { label: "No — Inadequate segregation", value: "no" },
    ],
  },
  {
    id: "q-19",
    section: "Internal Control Environment",
    question: "Is there a documented financial regulations manual in use?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Current and actively followed", value: "yes_current" },
      { label: "Yes — Available but compliance is weak", value: "yes_weak" },
      { label: "No — No documented financial manual", value: "no" },
    ],
  },
  {
    id: "q-20",
    section: "Internal Control Environment",
    question: "How are fixed assets recorded and managed?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Complete asset register maintained and reconciled annually",
        value: "complete",
      },
      {
        label: "Register exists but is incomplete or outdated",
        value: "incomplete",
      },
      { label: "No formal fixed asset register", value: "none" },
    ],
  },
  {
    id: "q-21",
    section: "Internal Control Environment",
    question:
      "Are there unresolved audit queries from the previous audit cycle?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "No — All prior queries resolved", value: "all_resolved" },
      { label: "Yes — Some queries remain unresolved", value: "some_pending" },
      {
        label: "Yes — Majority of queries remain unresolved",
        value: "most_pending",
      },
    ],
  },
  {
    id: "q-22",
    section: "Internal Control Environment",
    question: "Rate the effectiveness of the IT general controls environment.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Strong — Robust IT controls in place", value: "1" },
      { label: "Adequate — Basic controls with some gaps", value: "2" },
      { label: "Moderate — Significant IT weaknesses", value: "3" },
      { label: "Weak — Minimal or no IT controls", value: "4" },
    ],
  },

  // â•â•â• Risk Assessment (ISA 315/330) â•â•â•
  {
    id: "q-23",
    section: "Risk Assessment",
    question:
      "Rate the overall risk of material misstatement for the LGA's financial statements.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Low", value: "1" },
      { label: "Medium-Low", value: "2" },
      { label: "Medium", value: "3" },
      { label: "Medium-High", value: "4" },
      { label: "High", value: "5" },
    ],
  },
  {
    id: "q-24",
    section: "Risk Assessment",
    question:
      "Have any fraud or irregularity indicators been identified during the preliminary review?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Specific indicators identified", value: "yes" },
      { label: "No — No indicators at this stage", value: "no" },
      {
        label: "Inconclusive — Further investigation needed",
        value: "inconclusive",
      },
    ],
  },
  {
    id: "q-25",
    section: "Risk Assessment",
    question:
      "Are there any identified related-party transactions or conflicts of interest?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Significant related-party transactions noted",
        value: "yes_significant",
      },
      { label: "Yes — Minor related-party matters noted", value: "yes_minor" },
      { label: "No — None identified", value: "no" },
    ],
  },
  {
    id: "q-26",
    section: "Risk Assessment",
    question: "Are there ongoing litigation cases or contingent liabilities?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Significant financial exposure",
        value: "yes_significant",
      },
      { label: "Yes — Minor or immaterial exposure", value: "yes_minor" },
      { label: "No — None identified", value: "no" },
    ],
  },
  {
    id: "q-27",
    section: "Risk Assessment",
    question:
      "Has the LGA been subject to any special investigations or forensic audits in the last 5 years?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Resulted in recoveries or sanctions",
        value: "yes_sanctions",
      },
      { label: "Yes — Cleared without findings", value: "yes_cleared" },
      { label: "No", value: "no" },
      { label: "Not aware", value: "unknown" },
    ],
  },
  {
    id: "q-28",
    section: "Risk Assessment",
    question:
      "What is the assessment of management integrity and control consciousness?",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "High — Strong tone at the top", value: "1" },
      { label: "Adequate — Generally cooperative", value: "2" },
      { label: "Moderate — Some concerns noted", value: "3" },
      { label: "Low — Significant integrity concerns", value: "4" },
    ],
  },
  {
    id: "q-29",
    section: "Risk Assessment",
    question:
      "How frequent are significant changes in personnel or accounting systems?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Frequent — Multiple changes yearly", value: "frequent" },
      { label: "Occasional — Some changes", value: "occasional" },
      { label: "Rare — Systems and personnel are stable", value: "rare" },
    ],
  },
  {
    id: "q-30",
    section: "Risk Assessment",
    question:
      "Do you have formal mechanisms in place to assess fraud risks proactively?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Regular formal assessments", value: "yes_formal" },
      { label: "Yes — Informal assessments only", value: "yes_informal" },
      { label: "No — No mechanism in place", value: "no" },
    ],
  },
  {
    id: "q-31",
    section: "Risk Assessment",
    question:
      "Is there a documented business continuity or disaster recovery plan?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Documented and regularly tested", value: "yes_tested" },
      { label: "Yes — Documented but rarely tested", value: "yes_untested" },
      { label: "No — No formal plan", value: "no" },
    ],
  },
  {
    id: "q-32",
    section: "Risk Assessment",
    question:
      "Are external compliance and regulatory requirements consistently met on time?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Consistently met on time", value: "yes" },
      { label: "Partially — Occasional delays or issues", value: "partial" },
      { label: "No — Frequent delays or compliance failures", value: "no" },
    ],
  },

  // â•â•â• Additional: Understanding the Entity â•â•â•
  {
    id: "q-ue-1",
    section: "Understanding the Entity",
    question:
      "How many council wards does the LGA have, and is ward-level financial reporting available?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Ward-level reports are produced and consolidated",
        value: "ward_reports",
      },
      {
        label: "Wards exist but no separate financial reports are produced",
        value: "no_reports",
      },
      {
        label: "Ward structure is unclear or not formally defined",
        value: "unclear",
      },
    ],
  },
  {
    id: "q-ue-2",
    section: "Understanding the Entity",
    question:
      "Has the LGA entered into any Public-Private Partnerships (PPPs) or joint ventures during the audit period?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — With documented agreements and reporting",
        value: "yes_documented",
      },
      {
        label: "Yes — Informal arrangements not fully documented",
        value: "yes_informal",
      },
      { label: "No", value: "no" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-ue-3",
    section: "Understanding the Entity",
    question:
      "Are the LGA's annual budgets publicly disclosed and submitted to the relevant state authority on time?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Always submitted on time and publicly available",
        value: "yes_timely",
      },
      {
        label: "Partially — Submitted late or not publicly disclosed",
        value: "partial",
      },
      {
        label: "No — Budget submissions are consistently delayed",
        value: "no",
      },
    ],
  },
  {
    id: "q-ue-4",
    section: "Understanding the Entity",
    question:
      "Does the LGA have a Medium-Term Expenditure Framework (MTEF) or development plan aligned to its budget?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — MTEF is in place and budget-aligned", value: "yes_mtef" },
      {
        label: "Partially — Plans exist but not integrated with budget",
        value: "partial",
      },
      { label: "No — No formal MTEF or development plan", value: "no" },
    ],
  },

  // â•â•â• Additional: Key Accounting Systems â•â•â•
  {
    id: "q-kas-1",
    section: "Key Accounting Systems",
    question:
      "Is there a documented chart of accounts aligned to IPSAS/PSAS standards?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Fully aligned and consistently applied",
        value: "yes_aligned",
      },
      { label: "Yes — Exists but partially applied", value: "yes_partial" },
      { label: "No — No formal chart of accounts in use", value: "no" },
    ],
  },
  {
    id: "q-kas-2",
    section: "Key Accounting Systems",
    question:
      "How are journal vouchers authorised and reviewed before posting?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Dual authorisation by preparer and independent reviewer",
        value: "dual_auth",
      },
      { label: "Authorised by one officer only", value: "single_auth" },
      { label: "No formal authorisation process", value: "no_auth" },
    ],
  },
  {
    id: "q-kas-3",
    section: "Key Accounting Systems",
    question:
      "Are staff and project advances regularly retired within the stipulated period?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — All advances retired on time", value: "yes_all" },
      {
        label: "Partially — Some advances remain outstanding beyond due date",
        value: "partial",
      },
      { label: "No — Significant unretired advances exist", value: "no" },
    ],
  },
  {
    id: "q-kas-4",
    section: "Key Accounting Systems",
    question:
      "Is there a functional stores or inventory management system for LGA assets and consumables?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Full stores management with periodic stock-taking",
        value: "yes_full",
      },
      { label: "Yes — Exists but not effectively managed", value: "yes_weak" },
      { label: "No — No formal stores management", value: "no" },
    ],
  },

  // â•â•â• Additional: Internal Control Environment â•â•â•
  {
    id: "q-ice-1",
    section: "Internal Control Environment",
    question:
      "Does the LGA conduct periodic formal risk assessments to identify and mitigate operational risks?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Conducted at least annually with documented outcomes",
        value: "yes_annual",
      },
      {
        label: "Yes — Informally, without documented outputs",
        value: "yes_informal",
      },
      { label: "No — No formal risk assessment process", value: "no" },
    ],
  },
  {
    id: "q-ice-2",
    section: "Internal Control Environment",
    question:
      "Are there documented expenditure approval thresholds (e.g., Treasurer, Chairman, Council) enforced in practice?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Documented and consistently enforced",
        value: "yes_enforced",
      },
      {
        label: "Yes — Documented but inconsistently applied",
        value: "yes_weak",
      },
      { label: "No — No formal approval thresholds in place", value: "no" },
    ],
  },
  {
    id: "q-ice-3",
    section: "Internal Control Environment",
    question:
      "Is there a documented anti-corruption or whistleblower policy accessible to all staff?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Yes — Policy exists, staff are aware, and complaints channel is active",
        value: "yes_active",
      },
      {
        label: "Yes — Policy exists but staff awareness is low",
        value: "yes_low_awareness",
      },
      { label: "No — No such policy exists", value: "no" },
    ],
  },
  {
    id: "q-ice-4",
    section: "Internal Control Environment",
    question:
      "How frequently are surprise cash counts or unannounced control checks conducted?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Monthly or more frequently", value: "monthly" },
      { label: "Quarterly", value: "quarterly" },
      { label: "Annually or less", value: "annually" },
      { label: "Never — No such checks are conducted", value: "never" },
    ],
  },

  // â•â•â• Additional: Risk Assessment â•â•â•
  {
    id: "q-ra-1",
    section: "Risk Assessment",
    question:
      "Are there significant areas of non-compliance with the LGA's Appropriation Law or approved budget lines?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Multiple significant breaches identified",
        value: "yes_significant",
      },
      { label: "Yes — Minor deviations with explanations", value: "yes_minor" },
      {
        label: "No — Expenditures are within appropriated limits",
        value: "no",
      },
    ],
  },
  {
    id: "q-ra-2",
    section: "Risk Assessment",
    question:
      "Are Budget Implementation Reports (BIRs) prepared and submitted to relevant oversight bodies?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Prepared quarterly and submitted on time",
        value: "yes_timely",
      },
      {
        label: "Yes — Prepared but not submitted or submitted late",
        value: "yes_late",
      },
      { label: "No — BIRs are not prepared", value: "no" },
    ],
  },

  // â•â•â• Information Security â•â•â•
  {
    id: "q-37",
    section: "Information Security",
    question: "Rate the maturity of the LGA's cybersecurity measures.",
    type: "risk-scoring",
    required: true,
    options: [
      { label: "Mature — Comprehensive security framework", value: "1" },
      { label: "Developing — Basic protections in place", value: "2" },
      { label: "Minimal — Significant gaps", value: "3" },
      { label: "Non-existent — No cybersecurity measures", value: "4" },
    ],
  },
  {
    id: "q-38",
    section: "Information Security",
    question:
      "Are there formal IT policies covering acceptable use, passwords, and data protection?",
    type: "multiple-choice",
    required: true,
    options: [
      { label: "Yes — Documented and enforced", value: "yes_enforced" },
      {
        label: "Yes — Documented but not actively enforced",
        value: "yes_not_enforced",
      },
      { label: "No — No formal IT policies", value: "no" },
    ],
  },
  {
    id: "q-is-1",
    section: "Information Security",
    question:
      "Is access to financial systems controlled through role-based permissions and unique user accounts?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label:
          "Yes — Role-based access with unique accounts and regular reviews",
        value: "yes_rbac",
      },
      {
        label: "Partially — Some shared accounts or unreviewed access rights",
        value: "partial",
      },
      { label: "No — No formal access controls in place", value: "no" },
    ],
  },
  {
    id: "q-is-2",
    section: "Information Security",
    question:
      "Are backups of financial data performed regularly and stored securely (off-site or cloud)?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Daily or weekly backups with secure off-site storage",
        value: "yes_regular",
      },
      {
        label: "Yes — Backups exist but not tested or stored off-site",
        value: "yes_weak",
      },
      { label: "No — No regular backup process", value: "no" },
    ],
  },
  {
    id: "q-is-3",
    section: "Information Security",
    question:
      "Have there been any cybersecurity incidents, data breaches, or system failures in the last 3 years?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Major incident with significant data or financial impact",
        value: "yes_major",
      },
      { label: "Yes — Minor incidents that were resolved", value: "yes_minor" },
      { label: "No — No known incidents", value: "no" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "q-is-4",
    section: "Information Security",
    question:
      "Is there a qualified ICT officer or dedicated IT governance unit responsible for systems management?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Dedicated ICT unit with qualified staff",
        value: "yes_dedicated",
      },
      {
        label: "Yes — Shared responsibility with limited IT expertise",
        value: "yes_shared",
      },
      { label: "No — No dedicated IT function", value: "no" },
    ],
  },
  {
    id: "q-is-5",
    section: "Information Security",
    question:
      "Are staff trained on data protection, phishing awareness, and IT security best practices?",
    type: "multiple-choice",
    required: true,
    options: [
      {
        label: "Yes — Regular structured training conducted",
        value: "yes_regular",
      },
      {
        label: "Yes — Occasional or informal training only",
        value: "yes_occasional",
      },
      { label: "No — No IT security training provided", value: "no" },
    ],
  },
];

export const SEED_QUESTIONNAIRE_RESPONSES: QuestionnaireResponse[] = [
  {
    id: "qr-1",
    auditId: "audit-1",
    questionId: "q-1",
    section: "Understanding the Entity",
    answer: "well_defined",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "qr-2",
    auditId: "audit-1",
    questionId: "q-2",
    section: "Understanding the Entity",
    answer: "federal_allocation,state_allocation,igr",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T10:15:00Z",
  },
  {
    id: "qr-3",
    auditId: "audit-1",
    questionId: "q-9",
    section: "Key Accounting Systems",
    answer: "yes_partial",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-02T11:00:00Z",
  },
  {
    id: "qr-4",
    auditId: "audit-1",
    questionId: "q-16",
    section: "Internal Control Environment",
    answer: "3",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:00:00Z",
  },
  {
    id: "qr-5",
    auditId: "audit-1",
    questionId: "q-23",
    section: "Risk Assessment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:30:00Z",
  },
  {
    id: "qr-6",
    auditId: "audit-1",
    questionId: "q-24",
    section: "Risk Assessment",
    answer: "inconclusive",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:35:00Z",
  },
  {
    id: "qr-7",
    auditId: "audit-1",
    questionId: "q-25",
    section: "Risk Assessment",
    answer: "yes_minor",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:40:00Z",
  },
  {
    id: "qr-8",
    auditId: "audit-1",
    questionId: "q-28",
    section: "Risk Assessment",
    answer: "3",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:45:00Z",
  },
  {
    id: "qr-9",
    auditId: "audit-1",
    questionId: "q-29",
    section: "Risk Assessment",
    answer: "occasional",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T09:50:00Z",
  },
  {
    id: "qr-10",
    auditId: "audit-1",
    questionId: "q-17",
    section: "Internal Control Environment",
    answer: "yes_limited",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T10:00:00Z",
  },
  {
    id: "qr-11",
    auditId: "audit-1",
    questionId: "q-20",
    section: "Fixed Assets",
    answer: "incomplete",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-03T10:05:00Z",
  },
  // audit-3 questionnaire responses
  {
    id: "qr-12",
    auditId: "audit-3",
    questionId: "q-16",
    section: "Internal Control Environment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "qr-13",
    auditId: "audit-3",
    questionId: "q-23",
    section: "Risk Assessment",
    answer: "5",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:10:00Z",
  },
  {
    id: "qr-14",
    auditId: "audit-3",
    questionId: "q-24",
    section: "Risk Assessment",
    answer: "yes",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:15:00Z",
  },
  {
    id: "qr-15",
    auditId: "audit-3",
    questionId: "q-25",
    section: "Risk Assessment",
    answer: "yes_significant",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:20:00Z",
  },
  {
    id: "qr-16",
    auditId: "audit-3",
    questionId: "q-17",
    section: "Internal Control Environment",
    answer: "no",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:25:00Z",
  },
  {
    id: "qr-17",
    auditId: "audit-3",
    questionId: "q-20",
    section: "Fixed Assets",
    answer: "none",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:30:00Z",
  },
  {
    id: "qr-18",
    auditId: "audit-3",
    questionId: "q-28",
    section: "Risk Assessment",
    answer: "4",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:35:00Z",
  },
  {
    id: "qr-19",
    auditId: "audit-3",
    questionId: "q-29",
    section: "Risk Assessment",
    answer: "frequent",
    answeredBy: "user-lead-1",
    answeredAt: "2026-03-15T09:40:00Z",
  },
];
