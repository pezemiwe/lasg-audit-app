/* ==================================================================
   Sample Trial Balance Generator
   Creates a downloadable .xlsx file matching the parser's expected
   shape. Used for the demo — lets a user click "Download sample",
   then immediately upload that file to test the parse flow.
   ================================================================== */

import * as XLSX from "xlsx";

interface SampleRow {
  "NCOA Code": string;
  "Account Name": string;
  "Current Year": number;
  "Prior Year": number;
  Classification: string;
}

const SAMPLE_ROWS: SampleRow[] = [
  { "NCOA Code": "110101", "Account Name": "Share of Federation Account", "Current Year": 49_820_000_000, "Prior Year": 44_110_000_000, Classification: "Revenue" },
  { "NCOA Code": "110102", "Account Name": "Share of Value Added Tax (VAT)", "Current Year": 28_430_000_000, "Prior Year": 24_990_000_000, Classification: "Revenue" },
  { "NCOA Code": "110103", "Account Name": "Excess Crude Oil and Others", "Current Year": 7_450_000_000, "Prior Year": 6_980_000_000, Classification: "Revenue" },
  { "NCOA Code": "120201", "Account Name": "Licences General", "Current Year": 440_000_000, "Prior Year": 310_000_000, Classification: "Revenue" },
  { "NCOA Code": "120204", "Account Name": "Fees General", "Current Year": 2_880_000_000, "Prior Year": 2_210_000_000, Classification: "Revenue" },
  { "NCOA Code": "120205", "Account Name": "Fines General", "Current Year": 160_000_000, "Prior Year": 140_000_000, Classification: "Revenue" },
  { "NCOA Code": "120206", "Account Name": "Sales General", "Current Year": 45_000_000, "Prior Year": 38_000_000, Classification: "Revenue" },
  { "NCOA Code": "120207", "Account Name": "Earnings General", "Current Year": 520_000_000, "Prior Year": 450_000_000, Classification: "Revenue" },
  { "NCOA Code": "120208", "Account Name": "Rent on Government Buildings General", "Current Year": 3_200_000, "Prior Year": 2_800_000, Classification: "Revenue" },
  { "NCOA Code": "120214", "Account Name": "Investment Income", "Current Year": 18_000_000, "Prior Year": 15_000_000, Classification: "Revenue" },
  { "NCOA Code": "210101", "Account Name": "Salaries and Wages", "Current Year": 21_880_000_000, "Prior Year": 19_220_000_000, Classification: "Expense" },
  { "NCOA Code": "220201", "Account Name": "Overhead Cost", "Current Year": 8_640_000_000, "Prior Year": 7_910_000_000, Classification: "Expense" },
  { "NCOA Code": "220701", "Account Name": "Transfers to SUBEB and Other LG Entities", "Current Year": 38_720_000_000, "Prior Year": 32_140_000_000, Classification: "Expense" },
  { "NCOA Code": "310101", "Account Name": "Cash and Cash Equivalent", "Current Year": 14_280_000_000, "Prior Year": 11_540_000_000, Classification: "Asset" },
  { "NCOA Code": "310601", "Account Name": "Receivables", "Current Year": 0, "Prior Year": 0, Classification: "Asset" },
  { "NCOA Code": "310801", "Account Name": "Prepayments", "Current Year": 210_000_000, "Prior Year": 163_000_000, Classification: "Asset" },
  { "NCOA Code": "310501", "Account Name": "Inventories", "Current Year": 1_200_000, "Prior Year": 914_000, Classification: "Asset" },
  { "NCOA Code": "311001", "Account Name": "Loan Granted (LG Loan Fund)", "Current Year": 25_000_000, "Prior Year": 23_000_000, Classification: "Asset" },
  { "NCOA Code": "310901", "Account Name": "Investments", "Current Year": 68_000_000, "Prior Year": 34_000_000, Classification: "Asset" },
  { "NCOA Code": "320101", "Account Name": "Property, Plant and Equipment (PPE)", "Current Year": 22_110_000_000, "Prior Year": 19_450_000_000, Classification: "Asset" },
  { "NCOA Code": "320201", "Account Name": "Investment Properties", "Current Year": 275_000_000, "Prior Year": 14_000_000, Classification: "Asset" },
  { "NCOA Code": "320301", "Account Name": "Intangible Assets (Advances)", "Current Year": 11_930_000_000, "Prior Year": 12_880_000_000, Classification: "Asset" },
  { "NCOA Code": "410101", "Account Name": "Deposits", "Current Year": 9_220_000_000, "Prior Year": 8_760_000_000, Classification: "Liability" },
  { "NCOA Code": "410201", "Account Name": "Short Term Loans and Debts", "Current Year": 487_000_000, "Prior Year": 517_000_000, Classification: "Liability" },
  { "NCOA Code": "410401", "Account Name": "Payables (Accrued Expenses)", "Current Year": 6_680_000_000, "Prior Year": 5_890_000_000, Classification: "Liability" },
  { "NCOA Code": "420301", "Account Name": "Long Term Borrowing", "Current Year": 175_000_000, "Prior Year": 175_000_000, Classification: "Liability" },
  { "NCOA Code": "430301", "Account Name": "Reserves", "Current Year": 28_170_000_000, "Prior Year": 24_880_000_000, Classification: "Equity" },
  { "NCOA Code": "430201", "Account Name": "Accumulated Surpluses / (Deficits)", "Current Year": 4_290_000_000, "Prior Year": 4_328_000_000, Classification: "Equity" },
];

/**
 * Build and trigger download of a sample trial balance workbook.
 * Call this from a button onClick in the TrialBalanceUpload component.
 */
export function downloadSampleTrialBalance(
  filename = "LASG_Sample_Trial_Balance_2025_vs_2024.xlsx",
): void {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_ROWS, {
    header: [
      "NCOA Code",
      "Account Name",
      "Current Year",
      "Prior Year",
      "Classification",
    ],
  });

  // Column widths (chars)
  ws["!cols"] = [
    { wch: 12 },
    { wch: 44 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
  ];

  // Currency format for the numeric columns — Excel-style
  const fmtCurrency = '#,##0.00;("#,##0.00")';
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let R = range.s.r + 1; R <= range.e.r; R++) {
    for (const C of [2, 3]) {
      const cellAddr = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddr];
      if (cell && typeof cell.v === "number") {
        cell.z = fmtCurrency;
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

  // Metadata sheet
  const meta = XLSX.utils.aoa_to_sheet([
    ["Lagos State Local Governments — Sample Trial Balance"],
    ["Generated by LASG Audit Platform"],
    [""],
    ["Purpose:", "Demo-ready trial balance for upload to the Audit Outcomes module"],
    ["Framework:", "Nigerian National Chart of Accounts (NCOA) — Accrual IPSAS"],
    ["Comparative:", "Current year vs. Prior year"],
    [""],
    ["Usage:"],
    ["1. Open the Audit Outcomes page in the platform"],
    ["2. Go to the Trial Balance tab"],
    ["3. Drag this file into the upload zone, or click to browse"],
    ["4. The parser will detect columns automatically and classify accounts via NCOA code ranges"],
  ]);
  meta["!cols"] = [{ wch: 16 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, meta, "README");

  // Trigger browser download
  XLSX.writeFile(wb, filename, { bookType: "xlsx" });
}
