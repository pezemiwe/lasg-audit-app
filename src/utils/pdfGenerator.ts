/* ==================================================================
   PDF Generator — Audited Financial Statement Compilation
   Builds the full ~500-page PDF using jsPDF + jspdf-autotable.

   Output structure mirrors the Edo State AG report:
     1.  Cover page
     2.  Table of Contents (auto-generated with page refs)
     3.  Audit Certificate (letterhead, signatures)
     4.  Report of the Auditor-General (numbered sections)
     5.  Accounting Policies (IPSAS Accrual)
     6.  Consolidated Statement of Financial Position
     7.  Consolidated Statement of Financial Performance
     8.  Consolidated Cash Flow Statement
     9.  Notes to the Accounts
    10.  Per-LGA audit package (repeats for each LGA/LCDA):
         - Audit Certificate (LG)
         - Statement of Responsibility
         - Statement of Financial Position
         - Statement of Financial Performance
         - Cash Flow Statement
         - Notes

   Public API:
     generateAuditOutcomePdf(args) -> Promise<Blob>
   ================================================================== */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  AuditOutcome,
  AuditReportDocument,
  AccountingPolicies,
  FinancialStatement,
  StatementOfResponsibility,
  LgaAuditPackage,
  SectionTable,
  SignatureBlock,
} from "../types/auditOutcomes";
import type { LGA } from "../types";

/* ─── Design tokens (Deloitte-restrained, not decorative) ─── */
const COLOR = {
  ink: [20, 20, 20] as [number, number, number],
  muted: [90, 90, 90] as [number, number, number],
  rule: [200, 200, 200] as [number, number, number],
  accent: [6, 78, 59] as [number, number, number], // primary green
  band: [245, 245, 245] as [number, number, number],
  subtle: [250, 250, 250] as [number, number, number],
};

const PAGE = {
  width: 612,
  height: 792,
  marginX: 54,
  marginTop: 60,
  marginBottom: 60,
};

const FONT = {
  serif: "times",
  sans: "helvetica",
};

/* ─── Helpers ─── */

const fmtN = (n: number | null | undefined): string => {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n === 0) return "-";
  const abs = Math.abs(n);
  const str = abs.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return n < 0 ? `(${str})` : str;
};

const fmtYearDate = (y: number) => `31ST DECEMBER, ${y}`;

interface PdfContext {
  doc: jsPDF;
  pageNumber: number;
  toc: Array<{ title: string; page: number; level: number }>;
  sealImage?: string; // data URL
  runningHeader?: string; // text shown at top of each page
  skipHeaderOnCurrentPage?: boolean;
}

const addHeaderFooter = (
  ctx: PdfContext,
  opts?: { suppressHeader?: boolean },
) => {
  const { doc } = ctx;
  if (!opts?.suppressHeader && ctx.runningHeader) {
    doc.setFont(FONT.sans, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR.muted);
    doc.text(ctx.runningHeader, PAGE.width / 2, 34, { align: "center" });
    doc.setDrawColor(...COLOR.rule);
    doc.setLineWidth(0.3);
    doc.line(PAGE.marginX, 42, PAGE.width - PAGE.marginX, 42);
  }
  // Footer page number
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.ink);
  doc.text(String(ctx.pageNumber), PAGE.width / 2, PAGE.height - 30, {
    align: "center",
  });
};

const newPage = (ctx: PdfContext, opts?: { suppressHeader?: boolean }) => {
  ctx.doc.addPage();
  ctx.pageNumber += 1;
  addHeaderFooter(ctx, opts);
};

const ensureSpace = (ctx: PdfContext, y: number, needed: number): number => {
  if (y + needed > PAGE.height - PAGE.marginBottom) {
    newPage(ctx);
    return PAGE.marginTop;
  }
  return y;
};

