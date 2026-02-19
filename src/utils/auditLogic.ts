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
export const getSuggestedProcedures = (area: string): string[] => {
  const procedures: Record<string, string[]> = {
    "Revenue Collection": [
      "Verify that all revenue receipts are sequentially numbered and accounted for.",
      "Reconcile daily cash collections with bank deposit slips.",
      "Confirm authorization of revenue waivers/discounts by relevant authority.",
    ],
    "Payroll Administration": [
      "Vouch a sample of 20 employees to ensure they physically exist (Ghost worker check).",
      "Reconcile payroll summary to GL control account.",
      "Verify approval for all overtime payments and bonuses.",
    ],
    Procurement: [
      "Examine tender board minutes for approval of contracts above threshold.",
      "Verify 3 quotations were obtained for all sampled LPOs.",
      "Inspect physical delivery of goods for selected high-value procurements.",
    ],
    "Asset Management": [
      "Conduct physical verification of fixed assets in the registry.",
      "Verify ownership documents (C of O, Titles) for land and buildings.",
      "Check condition of vehicles and consistency with fuel usage logs.",
    ],
    "Budgetary Control": [
      "Compare actual expenditure against approved budget line-by-line.",
      "Investigate any budget variance exceeding 10%.",
      "Ensure virements were properly authorized before execution.",
    ],
  };

  // Fuzzy match or default
  const key = Object.keys(procedures).find((k) =>
    area.toLowerCase().includes(k.toLowerCase()),
  );
  return key
    ? procedures[key]
    : [
        "Review relevant policy documents and guidelines.",
        "Interview key personnel to understand internal controls.",
        "Perform analytical review of account balances.",
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
        message: `LGA has uploaded documents for: ${details}. Review required within 48 hours.`,
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
        message: `LGA has counter-signed the scope agreement for ${details}. Fieldwork can proceed.`,
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
