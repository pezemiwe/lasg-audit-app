// Generates two LGA Approved Budget xlsx test files using SheetJS
const XLSX = require("xlsx");
const path = require("path");

const outDir = path.join(__dirname, "../public/test-data");

const HEADER = [
  "NCOA Code",
  "Account Name",
  "Classification",
  "Current Year",
  "Prior Year",
];

const budget2026 = [
  HEADER,
  ["100100", "Statutory Allocation (FAAC)", "Revenue", 950000000, 820000000],
  ["100200", "Value Added Tax (VAT) Share", "Revenue", 310000000, 268000000],
  ["100300", "State Government Grant", "Revenue", 80000000, 72000000],
  ["100400", "Internally Generated Revenue", "Revenue", 145000000, 118000000],
  ["100410", "  Market Fees & Levies", "Revenue", 45000000, 38000000],
  ["100420", "  Motor Park Levies", "Revenue", 18000000, 15000000],
  ["100430", "  Tenement Rates", "Revenue", 32000000, 27000000],
  ["100440", "  Building Plan Approval Fees", "Revenue", 25000000, 20000000],
  ["100450", "  Other IGR", "Revenue", 25000000, 18000000],
  ["100500", "Grants & Aid", "Revenue", 60000000, 45000000],
  ["200100", "Personnel Costs", "Expense", 520000000, 475000000],
  ["200110", "  Salaries & Allowances", "Expense", 420000000, 385000000],
  ["200120", "  Pensions & Gratuities", "Expense", 68000000, 62000000],
  ["200130", "  Training & Development", "Expense", 12000000, 10000000],
  ["200140", "  Other Staff Costs", "Expense", 20000000, 18000000],
  ["200200", "Overhead Costs", "Expense", 195000000, 172000000],
  ["200210", "  Utilities", "Expense", 28000000, 24000000],
  ["200220", "  Vehicle Running Costs", "Expense", 32000000, 28000000],
  ["200230", "  Repairs & Maintenance", "Expense", 45000000, 40000000],
  ["200240", "  Office Consumables", "Expense", 18000000, 15000000],
  ["200250", "  Printing & Publications", "Expense", 12000000, 10000000],
  ["200260", "  Consultancy Services", "Expense", 30000000, 25000000],
  ["200270", "  Other Overhead", "Expense", 30000000, 30000000],
  ["300100", "Capital Expenditure", "Expense", 480000000, 380000000],
  ["300110", "  Road Construction & Rehab", "Expense", 180000000, 140000000],
  ["300120", "  School Building & Renovation", "Expense", 85000000, 70000000],
  ["300130", "  Health Centre Construction", "Expense", 75000000, 60000000],
  ["300140", "  Water Supply Schemes", "Expense", 60000000, 50000000],
  ["300150", "  Market Infrastructure", "Expense", 40000000, 30000000],
  ["300160", "  Equipment & Vehicles", "Expense", 40000000, 30000000],
];

const budget2025 = [
  HEADER,
  ["100100", "Statutory Allocation (FAAC)", "Revenue", 820000000, 710000000],
  ["100200", "Value Added Tax (VAT) Share", "Revenue", 268000000, 230000000],
  ["100300", "State Government Grant", "Revenue", 72000000, 65000000],
  ["100400", "Internally Generated Revenue", "Revenue", 118000000, 98000000],
  ["100410", "  Market Fees & Levies", "Revenue", 38000000, 32000000],
  ["100420", "  Motor Park Levies", "Revenue", 15000000, 12000000],
  ["100430", "  Tenement Rates", "Revenue", 27000000, 22000000],
  ["100440", "  Building Plan Approval Fees", "Revenue", 20000000, 16000000],
  ["100450", "  Other IGR", "Revenue", 18000000, 16000000],
  ["100500", "Grants & Aid", "Revenue", 45000000, 38000000],
  ["200100", "Personnel Costs", "Expense", 475000000, 430000000],
  ["200110", "  Salaries & Allowances", "Expense", 385000000, 350000000],
  ["200120", "  Pensions & Gratuities", "Expense", 62000000, 56000000],
  ["200130", "  Training & Development", "Expense", 10000000, 8000000],
  ["200140", "  Other Staff Costs", "Expense", 18000000, 16000000],
  ["200200", "Overhead Costs", "Expense", 172000000, 152000000],
  ["200210", "  Utilities", "Expense", 24000000, 20000000],
  ["200220", "  Vehicle Running Costs", "Expense", 28000000, 24000000],
  ["200230", "  Repairs & Maintenance", "Expense", 40000000, 35000000],
  ["200240", "  Office Consumables", "Expense", 15000000, 12000000],
  ["200250", "  Printing & Publications", "Expense", 10000000, 8000000],
  ["200260", "  Consultancy Services", "Expense", 25000000, 22000000],
  ["200270", "  Other Overhead", "Expense", 30000000, 31000000],
  ["300100", "Capital Expenditure", "Expense", 380000000, 305000000],
  ["300110", "  Road Construction & Rehab", "Expense", 140000000, 115000000],
  ["300120", "  School Building & Renovation", "Expense", 70000000, 58000000],
  ["300130", "  Health Centre Construction", "Expense", 60000000, 50000000],
  ["300140", "  Water Supply Schemes", "Expense", 50000000, 42000000],
  ["300150", "  Market Infrastructure", "Expense", 30000000, 22000000],
  ["300160", "  Equipment & Vehicles", "Expense", 30000000, 18000000],
];

function writeXlsx(rows, filename) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
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