const drawCenteredTitle = (
  ctx: PdfContext,
  title: string,
  y: number,
  opts: { size?: number; bold?: boolean } = {},
): number => {
  const { doc } = ctx;
  doc.setFont(FONT.serif, opts.bold === false ? "normal" : "bold");
  doc.setFontSize(opts.size ?? 14);
  doc.setTextColor(...COLOR.ink);
  const lines = doc.splitTextToSize(title, PAGE.width - 2 * PAGE.marginX);
  (lines as string[]).forEach((line, i) => {
    doc.text(line, PAGE.width / 2, y + i * ((opts.size ?? 14) + 2), {
      align: "center",
    });
  });
  return y + (lines as string[]).length * ((opts.size ?? 14) + 2);
};

const drawParagraph = (
  ctx: PdfContext,
  text: string,
  y: number,
  opts: {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    align?: "left" | "justify" | "center";
    lineHeight?: number;
    indent?: number;
  } = {},
): number => {
  const { doc } = ctx;
  const size = opts.size ?? 10;
  const lh = opts.lineHeight ?? size * 1.4;
  const style = opts.italic ? "italic" : opts.bold ? "bold" : "normal";
  doc.setFont(FONT.serif, style);
  doc.setFontSize(size);
  doc.setTextColor(...COLOR.ink);
  const marginX = PAGE.marginX + (opts.indent ?? 0);
  const maxWidth = PAGE.width - 2 * PAGE.marginX - (opts.indent ?? 0);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];

  for (const line of lines) {
    y = ensureSpace(ctx, y, lh);
    doc.text(line, opts.align === "center" ? PAGE.width / 2 : marginX, y, {
      align: opts.align === "center" ? "center" : "left",
    });
    y += lh;
  }
  return y;
};

const drawBullets = (ctx: PdfContext, bullets: string[], y: number): number => {
  const { doc } = ctx;
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.ink);
  for (const b of bullets) {
    y = ensureSpace(ctx, y, 14);
    const maxWidth = PAGE.width - 2 * PAGE.marginX - 14;
    const lines = doc.splitTextToSize(b, maxWidth) as string[];
    doc.text("•", PAGE.marginX + 4, y);
    lines.forEach((line, i) => {
      doc.text(line, PAGE.marginX + 14, y + i * 13);
    });
    y += lines.length * 13 + 4;
  }
  return y;
};

const drawTable = (ctx: PdfContext, table: SectionTable, y: number): number => {
  autoTable(ctx.doc, {
    startY: y,
    head: [table.headers],
    body: table.rows.map((row) => row.map((c) => c.value)),
    theme: "grid",
    styles: {
      font: FONT.serif,
      fontSize: 9,
      cellPadding: 4,
      textColor: COLOR.ink,
      lineColor: COLOR.rule,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: COLOR.band,
      textColor: COLOR.ink,
      fontStyle: "bold",
    },
    margin: { left: PAGE.marginX, right: PAGE.marginX },
    didDrawPage: () => {
      // autoTable added a page — sync our counter
    },
  });
  // After autoTable, the lastAutoTable finalY is available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (ctx.doc as any).lastAutoTable?.finalY ?? y;
  // Sync pageNumber: jsPDF's internal page count vs our counter
  ctx.pageNumber = ctx.doc.getNumberOfPages();
  return finalY + 12;
};

const drawSignatureBlock = (
  ctx: PdfContext,
  sig: SignatureBlock | undefined,
  y: number,
  label: string,
): number => {
  const { doc } = ctx;
  y = ensureSpace(ctx, y, 80);
  const x = PAGE.marginX;
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.ink);

  // Signature line
  if (sig?.signatureDataUrl) {
    try {
      doc.addImage(sig.signatureDataUrl, "PNG", x, y - 8, 120, 28);
    } catch {
      // ignore bad image
    }
  }
  y += 24;
  doc.setDrawColor(...COLOR.ink);
  doc.setLineWidth(0.4);
  doc.line(x, y, x + 220, y);
  y += 12;
  doc.setFont(FONT.serif, "bold");
  doc.text(sig?.name || "________________________", x, y);
  y += 12;
  doc.setFont(FONT.serif, "normal");
  doc.text(sig?.title || label, x, y);
  y += 12;
  if (sig?.signedAt) {
    const d = new Date(sig.signedAt);
    doc.text(
      `Date: ${d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`,
      x,
      y,
    );
    y += 12;
  } else {
    doc.text("Date: _______________________", x, y);
    y += 12;
  }
  return y + 10;
};

