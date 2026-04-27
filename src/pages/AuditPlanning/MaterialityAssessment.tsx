/**
 * MaterialityAssessment.tsx
 * Materiality Assessment & Item Selection
 * ISA 320 compliant
 * Lagos State Audit Platform
 */
import React, { useState } from "react";
import { Target, Info, Layers, ChevronDown, CheckCircle2 } from "lucide-react";
import s from "../../styles/pages.module.css";

type AccountType =
  | "revenue"
  | "expense"
  | "asset"
  | "liability"
  | "equity"
  | "pbt";

interface FinancialLine {
  id: string;
  code: string;
  account: string;
  section: string;
  prior: number;
  current: number;
  type: AccountType;
  bold?: boolean;
}

const MOCK_FS: FinancialLine[] = [
  {
    id: "fs-r1",
    code: "401",
    account: "FAAC Statutory Allocation",
    section: "Revenue",
    prior: 2850000000,
    current: 3120000000,
    type: "revenue",
  },
  {
    id: "fs-r2",
    code: "402",
    account: "FAAC Excess Crude Account Share",
    section: "Revenue",
    prior: 280000000,
    current: 310000000,
    type: "revenue",
  },
  {
    id: "fs-r3",
    code: "403",
    account: "VAT Pool Allocation",
    section: "Revenue",
    prior: 420000000,
    current: 490000000,
    type: "revenue",
  },
  {
    id: "fs-r4",
    code: "410",
    account: "Internally Generated Revenue (IGR)",
    section: "Revenue",
    prior: 680000000,
    current: 540000000,
    type: "revenue",
  },
  {
    id: "fs-r5",
    code: "420",
    account: "Grants & Donor Transfers",
    section: "Revenue",
    prior: 320000000,
    current: 410000000,
    type: "revenue",
  },
  {
    id: "fs-r6",
    code: "430",
    account: "Other Revenue",
    section: "Revenue",
    prior: 100000000,
    current: 200000000,
    type: "revenue",
  },
  {
    id: "fs-rt",
    code: "",
    account: "Total Revenue",
    section: "Revenue",
    prior: 4650000000,
    current: 5070000000,
    type: "revenue",
    bold: true,
  },
  {
    id: "fs-e1",
    code: "501",
    account: "Personnel Costs",
    section: "Expenditure",
    prior: 1750000000,
    current: 1920000000,
    type: "expense",
  },
  {
    id: "fs-e2",
    code: "502",
    account: "Overhead & Administrative Costs",
    section: "Expenditure",
    prior: 590000000,
    current: 680000000,
    type: "expense",
  },
  {
    id: "fs-e3",
    code: "503",
    account: "Capital Transfer to Projects",
    section: "Expenditure",
    prior: 720000000,
    current: 820000000,
    type: "expense",
  },
  {
    id: "fs-e4",
    code: "504",
    account: "Grants & Social Transfers",
    section: "Expenditure",
    prior: 180000000,
    current: 220000000,
    type: "expense",
  },
  {
    id: "fs-e5",
    code: "505",
    account: "Depreciation & Amortisation",
    section: "Expenditure",
    prior: 132000000,
    current: 145000000,
    type: "expense",
  },
  {
    id: "fs-e6",
    code: "506",
    account: "Loan Repayments & Interest",
    section: "Expenditure",
    prior: 85000000,
    current: 80000000,
    type: "expense",
  },
  {
    id: "fs-et",
    code: "",
    account: "Total Expenditure",
    section: "Expenditure",
    prior: 3457000000,
    current: 3865000000,
    type: "expense",
    bold: true,
  },
  {
    id: "fs-pbt",
    code: "",
    account: "Surplus / (Deficit) Before Tax (PBT)",
    section: "Surplus",
    prior: 1193000000,
    current: 1205000000,
    type: "pbt",
    bold: true,
  },
  {
    id: "fs-a1",
    code: "101",
    account: "Cash & Bank Balances",
    section: "Assets",
    prior: 450000000,
    current: 520000000,
    type: "asset",
  },
  {
    id: "fs-a2",
    code: "102",
    account: "Receivables & Prepayments",
    section: "Assets",
    prior: 400000000,
    current: 460000000,
    type: "asset",
  },
  {
    id: "fs-a3",
    code: "103",
    account: "Investments & Securities",
    section: "Assets",
    prior: 200000000,
    current: 250000000,
    type: "asset",
  },
  {
    id: "fs-a4",
    code: "111",
    account: "Property, Plant & Equipment (Net)",
    section: "Assets",
    prior: 1890000000,
    current: 2100000000,
    type: "asset",
  },
  {
    id: "fs-a5",
    code: "112",
    account: "Capital Work In Progress (CWIP)",
    section: "Assets",
    prior: 300000000,
    current: 450000000,
    type: "asset",
  },
  {
    id: "fs-at",
    code: "",
    account: "Total Assets",
    section: "Assets",
    prior: 3240000000,
    current: 3780000000,
    type: "asset",
    bold: true,
  },
  {
    id: "fs-l1",
    code: "201",
    account: "Creditors & Accrued Payables",
    section: "Liabilities",
    prior: 285000000,
    current: 340000000,
    type: "liability",
  },
  {
    id: "fs-l2",
    code: "202",
    account: "Deferred Revenue",
    section: "Liabilities",
    prior: 80000000,
    current: 120000000,
    type: "liability",
  },
  {
    id: "fs-l3",
    code: "211",
    account: "Long-Term Borrowings",
    section: "Liabilities",
    prior: 520000000,
    current: 480000000,
    type: "liability",
  },
  {
    id: "fs-l4",
    code: "212",
    account: "Pension & Post-Employment Liability",
    section: "Liabilities",
    prior: 210000000,
    current: 260000000,
    type: "liability",
  },
  {
    id: "fs-lt",
    code: "",
    account: "Total Liabilities",
    section: "Liabilities",
    prior: 1095000000,
    current: 1200000000,
    type: "liability",
    bold: true,
  },
  {
    id: "fs-eq",
    code: "",
    account: "Net Assets / Accumulated Fund",
    section: "Equity",
    prior: 2145000000,
    current: 2580000000,
    type: "equity",
    bold: true,
  },
];

