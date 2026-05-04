export const RISK_KEY_RISKS: Record<string, string[]> = {
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

export const buildDefaultKeyRisks = (sectionTitle: string): string[] =>
  RISK_KEY_RISKS[sectionTitle] ?? [
    "Risk of material misstatement in this area",
    "Potential non-compliance with applicable regulations",
    "Fraud risk: manipulation or misrepresentation",
  ];

export const buildDefaultDocNotes = (sectionTitle: string): string =>
  `Document all procedures performed for ${sectionTitle}. Retain copies of key supporting documents (sample selections, confirmations, reconciliations). Cross-reference all evidence to the relevant workpaper.`;
