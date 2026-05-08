// Generates two LGA Approved Budget xlsx test files using SheetJS
const XLSX = require("xlsx");
const path = require("path");

const outDir = path.join(__dirname, "../public/test-data");

// Each row: [NCOA Code, Account Name, Classification, Current Year, Prior Year]
const HEADER = [
  "NCOA Code",
  "Account Name",
  "Classification",
  "Current Year",
  "Prior Year",
];

const budget2026 = [
  HEADER,
  // ── REVENUE ────────────────────────────────────────────────────────────────
  [
    "100100",
    "Statutory Allocation (FAAC)",
    "Revenue",
    950_000_000,
    820_000_000,
  ],
  [
    "100200",
    "Value Added Tax (VAT) Share",
    "Revenue",
    310_000_000,
    268_000_000,
  ],
  ["100300", "State Government Grant", "Revenue", 80_000_000, 72_000_000],
  [
    "100400",
    "Internally Generated Revenue",
    "Revenue",
    145_000_000,
    118_000_000,
  ],
  ["100410", "  Market Fees & Levies", "Revenue", 45_000_000, 38_000_000],
  ["100420", "  Motor Park Levies", "Revenue", 18_000_000, 15_000_000],
  ["100430", "  Tenement Rates", "Revenue", 32_000_000, 27_000_000],
  [
    "100440",
    "  Building Plan Approval Fees",
    "Revenue",
    25_000_000,
    20_000_000,
  ],
  ["100450", "  Other IGR", "Revenue", 25_000_000, 18_000_000],
  ["100500", "Grants & Aid", "Revenue", 60_000_000, 45_000_000],
  // ── RECURRENT EXPENDITURE ──────────────────────────────────────────────────
  ["200100", "Personnel Costs", "Expense", 520_000_000, 475_000_000],
  ["200110", "  Salaries & Allowances", "Expense", 420_000_000, 385_000_000],
  ["200120", "  Pensions & Gratuities", "Expense", 68_000_000, 62_000_000],
  ["200130", "  Training & Development", "Expense", 12_000_000, 10_000_000],
  ["200140", "  Other Staff Costs", "Expense", 20_000_000, 18_000_000],
  ["200200", "Overhead Costs", "Expense", 195_000_000, 172_000_000],
  ["200210", "  Utilities", "Expense", 28_000_000, 24_000_000],
  ["200220", "  Vehicle Running Costs", "Expense", 32_000_000, 28_000_000],
  ["200230", "  Repairs & Maintenance", "Expense", 45_000_000, 40_000_000],
  ["200240", "  Office Consumables", "Expense", 18_000_000, 15_000_000],
  ["200250", "  Printing & Publications", "Expense", 12_000_000, 10_000_000],
  ["200260", "  Consultancy Services", "Expense", 30_000_000, 25_000_000],
  ["200270", "  Other Overhead", "Expense", 30_000_000, 30_000_000],
  // ── CAPITAL EXPENDITURE ────────────────────────────────────────────────────
  ["300100", "Capital Expenditure", "Expense", 480_000_000, 380_000_000],
  [
    "300110",
    "  Road Construction & Rehab",
    "Expense",
    180_000_000,
    140_000_000,
  ],
  [
    "300120",
    "  School Building & Renovation",
    "Expense",
    85_000_000,
    70_000_000,
  ],
  ["300130", "  Health Centre Construction", "Expense", 75_000_000, 60_000_000],
  ["300140", "  Water Supply Schemes", "Expense", 60_000_000, 50_000_000],
  ["300150", "  Market Infrastructure", "Expense", 40_000_000, 30_000_000],
  ["300160", "  Equipment & Vehicles", "Expense", 40_000_000, 30_000_000],
];

const budget2025 = [
  HEADER,
  // ── REVENUE ────────────────────────────────────────────────────────────────
  [
    "100100",
    "Statutory Allocation (FAAC)",
    "Revenue",
    820_000_000,
    710_000_000,
  ],
  [
    "100200",
    "Value Added Tax (VAT) Share",
    "Revenue",
    268_000_000,
    230_000_000,
  ],
  ["100300", "State Government Grant", "Revenue", 72_000_000, 65_000_000],
  [
    "100400",
    "Internally Generated Revenue",
    "Revenue",
    118_000_000,
    98_000_000,
  ],
  ["100410", "  Market Fees & Levies", "Revenue", 38_000_000, 32_000_000],
  ["100420", "  Motor Park Levies", "Revenue", 15_000_000, 12_000_000],
  ["100430", "  Tenement Rates", "Revenue", 27_000_000, 22_000_000],
  [
    "100440",
    "  Building Plan Approval Fees",
    "Revenue",
    20_000_000,
    16_000_000,
  ],
  ["100450", "  Other IGR", "Revenue", 18_000_000, 16_000_000],
  ["100500", "Grants & Aid", "Revenue", 45_000_000, 38_000_000],
  // ── RECURRENT EXPENDITURE ──────────────────────────────────────────────────
  ["200100", "Personnel Costs", "Expense", 475_000_000, 430_000_000],
  ["200110", "  Salaries & Allowances", "Expense", 385_000_000, 350_000_000],
  ["200120", "  Pensions & Gratuities", "Expense", 62_000_000, 56_000_000],
  ["200130", "  Training & Development", "Expense", 10_000_000, 8_000_000],
  ["200140", "  Other Staff Costs", "Expense", 18_000_000, 16_000_000],
  ["200200", "Overhead Costs", "Expense", 172_000_000, 152_000_000],
  ["200210", "  Utilities", "Expense", 24_000_000, 20_000_000],
  ["200220", "  Vehicle Running Costs", "Expense", 28_000_000, 24_000_000],
  ["200230", "  Repairs & Maintenance", "Expense", 40_000_000, 35_000_000],
  ["200240", "  Office Consumables", "Expense", 15_000_000, 12_000_000],
  ["200250", "  Printing & Publications", "Expense", 10_000_000, 8_000_000],
  ["200260", "  Consultancy Services", "Expense", 25_000_000, 22_000_000],
  ["200270", "  Other Overhead", "Expense", 30_000_000, 31_000_000],
  // ── CAPITAL EXPENDITURE ────────────────────────────────────────────────────
  ["300100", "Capital Expenditure", "Expense", 380_000_000, 305_000_000],
  [
    "300110",
    "  Road Construction & Rehab",
    "Expense",
    140_000_000,
    115_000_000,
  ],
  [
    "300120",
    "  School Building & Renovation",
    "Expense",
    70_000_000,
    58_000_000,
  ],
  ["300130", "  Health Centre Construction", "Expense", 60_000_000, 50_000_000],
  ["300140", "  Water Supply Schemes", "Expense", 50_000_000, 42_000_000],
  ["300150", "  Market Infrastructure", "Expense", 30_000_000, 22_000_000],
  ["300160", "  Equipment & Vehicles", "Expense", 30_000_000, 18_000_000],
];

function writeXlsx(rows, filename) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  // Auto-width columns
  ws["!cols"] = [
    { wch: 12 },
    { wch: 42 },
    { wch: 16 },
    { wch: 20 },
    { wch: 20 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Budget");
  const outPath = path.join(outDir, filename);
  XLSX.writeFile(wb, outPath);
  console.log("Written:", outPath);
}

writeXlsx(budget2026, "Approved_Budget_2026.xlsx");
writeXlsx(budget2025, "Approved_Budget_2025.xlsx");
