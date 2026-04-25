import type {
  AuditProgramme,
  AuditProgrammeSection,
  ProgrammeTemplate,
} from "../types";

const SEED_SECTIONS: AuditProgrammeSection[] = [
  {
    id: "sec-revenue",
    title: "Revenue",
    auditObjectives: [
      "To ensure that revenue is accurately recorded, exists, and is complete.",
      "To confirm that revenue recognition is in accordance with IPSAS and applicable accounting standards.",
      "To verify that cut-off procedures are appropriate.",
      "To assess the risk of material misstatement due to fraud or error.",
    ],
    riskLevel: "High",
    keyRisks: [
      "Revenue recognition at inappropriate times (cut-off errors)",
      "Fictitious sales/receipts (existence)",
      "Unrecorded revenue (completeness)",
      "Manipulation of revenue to meet targets (fraud risk)",
    ],
    documentationNotes:
      "Document all procedures performed, evidence obtained, and conclusions reached. Retain copies of revenue schedules, bank tellers, receipt books, and reconciliation workpapers.",
    sortOrder: 1,
  },
  {
    id: "sec-payroll",
    title: "Payroll",
    auditObjectives: [
      "To confirm that payroll expenditure relates only to bona fide employees.",
      "To verify that salaries are accurately computed and properly authorised.",
      "To ensure statutory deductions are correctly calculated and remitted.",
    ],
    riskLevel: "Critical",
    keyRisks: [
      "Ghost workers on the payroll",
      "Incorrect salary computation or grade placement",
      "Unauthorised payroll changes (additions, promotions, terminations)",
      "Non-remittance of statutory deductions (PAYE, Pension, NHF)",
    ],
    documentationNotes:
      "Document all payroll testing. Retain nominal roll / payroll reconciliation, sample personnel files, biometric cross-reference, and statutory deduction verification schedules.",
    sortOrder: 2,
  },
  {
    id: "sec-assets",
    title: "Assets",
    auditObjectives: [
      "To verify the existence, completeness, and proper valuation of fixed assets.",
      "To confirm that capital project expenditure is properly authorised and accounted for.",
      "To ensure asset disposals are properly approved and proceeds recorded.",
    ],
    riskLevel: "Medium",
    keyRisks: [
      "Unrecorded or fictitious assets",
      "Assets not physically verified or without identification tags",
      "Improper disposal without authorisation",
      "Capital projects not completed as per contract specifications",
    ],
    documentationNotes:
      "Retain asset register extracts, physical verification reports, photographs, disposal approval documents, and asset reconciliation schedules.",
    sortOrder: 3,
  },
  {
    id: "sec-expenditure",
    title: "Expenditure",
    auditObjectives: [
      "To verify that all expenditure is properly authorised and supported by adequate documentation.",
      "To confirm expenditure is correctly classified and within approved budget provisions.",
      "To assess completeness of liabilities at period end.",
    ],
    riskLevel: "High",
    keyRisks: [
      "Expenditure recorded without proper authorisation",
      "Fictitious or inflated payment vouchers",
      "Misclassification of expenditure heads",
      "Unrecorded liabilities at period end (completeness)",
    ],
    documentationNotes:
      "Retain payment voucher samples, LPOs, quotations, budget variance analysis, post-period payment listings, and creditors schedules.",
    sortOrder: 4,
  },
];