/* ─── Letterhead (used on section openers) ─── */

const drawLetterhead = (ctx: PdfContext, opts: { lgaName?: string } = {}) => {
  const { doc } = ctx;
  // Seal (left)
  if (ctx.sealImage) {
    try {
      doc.addImage(ctx.sealImage, "PNG", PAGE.marginX, 40, 54, 54);
    } catch {
      // ignore
    }
  }
  // Title block (center/right)
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR.accent);
  doc.text("OFFICE OF THE AUDITOR-GENERAL", PAGE.width / 2, 52, {
    align: "center",
  });
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.ink);
  doc.text("FOR LOCAL GOVERNMENTS", PAGE.width / 2, 66, { align: "center" });
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.muted);
  doc.text("LAGOS STATE OF NIGERIA", PAGE.width / 2, 78, { align: "center" });
  if (opts.lgaName) {
    doc.setFont(FONT.serif, "italic");
    doc.setFontSize(9);
    doc.text(opts.lgaName.toUpperCase(), PAGE.width / 2, 90, {
      align: "center",
    });
  }
  // Divider rule
  doc.setDrawColor(...COLOR.accent);
  doc.setLineWidth(1.5);
  doc.line(PAGE.marginX, 100, PAGE.width - PAGE.marginX, 100);
  doc.setLineWidth(0.3);
  doc.setDrawColor(...COLOR.rule);
  doc.line(PAGE.marginX, 103, PAGE.width - PAGE.marginX, 103);
};

/* ─── Section builders ─── */

const buildCoverPage = (
  ctx: PdfContext,
  outcome: AuditOutcome,
  opts: { subtitle?: string },
) => {
  const { doc } = ctx;
  // Full-page cover
  doc.setFillColor(...COLOR.subtle);
  doc.rect(0, 0, PAGE.width, PAGE.height, "F");

  // Thin top band
  doc.setFillColor(...COLOR.accent);
  doc.rect(0, 0, PAGE.width, 8, "F");

  // Seal
  if (ctx.sealImage) {
    try {
      doc.addImage(ctx.sealImage, "PNG", PAGE.width / 2 - 60, 120, 120, 120);
    } catch {
      // ignore
    }
  }

  // Titles
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.muted);
  doc.text("LAGOS STATE GOVERNMENT", PAGE.width / 2, 270, { align: "center" });
  doc.setFontSize(10);
  doc.text(
    "OFFICE OF THE AUDITOR-GENERAL FOR LOCAL GOVERNMENTS",
    PAGE.width / 2,
    286,
    { align: "center" },
  );

  doc.setDrawColor(...COLOR.accent);
  doc.setLineWidth(1.5);
  doc.line(PAGE.width / 2 - 60, 300, PAGE.width / 2 + 60, 300);

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLOR.ink);
  doc.text("AUDITED FINANCIAL STATEMENTS", PAGE.width / 2, 350, {
    align: "center",
  });
  doc.setFontSize(16);
  doc.text("OF THE LOCAL GOVERNMENT COUNCILS", PAGE.width / 2, 376, {
    align: "center",
  });
  doc.text("OF LAGOS STATE", PAGE.width / 2, 396, { align: "center" });

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLOR.muted);
  doc.text(
    `FOR THE YEAR ENDED ${fmtYearDate(outcome.auditYear)}`,
    PAGE.width / 2,
    430,
    { align: "center" },
  );

  if (opts.subtitle) {
    doc.setFontSize(11);
    doc.setFont(FONT.serif, "italic");
    doc.text(opts.subtitle, PAGE.width / 2, 460, { align: "center" });
  }

  // Bottom band with metadata
  doc.setDrawColor(...COLOR.rule);
  doc.setLineWidth(0.3);
  doc.line(PAGE.marginX, 700, PAGE.width - PAGE.marginX, 700);
  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.muted);
  doc.text(
    `Prepared pursuant to the Lagos State Audit Law and Local Government Law`,
    PAGE.width / 2,
    716,
    { align: "center" },
  );
  doc.text(
    `Framework: International Public Sector Accounting Standards (IPSAS Accrual)`,
    PAGE.width / 2,
    730,
    { align: "center" },
  );

  // No page number or header on cover
  // Skip footer — don't call addHeaderFooter
};

