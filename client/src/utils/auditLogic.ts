export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

// Matrix Logic for Automated Risk Calculation
// Takes Inherent & Control risks -> Outputs Overall Audit Risk
export const calculateOverallRisk = (
  inherent: RiskLevel,
  control: RiskLevel,
): RiskLevel => {
  const i = inherent;
  const c = control;

  // Critical Inherent Risk always leads to High or Critical
  if (i === "Critical") {
    if (c === "Critical" || c === "High") return "Critical";
    if (c === "Medium") return "High";
    return "Medium"; // Strong controls can mitigate critical inherent risk only slightly
  }

  // High Inherent Risk
  if (i === "High") {
    if (c === "Critical" || c === "High") return "High";
    if (c === "Medium") return "Medium";
    return "Low";
  }

  // Medium Inherent Risk
  if (i === "Medium") {
    if (c === "Critical") return "High";
    if (c === "High") return "Medium";
    return "Low";
  }

  // Low Inherent Risk
  if (i === "Low") {
    if (c === "Critical") return "Medium";
    return "Low";
  }

  return "Medium"; // Fallback
};

// Auto-Suggest Procedures based on Risk Area
// Returns assertion-aligned procedures suitable for the standardised AWP
export const getSuggestedProcedures = (area: string): string[] => {
  const procedures: Record<string, string[]> = {
    "Revenue Collection": [
      "Vouch a sample of revenue receipts to source documents and verify sequential numbering (Completeness/Existence).",
      "Reconcile daily cash collections with bank deposit slips and confirm amounts agree (Accuracy/Valuation).",
      "Confirm authorization of revenue waivers/discounts by relevant authority and review supporting approvals (Rights & Obligations).",
    ],
    "Revenue & Receipts": [
      "Vouch a sample of revenue receipts to source documents and verify sequential numbering (Completeness).",
      "Reconcile aggregate revenue to approved budget and investigate variances exceeding 10% (Accuracy/Valuation).",
      "Confirm all revenue streams are properly classified per chart of accounts (Presentation & Disclosure).",
    ],
    "Payroll Administration": [
      "Vouch a sample of 20 employees to ensure they physically exist — headcount verification (Existence/Occurrence).",
      "Reconcile payroll summary to GL control account and verify net pay to bank statements (Accuracy/Valuation).",
      "Verify approval for all overtime payments and bonuses against approved establishment (Rights & Obligations).",
    ],
    "Payroll & Personnel": [
      "Perform headcount verification for a sample of 25 employees against personnel files (Existence/Occurrence).",
      "Reconcile payroll summary to GL control account and trace net pay to bank statements (Accuracy/Valuation).",
      "Review grade-level placement and verify step increments comply with approved scheme of service (Completeness).",
    ],
    Procurement: [
      "Examine tender board minutes for approval of contracts above threshold (Existence/Occurrence).",
      "Verify 3 quotations were obtained for all sampled LPOs and confirm competitive pricing (Rights & Obligations).",
      "Inspect physical delivery of goods for selected high-value procurements against purchase orders (Completeness).",
    ],
    "Procurement & Contracts": [
      "Review Due Process certification for all contracts above ₦50M threshold (Existence/Occurrence).",
      "Verify contractor prequalification documents and confirm registration validity (Rights & Obligations).",
      "Inspect project completion certificates against milestones and payment certificates (Completeness).",
    ],
    "Asset Management": [
      "Conduct physical verification of fixed assets in the registry (Existence/Occurrence).",
      "Verify ownership documents (C of O, Titles) for land and buildings (Rights & Obligations).",
      "Check condition of vehicles and consistency with fuel usage logs (Accuracy/Valuation).",
    ],
    "Fixed Assets": [
      "Conduct physical verification of a sample of fixed assets against the asset register (Existence/Occurrence).",
      "Verify asset register completeness by tracing capital expenditure to recorded assets (Completeness).",
      "Review depreciation computations and verify useful life assumptions per IPSAS 17 (Accuracy/Valuation).",
    ],
    "Budgetary Control": [
      "Compare actual expenditure against approved budget line-by-line (Accuracy/Valuation).",
      "Investigate any budget variance exceeding 10% and obtain management explanations (Completeness).",
      "Ensure virements were properly authorized before execution (Rights & Obligations).",
    ],
    "Expenditure & Payments": [
      "Vouch a sample of payment vouchers to supporting documents and verify approval chain (Existence/Occurrence).",
      "Verify expenditure classification against chart of accounts and approved budget heads (Presentation & Disclosure).",
      "Perform cut-off testing on payments around year-end to confirm proper period allocation (Cut-off).",
    ],
    "Bank & Cash": [
      "Obtain and review bank reconciliation statements for all accounts at year-end (Completeness).",
      "Confirm bank balances directly with financial institutions via bank confirmation letters (Existence/Occurrence).",
      "Perform cash count at treasury and reconcile with cash book balance (Accuracy/Valuation).",
    ],
  };

  // Fuzzy match or default
  const key = Object.keys(procedures).find((k) =>
    area.toLowerCase().includes(k.toLowerCase()),
  );
  return key
    ? procedures[key]
    : [
        "Review relevant policy documents, guidelines, and regulatory requirements.",
        "Interview key personnel to understand internal controls and identify weaknesses.",
        "Perform analytical review of account balances and investigate unusual fluctuations.",
      ];
};

export const getSmartNotification = (
  action: "UPLOAD" | "MANDATE" | "SCOPE",
  details: string,
): { title: string; message: string; priority: "High" | "Normal" } => {
  switch (action) {
    case "UPLOAD":
      return {
        title: "New Audit Evidence",
        message: `Council has uploaded documents for: ${details}. Review required within 48 hours.`,
        priority: "Normal",
      };
    case "MANDATE":
      return {
        title: "Mandate Activation",
        message: `Mandate ${details} is now active. Letters have been auto-drafted for review.`,
        priority: "High",
      };
    case "SCOPE":
      return {
        title: "Scope Sign-off",
        message: `Council has counter-signed the scope agreement for ${details}. Fieldwork can proceed.`,
        priority: "High",
      };
    default:
      return {
        title: "System Notification",
        message: details,
        priority: "Normal",
      };
  }
};