export const SEED_PROGRAMMES: AuditProgramme[] = [
  {
    id: "prog-2",
    auditId: "audit-2",
    objectives:
      "To express an opinion on the financial statements and procurement compliance of Alimosho LGA",
    scope:
      "All financial transactions with a focus on procurement processes and revenue receipts for FY 2025",
    riskAreas: ["Procurement & Contracts", "Revenue & Receipts"],
    sections: [
      {
        id: "sec-201",
        title: "Procurement & Contracts",
        auditObjectives: [
          "Verify compliance with Public Procurement Law",
          "Ensure value for money",
        ],
        riskLevel: "Critical",
        keyRisks: [
          "Non-compliance with Public Procurement Act",
          "Overpayment for goods/services not delivered",
        ],
        documentationNotes:
          "Document all contracts sampled and their compliance status.",
        sortOrder: 1,
      },
      {
        id: "sec-202",
        title: "Revenue & Receipts",
        auditObjectives: ["Verify completeness of revenue recorded"],
        riskLevel: "High",
        keyRisks: [
          "Unrecorded receipts (completeness)",
          "Fictitious revenue (existence)",
        ],
        documentationNotes: "Agree all revenue summaries to bank statements.",
        sortOrder: 2,
      },
    ],
    procedures: [
      {
        id: "proc-p1",
        area: "Procurement & Contracts",
        procedure:
          "Select a sample of 25 capital contracts and verify the tender process and approvals.",
        assertion: "Rights & Obligations",
        assignedTo: "user-auditor-5",
        status: "Not Started",
      },
      {
        id: "proc-r2",
        area: "Revenue & Receipts",
        procedure:
          "Perform analytical procedures on monthly IGR trends to identify unusual fluctuations.",
        assertion: "Completeness",
        assignedTo: "user-lead-2",
        status: "Not Started",
      },
    ],
    status: "Draft",
    preparedBy: "user-lead-2",
  },
  {
    id: "prog-1",
    auditId: "audit-1",
    objectives:
      "To express an opinion on the financial statements of Mushin LGA for FY 2025",
    scope:
      "All financial transactions, assets, liabilities and equity for the period 1 January to 31 December 2025",
    riskAreas: ["Revenue", "Payroll", "Assets", "Expenditure"],
    sections: SEED_SECTIONS,
    procedures: [
      {
        id: "proc-r1",
        area: "Revenue",
        procedure:
          "Obtain and review the schedule of all IGR sources; agree totals to the trial balance and financial statements.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Revenue schedule, trial balance, financial statements",
        sampleSize: "100% of sources",
        assignedTo: "user-auditor-1",
        status: "In Progress",
        evidenceUploaded: true,
        workpaperRef: "WP-REV-01",
      },
      {
        id: "proc-r2",
        area: "Revenue",
        procedure:
          "Select a sample of revenue receipts and trace from point of collection through to bank lodgement.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence: "Receipt books, bank tellers, bank statements",
        sampleSize: "30-50 transactions",
        assignedTo: "user-auditor-1",
        status: "In Progress",
        evidenceUploaded: false,
        workpaperRef: "WP-REV-02",
      },
      {
        id: "proc-r3",
        area: "Revenue",
        procedure:
          "Perform analytical review comparing current period revenue to prior year and budget estimates; investigate variances >10%.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Analytical",
        expectedEvidence: "Comparative revenue analysis workpaper",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-03",
      },
      {
        id: "proc-r4",
        area: "Revenue",
        procedure:
          "Test design and operating effectiveness of controls over revenue collection, receipting, and bank lodgement.",
        assertion: "Completeness",
        natureOfTest: "Control",
        expectedEvidence: "Walkthrough documentation, control test results",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-04",
      },
      {
        id: "proc-r5",
        area: "Revenue",
        procedure:
          "Review revenue disclosures in the financial statements for compliance with applicable IPSAS standards.",
        assertion: "Presentation & Disclosure",
        natureOfTest: "Inspection",
        expectedEvidence: "Financial statements, disclosure checklist",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-REV-05",
      },
      {
        id: "proc-p1",
        area: "Payroll",
        procedure:
          "Reconcile the nominal roll to the payroll register; identify discrepancies between HR records and payroll listing.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Nominal roll, payroll register, reconciliation schedule",
        assignedTo: "user-auditor-2",
        status: "In Progress",
        evidenceUploaded: false,
        workpaperRef: "WP-PAY-01",
      },
      {
        id: "proc-p2",
        area: "Payroll",
        procedure:
          "Cross-reference payroll data with biometric attendance records; flag personnel on payroll but absent from biometric system.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Analytical",
        expectedEvidence:
          "Biometric data export, payroll listing, exception report",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-02",
      },
      {
        id: "proc-p3",
        area: "Payroll",
        procedure:
          "Select sample of personnel files and verify: (a) valid appointment letters, (b) correct grade level, (c) accurate salary computation.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Substantive",
        expectedEvidence: "Personnel files, salary structure table",
        sampleSize: "25-40 personnel files",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-03",
      },
      {
        id: "proc-p4",
        area: "Payroll",
        procedure:
          "Verify statutory deductions (PAYE, Pension, NHF) are correctly computed and remitted within statutory timelines.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Deduction schedules, remittance receipts, PFA confirmations",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-PAY-04",
      },
      {
        id: "proc-a1",
        area: "Assets",
        procedure:
          "Obtain the asset register and agree totals to financial statements; test a sample of asset additions and disposals.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Asset register, financial statements, purchase invoices",
        sampleSize: "20-30 assets",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-01",
      },
      {
        id: "proc-a2",
        area: "Assets",
        procedure:
          "Physically verify a sample of high-value assets; confirm existence, condition, location, and identification tags.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Inspection",
        expectedEvidence: "Physical verification report, asset tag photos",
        sampleSize: "20 assets",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-02",
      },
      {
        id: "proc-a3",
        area: "Assets",
        procedure:
          "Review asset disposal procedures for proper authorisation, competitive bidding, and proceeds tracing to council accounts.",
        assertion: "Rights & Obligations",
        natureOfTest: "Substantive",
        expectedEvidence:
          "Disposal approval, tender documents, receipt vouchers",
        assignedTo: "user-auditor-1",
        status: "Not Started",
        workpaperRef: "WP-AST-03",
      },
      {
        id: "proc-e1",
        area: "Expenditure",
        procedure:
          "Select sample of payment vouchers and verify: (a) proper authorisation, (b) adequate supporting documents, (c) correct budget classification.",
        assertion: "Existence/Occurrence",
        natureOfTest: "Substantive",
        expectedEvidence: "Payment vouchers, LPOs, quotations, approval memos",
        sampleSize: "50-80 vouchers",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-01",
      },
      {
        id: "proc-e2",
        area: "Expenditure",
        procedure:
          "Perform budget vs actual analysis across all expenditure heads; investigate variances exceeding 15% or any budget overruns.",
        assertion: "Accuracy/Valuation",
        natureOfTest: "Analytical",
        expectedEvidence: "Budget variance analysis workpaper",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-02",
      },
      {
        id: "proc-e3",
        area: "Expenditure",
        procedure:
          "Test controls over the expenditure cycle: segregation of requisition, approval, payment, and recording functions.",
        assertion: "Rights & Obligations",
        natureOfTest: "Control",
        expectedEvidence: "Walkthrough notes, organisational chart",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-03",
      },
      {
        id: "proc-e4",
        area: "Expenditure",
        procedure:
          "Search for unrecorded liabilities by examining post-period payments and outstanding commitments at year end.",
        assertion: "Completeness",
        natureOfTest: "Substantive",
        expectedEvidence: "Post-period payment list, creditors schedule",
        assignedTo: "user-auditor-2",
        status: "Not Started",
        workpaperRef: "WP-EXP-04",
      },
    ],
    status: "Approved",
    preparedBy: "Mr. Adewale Ogunjobi",
    submittedAt: "2026-02-28T10:00:00Z",
    approvedBy: "Mrs. Folashade Adekunle",
    approvedAt: "2026-03-01T09:00:00Z",
  },
];

