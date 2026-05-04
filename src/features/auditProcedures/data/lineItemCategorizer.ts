/**
 * Categorise Trial-Balance / Financial-Statement line items into the 8 audit
 * procedure categories used by the AuditProcedures reference library, then
 * match each line item to its applicable reference procedures.
 */

import {
  auditProceduresData,
  type AuditProcedure,
  type ProcedureCategory,
} from "./auditProcedures";

/* ─── Display metadata for each category ─────────────────────────────── */
export const PROCEDURE_CATEGORY_META: Record<
  ProcedureCategory,
  { label: string; short: string; color: string; bg: string; order: number }
> = {
  revenue: {
    label: "Revenue",
    short: "REV",
    color: "#15803d",
    bg: "#ecfdf5",
    order: 1,
  },
  recurrent: {
    label: "Recurrent Expenditure",
    short: "RECUR",
    color: "#9a3412",
    bg: "#fff7ed",
    order: 2,
  },
  capital: {
    label: "Capital Expenditure",
    short: "CAPEX",
    color: "#a16207",
    bg: "#fefce8",
    order: 3,
  },
  "current-asset": {
    label: "Current Assets",
    short: "CA",
    color: "#1d4ed8",
    bg: "#eff6ff",
    order: 4,
  },
  "non-current-asset": {
    label: "Non-Current Assets",
    short: "NCA",
    color: "#1e40af",
    bg: "#dbeafe",
    order: 5,
  },
  "current-liability": {
    label: "Current Liabilities",
    short: "CL",
    color: "#b91c1c",
    bg: "#fee2e2",
    order: 6,
  },
  "non-current-liability": {
    label: "Non-Current Liabilities",
    short: "NCL",
    color: "#991b1b",
    bg: "#fecaca",
    order: 7,
  },
  equity: {
    label: "Equity / Net Assets",
    short: "EQ",
    color: "#6b21a8",
    bg: "#f3e8ff",
    order: 8,
  },
};

export const CATEGORY_ORDER: ProcedureCategory[] = [
  "revenue",
  "recurrent",
  "capital",
  "current-asset",
  "non-current-asset",
  "current-liability",
  "non-current-liability",
  "equity",
];

/* ─── NCOA prefix → category ─────────────────────────────────────────── */
/**
 * Lagos State NCOA top-level digit map:
 *   1xxx = Revenue (11xx statutory, 12xx IGR, 13xx aid/grants)
 *   2xxx = Expenditure (21xx personnel, 22xx overhead, 23xx capital)
 *   3xxx = Assets (31xx current, 32xx non-current)
 *   4xxx = Liabilities & Equity (41xx current liab, 42xx non-current liab,
 *                                 43xx equity / net assets)
 */
export function categoryFromNcoa(
  ncoa: string | undefined,
): ProcedureCategory | null {
  if (!ncoa) return null;
  const code = ncoa.replace(/\D/g, "");
  if (code.length < 2) return null;
  const top = code[0];
  const sub = code.slice(0, 2);

  if (top === "1") return "revenue";
  if (top === "2") {
    if (sub === "23") return "capital";
    return "recurrent";
  }
  if (top === "3") {
    if (sub === "32") return "non-current-asset";
    return "current-asset";
  }
  if (top === "4") {
    if (sub === "41") return "current-liability";
    if (sub === "42") return "non-current-liability";
    if (sub === "43") return "equity";
  }
  return null;
}

/* ─── Fallback: classify by keyword when NCOA missing ─────────────────── */
export function categoryFromAccountName(
  name: string,
): ProcedureCategory | null {
  const n = name.toLowerCase();
  if (
    /(faac|vat|allocation|igr|revenue|fees|fines|licence|license|grant|aid|tax received)/.test(
      n,
    )
  )
    return "revenue";
  if (/(salar|wage|pension|gratuity|allowance|personnel|payroll)/.test(n))
    return "recurrent";
  if (/(overhead|utilit|maintenance|training|travel|stationery)/.test(n))
    return "recurrent";
  if (/(capital|construction|works|infrastructure|project)/.test(n))
    return "capital";
  if (/(cash|bank|petty|advance|prepayment|receivable|inventor|stock)/.test(n))
    return "current-asset";
  if (/(property|plant|equipment|ppe|vehicle|building|land|intangib)/.test(n))
    return "non-current-asset";
  if (/(payable|deposit|accrued|short.?term|withholding)/.test(n))
    return "current-liability";
  if (/(borrowing|loan|long.?term|bond)/.test(n))
    return "non-current-liability";
  if (/(reserve|surplus|deficit|equity|net asset|capital fund)/.test(n))
    return "equity";
  return null;
}

/* ─── Match a line item to applicable audit procedures ───────────────── */
/**
 * Returns the procedures whose ncoaPrefix matches the line item's NCOA code
 * (longest-prefix match). When the line item has no NCOA, falls back to all
 * procedures in the same category (after categorising by name).
 */
export function matchProceduresForLineItem(
  ncoa: string | undefined,
  accountName: string,
  category: ProcedureCategory | null,
): AuditProcedure[] {
  const cat =
    category ?? categoryFromNcoa(ncoa) ?? categoryFromAccountName(accountName);

  if (!cat) return [];

  const inCategory = auditProceduresData.filter((p) => p.category === cat);

  if (ncoa) {
    const code = ncoa.replace(/\D/g, "");
    /* Try longest-prefix match (4 → 3 → 2 digits) */
    for (const len of [4, 3, 2]) {
      const slice = code.slice(0, len);
      const matched = inCategory.filter((p) => p.ncoaPrefix.startsWith(slice));
      if (matched.length > 0) return matched;
    }
  }

  return inCategory;
}