const buildTocPlaceholder = (ctx: PdfContext): number => {
  newPage(ctx, { suppressHeader: true });
  const { doc } = ctx;
  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR.ink);
  doc.text("TABLE OF CONTENTS", PAGE.width / 2, PAGE.marginTop + 10, {
    align: "center",
  });
  // Placeholder page — we'll render real TOC AT THE END via a second pass
  return PAGE.marginTop + 40;
};

const renderToc = (ctx: PdfContext, tocPageIndex: number) => {
  // Re-render TOC content on its reserved page using ctx.toc
  const { doc } = ctx;
  doc.setPage(tocPageIndex);
  // Clear content area — draw white rect
  doc.setFillColor(255, 255, 255);
  doc.rect(
    0,
    PAGE.marginTop - 10,
    PAGE.width,
    PAGE.height - PAGE.marginTop - PAGE.marginBottom + 20,
    "F",
  );

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR.ink);
  doc.text("TABLE OF CONTENTS", PAGE.width / 2, PAGE.marginTop + 10, {
    align: "center",
  });

  let y = PAGE.marginTop + 50;
  doc.setFontSize(10);

  for (const entry of ctx.toc) {
    if (y > PAGE.height - PAGE.marginBottom - 20) {
      // TOC too long — only first page rendered; we don't currently paginate TOC
      break;
    }
    const indent = entry.level * 14;
    doc.setFont(FONT.serif, entry.level === 0 ? "bold" : "normal");
    doc.setTextColor(...COLOR.ink);

    const title = entry.title;
    const pageStr = String(entry.page);
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.getTextWidth(pageStr);
    const startX = PAGE.marginX + indent;
    const endX = PAGE.width - PAGE.marginX;
    const dotsStart = startX + titleWidth + 4;
    const dotsEnd = endX - pageWidth - 4;

    doc.text(title, startX, y);
    // Dotted leader
    if (dotsEnd > dotsStart) {
      doc.setFont(FONT.serif, "normal");
      doc.setTextColor(...COLOR.muted);
      let dx = dotsStart;
      while (dx < dotsEnd) {
        doc.text(".", dx, y);
        dx += 4;
      }
    }
    doc.setTextColor(...COLOR.ink);
    doc.text(pageStr, endX, y, { align: "right" });

    y += 16;
  }
};

const buildAuditCertificate = (
  ctx: PdfContext,
  report: AuditReportDocument,
  opts: { lgaName?: string },
) => {
  newPage(ctx, { suppressHeader: true });
  drawLetterhead(ctx, { lgaName: opts.lgaName });

  let y = 130;
  y = drawCenteredTitle(ctx, "AUDIT CERTIFICATE", y, { size: 14, bold: true });
  y += 18;

  const addressee = `TO: ${report.addressee.toUpperCase()}`;
  y = drawParagraph(ctx, addressee, y, { size: 10, bold: true });
  y += 8;

  y = drawParagraph(
    ctx,
    report.basisOfOpinion ||
      `The Financial Statements of the Local Government Councils of Lagos State for the year ended ${fmtYearDate(
        new Date().getFullYear() - 1,
      )} have been audited in accordance with the International Public Sector Accounting Standards (IPSAS) Accrual framework and the Lagos State Audit Law.`,
    y,
    { size: 10, align: "justify" },
  );
  y += 10;

  y = drawParagraph(ctx, `OPINION — ${report.opinion.toUpperCase()}`, y, {
    size: 11,
    bold: true,
  });
  y += 6;

  const opinionText: Record<string, string> = {
    Unqualified:
      "In my opinion, the Financial Statements present fairly, in all material respects, the financial position and the financial performance of the Council for the year then ended in accordance with IPSAS Accrual.",
    Qualified:
      "In my opinion, except for the effects of the matters described in the Basis for Qualified Opinion section, the Financial Statements present fairly, in all material respects, the financial position and financial performance of the Council.",
    Adverse:
      "In my opinion, because of the significance of the matters described, the Financial Statements do not present fairly the financial position and financial performance of the Council.",
    Disclaimer:
      "I do not express an opinion on the Financial Statements. Because of the significance of the matters described, I have not been able to obtain sufficient appropriate audit evidence to provide a basis for an audit opinion.",
  };
  y = drawParagraph(ctx, opinionText[report.opinion] || "", y, {
    size: 10,
    align: "justify",
  });
  y += 20;

  // Signatures
  y = drawSignatureBlock(
    ctx,
    report.auditorGeneralSignature,
    y,
    "Auditor-General for Local Governments",
  );
  y = drawSignatureBlock(
    ctx,
    report.auditSupervisorSignature,
    y,
    "Audit Supervisor",
  );
  y = drawSignatureBlock(ctx, report.auditLeadSignature, y, "Audit Lead");
};