const MOCK_TB: FinancialLine[] = [
  {
    id: "tb-r01",
    code: "401001",
    account: "FAAC Statutory Allocation",
    section: "Revenue",
    prior: 2850000000,
    current: 3120000000,
    type: "revenue",
  },
  {
    id: "tb-r02",
    code: "401002",
    account: "FAAC ECA Special Allocation",
    section: "Revenue",
    prior: 280000000,
    current: 310000000,
    type: "revenue",
  },
  {
    id: "tb-r03",
    code: "401003",
    account: "VAT Pool Allocation",
    section: "Revenue",
    prior: 420000000,
    current: 490000000,
    type: "revenue",
  },
  {
    id: "tb-r04",
    code: "410001",
    account: "Business Premises Levy",
    section: "Revenue",
    prior: 80000000,
    current: 70000000,
    type: "revenue",
  },
  {
    id: "tb-r05",
    code: "410002",
    account: "Market & Motor Park Fees",
    section: "Revenue",
    prior: 180000000,
    current: 140000000,
    type: "revenue",
  },
  {
    id: "tb-r06",
    code: "410003",
    account: "Right-of-Way Charges",
    section: "Revenue",
    prior: 90000000,
    current: 75000000,
    type: "revenue",
  },
  {
    id: "tb-r07",
    code: "410004",
    account: "Birth / Death Registry Fees",
    section: "Revenue",
    prior: 30000000,
    current: 25000000,
    type: "revenue",
  },
  {
    id: "tb-r08",
    code: "410005",
    account: "Land Use Charges",
    section: "Revenue",
    prior: 200000000,
    current: 150000000,
    type: "revenue",
  },
  {
    id: "tb-r09",
    code: "410006",
    account: "Hotel & Entertainment Levy",
    section: "Revenue",
    prior: 50000000,
    current: 40000000,
    type: "revenue",
  },
  {
    id: "tb-r10",
    code: "420001",
    account: "Federal Government Grants",
    section: "Revenue",
    prior: 180000000,
    current: 250000000,
    type: "revenue",
  },
  {
    id: "tb-r11",
    code: "420002",
    account: "State Government Transfers",
    section: "Revenue",
    prior: 140000000,
    current: 160000000,
    type: "revenue",
  },
  {
    id: "tb-r12",
    code: "430001",
    account: "Miscellaneous Income",
    section: "Revenue",
    prior: 100000000,
    current: 200000000,
    type: "revenue",
  },
  {
    id: "tb-e01",
    code: "501001",
    account: "Salaries & Wages",
    section: "Expenditure",
    prior: 1200000000,
    current: 1300000000,
    type: "expense",
  },
  {
    id: "tb-e02",
    code: "501002",
    account: "Allowances & Benefits",
    section: "Expenditure",
    prior: 350000000,
    current: 380000000,
    type: "expense",
  },
  {
    id: "tb-e03",
    code: "501003",
    account: "Social Contributions (Pension)",
    section: "Expenditure",
    prior: 200000000,
    current: 240000000,
    type: "expense",
  },
  {
    id: "tb-e04",
    code: "502001",
    account: "Office Consumables & Stationery",
    section: "Expenditure",
    prior: 35000000,
    current: 40000000,
    type: "expense",
  },
  {
    id: "tb-e05",
    code: "502002",
    account: "Utilities (EKEDC, LAWMA, Water)",
    section: "Expenditure",
    prior: 60000000,
    current: 75000000,
    type: "expense",
  },
  {
    id: "tb-e06",
    code: "502003",
    account: "Maintenance & Repairs",
    section: "Expenditure",
    prior: 85000000,
    current: 100000000,
    type: "expense",
  },
  {
    id: "tb-e07",
    code: "502004",
    account: "Travel & Transport",
    section: "Expenditure",
    prior: 55000000,
    current: 65000000,
    type: "expense",
  },
  {
    id: "tb-e08",
    code: "502005",
    account: "Consultancy Fees",
    section: "Expenditure",
    prior: 80000000,
    current: 90000000,
    type: "expense",
  },
  {
    id: "tb-e09",
    code: "502006",
    account: "Security Services",
    section: "Expenditure",
    prior: 40000000,
    current: 50000000,
    type: "expense",
  },
  {
    id: "tb-e10",
    code: "502007",
    account: "Training & Capacity Development",
    section: "Expenditure",
    prior: 30000000,
    current: 35000000,
    type: "expense",
  },
  {
    id: "tb-e11",
    code: "503001",
    account: "Road Infrastructure Projects",
    section: "Expenditure",
    prior: 250000000,
    current: 300000000,
    type: "expense",
  },
  {
    id: "tb-e12",
    code: "503002",
    account: "Schools & Education Infrastructure",
    section: "Expenditure",
    prior: 180000000,
    current: 200000000,
    type: "expense",
  },
  {
    id: "tb-e13",
    code: "503003",
    account: "Healthcare Facilities",
    section: "Expenditure",
    prior: 120000000,
    current: 150000000,
    type: "expense",
  },
  {
    id: "tb-e14",
    code: "503004",
    account: "Market & Public Infrastructure",
    section: "Expenditure",
    prior: 90000000,
    current: 100000000,
    type: "expense",
  },
  {
    id: "tb-e15",
    code: "504001",
    account: "Cash Grants to Vulnerable Persons",
    section: "Expenditure",
    prior: 80000000,
    current: 100000000,
    type: "expense",
  },
  {
    id: "tb-e16",
    code: "504002",
    account: "Community Development Projects",
    section: "Expenditure",
    prior: 100000000,
    current: 120000000,
    type: "expense",
  },
  {
    id: "tb-e17",
    code: "505001",
    account: "Depreciation - PPE",
    section: "Expenditure",
    prior: 132000000,
    current: 145000000,
    type: "expense",
  },
  {
    id: "tb-e18",
    code: "506001",
    account: "Interest on Loans",
    section: "Expenditure",
    prior: 45000000,
    current: 40000000,
    type: "expense",
  },
  {
    id: "tb-e19",
    code: "506002",
    account: "Loan Principal Repayment",
    section: "Expenditure",
    prior: 40000000,
    current: 40000000,
    type: "expense",
  },
  {
    id: "tb-pbt",
    code: "",
    account: "Net Surplus Before Tax (Derived)",
    section: "Surplus",
    prior: 1193000000,
    current: 1205000000,
    type: "pbt",
    bold: true,
  },
  {
    id: "tb-a1",
    code: "101001",
    account: "Cash in Hand",
    section: "Assets",
    prior: 50000000,
    current: 70000000,
    type: "asset",
  },
  {
    id: "tb-a2",
    code: "101002",
    account: "Bank Balance - Zenith Bank",
    section: "Assets",
    prior: 200000000,
    current: 250000000,
    type: "asset",
  },
  {
    id: "tb-a3",
    code: "101003",
    account: "Bank Balance - First Bank",
    section: "Assets",
    prior: 200000000,
    current: 200000000,
    type: "asset",
  },
  {
    id: "tb-a4",
    code: "102001",
    account: "Receivables - FAAC Arrears",
    section: "Assets",
    prior: 150000000,
    current: 180000000,
    type: "asset",
  },
  {
    id: "tb-a5",
    code: "102002",
    account: "Receivables - IGR Debtors",
    section: "Assets",
    prior: 250000000,
    current: 280000000,
    type: "asset",
  },
  {
    id: "tb-a6",
    code: "111001",
    account: "Land & Buildings",
    section: "Assets",
    prior: 900000000,
    current: 1050000000,
    type: "asset",
  },
  {
    id: "tb-a7",
    code: "111002",
    account: "Plant & Machinery",
    section: "Assets",
    prior: 490000000,
    current: 550000000,
    type: "asset",
  },
  {
    id: "tb-a8",
    code: "111003",
    account: "Motor Vehicles",
    section: "Assets",
    prior: 300000000,
    current: 300000000,
    type: "asset",
  },
  {
    id: "tb-a9",
    code: "111004",
    account: "Office Equipment & Furniture",
    section: "Assets",
    prior: 200000000,
    current: 200000000,
    type: "asset",
  },
  {
    id: "tb-l1",
    code: "201001",
    account: "Creditors - Contractors",
    section: "Liabilities",
    prior: 150000000,
    current: 200000000,
    type: "liability",
  },
  {
    id: "tb-l2",
    code: "201002",
    account: "Accrued Salaries & Wages",
    section: "Liabilities",
    prior: 135000000,
    current: 140000000,
    type: "liability",
  },
  {
    id: "tb-l3",
    code: "211001",
    account: "FGN Infrastructure Bond",
    section: "Liabilities",
    prior: 400000000,
    current: 360000000,
    type: "liability",
  },
  {
    id: "tb-l4",
    code: "211002",
    account: "Commercial Bank Term Loan",
    section: "Liabilities",
    prior: 120000000,
    current: 120000000,
    type: "liability",
  },
];

