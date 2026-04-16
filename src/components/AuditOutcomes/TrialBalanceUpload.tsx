/* ==================================================================
   TrialBalanceUpload
   Drag-drop upload for two unaudited trial balance files
   (current-year and prior-year comparative) with SheetJS parsing.
   ================================================================== */

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  parseTrialBalanceFile,
  buildTrialBalance,
  type ParseResult,
} from "../../utils/excelParser";
import type { TrialBalance } from "../../types/auditOutcomes";

interface TrialBalanceUploadProps {
  auditOutcomeId: string;
  auditId: string;
  userId: string;
  currentYear: number;
  priorYear: number;
  existing?: TrialBalance;
  onUploaded: (tb: TrialBalance) => void;
  onReset: () => void;
  onProceed?: () => void;
  disabled?: boolean;
}

const fmtCurrency = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const TrialBalanceUpload: React.FC<TrialBalanceUploadProps> = ({
  auditOutcomeId,
  auditId,
  userId,
  currentYear,
  priorYear,
  existing,
  onUploaded,
  onReset,
  onProceed,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [previewParse, setPreviewParse] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = async (file: File) => {
    setError("");
    setWarnings([]);
    setParsing(true);
    try {
      const res = await parseTrialBalanceFile(file);
      setPreviewParse(res);
      setWarnings(res.warnings);
      setFileName(file.name);

      const tb = buildTrialBalance({
        auditOutcomeId,
        auditId,
        currentYear,
        priorYear,
        fileName: file.name,
        uploadedBy: userId,
        parseResult: res,
      });
      onUploaded(tb);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not parse this file",
      );
    } finally {
      setParsing(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const hasData = !!existing;

  return (
    <div>
      {!hasData && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#064e3b" : "#cbd5e1"}`,
            borderRadius: 8,
            padding: "2.25rem 1.5rem",
            textAlign: "center",
            background: dragOver ? "#ecfdf5" : "#f8fafc",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={onInputChange}
            disabled={disabled}
          />
          <UploadCloud
            size={36}
            color={dragOver ? "#064e3b" : "#64748b"}
            style={{ marginBottom: 10 }}
          />
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0f172a",
              marginBottom: 6,
            }}
          >
            Upload Unaudited Trial Balance
          </div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 8 }}>
            Drag &amp; drop an{" "}
            <strong>
              .xlsx containing both {currentYear} and {priorYear} columns
            </strong>
            , or click to browse
          </div>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            Expected columns: NCOA Code · Account · {currentYear} · {priorYear}
          </div>
          {parsing && (
            <div style={{ marginTop: 12, color: "#064e3b", fontSize: "0.8rem" }}>
              Parsing workbook…
            </div>
          )}
          {error && (
            <div
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#dc2626",
                fontSize: "0.8rem",
              }}
            >
              <AlertTriangle size={14} /> {error}
            </div>
          )}
        </div>
      )}

      {hasData && (
        <div>
          {/* File chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0.75rem 1rem",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              background: "#f0fdf4",
              marginBottom: "1.25rem",
            }}
          >
            <FileSpreadsheet size={22} color="#15803d" />
            <div style={{ flex: 1 }}>
              <div
                style={{ fontWeight: 600, fontSize: "0.88rem", color: "#14532d" }}
              >
                {existing.fileName}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#166534" }}>
                {existing.lines.length} account lines parsed · Uploaded{" "}
                {new Date(existing.uploadedAt).toLocaleDateString()}
              </div>
            </div>
            <CheckCircle2 size={20} color="#16a34a" />
            {!disabled && (
              <button
                type="button"
                onClick={onReset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "0.35rem 0.6rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  background: "#ffffff",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={12} /> Replace
              </button>
            )}
          </div>

          {/* Summary tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: "1.25rem",
            }}
          >
            <SummaryTile
              label="Total Revenue"
              value={fmtCurrency(existing.totalRevenue)}
              tone="sky"
            />
            <SummaryTile
              label="Total Expenditure"
              value={fmtCurrency(existing.totalExpenditure)}
              tone="amber"
            />
            <SummaryTile
              label="Profit Before Tax"
              value={fmtCurrency(existing.profitBeforeTax)}
              tone="green"
              highlight
            />
            <SummaryTile
              label="Total Assets"
              value={fmtCurrency(existing.totalAssets)}
              tone="slate"
            />
            <SummaryTile
              label="Total Liabilities"
              value={fmtCurrency(existing.totalLiabilities)}
              tone="rose"
            />
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div
              style={{
                padding: "0.7rem 0.85rem",
                border: "1px solid #fde68a",
                background: "#fffbeb",
                color: "#92400e",
                borderRadius: 6,
                fontSize: "0.8rem",
                marginBottom: "1.25rem",
              }}
            >
              <strong style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <AlertTriangle size={14} /> Parse notes
              </strong>
              <ul style={{ margin: "0.35rem 0 0 1.1rem" }}>
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview table */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              overflow: "hidden",
              marginBottom: "1.25rem",
              maxHeight: 380,
              overflowY: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#f1f5f9",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th style={th}>NCOA</th>
                  <th style={{ ...th, textAlign: "left" }}>Account</th>
                  <th style={{ ...th, textAlign: "right" }}>
                    {currentYear} (₦)
                  </th>
                  <th style={{ ...th, textAlign: "right" }}>{priorYear} (₦)</th>
                  <th style={{ ...th, textAlign: "right" }}>Variance</th>
                  <th style={th}>Class</th>
                </tr>
              </thead>
              <tbody>
                {existing.lines.slice(0, 200).map((line) => (
                  <tr key={line.id}>
                    <td style={td}>{line.ncoaCode || "—"}</td>
                    <td style={{ ...td, textAlign: "left" }}>
                      {line.accountName}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {line.currentYear.toLocaleString("en-NG")}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {line.priorYear.toLocaleString("en-NG")}
                    </td>
                    <td
                      style={{
                        ...td,
                        textAlign: "right",
                        color:
                          line.variance > 0
                            ? "#15803d"
                            : line.variance < 0
                              ? "#dc2626"
                              : "#64748b",
                      }}
                    >
                      {line.variancePct > 0 ? "+" : ""}
                      {line.variancePct.toFixed(1)}%
                    </td>
                    <td style={td}>{line.classification}</td>
                  </tr>
                ))}
                {existing.lines.length > 200 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        ...td,
                        textAlign: "center",
                        color: "#64748b",
                        fontStyle: "italic",
                      }}
                    >
                      Showing 200 of {existing.lines.length} lines
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {onProceed && !disabled && (
            <button
              type="button"
              onClick={onProceed}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "0.6rem 1rem",
                background: "#064e3b",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue to Materiality <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Silence unused-vars — kept for API parity */}
      {fileName && null}
      {previewParse && null}
    </div>
  );
};

const SummaryTile: React.FC<{
  label: string;
  value: string;
  tone: "sky" | "amber" | "green" | "slate" | "rose";
  highlight?: boolean;
}> = ({ label, value, tone, highlight }) => {
  const palette: Record<string, { bg: string; border: string; text: string }> = {
    sky: { bg: "#f0f9ff", border: "#bae6fd", text: "#075985" },
    amber: { bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d" },
    slate: { bg: "#f8fafc", border: "#e2e8f0", text: "#334155" },
    rose: { bg: "#fff1f2", border: "#fecdd3", text: "#9f1239" },
  };
  const c = palette[tone];
  return (
    <div
      style={{
        padding: "0.85rem 1rem",
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        background: c.bg,
        boxShadow: highlight ? `0 0 0 2px ${c.border}` : undefined,
      }}
    >
      <div
        style={{
          fontSize: "0.68rem",
          textTransform: "uppercase",
          color: c.text,
          letterSpacing: "0.05em",
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: c.text }}>
        {value}
      </div>
    </div>
  );
};

const th: React.CSSProperties = {
  padding: "0.5rem 0.65rem",
  textAlign: "center",
  fontWeight: 600,
  fontSize: "0.72rem",
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "0.4rem 0.65rem",
  textAlign: "center",
  borderBottom: "1px solid #f1f5f9",
  whiteSpace: "nowrap",
};

export default TrialBalanceUpload;