const buildReport = (ctx: PdfContext, report: AuditReportDocument) => {
  newPage(ctx, { suppressHeader: true });
  drawLetterhead(ctx);
  let y = 130;

  y = drawCenteredTitle(
    ctx,
    `REPORT OF THE AUDITOR-GENERAL FOR LOCAL GOVERNMENTS`,
    y,
    { size: 13, bold: true },
  );
  y += 6;
  y = drawCenteredTitle(ctx, report.title.toUpperCase(), y, {
    size: 11,
    bold: true,
  });
  y += 20;

  ctx.runningHeader = "REPORT OF THE AUDITOR-GENERAL — LAGOS STATE";

  for (const section of [...report.sections].sort(
    (a, b) => a.order - b.order,
  )) {
    y = ensureSpace(ctx, y, 40);
    // Numbered header
    ctx.doc.setFont(FONT.serif, "bold");
    ctx.doc.setFontSize(11);
    ctx.doc.setTextColor(...COLOR.ink);
    const headerText = `${section.order}. ${section.header.toUpperCase()}`;
    const headerLines = ctx.doc.splitTextToSize(
      headerText,
      PAGE.width - 2 * PAGE.marginX,
    ) as string[];
    for (const line of headerLines) {
      y = ensureSpace(ctx, y, 14);
      ctx.doc.text(line, PAGE.marginX, y);
      y += 14;
    }
    y += 4;

    if (section.description) {
      y = drawParagraph(ctx, section.description, y, {
        size: 10,
        align: "justify",
      });
      y += 4;
    }

    if (section.bullets && section.bullets.length > 0) {
      y = drawBullets(ctx, section.bullets, y);
    }

    if (section.table) {
      y = ensureSpace(ctx, y, 60);
      y = drawTable(ctx, section.table, y);
    }

    if (section.recommendation) {
      y = ensureSpace(ctx, y, 40);
      ctx.doc.setFont(FONT.serif, "bold");
      ctx.doc.setFontSize(10);
      ctx.doc.setTextColor(...COLOR.accent);
      ctx.doc.text("RECOMMENDATION", PAGE.marginX, y);
      y += 14;
      ctx.doc.setTextColor(...COLOR.ink);
      y = drawParagraph(ctx, section.recommendation, y, {
        size: 10,
        align: "justify",
        italic: false,
      });
      y += 10;
    }

    y += 6;
  }
};