const SECTION_ORDER = [
  "Revenue",
  "Expenditure",
  "Surplus",
  "Assets",
  "Liabilities",
  "Equity",
];

const SECTION_LABELS: Record<string, string> = {
  Revenue: "I.   Revenue",
  Expenditure: "II.  Expenditure",
  Surplus: "III. Surplus / (Deficit)",
  Assets: "IV.  Assets",
  Liabilities: "V.   Liabilities",
  Equity: "VI.  Net Assets / Equity",
};

const fmt = (val: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(val);

const fmtPct = (val: number) => (val > 0 ? "+" : "") + val.toFixed(1) + "%";

const DocSelector: React.FC<{
  selectedDoc: "" | "tb" | "fs";
  setSelectedDoc: React.Dispatch<React.SetStateAction<"" | "tb" | "fs">>;
}> = ({ selectedDoc, setSelectedDoc }) => (
  <div style={{ position: "relative" }}>
    <select
      className={s.formInput}
      style={{ minWidth: "280px", paddingRight: "2rem", fontSize: "0.85rem" }}
      value={selectedDoc}
      onChange={(e) => setSelectedDoc(e.target.value as "" | "tb" | "fs")}
    >
      <option value="">-- Select Base Document --</option>
      <option value="fs">Financial Statements (Draft)</option>
      <option value="tb">Trial Balance (Detailed Ledger)</option>
    </select>
    <ChevronDown
      size={14}
      style={{
        position: "absolute",
        right: "0.6rem",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color: "#94a3b8",
      }}
    />
  </div>
);

export const MaterialityAssessment: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<"" | "tb" | "fs">("");

  if (!selectedDoc) {
    return (
      <div className={s.card} style={{ marginTop: "2rem" }}>
        <div
          className={s.cardHeader}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                padding: "0.5rem",
                background: "#eff6ff",
                color: "#2563eb",
                borderRadius: "8px",
              }}
            >
              <Target size={20} />
            </div>
            <div>
              <h3 className={s.cardTitle} style={{ margin: 0 }}>
                Materiality Assessment &amp; Item Selection
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  color: "var(--text-3)",
                  marginTop: "0.1rem",
                }}
              >
                ISA 320 Profit Before Tax (PBT) based computation
              </p>
            </div>
          </div>
          <DocSelector
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        </div>
        <div
          className={s.cardBody}
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "420px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={28} style={{ color: "#3b82f6" }} />
            </div>
            <div
              style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}
            >
              Select a Base Document to Compute Materiality
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Choose either the <strong>Financial Statements</strong> or{" "}
              <strong>Trial Balance</strong> above. The engine will extract
              Profit Before Tax (PBT), apply ISA 320 standard materiality
              thresholds, and display all items selected for substantive
              testing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = selectedDoc === "fs" ? MOCK_FS : MOCK_TB;
  const pbtRow = data.find((d) => d.type === "pbt");
  const PBT = pbtRow ? pbtRow.current : 0;
  const OVERALL_MAT = PBT * 0.05;
  const PERF_MAT = OVERALL_MAT * 0.7;
  const TRIVIAL_MAT = PERF_MAT * 0.05;

  const datasetWithVariance = data.map((d) => {
    const variance = d.current - d.prior;
    const pct = d.prior !== 0 ? (variance / d.prior) * 100 : 0;
    return { ...d, variance, pct };
  });

  const selectedItems = datasetWithVariance.filter(
    (d) =>
      !d.bold &&
      d.type !== "pbt" &&
      (Math.abs(d.pct) >= 10 || d.current >= PERF_MAT),
  );

  return (
    <div className={s.card} style={{ marginTop: "2rem" }}>
      <div
        className={s.cardHeader}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.5rem",
              background: "#eff6ff",
              color: "#2563eb",
              borderRadius: "8px",
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <h3 className={s.cardTitle} style={{ margin: 0 }}>
              Materiality Assessment &amp; Item Selection
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: "var(--text-3)",
                marginTop: "0.1rem",
              }}
            >
              ISA 320 &mdash; Based on{" "}
              {selectedDoc === "fs" ? "Financial Statements" : "Trial Balance"}{" "}
              &middot; PBT: {fmt(PBT)}
            </p>
          </div>
        </div>
        <DocSelector
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
        />
      </div>

      <div className={s.cardBody}>
        {/* Methodology Banner */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          <Info
            size={16}
            style={{ color: "#2563eb", flexShrink: 0, marginTop: "0.1rem" }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: "#1e3a8a",
              lineHeight: 1.6,
            }}
          >
            <strong>Methodology (ISA 320):</strong> Overall Materiality = 5% x
            PBT. Performance Materiality = 70% of Overall. Trivial / De-minimis
            = 5% of Performance. Items selected for substantive testing where
            (i) analytical review variance is 10% or more, (ii) balance exceeds
            Performance Materiality, or (iii) judgemental selection applies.
          </p>
        </div>

        {/* Materiality KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              borderTop: "4px solid #f59e0b",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#92400e",
                marginBottom: "0.5rem",
              }}
            >
              Base Figure (PBT)
            </div>
            <div
              style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}
            >
              {fmt(PBT)}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Profit Before Tax extracted from{" "}
              {selectedDoc === "fs" ? "FS" : "TB"}
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              borderTop: "4px solid #10b981",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#166534",
                marginBottom: "0.5rem",
              }}
            >
              Overall Materiality (5%)
            </div>
            <div
              style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}
            >
              {fmt(OVERALL_MAT)}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Errors above this require disclosure
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              borderTop: "4px solid #3b82f6",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#1e40af",
                marginBottom: "0.5rem",
              }}
            >
              Performance Mat. (70%)
            </div>
            <div
              style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}
            >
              {fmt(PERF_MAT)}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Substantive testing scope threshold
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              borderTop: "4px solid #94a3b8",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              Trivial / De-minimis (5%)
            </div>
            <div
              style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}
            >
              {fmt(TRIVIAL_MAT)}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              Errors below this are immaterial
            </div>
          </div>
        </div>

        {/* Base Document Table */}
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            borderLeft: "3px solid #3b82f6",
            paddingLeft: "0.75rem",
          }}
        >
          Base Document - Year-on-Year Comparison
        </h4>
        <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {selectedDoc === "tb" && (
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#475569",
                    }}
                  >
                    Code
                  </th>
                )}
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                  }}
                >
                  Account
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  FY 2024 (Prior)
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                    whiteSpace: "nowrap",
                  }}
                >
                  FY 2025 (Current)
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                  }}
                >
                  Variance
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                  }}
                >
                  Delta %
                </th>
                <th
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#475569",
                  }}
                >
                  vs Mat.
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const grouped: Record<string, typeof datasetWithVariance> = {};
                datasetWithVariance.forEach((row) => {
                  if (!grouped[row.section]) grouped[row.section] = [];
                  grouped[row.section].push(row);
                });
                return SECTION_ORDER.filter((s) => grouped[s]).map(
                  (section) => (
                    <React.Fragment key={section}>
                      <tr>
                        <td
                          colSpan={selectedDoc === "tb" ? 7 : 6}
                          style={{
                            padding: "0.6rem 1rem",
                            background: "#f1f5f9",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "#334155",
                            borderTop: "2px solid #e2e8f0",
                          }}
                        >
                          {SECTION_LABELS[section] ?? section}
                        </td>
                      </tr>
                      {grouped[section].map((row) => {
                        const vs =
                          row.current >= OVERALL_MAT
                            ? {
                                label: "Exceeds Overall",
                                bg: "#fee2e2",
                                text: "#b91c1c",
                              }
                            : row.current >= PERF_MAT
                              ? {
                                  label: "Exceeds Perf.",
                                  bg: "#fef3c7",
                                  text: "#92400e",
                                }
                              : {
                                  label: "Below Trivial",
                                  bg: "#f0fdf4",
                                  text: "#166534",
                                };
                        return (
                          <tr
                            key={row.id}
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              background: row.bold ? "#fafbfd" : "white",
                            }}
                          >
                            {selectedDoc === "tb" && (
                              <td
                                style={{
                                  padding: "0.75rem 1rem",
                                  fontFamily: "monospace",
                                  fontSize: "0.75rem",
                                  color: "#94a3b8",
                                }}
                              >
                                {row.code}
                              </td>
                            )}
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                fontWeight: row.bold ? 700 : 500,
                                color: row.bold ? "#0f172a" : "var(--text)",
                                paddingLeft: row.bold ? "1rem" : "1.75rem",
                              }}
                            >
                              {row.account}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                textAlign: "right",
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                                color: "#475569",
                              }}
                            >
                              {fmt(row.prior)}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                textAlign: "right",
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                                fontWeight: row.bold ? 800 : 600,
                                color: "#0f172a",
                              }}
                            >
                              {fmt(row.current)}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                textAlign: "right",
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                                fontWeight: 600,
                                color:
                                  row.variance >= 0 ? "#059669" : "#dc2626",
                              }}
                            >
                              {row.variance >= 0 ? "+" : ""}
                              {fmt(row.variance)}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                textAlign: "right",
                                fontFamily: "monospace",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                color:
                                  Math.abs(row.pct) >= 10
                                    ? "#dc2626"
                                    : "#475569",
                              }}
                            >
                              {fmtPct(row.pct)}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                textAlign: "center",
                              }}
                            >
                              {row.bold ? (
                                <span
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: "0.72rem",
                                  }}
                                >
                                  -
                                </span>
                              ) : (
                                <span
                                  style={{
                                    padding: "0.15rem 0.55rem",
                                    borderRadius: "12px",
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    background: vs.bg,
                                    color: vs.text,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {vs.label}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ),
                );
              })()}
            </tbody>
          </table>
        </div>

        {/* Selected Items for Substantive Testing */}
        <h4
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            borderLeft: "3px solid #10b981",
            paddingLeft: "0.75rem",
          }}
        >
          Selected Items for Substantive Testing ({selectedItems.length})
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f0fdf4",
                  borderBottom: "2px solid #bbf7d0",
                }}
              >
                <th
                  style={{
                    padding: "0.85rem 1rem",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#166534",
                  }}
                >
                  Account
                </th>
                <th
                  style={{
                    padding: "0.85rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#166534",
                    whiteSpace: "nowrap",
                  }}
                >
                  Balance (CY)
                </th>
                <th
                  style={{
                    padding: "0.85rem 1rem",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#166534",
                  }}
                >
                  Analytical
                </th>
                <th
                  style={{
                    padding: "0.85rem 1rem",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#166534",
                  }}
                >
                  Mat. Risk
                </th>
                <th
                  style={{
                    padding: "0.85rem 1rem",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#166534",
                  }}
                >
                  Selection Rationale
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#64748b",
                      fontStyle: "italic",
                    }}
                  >
                    No items triggered the selection thresholds for this
                    document.
                  </td>
                </tr>
              ) : (
                selectedItems.map((row) => {
                  const varRisk = Math.abs(row.pct) >= 10;
                  const matRisk = row.current >= PERF_MAT;
                  const rationale =
                    varRisk && matRisk
                      ? "Both analytical review threshold (10% or more) and Performance Materiality exceeded. Mandatory deep substantive testing required."
                      : varRisk
                        ? `Significant year-on-year variance of ${fmtPct(row.pct)} triggers analytical review procedures.`
                        : matRisk
                          ? `Balance of ${fmt(row.current)} exceeds Performance Materiality (${fmt(PERF_MAT)}). Full scope substantive test required.`
                          : "Judgemental selection by auditor based on risk assessment findings.";
                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {row.account}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {fmt(row.current)}
                      </td>
                      <td
                        style={{ padding: "0.85rem 1rem", textAlign: "center" }}
                      >
                        {varRisk ? (
                          <span
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "12px",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          >
                            10% or more Delta
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#64748b",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "12px",
                              fontSize: "0.7rem",
                            }}
                          >
                            Low
                          </span>
                        )}
                      </td>
                      <td
                        style={{ padding: "0.85rem 1rem", textAlign: "center" }}
                      >
                        {matRisk ? (
                          <span
                            style={{
                              background: "#e0e7ff",
                              color: "#2563eb",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "12px",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          >
                            Exceeds PM
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#64748b",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "12px",
                              fontSize: "0.7rem",
                            }}
                          >
                            Below PM
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          fontSize: "0.82rem",
                          color: "#475569",
                          lineHeight: 1.5,
                        }}
                      >
                        <CheckCircle2
                          size={12}
                          style={{
                            color: "#059669",
                            marginRight: "0.35rem",
                            verticalAlign: "middle",
                          }}
                        />
                        {rationale}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
