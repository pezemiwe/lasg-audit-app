/* ==================================================================
   Excel Parser — Trial Balance
   Uses SheetJS (xlsx) to parse an unaudited trial balance and
   normalise it into TrialBalanceLine[].

   Expected columns (case-insensitive, flexible):
     - NCOA Code | Code | GL Code
     - Account / Account Name / Description
     - Current Year | 2025 | CY | Debit (CY) — any numeric column for current year
     - Prior Year | 2024 | PY — prior-year column
     - Classification — optional; derived from NCOA range if absent

   NCOA classification ranges (Nigerian public sector chart of accounts):
     1xxxxx — Revenue
     2xxxxx — Expenditure
     3xxxxx — Assets
     4xxxxx — Liabilities
     4303xx / 4302xx — Equity / Reserves (treated as Equity)
   ================================================================== */

import * as XLSX from "xlsx";
import type { TrialBalance, TrialBalanceLine } from "../types/auditOutcomes";

const uid = () =>
  `tbl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const norm = (s: unknown) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const toNumber = (v: unknown): number => {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  // Strings: strip commas, parentheses (accounting negative), currency
  const raw = String(v).trim();
  if (!raw) return 0;
  const isNeg = /^\(.*\)$/.test(raw);
  const cleaned = raw.replace(/[()₦N$,\s]/g, "").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return isNeg ? -Math.abs(n) : n;
};

const classifyFromNcoa = (code: string): TrialBalanceLine["classification"] => {
  if (!code) return "Unclassified";
  const c = code.replace(/\D/g, "");
  if (!c) return "Unclassified";
  const first = c.charAt(0);
  // Equity ranges (reserves / surpluses) take precedence over liabilities
  if (c.startsWith("43")) return "Equity";
  if (first === "1") return "Revenue";
  if (first === "2") return "Expense";
  if (first === "3") return "Asset";
  if (first === "4") return "Liability";
  return "Unclassified";
};

const classifyFromName = (name: string): TrialBalanceLine["classification"] => {
  const n = name.toLowerCase();
  if (/revenue|income|receipt|allocation|vat|fee|fine|levy|earning/.test(n))
    return "Revenue";
  if (
    /salary|wages|overhead|expense|expenditure|cost|depreciation|transfer/.test(
      n,
    )
  )
    return "Expense";
  if (
    /cash|receivable|prepayment|inventory|loan granted|investment|ppe|plant|equipment|intangible|asset/.test(
      n,
    )
  )
    return "Asset";
  if (/deposit|payable|loan|borrow|liability/.test(n)) return "Liability";
  if (/reserve|surplus|deficit|equity/.test(n)) return "Equity";
  return "Unclassified";
};

interface ColumnMap {
  code: number;
  name: number;
  current: number;
  prior: number;
  classification: number;
}

const findColumns = (headers: string[]): ColumnMap => {
  const h = headers.map(norm);
  const findIdx = (patterns: RegExp[]) =>
    h.findIndex((col) => patterns.some((p) => p.test(col)));

  return {
    code: findIdx([/^ncoacode$/, /^glcode$/, /^code$/, /^accountcode$/]),
    name: findIdx([/^accountname$/, /^account$/, /^description$/, /^details$/]),
    current: findIdx([
      /^currentyear$/,
      /^current$/,
      /^cy$/,
      /^thisyear$/,
      /^2025$/,
      /^2026$/,
      /^year1$/,
      /^debitcurrent$/,
    ]),
    prior: findIdx([
      /^prioryear$/,
      /^prior$/,
      /^py$/,
      /^lastyear$/,
      /^previous$/,
      /^2024$/,
      /^2023$/,
      /^year2$/,
    ]),
    classification: findIdx([
      /^classification$/,
      /^class$/,
      /^type$/,
      /^category$/,
    ]),
  };
};

export interface ParseResult {
  lines: TrialBalanceLine[];
  totals: {
    totalRevenue: number;
    totalExpenditure: number;
    profitBeforeTax: number;
    totalAssets: number;
    totalLiabilities: number;
  };
  warnings: string[];
}

/**
 * Parse a File or ArrayBuffer containing a trial balance xlsx/csv.
 * Returns normalised lines plus derived totals and any warnings.
 */
export async function parseTrialBalanceFile(
  file: File | ArrayBuffer,
): Promise<ParseResult> {
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("Workbook contains no sheets");
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  if (rows.length < 2) {
    throw new Error("Trial balance appears empty");
  }

  // Find the header row — first row with >=2 non-empty cells that look text-y
  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i] as unknown[];
    const nonEmpty = row.filter((c) => String(c ?? "").trim() !== "").length;
    if (nonEmpty >= 2) {
      headerRowIdx = i;
      break;
    }
  }

  const headers = (rows[headerRowIdx] as unknown[]).map((c) => String(c ?? ""));
  const cols = findColumns(headers);
  const warnings: string[] = [];

  if (cols.name === -1) {
    warnings.push(
      "No 'Account Name' column detected: using first text column as fallback",
    );
  }
  if (cols.current === -1) {
    warnings.push("No 'Current Year' column detected: results incomplete");
  }
  if (cols.prior === -1) {
    warnings.push("No 'Prior Year' column detected: no variance will compute");
  }

  const lines: TrialBalanceLine[] = [];
  let totalRevenue = 0;
  let totalExpenditure = 0;
  let totalAssets = 0;
  let totalLiabilities = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const name =
      cols.name >= 0
        ? String(row[cols.name] ?? "").trim()
        : String(row.find((c) => typeof c === "string" && c.trim()) ?? "");

    if (!name || /^total|^grand total|^sub.?total/i.test(name)) continue;

    const code = cols.code >= 0 ? String(row[cols.code] ?? "").trim() : "";
    const current = cols.current >= 0 ? toNumber(row[cols.current]) : 0;
    const prior = cols.prior >= 0 ? toNumber(row[cols.prior]) : 0;
    const variance = current - prior;
    const variancePct = prior !== 0 ? (variance / Math.abs(prior)) * 100 : 0;

    let classification: TrialBalanceLine["classification"];
    if (cols.classification >= 0) {
      const raw = norm(row[cols.classification]);
      if (raw.startsWith("rev")) classification = "Revenue";
      else if (raw.startsWith("exp")) classification = "Expense";
      else if (raw.startsWith("ass")) classification = "Asset";
      else if (raw.startsWith("lia")) classification = "Liability";
      else if (raw.startsWith("equ")) classification = "Equity";
      else
        classification = code ? classifyFromNcoa(code) : classifyFromName(name);
    } else {
      classification = code ? classifyFromNcoa(code) : classifyFromName(name);
    }

    lines.push({
      id: uid(),
      ncoaCode: code || undefined,
      accountName: name,
      currentYear: current,
      priorYear: prior,
      variance,
      variancePct,
      classification,
    });

    if (classification === "Revenue") totalRevenue += Math.abs(current);
    else if (classification === "Expense")
      totalExpenditure += Math.abs(current);
    else if (classification === "Asset") totalAssets += Math.abs(current);
    else if (classification === "Liability")
      totalLiabilities += Math.abs(current);
  }

  const profitBeforeTax = totalRevenue - totalExpenditure;

  return {
    lines,
    totals: {
      totalRevenue,
      totalExpenditure,
      profitBeforeTax,
      totalAssets,
      totalLiabilities,
    },
    warnings,
  };
}

/**
 * Build a full TrialBalance record from a parse result.
 */
export function buildTrialBalance(args: {
  auditOutcomeId: string;
  auditId: string;
  lgaId?: string;
  currentYear: number;
  priorYear: number;
  fileName: string;
  uploadedBy: string;
  parseResult: ParseResult;
}): TrialBalance {
  const {
    auditOutcomeId,
    auditId,
    lgaId,
    currentYear,
    priorYear,
    fileName,
    uploadedBy,
    parseResult,
  } = args;
  return {
    id: `tb-${Date.now().toString(36)}`,
    auditOutcomeId,
    auditId,
    lgaId,
    currentYear,
    priorYear,
    fileName,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    lines: parseResult.lines,
    ...parseResult.totals,
  };
}
