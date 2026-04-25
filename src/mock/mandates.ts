import type {
  Mandate,
} from "../types";

export const SEED_MANDATES: Mandate[] = [
  {
    id: "mandate-1",
    title: "Annual Audit of Local Government Accounts — FY 2025",
    auditYear: 2025,
    scope:
      "Comprehensive audit of all 57 Councils (20 LGAs and 37 LCDAs) covering financial statements, compliance, and performance indicators",
    objectives:
      "To provide independent assurance on the accuracy of financial statements, compliance with applicable laws and regulations, and the economy, efficiency and effectiveness of Council operations",
    timelines: "March 2026 – September 2026",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    auditTypes: ["Financial", "Compliance"],
    status: "Published",
    createdAt: "2026-01-15T09:00:00Z",
    publishedAt: "2026-01-20T14:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-2",
    title: "Special Audit of Procurement Practices — FY 2025",
    auditYear: 2025,
    scope:
      "Targeted review of procurement activities and contract awards across high-risk LGAs to ensure adherence to Public Procurement Law.",
    objectives:
      "Evaluate compliance with due process, assess value for money in contract execution, and identify potential irregularities.",
    timelines: "April 2026 – July 2026",
    startDate: "2026-04-01",
    endDate: "2026-07-31",
    auditTypes: ["Compliance", "Performance"],
    status: "Draft",
    createdAt: "2026-02-10T11:30:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-3",
    title: "Performance Audit of Primary Healthcare Delivery — FY 2024",
    auditYear: 2024,
    scope:
      "Assessment of healthcare service delivery, infrastructure, and resource utilization in Primary Healthcare Centers (PHCs).",
    objectives:
      "Determine the efficiency and effectiveness of PHC operations and patient care outcomes.",
    timelines: "January 2025 – June 2025",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    auditTypes: ["Performance"],
    status: "Active",
    createdAt: "2025-01-05T09:00:00Z",
    publishedAt: "2025-01-15T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-4",
    title: "Financial Audit of IGR Collection Systems — FY 2023",
    auditYear: 2023,
    scope:
      "Audit of Internally Generated Revenue (IGR) collection, remittance, and accounting systems.",
    objectives:
      "Verify the completeness and accuracy of reported revenue and assess control weaknesses in collection processes.",
    timelines: "August 2024 – December 2024",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    auditTypes: ["Financial"],
    status: "Completed",
    createdAt: "2024-07-20T08:45:00Z",
    publishedAt: "2024-08-01T09:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-5",
    title: "Compliance Audit of Pension & Gratuity Payments — FY 2024",
    auditYear: 2024,
    scope:
      "Review of pension administration and gratuity disbursements to retirees.",
    objectives:
      "Ensure timely and accurate payments to eligible beneficiaries and compliance with pension laws.",
    timelines: "September 2024 - November 2024",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    auditTypes: ["Compliance"],
    status: "Completed",
    createdAt: "2024-08-15T14:20:00Z",
    publishedAt: "2024-09-01T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-6",
    title: "Routine Audit of Local Government Education Authorities — FY 2025",
    auditYear: 2025,
    scope:
      "Examination of financial records and administrative processes of LGEAs.",
    objectives:
      "Assess financial management and administrative efficiency in education authorities.",
    timelines: "May 2026 - August 2026",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    auditTypes: ["Financial", "Compliance"],
    status: "Draft",
    createdAt: "2026-02-18T16:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-7",
    title: "Financial Sustainability Review of Market Boards — FY 2025",
    auditYear: 2025,
    scope: "Review of revenue generation and expenditure of market boards.",
    objectives:
      "Assess financial sustainability and identify opportunities for revenue enhancement.",
    timelines: "June 2026 - September 2026",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    auditTypes: ["Financial", "Performance"],
    status: "Published",
    createdAt: "2026-01-25T11:00:00Z",
    publishedAt: "2026-02-01T09:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-8",
    title: "Environmental Impact Assessment of LGA Projects — FY 2024",
    auditYear: 2024,
    scope:
      "Audit of environmental compliance for major infrastructure projects undertaken by LGAs.",
    objectives:
      "Ensure projects meet environmental standards and assess impact on local communities.",
    timelines: "February 2025 - August 2025",
    startDate: "2025-02-01",
    endDate: "2025-08-31",
    auditTypes: ["Compliance", "Performance"],
    status: "Active",
    createdAt: "2025-01-10T14:00:00Z",
    publishedAt: "2025-01-20T10:00:00Z",
    createdBy: "user-ag",
  },
  {
    id: "mandate-9",
    title: "Forensic Audit of Payroll Systems — FY 2022",
    auditYear: 2022,
    scope:
      "Detailed forensic examination of payroll data to identify ghost workers and irregularities.",
    objectives:
      "Eliminate payroll fraud and improve personnel cost management.",
    timelines: "September 2023 - December 2023",
    startDate: "2023-09-01",
    endDate: "2023-12-31",
    auditTypes: ["Financial", "Compliance"],
    status: "Completed",
    createdAt: "2023-08-01T09:00:00Z",
    publishedAt: "2023-08-15T12:00:00Z",
    createdBy: "user-ag",
  },
];