export const PROGRAMME_TEMPLATES: ProgrammeTemplate[] = [
  {
    id: "tpl-financial",
    name: "Financial Audit Programme",
    auditType: "Financial",
    description:
      "Standardised audit work programme for the financial audit of LGA/LCDA accounts in accordance with ISSAI, ISA and IPSAS standards.",
    methodology:
      "Risk-based audit approach combining tests of controls with substantive procedures. Emphasis on assertion-level testing, analytical procedures, and corroborative inquiry per ISA 500/530.",
    sections: [
      {
        title: "Revenue & Receipts",
        objective:
          "To confirm that all revenue is completely and accurately recorded, properly classified, and lodged intact to designated bank accounts.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Revenue & Receipts",
            procedure:
              "Obtain and review the schedule of all IGR sources; agree totals to the trial balance and financial statements.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Revenue schedule, trial balance, financial statements",
            sampleSize: "100% of sources",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Select a sample of revenue receipts and trace from point of collection through to bank lodgement, verifying amounts and timeliness.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence: "Receipt books, bank tellers, bank statements",
            sampleSize: "30-50 transactions",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Perform analytical review comparing current period revenue to prior year and budget estimates; investigate significant variances (>10%).",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Comparative revenue analysis workpaper",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Test the design and operating effectiveness of controls over revenue collection, receipting, and bank lodgement processes.",
            assertion: "Completeness",
            natureOfTest: "Control",
            expectedEvidence: "Walkthrough documentation, control test results",
          },
          {
            area: "Revenue & Receipts",
            procedure:
              "Confirm revenue sharing allocations (FAAC, VAT, Statutory) by obtaining independent confirmation from JAAC and reconciling to council records.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "JAAC allocation letters, bank credit advices",
          },
        ],
      },
      {
        title: "Expenditure & Payments",
        objective:
          "To verify that all expenditure is properly authorised, supported by adequate documentation, correctly classified, and within approved budget provisions.",
        riskLevel: "High",
        sortOrder: 2,
        procedures: [
          {
            area: "Expenditure & Payments",
            procedure:
              "Select sample of payment vouchers and verify: (a) proper authorisation per approval hierarchy, (b) adequate supporting documents, (c) correct budget classification.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Payment vouchers, LPOs, quotations, approval memos",
            sampleSize: "50-80 vouchers",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Perform budget vs actual analysis across all expenditure heads; investigate variances exceeding 15% or any budget overruns.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Budget variance analysis workpaper",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Test controls over the expenditure cycle: segregation of requisition, approval, payment, and recording functions.",
            assertion: "Rights & Obligations",
            natureOfTest: "Control",
            expectedEvidence: "Walkthrough notes, organisational chart",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Search for unrecorded liabilities by examining post-period payments and outstanding commitments at year end.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence: "Post-period payment list, creditors schedule",
          },
          {
            area: "Expenditure & Payments",
            procedure:
              "Vouch all expenditure items above materiality threshold to original source documents and confirm delivery of goods/services.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Delivery notes, completion certificates, inspection reports",
            sampleSize: "All items above N5M",
          },
        ],
      },
      {
        title: "Payroll & Personnel Costs",
        objective:
          "To confirm that payroll expenditure relates only to bona fide employees, is accurately computed, properly authorised, and correctly classified.",
        riskLevel: "Critical",
        sortOrder: 3,
        procedures: [
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Reconcile the nominal roll to the payroll register; identify any discrepancies between HR records and payroll listing.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Nominal roll, payroll register, reconciliation schedule",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Cross-reference payroll data with biometric attendance records; flag personnel appearing on payroll but absent from biometric system.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Biometric data export, payroll listing, exception report",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Select sample of personnel files and verify: (a) valid appointment letters, (b) correct grade level and step, (c) accurate salary computation.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "Personnel files, salary structure table",
            sampleSize: "25-40 personnel files",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Test controls over payroll changes (new hires, terminations, promotions, pay adjustments) for proper authorisation.",
            assertion: "Completeness",
            natureOfTest: "Control",
            expectedEvidence: "Change authorisation forms, board resolutions",
          },
          {
            area: "Payroll & Personnel Costs",
            procedure:
              "Verify statutory deductions (PAYE, Pension, NHF) are correctly computed and remitted to appropriate agencies within statutory timelines.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Deduction schedules, remittance receipts, PFA confirmations",
          },
        ],
      },
      {
        title: "Bank & Cash Management",
        objective:
          "To confirm that all bank accounts are properly authorised, balances are accurately stated, and cash handling procedures are adequate.",
        riskLevel: "High",
        sortOrder: 4,
        procedures: [
          {
            area: "Bank & Cash Management",
            procedure:
              "Obtain list of all bank accounts; confirm each account is properly authorised and obtain independent bank confirmations for all accounts.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Substantive",
            expectedEvidence: "Bank mandate list, bank confirmation letters",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Re-perform bank reconciliation for all accounts as at year end; investigate all reconciling items older than 30 days.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Bank statements, cashbooks, reconciliation statements",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Conduct surprise cash count of treasury and imprest holders; reconcile physical cash to records.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Cash count certificate, imprest register",
          },
          {
            area: "Bank & Cash Management",
            procedure:
              "Test controls over bank signatories, transfer limits, and dual authorisation requirements.",
            assertion: "Rights & Obligations",
            natureOfTest: "Control",
            expectedEvidence: "Bank mandate, signatory list, transaction logs",
          },
        ],
      },
      {
        title: "Procurement & Contracts",
        objective:
          "To verify that procurement activities comply with the Public Procurement Act, due process requirements are met, and value for money is achieved.",
        riskLevel: "High",
        sortOrder: 5,
        procedures: [
          {
            area: "Procurement & Contracts",
            procedure:
              "Select sample of contracts and verify: (a) competitive bidding where required, (b) due process certification, (c) Tenders Board approval.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Bid documents, evaluation reports, due process certificates",
            sampleSize: "All contracts above N5M + sample below",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "Review contract register for completeness; verify all awarded contracts are captured with correct values and contractor details.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence: "Contract register, award letters",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "Test for contract splitting by analysing related contracts awarded to same vendor or for similar scope within close timeframes.",
            assertion: "Presentation & Disclosure",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Contract analysis workpaper, vendor payment history",
          },
          {
            area: "Procurement & Contracts",
            procedure:
              "For capital projects, conduct physical inspection of selected projects; compare with contract specifications and milestone claims.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Observation",
            expectedEvidence:
              "Site inspection reports, photographs, engineers' certificates",
            sampleSize: "5-10 projects",
          },
        ],
      },
      {
        title: "Fixed Assets & Capital Projects",
        objective:
          "To verify the existence, completeness, and proper valuation of fixed assets, and that capital project expenditure is properly authorised and accounted for.",
        riskLevel: "Medium",
        sortOrder: 6,
        procedures: [
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Obtain the asset register and agree totals to the financial statements; test a sample of asset additions and disposals during the period.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Asset register, financial statements, purchase invoices, disposal approvals",
            sampleSize: "20-30 assets",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Physically verify a sample of high-value assets from the register; confirm existence, condition, location, and identification tags.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Physical verification report, asset tag photos",
            sampleSize: "20 assets",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Test completeness by selecting assets observed during site visits not found in register (reverse testing).",
            assertion: "Completeness",
            natureOfTest: "Observation",
            expectedEvidence: "Reverse verification schedule",
          },
          {
            area: "Fixed Assets & Capital Projects",
            procedure:
              "Review asset disposal procedures for proper authorisation, competitive bidding, and proceeds tracing to council accounts.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Disposal approval, tender documents, receipt vouchers",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-compliance",
    name: "Compliance Audit Programme",
    auditType: "Compliance",
    description:
      "Standardised programme for assessing compliance with applicable laws, regulations, and internal policies governing LGA/LCDA operations.",
    methodology:
      "Criteria-based audit approach testing compliance with the Constitution (S.7), Local Government Law, Public Finance Management Act, Public Procurement Act, Financial Regulations, and applicable circulars.",
    sections: [
      {
        title: "Financial Regulations Compliance",
        objective:
          "To assess compliance with Financial Regulations, Treasury Circulars, and extant financial management directives.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Obtain and review copies of all applicable financial regulations and circulars; confirm awareness and availability at council level.",
            assertion: "Rights & Obligations",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Copies of regulations, staff acknowledgement records",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Test a sample of financial transactions for compliance with: approval thresholds, documentation requirements, and recording timelines.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence: "Transaction files, approval records",
            sampleSize: "40-60 transactions",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Review the operation of the internal audit function: reporting lines, scope of work, and follow-up on recommendations.",
            assertion: "Completeness",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Internal audit reports, terms of reference, organogram",
          },
          {
            area: "Financial Regulations Compliance",
            procedure:
              "Assess the maintenance of proper books of accounts including cashbooks, ledgers, and votes book as required by regulations.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Accounting records, cashbooks, vote book",
          },
        ],
      },
      {
        title: "Procurement Law Compliance",
        objective:
          "To evaluate adherence to the Public Procurement Act and Bureau of Public Procurement guidelines.",
        riskLevel: "Critical",
        sortOrder: 2,
        procedures: [
          {
            area: "Procurement Law Compliance",
            procedure:
              "Map the council's procurement process against the requirements of the Public Procurement Act; document all deviations.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Process mapping document, PPA requirements checklist",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Verify that all procurement above the threshold was competitively tendered and received Due Process certification prior to award.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Tender documents, due process certificates, award letters",
            sampleSize: "All contracts above threshold",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Examine the composition and minutes of the Tenders Board to confirm proper constitution and decision-making procedures.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence: "Tenders Board minutes, membership list",
          },
          {
            area: "Procurement Law Compliance",
            procedure:
              "Test for prohibited practices: sole sourcing without justification, contract splitting, conflict of interest declarations.",
            assertion: "Rights & Obligations",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Vendor analysis, COI declarations, contract timeline analysis",
          },
        ],
      },
      {
        title: "Human Resource & Payroll Compliance",
        objective:
          "To confirm that staff recruitment, posting, promotion, and payroll processes comply with Public Service Rules and establishment guidelines.",
        riskLevel: "High",
        sortOrder: 3,
        procedures: [
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Verify that recruitment follows established procedures: advertisement, interview panel, offer/acceptance documentation.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Recruitment files, advertisement clippings, panel reports",
            sampleSize: "All hires in audit period",
          },
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Test pension and PAYE remittance compliance: correct computation, timely deduction, and prompt remittance to statutory agencies.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Deduction schedules, remittance receipts, penalty notices",
          },
          {
            area: "HR & Payroll Compliance",
            procedure:
              "Review promotions and grade-level changes for compliance with Public Service Rules and approval requirements.",
            assertion: "Rights & Obligations",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Promotion letters, board minutes, establishment records",
          },
        ],
      },
      {
        title: "Statutory Reporting & Accountability",
        objective:
          "To assess whether the council meets its statutory obligation to prepare and submit financial statements and respond to audit queries.",
        riskLevel: "Medium",
        sortOrder: 4,
        procedures: [
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Confirm that annual financial statements are prepared within the statutory time frame and conform to the prescribed format.",
            assertion: "Presentation & Disclosure",
            natureOfTest: "Inspection",
            expectedEvidence: "Financial statements, submission receipts",
          },
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Review status of prior-year audit recommendations and Public Accounts Committee (PAC) directives; document implementation status.",
            assertion: "Completeness",
            natureOfTest: "Substantive",
            expectedEvidence:
              "Prior audit reports, PAC directives, status tracker",
          },
          {
            area: "Statutory Reporting & Accountability",
            procedure:
              "Verify that quarterly returns to the State Ministry of Local Government are prepared and submitted as required.",
            assertion: "Cut-off",
            natureOfTest: "Inspection",
            expectedEvidence: "Quarterly returns, submission acknowledgements",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-performance",
    name: "Performance Audit Programme",
    auditType: "Performance",
    description:
      "Standardised programme for evaluating the economy, efficiency, and effectiveness of council programmes, projects, and service delivery.",
    methodology:
      "Value-for-money approach applying the 3Es framework (Economy, Efficiency, Effectiveness) per ISSAI 3000/3100 standards. Combines quantitative analysis with qualitative assessment of outcomes.",
    sections: [
      {
        title: "Economy Assessment",
        objective:
          "To evaluate whether council resources were acquired at the lowest cost consistent with the required quality and quantity.",
        riskLevel: "High",
        sortOrder: 1,
        procedures: [
          {
            area: "Economy Assessment",
            procedure:
              "Compare unit costs of goods and services procured against market benchmarks and prices obtained by comparable councils.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Price comparison schedule, market survey data",
          },
          {
            area: "Economy Assessment",
            procedure:
              "Analyse personnel costs as a percentage of total expenditure; benchmark against recommended ratios and comparable councils.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Personnel cost analysis workpaper",
          },
          {
            area: "Economy Assessment",
            procedure:
              "Review major contract awards for evidence of competitive pricing and cost negotiation.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Substantive",
            expectedEvidence: "Bid comparison sheets, negotiation records",
            sampleSize: "10 largest contracts",
          },
        ],
      },
      {
        title: "Efficiency Assessment",
        objective:
          "To assess whether outputs (services, projects) are maximised relative to the resources (inputs) consumed.",
        riskLevel: "Medium",
        sortOrder: 2,
        procedures: [
          {
            area: "Efficiency Assessment",
            procedure:
              "Calculate and analyse key efficiency ratios: revenue collection cost ratio, administrative cost ratio, project completion rate.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence: "Ratio analysis workpaper, financial data",
          },
          {
            area: "Efficiency Assessment",
            procedure:
              "Review project timelines and budgets for selected capital projects; calculate time and cost overruns as a percentage.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Project files, milestone reports, variation orders",
            sampleSize: "5-10 projects",
          },
          {
            area: "Efficiency Assessment",
            procedure:
              "Assess the utilisation of council assets (vehicles, equipment, buildings) through usage logs and maintenance records.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inspection",
            expectedEvidence:
              "Vehicle logbooks, equipment usage records, maintenance logs",
          },
        ],
      },
      {
        title: "Effectiveness Assessment",
        objective:
          "To evaluate whether programmes and projects achieved their intended outcomes and delivered value to the community.",
        riskLevel: "High",
        sortOrder: 3,
        procedures: [
          {
            area: "Effectiveness Assessment",
            procedure:
              "Identify key performance indicators (KPIs) for major council programmes; compare actual results against targets and prior-year performance.",
            assertion: "Accuracy/Valuation",
            natureOfTest: "Analytical",
            expectedEvidence:
              "Programme KPI reports, budget targets, prior-year data",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Conduct beneficiary assessment for selected community projects through interviews and site visits.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Inquiry",
            expectedEvidence:
              "Interview notes, beneficiary feedback forms, site visit reports",
            sampleSize: "3-5 community projects",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Review service delivery standards and citizen complaint records; assess responsiveness and resolution rates.",
            assertion: "Completeness",
            natureOfTest: "Inspection",
            expectedEvidence:
              "Complaint registers, resolution records, service charters",
          },
          {
            area: "Effectiveness Assessment",
            procedure:
              "Evaluate the quality and sustainability of completed capital projects through physical inspection and engineering assessment.",
            assertion: "Existence/Occurrence",
            natureOfTest: "Observation",
            expectedEvidence:
              "Inspection reports, photographs, engineering certificates",
            sampleSize: "5-8 projects",
          },
        ],
      },
    ],
  },
];