const buildStatementOfResponsibility = (
  ctx: PdfContext,
  sor: StatementOfResponsibility,
) => {
  newPage(ctx, { suppressHeader: true });
  drawLetterhead(ctx);
  let y = 130;
  y = drawCenteredTitle(ctx, "STATEMENT OF RESPONSIBILITY", y, {
    size: 14,
    bold: true,
  });
  y += 18;

  if (sor.preamble) {
    y = drawParagraph(ctx, sor.preamble, y, { size: 10, align: "justify" });
    y += 6;
  }
  y = drawParagraph(ctx, sor.responsibilityText, y, {
    size: 10,
    align: "justify",
  });
  y += 30;

  ctx.runningHeader = "STATEMENT OF RESPONSIBILITY";

  // Two signature blocks side by side
  const { doc } = ctx;
  y = ensureSpace(ctx, y, 110);
  const leftX = PAGE.marginX;
  const rightX = PAGE.width / 2 + 10;

  const drawSigAt = (
    sig: SignatureBlock | undefined,
    x: number,
    label: string,
  ) => {
    let yy = y;
    if (sig?.signatureDataUrl) {
      try {
        doc.addImage(sig.signatureDataUrl, "PNG", x, yy - 8, 120, 28);
      } catch {
        // ignore
      }
    }
    yy += 30;
    doc.setDrawColor(...COLOR.ink);
    doc.setLineWidth(0.4);
    doc.line(x, yy, x + 220, yy);
    yy += 12;
    doc.setFont(FONT.serif, "bold");
    doc.setFontSize(10);
    doc.text(sig?.name || "________________________", x, yy);
    yy += 12;
    doc.setFont(FONT.serif, "normal");
    doc.text(sig?.title || label, x, yy);
    if (sig?.signedAt) {
      yy += 12;
      const d = new Date(sig.signedAt);
      doc.text(
        `Date: ${d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`,
        x,
        yy,
      );
    }
  };

  drawSigAt(sor.treasurerSignature, leftX, "Treasurer");
  drawSigAt(sor.auditLeadSignature, rightX, "Audit Lead");
};

const buildAccountingPolicies = (
  ctx: PdfContext,
  policies: AccountingPolicies,
) => {
  newPage(ctx, { suppressHeader: true });
  drawLetterhead(ctx);
  let y = 130;
  y = drawCenteredTitle(ctx, "ACCOUNTING POLICIES", y, {
    size: 14,
    bold: true,
  });
  y = drawCenteredTitle(ctx, `(${policies.framework})`, y + 4, {
    size: 10,
    bold: false,
  });
  y += 24;

  ctx.runningHeader = "ACCOUNTING POLICIES (IPSAS ACCRUAL)";

  for (const p of [...policies.policies].sort((a, b) => a.order - b.order)) {
    y = ensureSpace(ctx, y, 30);
    ctx.doc.setFont(FONT.serif, "bold");
    ctx.doc.setFontSize(10.5);
    ctx.doc.setTextColor(...COLOR.ink);
    ctx.doc.text(`${p.order}. ${p.title}`, PAGE.marginX, y);
    y += 14;
    if (p.body) {
      y = drawParagraph(ctx, p.body, y, {
        size: 10,
        align: "justify",
        indent: 14,
      });
    }
    if (p.bullets && p.bullets.length > 0) {
      y = drawBullets(ctx, p.bullets, y);
    }
    if (p.table) {
      y = ensureSpace(ctx, y, 60);
      y = drawTable(ctx, p.table, y);
    }
    y += 8;
  }

  if (policies.supervisorSignature) {
    y = ensureSpace(ctx, y, 80);
    y = drawSignatureBlock(
      ctx,
      policies.supervisorSignature,
      y,
      "Audit Supervisor",
    );
  }
};

