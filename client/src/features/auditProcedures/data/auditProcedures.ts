/**
 * Audit Procedures reference data.
 * Covers Revenue, Recurrent Expenditure, Capital Expenditure,
 * Assets, Liabilities, and Equity per Lagos State NCOA.
 *
 * Each entry maps an NCOA account family → professional audit
 * procedures with assertions, risks, evidence, and ISA references.
 */

export type ProcedureCategory =
  | "revenue"
  | "recurrent"
  | "capital"
  | "current-asset"
  | "non-current-asset"
  | "current-liability"
  | "non-current-liability"
  | "equity";

export interface AuditProcedure {
  code: string;
  account: string;
  category: ProcedureCategory;
  ncoaPrefix: string;
  /** Financial-statement assertions tested by these procedures. */
  assertions: string[];
  /** Key risks of material misstatement. */
  risks: string[];
  /** Audit objectives. */
  objectives: string[];
  /** Detailed step-by-step audit procedures. */
  procedures: string[];
  /** Evidence the auditor should obtain & retain. */
  evidence: string[];
  /** Primary ISA / regulatory references. */
  references: string[];
}

export const auditProceduresData: AuditProcedure[] = [
  /* ───────────────────────── REVENUE ───────────────────────── */
  {
    code: "MU-110101",
    account: "Share of Federation Account (FAAC)",
    category: "revenue",
    ncoaPrefix: "1101",
    assertions: ["Occurrence", "Completeness", "Accuracy", "Cut-off"],
    risks: [
      "Under/over-recording of monthly allocations",
      "Unauthorised deductions at source not reconciled",
      "Misclassification between FAAC and other statutory transfers",
    ],
    objectives: [
      "Confirm all FAAC inflows received during the period are accurately recorded.",
      "Verify deductions, derivations and equalisation amounts agree to FAAC schedules.",
      "Ensure proper cut-off — only allocations relating to the period are recognised.",
    ],
    procedures: [
      "Obtain the 12 monthly FAAC distribution gazettes/communiqués from the Office of the Accountant-General of the Federation.",
      "Trace each monthly allocation amount to the LGA's bank statement and cashbook. Reconcile gross share, statutory deductions and net inflow.",
      "Recompute the LGA's share using the published horizontal allocation formula and population/landmass weights.",
      "Confirm derivation receipts (mineral, VAT) where applicable and trace to source documents.",
      "Test cut-off by reviewing inflows for the last and first month of the period to ensure they are recognised in the correct year.",
      "Perform an analytical review against prior year and budget; investigate variances ≥ 10%.",
    ],
    evidence: [
      "Monthly FAAC distribution communiqués (12 months)",
      "Bank statements showing receipt date and amount",
      "Cashbook / GL extract for FAAC account",
      "FAAC reconciliation prepared by the Treasurer",
    ],
    references: [
      "ISA 500 — Audit Evidence",
      "ISA 540 — Accounting Estimates",
      "Section 162, 1999 Constitution",
      "Allocation of Revenue (Federation Account, etc.) Act",
    ],
  },
  {
    code: "MU-110102",
    account: "Share of Value Added Tax (VAT)",
    category: "revenue",
    ncoaPrefix: "1101",
    assertions: ["Occurrence", "Completeness", "Accuracy"],
    risks: [
      "Deductions at source not properly disclosed",
      "Allocation formula errors",
      "VAT receipts deposited into wrong account",
    ],
    objectives: [
      "Verify that VAT distributions received are complete and accurate.",
      "Ensure allocation is in line with the VAT Act sharing formula.",
    ],
    procedures: [
      "Obtain monthly VAT distribution schedules from FIRS/FAAC.",
      "Reconcile recorded VAT inflows to bank statements and cashbook line by line.",
      "Recompute LGA share using the statutory formula (50% derivation, 30% population, 20% equality).",
      "Investigate any unusual fluctuations between months.",
      "Confirm VAT received is held in the designated revenue account.",
    ],
    evidence: [
      "FIRS/FAAC VAT distribution communiqués",
      "Bank statements",
      "Cashbook & GL VAT account printout",
    ],
    references: ["ISA 500", "VAT Act 2007 (as amended)", "FIRS Circulars"],
  },
  {
    code: "MU-110103",
    account: "Excess Crude Oil and Other Augmentations",
    category: "revenue",
    ncoaPrefix: "1101",
    assertions: ["Occurrence", "Accuracy", "Completeness"],
    risks: ["Irregular augmentations not authorised", "Inadequate disclosure"],
    objectives: [
      "Confirm augmentation receipts are authorised and properly classified.",
    ],
    procedures: [
      "Inspect FAAC minutes authorising augmentation distributions.",
      "Trace receipts to bank statements and confirm amounts agree to gazettes.",
      "Review classification — ensure not netted off against deductions.",
      "Compare to prior year and budget; document the rationale for movements.",
    ],
    evidence: [
      "FAAC minutes / communiqués",
      "Bank statements",
      "Treasury authorisation memos",
    ],
    references: ["ISA 315", "ISA 500", "Fiscal Responsibility Act 2007"],
  },
  {
    code: "MU-120201",
    account: "Licences (General) — IGR",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Completeness", "Accuracy", "Classification"],
    risks: [
      "Licence revenue collected but not remitted (leakage)",
      "Use of unauthorised receipt books",
      "Cash collections not banked intact and timely",
    ],
    objectives: [
      "Verify all licence revenue collected is fully recorded and banked.",
      "Confirm receipts are issued for every collection and reconciled to bank lodgements.",
    ],
    procedures: [
      "Obtain the schedule of all licence categories and approved tariff rates.",
      "Select a sample of issued receipts (using systematic sampling) and trace to the cashbook and bank statement.",
      "Test the receipt-book register for completeness — account for every serial number issued, used, voided or unissued.",
      "Reconcile daily collections to daily bank lodgements; investigate gaps > 24 hours.",
      "Recompute amounts based on tariff × volume of licences issued and compare to recorded revenue.",
      "Inquire about and inspect controls over Point of Sale and online channels (Lagos State Revenue Service portals).",
    ],
    evidence: [
      "Issued receipts (sample)",
      "Receipt-book register / e-receipt log",
      "Daily collection reports & banking-in slips",
      "Bank statements",
      "Tariff schedule / approved fees gazette",
    ],
    references: [
      "ISA 530 — Audit Sampling",
      "Lagos State Revenue Administration Law 2018",
      "Treasury Circular on IGR Collection",
    ],
  },
  {
    code: "MU-120204",
    account: "Fees (General)",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Completeness", "Accuracy"],
    risks: [
      "Discounts/waivers granted without authority",
      "Off-system collections",
    ],
    objectives: [
      "Confirm completeness and authorisation of all fee collections.",
    ],
    procedures: [
      "Reconcile total fees recorded to the e-receipt platform (LASRRA / LIRS portal).",
      "Inspect approved fee schedules and confirm rates applied.",
      "Sample-test waivers/discounts and trace to written approval by authorised officer.",
      "Recompute totals and trace to GL postings.",
    ],
    evidence: [
      "E-receipt platform reports",
      "Approved fee schedule",
      "Waiver approval memos",
    ],
    references: ["ISA 500", "Lagos State Public Finance Management Law"],
  },
  {
    code: "MU-120205",
    account: "Fines (General)",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Completeness", "Accuracy"],
    risks: ["Fines collected and not remitted; fictitious fines"],
    objectives: ["Verify legitimacy and complete recording of fines."],
    procedures: [
      "Obtain the register of fines from enforcement agencies (LASTMA, KAI, etc.).",
      "Sample test fines: trace from infraction notice → court/admin order → receipt → bank lodgement.",
      "Confirm remittance schedule and reconcile to LGA cashbook.",
      "Inspect aged unremitted fines and report.",
    ],
    evidence: [
      "Register of fines",
      "Infraction notices / court orders",
      "Lodgement schedules",
    ],
    references: ["ISA 500", "Lagos State Magistrate Court Rules"],
  },
  {
    code: "MU-120206",
    account: "Sales (General)",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Accuracy", "Cut-off"],
    risks: [
      "Sales of obsolete/scrap items not recorded",
      "Proceeds not banked",
    ],
    objectives: ["Confirm all sales are authorised, complete and banked."],
    procedures: [
      "Obtain board/council resolutions authorising disposals.",
      "Vouch each sale to supporting documents: valuation, advert, bid, payment receipt.",
      "Reconcile proceeds to bank deposits; investigate any cash retentions.",
      "Test cut-off around year-end.",
    ],
    evidence: [
      "Council resolutions",
      "Disposal valuation reports",
      "Auction/bid records",
      "Bank statements",
    ],
    references: ["Public Procurement Act 2007 — disposals", "ISA 500"],
  },
  {
    code: "MU-120207",
    account: "Earnings (General)",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Completeness", "Accuracy"],
    risks: ["Earnings retained at source", "Misclassification"],
    objectives: [
      "Verify earnings from LGA-owned facilities are accurately captured.",
    ],
    procedures: [
      "Obtain operational reports of fee-earning facilities (motor parks, markets, halls).",
      "Compare reported earnings to bank lodgements.",
      "Visit a sample of facilities; observe collection process and reconcile to records.",
    ],
    evidence: [
      "Facility operational reports",
      "Bank statements",
      "Concession/lease agreements",
    ],
    references: ["ISA 500", "Lagos State Markets and Motor Parks Law"],
  },
  {
    code: "MU-120208",
    account: "Rent on Government Buildings",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Completeness", "Accuracy", "Existence"],
    risks: [
      "Tenants in arrears without recovery action",
      "Rent collected not remitted",
    ],
    objectives: ["Confirm rent is fully accounted for and properly recovered."],
    procedures: [
      "Obtain the rent roll showing each tenancy, rate, period and amount due.",
      "Reconcile expected rent to amounts recorded.",
      "Send confirmation requests to selected tenants for rent paid.",
      "Inspect a sample of tenancy agreements; verify rates against gazette/board approval.",
      "Review aged arrears and recovery actions.",
    ],
    evidence: [
      "Rent roll",
      "Tenancy agreements",
      "Tenant confirmations",
      "Receipts and lodgement records",
    ],
    references: ["ISA 505 — External Confirmations", "ISA 500"],
  },
  {
    code: "MU-120214",
    account: "Investment Income",
    category: "revenue",
    ncoaPrefix: "1202",
    assertions: ["Occurrence", "Accuracy", "Completeness"],
    risks: [
      "Interest not received as scheduled",
      "Dividends not declared/recognised",
    ],
    objectives: ["Verify all investment returns are properly recognised."],
    procedures: [
      "Obtain a schedule of all investments, principal, rates and tenor.",
      "Recompute interest using rate × principal × time and trace to credits in bank.",
      "Obtain bank/registrar confirmations for outstanding balances and accrued income.",
      "Review dividend warrants and confirm receipt.",
    ],
    evidence: [
      "Investment register",
      "Bank/registrar confirmations",
      "Dividend warrants",
    ],
    references: ["ISA 505", "IPSAS 41 — Financial Instruments"],
  },

  /* ─────────────────── RECURRENT EXPENDITURE ─────────────────── */
  {
    code: "MU-210101",
    account: "Salaries and Wages",
    category: "recurrent",
    ncoaPrefix: "2101",
    assertions: [
      "Occurrence",
      "Completeness",
      "Accuracy",
      "Cut-off",
      "Classification",
    ],
    risks: [
      "Ghost workers on the payroll",
      "Unauthorised salary increments / step movement",
      "Payments after retirement / death / dismissal",
      "Statutory deductions (PAYE, pension) not remitted",
    ],
    objectives: [
      "Confirm payroll cost relates to bona-fide employees who rendered service.",
      "Verify amounts are accurately computed and properly authorised.",
      "Ensure statutory deductions are computed correctly and remitted timely.",
    ],
    procedures: [
      "Obtain the nominal roll, IPPIS/payroll system extracts and biometric verification report. Reconcile total headcount and gross pay to GL.",
      "Select a sample (≥ 25 staff covering all grade levels) and re-perform payroll: confirm grade, step, basic and allowances per CONPCASS scale.",
      "For new joiners, trace appointment letter, posting and start date.",
      "For exits, trace clearance/retirement letter and confirm payroll stop date.",
      "Test PAYE deductions against LIRS schedules; trace remittance receipts.",
      "Test pension contributions against PenCom-licensed PFA schedules; confirm employee/employer split.",
      "Perform variance analysis on month-on-month gross pay; investigate spikes.",
      "Inspect biometric/physical headcount results vs. payroll listing.",
    ],
    evidence: [
      "Nominal roll",
      "IPPIS / payroll system extracts",
      "Biometric verification report",
      "Sample staff files (appointment, promotion, exit letters)",
      "PAYE remittance schedules & receipts",
      "Pension remittance schedules & PFA confirmations",
    ],
    references: [
      "ISA 330 — Auditor's Responses to Risks",
      "ISA 530 — Audit Sampling",
      "Pension Reform Act 2014",
      "Personal Income Tax Act (PITA)",
      "Public Service Rules",
    ],
  },
  {
    code: "MU-220201",
    account: "Overhead Costs",
    category: "recurrent",
    ncoaPrefix: "2202",
    assertions: ["Occurrence", "Accuracy", "Classification", "Cut-off"],
    risks: [
      "Personal expenditure paid as overhead",
      "Splitting of contracts to avoid procurement thresholds",
      "Unsupported cash advances not retired",
    ],
    objectives: [
      "Confirm overhead expenses are bona-fide, authorised and properly supported.",
    ],
    procedures: [
      "Stratify overhead by sub-head (transport, utilities, maintenance, consultancy, printing, etc.) and select a representative sample.",
      "Vouch each sample to supporting documents: requisition → approval → invoice → payment voucher → receipt → bank debit.",
      "Confirm budgetary provision and authority to incur from the Approved Budget.",
      "Test compliance with procurement thresholds (Public Procurement Act).",
      "Review aged outstanding cash advances; confirm retirements and recover unretired amounts.",
      "Perform analytical review against prior year and budget by sub-head.",
    ],
    evidence: [
      "Approved Budget for the period",
      "Payment vouchers (sample)",
      "Invoices, receipts, contract files",
      "Cash advance register & retirements",
    ],
    references: [
      "Public Procurement Act 2007",
      "Lagos State Public Finance Management Law",
      "Financial Regulations (current edition)",
      "ISA 500, ISA 530",
    ],
  },
  {
    code: "MU-220701",
    account: "SUBEB and Transfers to Local Government Entities",
    category: "recurrent",
    ncoaPrefix: "2207",
    assertions: ["Occurrence", "Accuracy", "Completeness", "Cut-off"],
    risks: [
      "Transfers without supporting circulars",
      "Reconciliation differences with receiving entity",
    ],
    objectives: [
      "Verify transfers are authorised, accurate and reconciled with the recipient.",
    ],
    procedures: [
      "Obtain the schedule of transfers with statutory basis (SUBEB matching grant, JAAC distributions).",
      "Reconcile amounts transferred to confirmations from receiving entities.",
      "Vouch a sample to authorising memos and bank transfer evidence.",
      "Inspect minutes of the JAAC meeting endorsing the transfers.",
    ],
    evidence: [
      "Transfer schedule",
      "JAAC minutes",
      "Recipient entity confirmations",
      "Bank transfer receipts",
    ],
    references: [
      "UBE Act 2004",
      "Lagos State Local Government Law",
      "ISA 505 — External Confirmations",
    ],
  },
  {
    code: "MU-2120",
    account: "PAYE & Pension Deductions (Statutory)",
    category: "recurrent",
    ncoaPrefix: "2120",
    assertions: ["Completeness", "Accuracy", "Cut-off"],
    risks: [
      "Late/short remittance attracting penalties",
      "Mismatch between deductions and remittance",
    ],
    objectives: [
      "Confirm all statutory deductions are computed correctly and remitted within statutory deadlines.",
    ],
    procedures: [
      "Reconcile total PAYE deducted per the payroll to PAYE remittance returns to LIRS for each month.",
      "Inspect remittance evidence (e-receipt) and confirm date of remittance is by the 10th of the following month.",
      "Recompute pension at minimum 8% (employee) + 10% (employer) on pensionable emoluments.",
      "Confirm pension remitted to each employee's PFA via electronic schedule.",
      "Compute and report any penalties for late remittance.",
    ],
    evidence: [
      "PAYE schedules and LIRS receipts",
      "PFA remittance schedules",
      "Pension reform act compliance reports",
    ],
    references: [
      "Personal Income Tax Act",
      "Pension Reform Act 2014, S.4 & S.11",
      "ISA 250 — Laws and Regulations",
    ],
  },

  /* ─────────────────── CAPITAL EXPENDITURE ─────────────────── */
  {
    code: "MU-320101",
    account: "Land and Building (Capital)",
    category: "capital",
    ncoaPrefix: "3201",
    assertions: [
      "Existence",
      "Rights & Obligations",
      "Valuation & Allocation",
      "Completeness",
      "Classification",
    ],
    risks: [
      "Capitalisation of repairs that should be expensed",
      "Title not vested in LGA",
      "Inflated contract values",
      "Project cost certified but work not done",
    ],
    objectives: [
      "Verify additions are authentic, properly authorised, and physically exist.",
      "Confirm capitalisation criteria are met (IPSAS 17/45).",
      "Confirm LGA holds title or substantive rights.",
    ],
    procedures: [
      "Obtain the fixed-asset register and movement schedule (additions, disposals, transfers).",
      "Vouch each material addition to: BOQ, signed contract, due-process certificate, interim/final payment certificates, evidence of payment.",
      "Inspect physically a sample of new buildings/land — agree to register description and confirm completion status.",
      "Inspect Certificates of Occupancy / Deeds of Assignment / Gazettes evidencing LGA ownership.",
      "Re-perform depreciation calculations using approved rates (e.g., 2% straight-line for buildings).",
      "Test boundary cut-off — confirm only assets in use as at year-end are recognised.",
    ],
    evidence: [
      "Fixed-asset register",
      "Contract files (BOQ, certificates, payment vouchers)",
      "Title documents (C of O, Deed)",
      "Site inspection photographs / report",
      "Engineer's completion certificate",
    ],
    references: [
      "IPSAS 17 — Property, Plant and Equipment",
      "Public Procurement Act 2007",
      "Land Use Act, 1978",
      "ISA 500, ISA 540",
    ],
  },
  {
    code: "MU-320102",
    account: "Infrastructure (Roads, Drainage, Public Works)",
    category: "capital",
    ncoaPrefix: "3201",
    assertions: [
      "Existence",
      "Valuation",
      "Rights & Obligations",
      "Completeness",
    ],
    risks: [
      "Sub-standard work not detected",
      "Variations awarded without due process",
      "Fictitious projects",
    ],
    objectives: [
      "Verify infrastructure projects are real, completed in line with contract, and fairly stated.",
    ],
    procedures: [
      "Obtain the projects register and select a sample stratified by value and contractor.",
      "Inspect the procurement file: needs assessment, prior approval, advert, bid evaluation, due-process certificate, contract.",
      "Re-perform certified cost vs BOQ and inspect the Engineer's measurement sheets.",
      "Conduct site visits with an engineer and document state of completion vs interim certificate; photograph evidence.",
      "Inspect approval for variations; confirm cumulative variation does not exceed statutory threshold.",
      "Confirm retention amounts withheld; assess if due for release.",
    ],
    evidence: [
      "Projects register",
      "Procurement files",
      "BOQ & measurement sheets",
      "Site inspection report (with photographs and GPS)",
      "Variation approval letters",
    ],
    references: [
      "Public Procurement Act 2007 — Sections 16-24",
      "IPSAS 17 — PPE",
      "ISA 620 — Auditor's Expert",
    ],
  },
  {
    code: "MU-320106",
    account: "Furniture and Fittings (Capital)",
    category: "capital",
    ncoaPrefix: "3201",
    assertions: ["Existence", "Valuation", "Completeness"],
    risks: ["Items missing / pilfered", "Capitalisation of low-value items"],
    objectives: [
      "Verify additions exist, are properly capitalised, and tagged.",
    ],
    procedures: [
      "Obtain additions schedule and trace to invoices and delivery notes.",
      "Physically inspect a sample of items; verify asset tag and location.",
      "Confirm that only items meeting the capitalisation threshold are capitalised.",
      "Inspect store-issue records.",
    ],
    evidence: [
      "Invoices, delivery notes",
      "Asset register with tags",
      "Store-issue vouchers",
    ],
    references: ["IPSAS 17", "Treasury Circular on Capitalisation Threshold"],
  },
  {
    code: "MU-320301",
    account: "Intangible Assets (Software, Licences)",
    category: "capital",
    ncoaPrefix: "3203",
    assertions: ["Existence", "Valuation", "Rights"],
    risks: [
      "Annual subscription costs capitalised",
      "Impairment indicators ignored",
    ],
    objectives: [
      "Confirm only items meeting IPSAS 31 recognition criteria are capitalised.",
    ],
    procedures: [
      "Inspect supporting licences/contracts and confirm rights vest in LGA.",
      "Distinguish capitalisable development costs from operating costs.",
      "Re-perform amortisation over the useful life.",
      "Assess for impairment indicators per IPSAS 26.",
    ],
    evidence: [
      "Software licence agreements",
      "Amortisation schedule",
      "Impairment review memo",
    ],
    references: ["IPSAS 31", "IPSAS 26", "ISA 540"],
  },

  /* ─────────────────── CURRENT ASSETS ─────────────────── */
  {
    code: "MU-310101",
    account: "Cash and Cash Equivalents",
    category: "current-asset",
    ncoaPrefix: "3101",
    assertions: ["Existence", "Completeness", "Accuracy", "Rights", "Cut-off"],
    risks: [
      "Bank reconciling items unresolved",
      "Window dressing around year-end",
      "Cash held outside official accounts",
    ],
    objectives: [
      "Verify all cash balances exist, are owned by the LGA, and are accurately stated.",
    ],
    procedures: [
      "Obtain a complete listing of all bank accounts (including dormant) and request bank confirmations directly from each bank.",
      "Reconcile each bank account: book balance → reconciling items → bank balance per confirmation.",
      "Test reconciling items: trace deposits-in-transit and outstanding cheques to subsequent bank statements.",
      "Investigate stale-dated cheques (> 6 months) and large reconciling items.",
      "Perform cash count of imprests as at the audit date and reconcile to cashbook.",
      "Confirm any restrictions / encumbrances over cash balances.",
    ],
    evidence: [
      "Bank confirmations (signed by bank)",
      "Year-end bank reconciliations for every account",
      "Bank statements (Dec & Jan)",
      "Cash count sheets",
    ],
    references: [
      "ISA 505 — External Confirmations",
      "IPSAS 2 — Cash Flow Statements",
      "Financial Regulations on Bank Accounts",
    ],
  },
  {
    code: "MU-310601",
    account: "Receivables",
    category: "current-asset",
    ncoaPrefix: "3106",
    assertions: ["Existence", "Valuation", "Rights", "Completeness"],
    risks: ["Long-outstanding debts not impaired", "Fictitious debtors"],
    objectives: [
      "Confirm receivables exist, are recoverable, and are stated at recoverable amount.",
    ],
    procedures: [
      "Obtain aged receivables listing; agree total to GL.",
      "Send positive confirmations to a sample of debtors.",
      "Review subsequent receipts after year-end as alternative procedure.",
      "Assess provision for impairment using expected credit-loss model (IPSAS 41).",
      "Inquire of management about any disputes or pending litigation.",
    ],
    evidence: [
      "Aged receivables listing",
      "Debtor confirmations",
      "Receipts after year-end",
      "Provision schedule",
    ],
    references: ["ISA 505", "IPSAS 41", "ISA 540"],
  },
  {
    code: "MU-310801",
    account: "Prepayments",
    category: "current-asset",
    ncoaPrefix: "3108",
    assertions: ["Existence", "Valuation", "Rights"],
    risks: [
      "Items expensed should have been prepaid (or vice versa)",
      "Old prepayments not amortised",
    ],
    objectives: ["Verify prepayments relate to future periods and are valid."],
    procedures: [
      "Obtain prepayments schedule and inspect supporting invoices/contracts.",
      "Recompute the unexpired portion at year-end.",
      "Investigate prepayments older than 12 months.",
    ],
    evidence: ["Prepayments schedule", "Invoices, contracts"],
    references: ["IPSAS 1", "ISA 500"],
  },
  {
    code: "MU-310501",
    account: "Inventories",
    category: "current-asset",
    ncoaPrefix: "3105",
    assertions: ["Existence", "Valuation", "Completeness", "Rights"],
    risks: ["Theft / shrinkage", "Obsolete stock not written down"],
    objectives: ["Verify inventory quantities, condition and valuation."],
    procedures: [
      "Attend the year-end stock count; observe count procedures and perform test counts (book → floor and floor → book).",
      "Reconcile count results to inventory register.",
      "Inspect condition; identify slow-moving / obsolete items.",
      "Test costing by tracing to supplier invoices; apply lower of cost and current replacement cost (IPSAS 12).",
    ],
    evidence: [
      "Stock count sheets",
      "Inventory register",
      "Supplier invoices",
      "Auditor's count notes",
    ],
    references: ["ISA 501", "IPSAS 12 — Inventories"],
  },

  /* ─────────────────── NON-CURRENT ASSETS ─────────────────── */
  {
    code: "MU-320101-PPE",
    account: "Property, Plant and Equipment (PPE)",
    category: "non-current-asset",
    ncoaPrefix: "3201",
    assertions: [
      "Existence",
      "Rights",
      "Valuation",
      "Completeness",
      "Classification",
    ],
    risks: [
      "Assets not in fixed asset register",
      "Depreciation rates not consistently applied",
      "Disposals not recorded",
      "Impairment indicators ignored",
    ],
    objectives: [
      "Confirm PPE balances are complete, exist, and are properly valued.",
    ],
    procedures: [
      "Obtain and foot the fixed-asset register; agree opening balance to prior-year audited figures.",
      "Test additions per Capital Expenditure procedures (procurement, certificates, payment).",
      "Test disposals: trace to council approval, valuation, sale proceeds, gain/loss recognition.",
      "Re-perform depreciation by class using approved rates and useful lives.",
      "Physically verify a sample of items including high-value assets and tag-test.",
      "Assess impairment per IPSAS 21 / IPSAS 26.",
      "Inspect title documents for land and buildings.",
    ],
    evidence: [
      "Fixed-asset register",
      "Title documents",
      "Depreciation schedule",
      "Physical inspection sheets",
      "Council disposal resolutions",
    ],
    references: [
      "IPSAS 17 — PPE",
      "IPSAS 21 — Impairment of Non-Cash-Generating Assets",
      "IPSAS 45 — Property, Plant, and Equipment (when effective)",
      "ISA 501",
    ],
  },
  {
    code: "MU-310901",
    account: "Investments",
    category: "non-current-asset",
    ncoaPrefix: "3109",
    assertions: ["Existence", "Rights", "Valuation"],
    risks: ["Investments held in employee names", "Fair-value not assessed"],
    objectives: [
      "Verify investments are owned by the LGA and properly valued.",
    ],
    procedures: [
      "Obtain investment schedule and registrar/CSCS confirmations.",
      "Inspect share certificates / fixed deposit certificates registered in LGA name.",
      "For listed investments, agree fair value to NSE published prices at year-end.",
      "Recompute amortised cost / equity-method share where applicable.",
    ],
    evidence: [
      "Investment register",
      "Registrar / CSCS confirmations",
      "Year-end market prices",
    ],
    references: ["IPSAS 41", "IPSAS 36 — Investments in Associates", "ISA 505"],
  },
  {
    code: "MU-311001",
    account: "Loans Granted (LG Loan Fund)",
    category: "non-current-asset",
    ncoaPrefix: "3110",
    assertions: ["Existence", "Valuation", "Rights"],
    risks: ["Loans without recovery; defaulting borrowers"],
    objectives: ["Confirm loans are recoverable and properly impaired if not."],
    procedures: [
      "Obtain loan register; reconcile to GL.",
      "Send confirmations to borrowers.",
      "Inspect loan agreements; confirm interest, tenor and security.",
      "Review repayment history and assess provision for impairment.",
    ],
    evidence: ["Loan register", "Loan agreements", "Borrower confirmations"],
    references: ["IPSAS 41", "ISA 505", "ISA 540"],
  },

  /* ─────────────────── CURRENT LIABILITIES ─────────────────── */
  {
    code: "MU-410101",
    account: "Deposits Held",
    category: "current-liability",
    ncoaPrefix: "4101",
    assertions: ["Completeness", "Accuracy", "Existence"],
    risks: ["Deposits unaccounted; unauthorised application"],
    objectives: [
      "Verify deposits are properly held, recorded, and refundable on demand.",
    ],
    procedures: [
      "Obtain deposit register; reconcile to GL.",
      "Confirm balances with depositors on a sample basis.",
      "Inspect agreements / authorities for retention.",
      "Investigate aged unrefunded deposits.",
    ],
    evidence: ["Deposit register", "Depositor confirmations", "Agreements"],
    references: ["IPSAS 1", "ISA 505"],
  },
  {
    code: "MU-410201",
    account: "Short Term Loans and Debts",
    category: "current-liability",
    ncoaPrefix: "4102",
    assertions: ["Completeness", "Accuracy", "Classification"],
    risks: [
      "Loans not approved by Council",
      "Loans not classified per maturity",
    ],
    objectives: [
      "Verify all short-term borrowings are authorised and accurately recorded.",
    ],
    procedures: [
      "Obtain schedule of borrowings; trace to bank confirmations.",
      "Inspect Council resolutions and Federal Ministry of Finance approvals.",
      "Re-perform interest accrual.",
      "Confirm classification (short vs long-term) by maturity profile.",
      "Test compliance with debt limits (Fiscal Responsibility Act).",
    ],
    evidence: [
      "Loan schedule",
      "Bank confirmations",
      "Council resolutions",
      "Loan agreements",
    ],
    references: [
      "Fiscal Responsibility Act 2007",
      "Lagos State Public Finance Management Law",
      "IPSAS 41",
      "ISA 250",
    ],
  },
  {
    code: "MU-410401",
    account: "Payables (Accrued Expenses)",
    category: "current-liability",
    ncoaPrefix: "4104",
    assertions: ["Completeness", "Accuracy", "Cut-off", "Obligations"],
    risks: [
      "Unrecorded liabilities (search for unrecorded liabilities risk)",
      "Liabilities recorded in the wrong period",
    ],
    objectives: [
      "Confirm liabilities are complete, exist, and properly cut-off at year-end.",
    ],
    procedures: [
      "Obtain payables schedule; agree total to GL.",
      "Send confirmations to a sample of vendors.",
      "Perform a search for unrecorded liabilities: review post year-end payment vouchers and unpaid invoices for items relating to the audit period.",
      "Vouch a sample of payables to invoices, GRN and contract.",
      "Test cut-off by reviewing GRNs and invoices around year-end.",
    ],
    evidence: [
      "Payables schedule",
      "Vendor confirmations",
      "Post year-end payment vouchers",
      "Invoices, GRNs",
    ],
    references: ["ISA 505", "ISA 330", "IPSAS 1"],
  },

  /* ─────────────────── NON-CURRENT LIABILITIES ─────────────────── */
  {
    code: "MU-420301",
    account: "Long-Term Borrowings",
    category: "non-current-liability",
    ncoaPrefix: "4203",
    assertions: [
      "Completeness",
      "Accuracy",
      "Rights & Obligations",
      "Classification",
    ],
    risks: ["Covenants breach not disclosed", "Misclassification"],
    objectives: [
      "Verify long-term debt obligations are complete, properly classified and disclosed.",
    ],
    procedures: [
      "Obtain debt schedule; trace each loan to bank/lender confirmations.",
      "Inspect Council and FMF approvals; confirm compliance with FRA limits.",
      "Re-perform amortisation; agree current portion vs non-current.",
      "Inspect covenants; assess compliance and disclose any breaches.",
    ],
    evidence: [
      "Loan agreements",
      "Lender confirmations",
      "FRA debt sustainability analysis",
    ],
    references: [
      "Fiscal Responsibility Act 2007",
      "IPSAS 41",
      "ISA 250",
      "ISA 505",
    ],
  },

  /* ─────────────────── EQUITY / NET ASSETS ─────────────────── */
  {
    code: "MU-430301",
    account: "Reserves",
    category: "equity",
    ncoaPrefix: "4303",
    assertions: ["Completeness", "Accuracy", "Classification"],
    risks: ["Unauthorised transfers between reserves"],
    objectives: ["Confirm reserves are properly authorised and disclosed."],
    procedures: [
      "Obtain reserves movement schedule.",
      "Trace movements to Council resolutions and approved transfers.",
      "Confirm classification per IPSAS 1.",
      "Reconcile opening balance to prior-year audited figures.",
    ],
    evidence: ["Reserves schedule", "Council resolutions"],
    references: ["IPSAS 1", "ISA 500"],
  },
  {
    code: "MU-430401",
    account: "Accumulated Surpluses / (Deficits)",
    category: "equity",
    ncoaPrefix: "4304",
    assertions: ["Completeness", "Accuracy"],
    risks: [
      "Prior-period adjustments not properly disclosed",
      "Unauthorised appropriations",
    ],
    objectives: [
      "Verify accumulated surplus movements are valid, complete, and disclosed.",
    ],
    procedures: [
      "Reconcile opening accumulated surplus to prior-year audited figures.",
      "Trace current-year surplus/(deficit) to the Statement of Financial Performance.",
      "Inspect any prior-period adjustments; assess accounting per IPSAS 3.",
      "Inspect appropriations to reserves authorised by Council.",
    ],
    evidence: [
      "Statement of changes in net assets/equity",
      "Prior-year audited financials",
      "Council resolutions on appropriations",
    ],
    references: ["IPSAS 1", "IPSAS 3", "ISA 510 — Initial Engagements"],
  },
];

/* ───────────────────────── Category metadata ───────────────────────── */

export const CATEGORY_META: Record<
  ProcedureCategory,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  revenue: {
    label: "Revenue",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "💰",
  },
  recurrent: {
    label: "Recurrent Expenditure",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "📋",
  },
  capital: {
    label: "Capital Expenditure",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "🏗️",
  },
  "current-asset": {
    label: "Current Assets",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "💵",
  },
  "non-current-asset": {
    label: "Non-Current Assets",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "🏢",
  },
  "current-liability": {
    label: "Current Liabilities",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "📑",
  },
  "non-current-liability": {
    label: "Non-Current Liabilities",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "🏦",
  },
  equity: {
    label: "Equity / Net Assets",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#064e3b",
    icon: "⚖️",
  },
};
