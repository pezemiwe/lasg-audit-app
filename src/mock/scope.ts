import type {
  ScopeAgreement,
} from "../types";

export const SEED_SCOPE_AGREEMENTS: ScopeAgreement[] = [
  {
    id: "scope-1",
    auditId: "audit-1",
    lgaId: "lga-4",
    status: "Fully Approved",
    createdBy: "user-lead-1",
    createdAt: "2026-02-25T09:00:00Z",
    totalWeeks: 16,
    rows: [
      {
        id: "sr-1",
        area: "Cash Management & Treasury",
        description:
          "Review of all treasury operations, cash handling procedures, vault security, and daily lodgement practices",
        timelineWeeks: 3,
        expectations: "Working paper on treasury operations with test results",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-2",
        area: "Revenue Collection (IGR)",
        description:
          "Verification of all internally generated revenue streams, collection points, and bank lodgements",
        timelineWeeks: 3,
        expectations: "Revenue completeness report and reconciliation schedule",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-3",
        area: "Procurement & Contracts",
        description:
          "Review of procurement processes, due process compliance, contract awards, and value for money assessment",
        timelineWeeks: 4,
        expectations: "Procurement compliance matrix and exception report",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-4",
        area: "Payroll & Personnel",
        description:
          "Verification of staff establishment, payroll accuracy, ghost worker analysis, and pension deductions",
        timelineWeeks: 3,
        expectations:
          "Payroll verification report with biometric cross-reference results",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
      {
        id: "sr-5",
        area: "Capital Projects & Fixed Assets",
        description:
          "Physical verification of capital projects, review of asset register, and disposal procedures",
        timelineWeeks: 3,
        expectations:
          "Asset verification report and project completion certificates",
        auditorSignOff: {
          name: "Mr. Adewale Ogunjobi",
          timestamp: "2026-02-26T10:00:00Z",
        },
        lgaSignOff: {
          name: "Mrs Folake Akinwunmi",
          timestamp: "2026-02-27T14:00:00Z",
        },
      },
    ],
  },
  {
    id: "scope-2",
    auditId: "audit-2",
    lgaId: "lga-1",
    status: "Pending LGA",
    createdBy: "user-lead-2",
    createdAt: "2026-03-01T09:00:00Z",
    totalWeeks: 14,
    rows: [
      {
        id: "sr-6",
        area: "Financial Statements Review",
        description:
          "Comprehensive review of annual financial statements for accuracy and IPSAS compliance",
        timelineWeeks: 4,
        expectations: "Financial statement analysis report",
        auditorSignOff: {
          name: "Mrs. Adetola Bakare",
          timestamp: "2026-03-02T10:00:00Z",
        },
      },
      {
        id: "sr-7",
        area: "Budget Implementation",
        description:
          "Analysis of approved budget vs actual expenditure across all budget lines",
        timelineWeeks: 3,
        expectations:
          "Budget variance report with explanations for material variances",
        auditorSignOff: {
          name: "Mrs. Adetola Bakare",
          timestamp: "2026-03-02T10:00:00Z",
        },
      },
      {
        id: "sr-8",
        area: "Internal Controls Assessment",
        description:
          "Evaluation of design and operating effectiveness of key internal controls",
        timelineWeeks: 4,
        expectations: "Internal control deficiency report and recommendations",
      },
      {
        id: "sr-9",
        area: "Compliance Testing",
        description:
          "Test compliance with Public Finance Management Act and applicable regulations",
        timelineWeeks: 3,
        expectations: "Compliance testing results and exceptions noted",
      },
    ],
  },
];