const buildFinancialStatement = (
  ctx: PdfContext,
  fs: FinancialStatement,
  opts: { lgaName?: string } = {},
) => {
  newPage(ctx, { suppressHeader: true });
  drawLetterhead(ctx, { lgaName: opts.lgaName });
  let y = 130;
  y = drawCenteredTitle(ctx, fs.title.toUpperCase(), y, {
    size: 12,
    bold: true,
  });
  y += 16;

  ctx.runningHeader = fs.title.toUpperCase();

  if (fs.kind === "NotesToTheAccounts") {
    // Notes — render note by note with mini-tables
    for (const note of fs.noteRefs || []) {
      y = ensureSpace(ctx, y, 40);
      ctx.doc.setFont(FONT.serif, "bold");
      ctx.doc.setFontSize(11);
      ctx.doc.setTextColor(...COLOR.ink);
      ctx.doc.text(
        `NOTE ${note.noteNumber}: ${note.title.toUpperCase()}`,
        PAGE.marginX,
        y,
      );
      y += 16;
      if (note.body) {
        y = drawParagraph(ctx, note.body, y, { size: 10, align: "justify" });
        y += 4;
      }
      if (note.table) {
        y = ensureSpace(ctx, y, 60);
        y = drawTable(ctx, note.table, y);
      }
      y += 10;
    }
    return;
  }

  // Balance-sheet / performance / cashflow — standardised 4-col table
  // Description | Note | Current Year | Prior Year
  const body = fs.rows.map((r) => {
    const indent = "  ".repeat(r.indent ?? 0);
    const desc = `${indent}${r.description}`;
    const cy = r.isHeader ? "" : fmtN(r.currentYear ?? 0);
    const py = r.isHeader ? "" : fmtN(r.priorYear ?? 0);
    return [desc, r.note ?? "", cy, py];
  });

  autoTable(ctx.doc, {
    startY: y,
    head: [
      [
        { content: "Description", styles: { halign: "left" } },
        { content: "Note", styles: { halign: "center" } },
        {
          content: `${fs.currentYear} (₦)`,
          styles: { halign: "right" },
        },
        {
          content: `${fs.priorYear} (₦)`,
          styles: { halign: "right" },
        },
      ],
    ],
    body,
    theme: "grid",
    styles: {
      font: FONT.serif,
      fontSize: 9,
      cellPadding: 3.5,
      textColor: COLOR.ink,
      lineColor: COLOR.rule,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: COLOR.accent,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: "auto", halign: "left" },
      1: { cellWidth: 40, halign: "center" },
      2: { cellWidth: 110, halign: "right" },
      3: { cellWidth: 110, halign: "right" },
    },
    didParseCell: (data) => {
      const row = fs.rows[data.row.index];
      if (!row) return;
      if (row.isHeader) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = COLOR.band;
      }
      if (row.isSubtotal) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = COLOR.subtle;
      }
    },
    margin: { left: PAGE.marginX, right: PAGE.marginX },
  });

  ctx.pageNumber = ctx.doc.getNumberOfPages();
};

/* ─── LGA section opener page ─── */
const buildLgaSectionOpener = (
  ctx: PdfContext,
  lga: LGA,
  auditYear: number,
) => {
  newPage(ctx, { suppressHeader: true });
  const { doc } = ctx;
  // Soft background band
  doc.setFillColor(...COLOR.subtle);
  doc.rect(0, 0, PAGE.width, PAGE.height, "F");

  // Left accent bar
  doc.setFillColor(...COLOR.accent);
  doc.rect(0, 0, 8, PAGE.height, "F");

  if (ctx.sealImage) {
    try {
      doc.addImage(ctx.sealImage, "PNG", PAGE.width / 2 - 50, 180, 100, 100);
    } catch {
      // ignore
    }
  }

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.muted);
  doc.text(`${lga.councilType ?? "LGA"}`.toUpperCase(), PAGE.width / 2, 320, {
    align: "center",
  });

  doc.setFont(FONT.serif, "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLOR.ink);
  doc.text(lga.name.toUpperCase(), PAGE.width / 2, 360, { align: "center" });

  doc.setFont(FONT.serif, "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLOR.muted);
  doc.text(`LOCAL GOVERNMENT COUNCIL`, PAGE.width / 2, 388, {
    align: "center",
  });

  doc.setDrawColor(...COLOR.accent);
  doc.setLineWidth(1.2);
  doc.line(PAGE.width / 2 - 50, 410, PAGE.width / 2 + 50, 410);

  doc.setFont(FONT.serif, "italic");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.ink);
  doc.text(`AUDITED FINANCIAL STATEMENTS`, PAGE.width / 2, 440, {
    align: "center",
  });
  doc.text(
    `FOR THE YEAR ENDED ${fmtYearDate(auditYear)}`,
    PAGE.width / 2,
    458,
    { align: "center" },
  );
};

/* ─── Public API ─── */

export interface GeneratePdfArgs {
  outcome: AuditOutcome;
  consolidated: {
    auditReport: AuditReportDocument;
    statementOfResponsibility: StatementOfResponsibility;
    accountingPolicies: AccountingPolicies;
    sofp: FinancialStatement;
    sofPerf: FinancialStatement;
    cashFlow: FinancialStatement;
    notes: FinancialStatement;
  };
  lgaPackages: LgaAuditPackage[];
  lgasById: Record<string, LGA>;
  sealImageDataUrl?: string;
  fileName?: string;
}

