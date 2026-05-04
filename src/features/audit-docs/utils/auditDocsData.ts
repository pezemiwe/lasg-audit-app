export const FINDINGS = [
  {
    ref: "AUD-2025-001",
    category: "Financial",
    title: "Unreconciled Difference in Bank Balances",
    observation:
      "The bank balance per the general ledger differs from the bank statements by ₦14,320,000 as at 31 December 2024. No reconciliation was performed for 4 months.",
    risk: "Material misstatement; potential misappropriation of funds.",
    recommendation:
      "The LGA should prepare monthly bank reconciliation statements and ensure independent review by the head of finance.",
    managementResponse:
      "Management acknowledges the gap. A bank reconciliation exercise was completed on 15 Jan 2025. Controls have been tightened.",
    status: "Under Review",
  },
  {
    ref: "AUD-2025-002",
    category: "Procurement",
    title: "Single-Sourced Contracts Without Prior Approval",
    observation:
      "Three contracts totalling ₦87,500,000 were awarded by single-source without obtaining the required Bureau of Public Procurement (BPP) approval.",
    risk: "Violation of Public Procurement Act 2007 §68. Exposure to value-for-money risk.",
    recommendation:
      "All procurements above ₦15 million must be competitively tendered with BPP oversight. Management should obtain retrospective approvals or refer matters to the procurement tribunal.",
    managementResponse:
      "Management is engaging BPP for guidance. Emergency procurement was claimed but documentation is incomplete.",
    status: "Pending",
  },
  {
    ref: "AUD-2025-003",
    category: "Payroll",
    title: "Ghost Worker Suspicion — 2 Unverifiable Staff",
    observation:
      "Two employees (IDs: PS-1142 and PS-1143) appear on the payroll with cumulative payments of ₦4,320,000 but could not be physically verified during staff enumeration.",
    risk: "Potential fraud; loss of public funds. Criminal liability under EFCC Act.",
    recommendation:
      "Immediately suspend payments to these employees pending verification. Refer for full investigation and engage EFCC if fraud is confirmed.",
    managementResponse:
      "Matter referred to HR for verification. Payments withheld pending investigation.",
    status: "Submitted",
  },
  {
    ref: "AUD-2025-004",
    category: "Revenue",
    title: "Undocumented IGR Collections",
    observation:
      "Revenue receipts totalling ₦8,400,000 in market levy collections were not backed by receipts or documented in the revenue register.",
    risk: "Loss of government revenue; potential diversion of IGR.",
    recommendation:
      "Install electronic receipting system for all IGR collection points. Conduct a reconciliation of all undocumented collections.",
    managementResponse:
      "A digital receipting solution has been procured. Implementation scheduled for Q2 2025.",
    status: "Approved",
  },
];

export const WORKPAPER_CHECKLIST = [
  {
    ref: "WP-A1",
    title: "Audit Engagement Acceptance Form",
    status: "Complete",
  },
  {
    ref: "WP-A2",
    title: "Independence Declaration — All Team Members",
    status: "Complete",
  },
  { ref: "WP-A3", title: "Engagement Letter", status: "Complete" },
  { ref: "WP-B1", title: "Risk Assessment Memorandum", status: "Complete" },
  {
    ref: "WP-B2",
    title: "Materiality Calculation Worksheet",
    status: "Complete",
  },
  { ref: "WP-B3", title: "Audit Programme (Signed)", status: "Complete" },
  {
    ref: "WP-C1",
    title: "Internal Control Questionnaire",
    status: "In Progress",
  },
  {
    ref: "WP-C2",
    title: "Control Testing Schedules (All Areas)",
    status: "In Progress",
  },
  { ref: "WP-D1", title: "Revenue Test of Details", status: "Complete" },
  {
    ref: "WP-D2",
    title: "Payroll Substantive Testing Schedule",
    status: "Complete",
  },
  { ref: "WP-D3", title: "Procurement Vouching Schedule", status: "Complete" },
  {
    ref: "WP-D4",
    title: "Bank Confirmation & Reconciliation",
    status: "Complete",
  },
  { ref: "WP-D5", title: "Fixed Assets Verification Sheet", status: "Pending" },
  {
    ref: "WP-E1",
    title: "Summary of Findings & Recommendations",
    status: "In Progress",
  },
  {
    ref: "WP-E2",
    title: "Management Representation Letter Request",
    status: "Pending",
  },
  { ref: "WP-E3", title: "Draft Audit Report", status: "Pending" },
];
