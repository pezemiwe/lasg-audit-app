/**
 * EngagementExtended.tsx
 * Document Analytical Review + Materiality Assessment
 * ISA 315 / ISA 320 compliant
 * Lagos State Audit Platform FY 2025 vs FY 2024
 */
import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TableProperties,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Building2,
  ChevronDown,
} from "lucide-react";
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

const TYPE_META: Record<
  AccountType,
  { bg: string; text: string; border: string; label: string }
> = {
  revenue: {
    bg: "#f0fdf4",
    text: "#166534",
    border: "#bbf7d0",
    label: "Revenue",
  },
  expense: {
    bg: "#fef2f2",
    text: "#991b1b",
    border: "#fecaca",
    label: "Expense",
  },
  asset: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe", label: "Asset" },
  liability: {
    bg: "#fff7ed",
    text: "#9a3412",
    border: "#fed7aa",
    label: "Liability",
  },
  equity: {
    bg: "#f5f3ff",
    text: "#6d28d9",
    border: "#ddd6fe",
    label: "Equity",
  },
  pbt: { bg: "#fffbeb", text: "#92400e", border: "#fde68a", label: "PBT" },
};

const fmt = (val: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(val);

const fmtPct = (val: number) => (val > 0 ? "+" : "") + val.toFixed(1) + "%";

function varianceFlag(
  pct: number,
  bold: boolean,
): { label: string; bg: string; text: string; Icon: React.ElementType } {
  if (bold)
    return { label: "Total", bg: "#f1f5f9", text: "#475569", Icon: Minus };
  const abs = Math.abs(pct);
  if (abs >= 20)
    return {
      label: "Investigate",
      bg: "#fee2e2",
      text: "#b91c1c",
      Icon: AlertCircle,
    };
  if (abs >= 10)
    return {
      label: "Adverse",
      bg: "#fff7ed",
      text: "#c2410c",
      Icon: TrendingUp,
    };
  if (abs >= 3)
    return {
      label: "Notable",
      bg: "#fffbeb",
      text: "#b45309",
      Icon: TrendingDown,
    };
  return { label: "Stable", bg: "#f0fdf4", text: "#15803d", Icon: Minus };
}

// ---------------------------------------------------------------
// ANALYTICS COMPONENT
// ---------------------------------------------------------------
export const PreliminaryAnalytics: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<"tb" | "fs">("fs");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const data = selectedDoc === "fs" ? MOCK_FS : MOCK_TB;

  const datasetWithVariance = useMemo(
    () =>
      data.map((d) => {
        const variance = d.current - d.prior;
        const pct = d.prior !== 0 ? (variance / d.prior) * 100 : 0;
        return { ...d, variance, pct };
      }),
    [data],
  );

  const sections = useMemo(() => {
    const raw = SECTION_ORDER.filter((s) => data.some((d) => d.section === s));
    return ["all", ...raw];
  }, [data]);

  const filtered = useMemo(
    () =>
      sectionFilter === "all"
        ? datasetWithVariance
        : datasetWithVariance.filter((d) => d.section === sectionFilter),
    [datasetWithVariance, sectionFilter],
  );

  const maxVal = useMemo(
    () => Math.max(...filtered.map((d) => Math.max(d.current, d.prior)), 1),
    [filtered],
  );

  const topExpected = useMemo(() => {
    const r = datasetWithVariance
      .filter((d) => d.type === "revenue" && !d.bold)
      .sort((a, b) => b.current - a.current);
    return r.length > 0 ? r[0] : null;
  }, [datasetWithVariance]);

  const topPerforming = useMemo(() => {
    const r = [...datasetWithVariance]
      .filter((d) => !d.bold)
      .sort((a, b) => b.pct - a.pct);
    return r.length > 0 ? r[0] : null;
  }, [datasetWithVariance]);

  const topAsset = useMemo(() => {
    const r = datasetWithVariance
      .filter((d) => d.type === "asset" && !d.bold)
      .sort((a, b) => b.current - a.current);
    return r.length > 0 ? r[0] : null;
  }, [datasetWithVariance]);

  const highVariance = useMemo(
    () =>
      datasetWithVariance.filter((d) => !d.bold && Math.abs(d.pct) >= 10)
        .length,
    [datasetWithVariance],
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
              background: "#ecfdf5",
              color: "#059669",
              borderRadius: "8px",
            }}
          >
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className={s.cardTitle} style={{ margin: 0 }}>
              Document Analytical Review
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: "var(--text-3)",
                marginTop: "0.1rem",
              }}
            >
              ISA 315 Year-on-year comparison &middot;{" "}
              {data.filter((d) => !d.bold).length} line items analysed
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <select
              className={s.formInput}
              style={{
                paddingRight: "2rem",
                minWidth: "260px",
                fontSize: "0.85rem",
              }}
              value={selectedDoc}
              onChange={(e) => {
                setSelectedDoc(e.target.value as "tb" | "fs");
                setSectionFilter("all");
              }}
            >
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
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              padding: "0.2rem",
              borderRadius: "8px",
              gap: "0.2rem",
            }}
          >
            {(["table", "chart"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: viewMode === mode ? 700 : 500,
                  background: viewMode === mode ? "white" : "transparent",
                  boxShadow:
                    viewMode === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  color: viewMode === mode ? "#0f172a" : "#64748b",
                  transition: "all 0.15s",
                }}
              >
                {mode === "table" ? (
                  <TableProperties size={14} />
                ) : (
                  <BarChart3 size={14} />
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.cardBody}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {topExpected && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "1.25rem",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <DollarSign size={12} /> Top Expected Revenue
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  marginBottom: "0.2rem",
                }}
              >
                {topExpected.account}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#059669",
                }}
              >
                {fmt(topExpected.current)}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#4d7c0f",
                  marginTop: "0.2rem",
                }}
              >
                {topExpected.pct >= 0 ? "?" : "?"} {fmtPct(topExpected.pct)} vs
                prior year
              </div>
            </div>
          )}
          {topPerforming && (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "12px",
                padding: "1.25rem",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <TrendingUp size={12} /> Top Performing (Delta %)
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  marginBottom: "0.2rem",
                }}
              >
                {topPerforming.account}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#2563eb",
                }}
              >
                {fmt(topPerforming.current)}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#1d4ed8",
                  marginTop: "0.2rem",
                }}
              >
                {topPerforming.pct >= 0 ? "?" : "?"} {fmtPct(topPerforming.pct)}{" "}
                vs prior year
              </div>
            </div>
          )}
          {topAsset && (
            <div
              style={{
                background: "#f5f3ff",
                border: "1px solid #ddd6fe",
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#6d28d9",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Building2 size={12} /> Top Asset Position
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#0f172a",
                  marginBottom: "0.2rem",
                }}
              >
                {topAsset.account}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                {fmt(topAsset.current)}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#6d28d9",
                  marginTop: "0.2rem",
                }}
              >
                {topAsset.pct >= 0 ? "?" : "?"} {fmtPct(topAsset.pct)} vs prior
                year
              </div>
            </div>
          )}
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#9a3412",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <AlertCircle size={12} /> High Variance Items
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: 800, color: "#ea580c" }}
            >
              {highVariance}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "#9a3412",
                marginTop: "0.2rem",
              }}
            >
              Accounts with 10% or more movement
            </div>
          </div>
        </div>

        {/* Section Filter Chips */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              style={{
                padding: "0.3rem 0.85rem",
                borderRadius: "20px",
                border: `1px solid ${sectionFilter === sec ? "#059669" : "#e2e8f0"}`,
                background: sectionFilter === sec ? "#ecfdf5" : "white",
                color: sectionFilter === sec ? "#059669" : "#64748b",
                fontWeight: sectionFilter === sec ? 700 : 500,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {sec === "all" ? "All Sections" : (SECTION_LABELS[sec] ?? sec)}
            </button>
          ))}
        </div>

        {/* TABLE VIEW */}
        {viewMode === "table" && (
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
                    background: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  {selectedDoc === "tb" && (
                    <th
                      style={{
                        padding: "0.85rem 1rem",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "#475569",
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Code
                    </th>
                  )}
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Account / Description
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Prior Year
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Current Year
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Variance
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Delta %
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "center",
                      fontWeight: 700,
                      color: "#475569",
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Flag
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const grouped: Record<string, typeof filtered> = {};
                  filtered.forEach((row) => {
                    if (!grouped[row.section]) grouped[row.section] = [];
                    grouped[row.section].push(row);
                  });
                  return SECTION_ORDER.filter((sec) => grouped[sec]).map(
                    (section) => (
                      <React.Fragment key={section}>
                        <tr>
                          <td
                            colSpan={selectedDoc === "tb" ? 7 : 6}
                            style={{
                              padding: "0.75rem 1rem",
                              background: "#f1f5f9",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: "#334155",
                              borderTop: "2px solid #e2e8f0",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            {SECTION_LABELS[section] ?? section}
                          </td>
                        </tr>
                        {grouped[section].map((row) => {
                          const flag = varianceFlag(row.pct, !!row.bold);
                          const FlagIcon = flag.Icon;
                          const meta = TYPE_META[row.type];
                          const unfavourable =
                            (row.variance < 0 &&
                              row.type !== "expense" &&
                              row.type !== "liability") ||
                            (row.variance > 0 &&
                              (row.type === "expense" ||
                                row.type === "liability"));
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
                                    padding: "0.85rem 1rem",
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
                                  padding: "0.85rem 1rem",
                                  fontWeight: row.bold ? 700 : 500,
                                  color: row.bold ? "#0f172a" : "var(--text)",
                                  paddingLeft: row.bold ? "1rem" : "1.75rem",
                                }}
                              >
                                {!row.bold && (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      background: meta.text,
                                      marginRight: "0.6rem",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                )}
                                {row.account}
                              </td>
                              <td
                                style={{
                                  padding: "0.85rem 1rem",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.85rem",
                                  color: "#475569",
                                  fontWeight: row.bold ? 700 : 400,
                                }}
                              >
                                {fmt(row.prior)}
                              </td>
                              <td
                                style={{
                                  padding: "0.85rem 1rem",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.85rem",
                                  color: "#0f172a",
                                  fontWeight: row.bold ? 800 : 500,
                                }}
                              >
                                {fmt(row.current)}
                              </td>
                              <td
                                style={{
                                  padding: "0.85rem 1rem",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  color: unfavourable
                                    ? "#dc2626"
                                    : row.variance >= 0
                                      ? "#059669"
                                      : "#dc2626",
                                }}
                              >
                                {row.variance >= 0 ? "+" : ""}
                                {fmt(row.variance)}
                              </td>
                              <td
                                style={{
                                  padding: "0.85rem 1rem",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontSize: "0.85rem",
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
                                  padding: "0.85rem 1rem",
                                  textAlign: "center",
                                }}
                              >
                                {row.bold ? (
                                  <span
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    -
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "0.25rem",
                                      padding: "0.2rem 0.55rem",
                                      borderRadius: "12px",
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      background: flag.bg,
                                      color: flag.text,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <FlagIcon size={10} />
                                    {flag.label}
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
        )}

        {/* CHART VIEW */}
        {viewMode === "chart" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "0.5rem 0",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                fontSize: "0.78rem",
                color: "#64748b",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "8px",
                    background: "#cbd5e1",
                    borderRadius: "3px",
                  }}
                />
                Prior Year
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "8px",
                    background: "#3b82f6",
                    borderRadius: "3px",
                  }}
                />
                Current Year
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "8px",
                    background: "#ef4444",
                    borderRadius: "3px",
                  }}
                />
                Unfavourable Movement
              </span>
            </div>
            {filtered.map((row) => {
              const priorW = (row.prior / maxVal) * 100;
              const currentW = (row.current / maxVal) * 100;
              const unfavourable =
                (row.variance < 0 &&
                  row.type !== "expense" &&
                  row.type !== "liability") ||
                (row.variance > 0 &&
                  (row.type === "expense" || row.type === "liability"));
              const barColor = unfavourable ? "#ef4444" : "#3b82f6";
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "0.75rem",
                    alignItems: "center",
                    padding: "0.85rem 1rem",
                    borderRadius: "8px",
                    background: row.bold ? "#f8fafc" : "white",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: row.bold ? 700 : 600,
                        color: "#334155",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {row.account}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          color: "#94a3b8",
                          width: "32px",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        PY
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "10px",
                          background: "#f1f5f9",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${priorW}%`,
                            height: "100%",
                            background: "#cbd5e1",
                            borderRadius: "5px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#64748b",
                          width: "130px",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {fmt(row.prior)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          width: "32px",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        CY
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "10px",
                          background: "#f1f5f9",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${currentW}%`,
                            height: "100%",
                            background: barColor,
                            borderRadius: "5px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          width: "130px",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {fmt(row.current)}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", minWidth: "70px" }}>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: Math.abs(row.pct) >= 10 ? "#dc2626" : "#475569",
                      }}
                    >
                      {fmtPct(row.pct)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#94a3b8",
                        marginTop: "0.1rem",
                      }}
                    >
                      vs PY
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