export async function generateAuditOutcomePdf(
  args: GeneratePdfArgs,
): Promise<Blob> {
  const doc = new jsPDF({
    unit: "pt",
    format: "letter",
    orientation: "portrait",
    compress: true,
  });

  const ctx: PdfContext = {
    doc,
    pageNumber: 1,
    toc: [],
    sealImage: args.sealImageDataUrl,
  };

  /* 1. Cover */
  buildCoverPage(ctx, args.outcome, {
    subtitle: "Consolidated and Local Government Council Reports",
  });

  /* 2. TOC placeholder — we'll fill it in after we know page numbers */
  const tocPageIndex = doc.getNumberOfPages() + 1;
  buildTocPlaceholder(ctx);

  /* 3. Audit Certificate (Consolidated) */
  ctx.toc.push({
    title: "Audit Certificate",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildAuditCertificate(ctx, args.consolidated.auditReport, {});

  /* 4. Report of the AG */
  ctx.toc.push({
    title: "Report of the Auditor-General",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildReport(ctx, args.consolidated.auditReport);

  /* 5. Statement of Responsibility */
  ctx.toc.push({
    title: "Statement of Responsibility",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildStatementOfResponsibility(
    ctx,
    args.consolidated.statementOfResponsibility,
  );

  /* 6. Accounting Policies */
  ctx.toc.push({
    title: "Accounting Policies (IPSAS Accrual)",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildAccountingPolicies(ctx, args.consolidated.accountingPolicies);

  /* 7-10. Consolidated Financial Statements */
  ctx.toc.push({
    title: "Consolidated Statement of Financial Position",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildFinancialStatement(ctx, args.consolidated.sofp);

  ctx.toc.push({
    title: "Consolidated Statement of Financial Performance",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildFinancialStatement(ctx, args.consolidated.sofPerf);

  ctx.toc.push({
    title: "Consolidated Cash Flow Statement",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildFinancialStatement(ctx, args.consolidated.cashFlow);

  ctx.toc.push({
    title: "Notes to the Accounts",
    page: ctx.pageNumber + 1,
    level: 0,
  });
  buildFinancialStatement(ctx, args.consolidated.notes);

  /* 11. Per-LGA sections */
  for (const pkg of args.lgaPackages.filter((p) => p.included)) {
    const lga = args.lgasById[pkg.lgaId];
    if (!lga) continue;

    ctx.toc.push({
      title: `${lga.name} ${lga.councilType ?? "LGA"}`,
      page: ctx.pageNumber + 1,
      level: 0,
    });

    buildLgaSectionOpener(ctx, lga, args.outcome.auditYear);

    if (pkg.report) {
      ctx.toc.push({
        title: `— Audit Certificate`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildAuditCertificate(ctx, pkg.report, { lgaName: lga.name });

      ctx.toc.push({
        title: `— Audit Report`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildReport(ctx, pkg.report);
    }
    if (pkg.sofp) {
      ctx.toc.push({
        title: `— Statement of Financial Position`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildFinancialStatement(ctx, pkg.sofp, { lgaName: lga.name });
    }
    if (pkg.sofp_performance) {
      ctx.toc.push({
        title: `— Statement of Financial Performance`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildFinancialStatement(ctx, pkg.sofp_performance, { lgaName: lga.name });
    }
    if (pkg.cashFlow) {
      ctx.toc.push({
        title: `— Cash Flow Statement`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildFinancialStatement(ctx, pkg.cashFlow, { lgaName: lga.name });
    }
    if (pkg.notes) {
      ctx.toc.push({
        title: `— Notes to the Accounts`,
        page: ctx.pageNumber + 1,
        level: 1,
      });
      buildFinancialStatement(ctx, pkg.notes, { lgaName: lga.name });
    }
  }

  /* 12. Render TOC on reserved page */
  renderToc(ctx, tocPageIndex);

  const blob = doc.output("blob");
  return blob;
}

/* ─── Utility to convert File/Image URL to data URL (for seal logo) ─── */
export async function imageUrlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
