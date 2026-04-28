import React, { useState, useEffect, useRef } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, PreliminaryAnalytic } from "../../../types";
import { FileText, Check, Save, Sparkles, Layers } from "lucide-react";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import { type ArDocType } from "../constants";
import { fmtCurrency } from "../utils/format";
import {
  MOCK_FS,
  MOCK_TB,
  MOCK_TB_REVENUE_BASIS,
  AR_FS_SECTIONS,
  AR_FS_LABELS,
  AR_TB_SECTIONS,
  AR_TB_LABELS,
  type ArRow,
} from "../arMockData";

const arFmt = (n: number) =>
  n === 0
    ? "—"
    : "₦" +
      Math.abs(n).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
const arFmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

// ─── Analytical Review Step — Progressive Reveal ─────────────────────────────
const AnalyticalReviewStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  analytics: PreliminaryAnalytic[];
  materialityData: AuditStore["materiality"][0] | undefined;
  store: AuditStore;
  user: User;
  arDocType: ArDocType | null;
  setArDocType: (v: ArDocType | null) => void;
  arPhase: "select" | "imported";
  setArPhase: (v: "select" | "imported") => void;
}> = ({
  audit,
  lgaName,
  materialityData,
  store,
  user,
  arDocType,
  setArDocType,
  arPhase,
  setArPhase,
}) => {
  const phase = arPhase;
  const setPhase = setArPhase;
  const docType = arDocType;
  const setDocType = setArDocType;
  const [isLoading, setIsLoading] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleImport = () => {
    if (!docType) return;
    setIsLoading(true);
    setLoadProgress(0);
    progressRef.current = setInterval(() => {
      setLoadProgress((p) => {
        if (p >= 92) {
          clearInterval(progressRef.current!);
          return 92;
        }
        return p + Math.random() * 14;
      });
    }, 180);
    loadTimerRef.current = setTimeout(() => {
      clearInterval(progressRef.current!);
      setLoadProgress(100);
      setTimeout(() => {
        store.setAuditDocSource(audit.id, docType);
        setPhase("imported");
        setInnerTab("analytics");
        setViewMode("table");
        setIsLoading(false);
        setLoadProgress(0);
      }, 300);
    }, 2000);
  };
  const [innerTab, setInnerTab] = useState<"analytics" | "materiality">(
    "analytics",
  );
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");
  const [subjectivePct, setSubjectivePct] = useState(10);
  const [specialItems, setSpecialItems] = useState<Set<string>>(
    new Set<string>(),
  );

  const toggleSpecial = (id: string) =>
    setSpecialItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // LGA code prefix — first 2 letters of first word, uppercase
  const lgaPrefix = lgaName.replace(/\s.*/, "").slice(0, 2).toUpperCase();

  // ── Materiality state — basis is fixed as Profit Before Tax (PBT) ──
  const FIXED_BASIS = "Profit Before Tax (PBT)";
  const [basisAmount, setBasisAmount] = useState(
    materialityData?.basisAmount || MOCK_TB_REVENUE_BASIS,
  );
  const [percentage, setPercentage] = useState(
    materialityData?.percentage || 5,
  );
  const [perfPct, setPerfPct] = useState(
    materialityData
      ? Math.round(
          (materialityData.performanceMateriality /
            materialityData.overallMateriality) *
            100,
        )
      : 70,
  );
  const overallMateriality = Math.round(basisAmount * (percentage / 100));
  const performanceMateriality = Math.round(
    overallMateriality * (perfPct / 100),
  );
  const trivialThreshold = Math.round(overallMateriality * 0.05);

  const handleSaveMat = () => {
    store.setAuditMateriality({
      auditId: audit.id,
      basis: FIXED_BASIS,
      basisAmount,
      percentage,
      overallMateriality,
      performanceMateriality,
      clearlyTrivialThreshold: trivialThreshold,
      preparedBy: user.id,
    });
    store.logActivity({
      userId: user.id,
      action: "SET_MATERIALITY",
      details: `Materiality set: ${fmtCurrency(overallMateriality)} (${percentage}% of ${FIXED_BASIS})`,
      entityType: "audit",
      entityId: audit.id,
    });
  };

  // ── Phase 1: Document selection cards ────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className={s.card} style={{ position: "relative" }}>
        <div className={s.cardHeader}>
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
              <Layers size={20} />
            </div>
            <div>
              <h3 className={s.cardTitle} style={{ margin: 0 }}>
                Import Financial Document for Analysis
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  color: "var(--text-3)",
                  marginTop: "0.1rem",
                }}
              >
                ISA 520 — Select the document type uploaded by the Head of Local
                Government
              </p>
            </div>
          </div>
        </div>
        <div className={s.cardBody}>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-2)",
              marginBottom: "1.75rem",
              lineHeight: 1.7,
            }}
          >
            The following documents have been uploaded by the Head of Local
            Government. Select a document type to import — each package contains
            both the <strong>Current Year (Unaudited)</strong> and{" "}
            <strong>Prior Year (Audited)</strong> figures.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {(["fs", "tb"] as const).map((type) => {
              const isFS = type === "fs";
              const active = docType === type;
              const cyCode = `${lgaPrefix}-${isFS ? "FS" : "TB"}-CY-2022`;
              const pyCode = `${lgaPrefix}-${isFS ? "FS" : "TB"}-PY-2021`;
              return (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    border: `2px solid ${active ? "#2563eb" : "#e2e8f0"}`,
                    borderRadius: "14px",
                    padding: "1.75rem",
                    background: active ? "#eff6ff" : "white",
                    boxShadow: active
                      ? "0 0 0 4px rgba(37,99,235,0.1)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.15s",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: active ? "#dbeafe" : "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: active ? "#1d4ed8" : "#64748b",
                        flexShrink: 0,
                      }}
                    >
                      {isFS ? <FileText size={24} /> : <Layers size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#0f172a",
                        }}
                      >
                        {isFS ? "Financial Statements" : "Trial Balance"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginTop: "0.2rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {isFS
                          ? "IPSAS — Statement of Receipts, Payments & Balance Sheet"
                          : "General Ledger — Full Chart of Accounts Summary"}
                      </div>
                    </div>
                    {active && (
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={14} style={{ color: "white" }} />
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {[
                      {
                        label: "FY 2022 — Current Year (Unaudited / Draft)",
                        icon: "📄",
                        note: "Uploaded by HLG",
                        code: cyCode,
                      },
                      {
                        label: "FY 2021 — Prior Year (Audited)",
                        icon: "✅",
                        note: "Verified & signed",
                        code: pyCode,
                      },
                    ].map((doc) => (
                      <div
                        key={doc.code}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.6rem 0.875rem",
                          borderRadius: "8px",
                          background: active
                            ? "rgba(37,99,235,0.07)"
                            : "#f8fafc",
                          border: `1px solid ${active ? "#bfdbfe" : "#e2e8f0"}`,
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>{doc.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            {doc.label}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                            {doc.note}
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: active ? "#1d4ed8" : "#94a3b8",
                            background: active ? "#dbeafe" : "#f1f5f9",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className={s.btnPrimary}
              disabled={!docType || isLoading}
              onClick={handleImport}
              style={{
                opacity: docType && !isLoading ? 1 : 0.45,
                cursor: docType && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              <Sparkles size={14} /> Import to Analyse
            </button>
          </div>

          {isLoading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#2563eb",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>
                  {docType === "fs" ? "Importing Financial Statements…" : "Importing Trial Balance…"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>
                  Parsing CY & PY figures for analytical review
                </div>
              </div>
              <div style={{ width: "220px", background: "#e2e8f0", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(loadProgress, 100)}%`,
                    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                    borderRadius: "99px",
                    transition: "width 0.18s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                {Math.round(Math.min(loadProgress, 100))}%
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Phase 2: Analytics + Materiality (inner tabs) ────────────────────────────
  const isFS = docType === "fs";
  const data = isFS ? MOCK_FS : MOCK_TB;
  const sections = isFS ? AR_FS_SECTIONS : AR_TB_SECTIONS;
  const secLabels = isFS ? AR_FS_LABELS : AR_TB_LABELS;
  const docLabel = isFS ? "Financial Statements" : "Trial Balance";

  const grouped: Record<string, ArRow[]> = {};
  data.forEach((row) => {
    if (!grouped[row.section]) grouped[row.section] = [];
    grouped[row.section].push(row);
  });

  // Chart groups — top 5 line items per financial category
  const FS_CHART_GROUPS = [
    {
      label: "Top Revenue / Expected",
      color: "#2563eb",
      sections: ["stat_allocation", "indep_revenue"],
    },
    {
      label: "Top Assets",
      color: "#16a34a",
      sections: ["current_assets", "noncurrent_assets"],
    },
    {
      label: "Top Liabilities",
      color: "#dc2626",
      sections: ["current_liab", "noncurrent_liab"],
    },
    {
      label: "Expenditure",
      color: "#d97706",
      sections: ["recurrent_exp", "capital_exp"],
    },
  ];
  const TB_CHART_GROUPS = [
    { label: "Top Revenue", color: "#2563eb", sections: ["revenue"] },
    { label: "Personnel Costs", color: "#dc2626", sections: ["personnel"] },
    { label: "Overhead Costs", color: "#d97706", sections: ["overhead"] },
    { label: "Capital Expenditure", color: "#7c3aed", sections: ["capital"] },
  ];
  const chartGroups = (isFS ? FS_CHART_GROUPS : TB_CHART_GROUPS)
    .map((group) => ({
      ...group,
      items: group.sections
        .flatMap((sec) =>
          data.filter((r) => r.section === sec && r.type === "line"),
        )
        .sort((a, b) => Math.abs(b.current) - Math.abs(a.current))
        .map((r) => ({
          label: r.account,
          cy: Math.abs(r.current),
          py: Math.abs(r.prior),
        })),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Inner tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        {(["analytics", "materiality"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setInnerTab(tab)}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "0.75rem 1.75rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: innerTab === tab ? "#2563eb" : "#64748b",
              borderBottom:
                innerTab === tab
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
              marginBottom: "-2px",
              transition: "all 0.15s",
            }}
          >
            {tab === "analytics" ? "Analytics" : "Materiality"}
          </button>
        ))}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            paddingBottom: "0.6rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Imported: <strong style={{ color: "#0f172a" }}>{docLabel}</strong>
          </span>
          <button
            className={s.btnSecondary}
            style={{ fontSize: "0.72rem", padding: "0.25rem 0.7rem" }}
            onClick={() => setPhase("select")}
          >
            Change
          </button>
        </div>
      </div>

      {/* ── Analytics Tab ── */}
      {innerTab === "analytics" && (
        <div className={s.card}>
          <div
            className={s.cardHeader}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <h3 className={s.cardTitle} style={{ margin: 0 }}>
                Year-on-Year Analytical Review
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  color: "var(--text-3)",
                  marginTop: "0.1rem",
                }}
              >
                ISA 520 — Comparing FY 2022 (Current Year) against FY 2021
                (Prior Year) for {lgaName}
              </p>
            </div>

            {/* Table / Charts toggle pill */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                borderRadius: "8px",
                padding: "3px",
                gap: "2px",
              }}
            >
              {(["table", "charts"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "0.35rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    background: viewMode === mode ? "white" : "transparent",
                    color: viewMode === mode ? "#0f172a" : "#64748b",
                    boxShadow:
                      viewMode === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {mode === "table" ? "Table" : "Charts"}
                </button>
              ))}
            </div>
          </div>

          <div className={s.cardBody}>
            {/* ── Table View ── */}
            {viewMode === "table" && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.5rem",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        PY 2021 (₦)
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        CY 2022 (₦)
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.75rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Variance
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.75rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Delta %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections
                      .filter((sec) => grouped[sec])
                      .map((section) => (
                        <React.Fragment key={section}>
                          <tr>
                            <td
                              colSpan={6}
                              style={{
                                padding: "0.6rem 1rem",
                                background: "#f1f5f9",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#334155",
                                borderTop: "2px solid #e2e8f0",
                              }}
                            >
                              {secLabels[section] ?? section}
                            </td>
                          </tr>
                          {grouped[section]
                            .filter((row) => row.type === "line")
                            .map((row) => {
                              const variance = row.current - row.prior;
                              const pct =
                                row.prior !== 0
                                  ? (variance / Math.abs(row.prior)) * 100
                                  : 0;
                              const flagged = !row.bold && Math.abs(pct) >= 10;
                              return (
                                <tr
                                  key={row.id}
                                  style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background: row.bold ? "#fafbfe" : "white",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      fontWeight: row.bold ? 700 : 500,
                                      color: row.bold
                                        ? "#0f172a"
                                        : "var(--text)",
                                      paddingLeft: row.bold
                                        ? "1rem"
                                        : "1.75rem",
                                    }}
                                  >
                                    {row.account}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.5rem",
                                      textAlign: "center",
                                      fontFamily: "monospace",
                                      fontSize: "0.72rem",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    {row.code
                                      ? `${lgaPrefix}-${row.code}`
                                      : "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      color: "#475569",
                                    }}
                                  >
                                    {arFmt(row.prior)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      fontWeight: row.bold ? 800 : 600,
                                      color: "#0f172a",
                                    }}
                                  >
                                    {arFmt(row.current)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 0.75rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      color:
                                        variance >= 0 ? "#059669" : "#dc2626",
                                    }}
                                  >
                                    {row.current === 0 && row.prior === 0
                                      ? "—"
                                      : (variance >= 0 ? "+" : "") +
                                        arFmt(variance)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 0.75rem",
                                      textAlign: "right",
                                    }}
                                  >
                                    {row.current === 0 && row.prior === 0 ? (
                                      <span
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        —
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          fontFamily: "monospace",
                                          fontSize: "0.8rem",
                                          fontWeight: 700,
                                          color: flagged
                                            ? "#dc2626"
                                            : row.bold
                                              ? "#0f172a"
                                              : "#475569",
                                        }}
                                      >
                                        {arFmtPct(pct)}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Charts View ── */}
            {viewMode === "charts" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* ── Top-item summary cards (one per group) ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(chartGroups.length, 4)}, 1fr)`,
                    gap: "0.75rem",
                  }}
                >
                  {chartGroups.map((group) => {
                    const top = group.items[0];
                    if (!top) return null;
                    const variance = top.cy - top.py;
                    const up = variance >= 0;
                    const delta = top.py > 0 ? (variance / top.py) * 100 : 0;
                    return (
                      <div
                        key={group.label}
                        style={{
                          padding: "0.875rem 1rem",
                          borderRadius: "8px",
                          background: "#f8fafc",
                          border: `1px solid ${group.color}40`,
                          borderLeft: `4px solid ${group.color}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginBottom: "0.45rem",
                          }}
                        >
                          <span
                            style={{
                              padding: "0.15rem 0.55rem",
                              borderRadius: "10px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              background: group.color,
                              color: "white",
                            }}
                          >
                            {group.label}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "0 0 0.3rem 0",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#0f172a",
                            lineHeight: 1.4,
                          }}
                        >
                          {top.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.74rem",
                            color: "#475569",
                            lineHeight: 1.4,
                          }}
                        >
                          CY:{" "}
                          <strong style={{ color: group.color }}>
                            {arFmt(top.cy)}
                          </strong>
                          {"  "}
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color: up ? "#166534" : "#b91c1c",
                            }}
                          >
                            {up ? "Up" : "Down"} {arFmtPct(Math.abs(delta))}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* ── Full comparison panels ── */}
                {chartGroups.map((group) => {
                  const groupMax = Math.max(
                    ...group.items.map((i) => Math.max(i.cy, i.py)),
                    1,
                  );
                  return (
                    <div
                      key={group.label}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      {/* Group header */}
                      <div
                        style={{
                          padding: "0.65rem 1.25rem",
                          borderBottom: "2px solid #e2e8f0",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: group.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            color: "#0f172a",
                          }}
                        >
                          {group.label}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "#94a3b8",
                            marginLeft: "auto",
                          }}
                        >
                          {group.items.length} item
                          {group.items.length !== 1 ? "s" : ""} · CY vs PY
                        </span>
                      </div>
                      {/* Items */}
                      <div
                        style={{
                          padding: "0.85rem 1.25rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {group.items.map((item, idx) => {
                          const cyPct =
                            groupMax > 0 ? (item.cy / groupMax) * 100 : 0;
                          const pyPct =
                            groupMax > 0 ? (item.py / groupMax) * 100 : 0;
                          const variance = item.cy - item.py;
                          const delta =
                            item.py > 0 ? (variance / item.py) * 100 : 0;
                          const up = variance >= 0;
                          const isLast = idx === group.items.length - 1;
                          return (
                            <div
                              key={item.label}
                              style={{
                                paddingBottom: isLast ? 0 : "0.65rem",
                                borderBottom: isLast
                                  ? "none"
                                  : "1px solid #f1f5f9",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "0.35rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    color: "#334155",
                                    flex: 1,
                                    paddingRight: "0.5rem",
                                  }}
                                >
                                  {item.label}
                                </span>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.71rem",
                                      color: "#64748b",
                                    }}
                                  >
                                    CY:{" "}
                                    <strong style={{ color: "#0f172a" }}>
                                      {arFmt(item.cy)}
                                    </strong>
                                  </span>
                                  <span
                                    style={{
                                      padding: "0.1rem 0.4rem",
                                      borderRadius: "8px",
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      background: up ? "#dcfce7" : "#fee2e2",
                                      color: up ? "#166534" : "#b91c1c",
                                    }}
                                  >
                                    {up ? "Up" : "Down"}{" "}
                                    {arFmtPct(Math.abs(delta))}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.28rem",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      color: "#94a3b8",
                                      width: "40px",
                                      textAlign: "right",
                                      flexShrink: 0,
                                    }}
                                  >
                                    PY
                                  </span>
                                  <div
                                    style={{
                                      flex: 1,
                                      height: "8px",
                                      background: "#e2e8f0",
                                      borderRadius: "4px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${pyPct}%`,
                                        height: "100%",
                                        background: "#94a3b8",
                                        borderRadius: "4px",
                                        transition: "width 0.4s",
                                      }}
                                    />
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "0.68rem",
                                      fontFamily: "monospace",
                                      color: "#64748b",
                                      width: "100px",
                                      flexShrink: 0,
                                      textAlign: "right",
                                    }}
                                  >
                                    {arFmt(item.py)}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      color: group.color,
                                      fontWeight: 700,
                                      width: "40px",
                                      textAlign: "right",
                                      flexShrink: 0,
                                    }}
                                  >
                                    CY
                                  </span>
                                  <div
                                    style={{
                                      flex: 1,
                                      height: "8px",
                                      background: "#e2e8f0",
                                      borderRadius: "4px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${cyPct}%`,
                                        height: "100%",
                                        background: group.color,
                                        borderRadius: "4px",
                                        transition: "width 0.4s",
                                      }}
                                    />
                                  </div>
                                  <span
                                    style={{
                                      fontSize: "0.68rem",
                                      fontFamily: "monospace",
                                      color: "#0f172a",
                                      fontWeight: 700,
                                      width: "100px",
                                      flexShrink: 0,
                                      textAlign: "right",
                                    }}
                                  >
                                    {arFmt(item.cy)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Materiality Tab ── */}
      {innerTab === "materiality" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <PlanningCard
            title="Materiality Determination"
            subtitle="ISA 320 - Materiality in Planning and Performing an Audit"
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                marginBottom: "1.5rem",
                fontSize: "0.82rem",
                color: "#1e40af",
                lineHeight: 1.6,
              }}
            >
              Materiality is the magnitude of misstatements that, individually
              or in aggregate, could reasonably be expected to influence the
              economic decisions of users. The auditor sets materiality at both
              the overall and performance levels.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              {/* Left: inputs */}
              <div>
                {/* Fixed basis — no dropdown */}
                <div
                  className={s.formGroup}
                  style={{ marginBottom: "1.25rem" }}
                >
                  <label className={s.formLabel}>Benchmark / Basis</label>
                  <div
                    style={{
                      padding: "0.55rem 0.875rem",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#2563eb",
                        flexShrink: 0,
                      }}
                    />
                    {FIXED_BASIS}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                      }}
                    >
                      Fixed
                    </span>
                  </div>
                </div>
                <div
                  className={s.formGroup}
                  style={{ marginBottom: "1.25rem" }}
                >
                  <label className={s.formLabel}>Basis Amount (₦)</label>
                  <input
                    type="number"
                    className={s.formInput}
                    value={basisAmount}
                    onChange={(e) => setBasisAmount(Number(e.target.value))}
                  />
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {fmtCurrency(basisAmount)}
                  </div>
                </div>
                <div
                  className={s.formGroup}
                  style={{ marginBottom: "1.25rem" }}
                >
                  <label className={s.formLabel}>
                    Materiality Percentage (%)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="range"
                      min={0.5}
                      max={5}
                      step={0.25}
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-3)",
                      marginTop: "0.15rem",
                    }}
                  >
                    Typical range: 1-2% for revenue/expenditure, 2-5% for assets
                  </div>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>
                    Performance Materiality (%)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="range"
                      min={50}
                      max={90}
                      step={5}
                      value={perfPct}
                      onChange={(e) => setPerfPct(Number(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      {perfPct}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-3)",
                      marginTop: "0.15rem",
                    }}
                  >
                    Set lower (50-60%) for higher-risk entities; higher (75-85%)
                    for lower-risk
                  </div>
                </div>
              </div>

              {/* Right: outputs */}
              <div>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "2px solid #bbf7d0",
                    borderRadius: "6px",
                    padding: "1.5rem",
                    textAlign: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#166534",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Overall Materiality
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#064e3b",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {fmtCurrency(overallMateriality)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#166534",
                      marginTop: "0.25rem",
                    }}
                  >
                    {percentage}% of {FIXED_BASIS} ({fmtCurrency(basisAmount)})
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "6px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#1e40af",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Performance Materiality
                    </div>
                    <div
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        color: "#1e3a8a",
                      }}
                    >
                      {fmtCurrency(performanceMateriality)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#3b82f6" }}>
                      {perfPct}% of overall
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "6px",
                      background: "#fefce8",
                      border: "1px solid #fde68a",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#92400e",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Clearly Trivial
                    </div>
                    <div
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        color: "#78350f",
                      }}
                    >
                      {fmtCurrency(trivialThreshold)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#d97706" }}>
                      5% of overall
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1.25rem",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    background: "#f8fafc",
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                    color: "var(--text-2)",
                  }}
                >
                  <strong>Interpretation:</strong> Misstatements individually
                  exceeding <strong>{fmtCurrency(overallMateriality)}</strong>{" "}
                  are considered material. Audit procedures are designed to
                  detect misstatements exceeding{" "}
                  <strong>{fmtCurrency(performanceMateriality)}</strong>. Items
                  below <strong>{fmtCurrency(trivialThreshold)}</strong> are
                  deemed clearly trivial and will not be accumulated.
                </div>
              </div>
            </div>
          </PlanningCard>

          {/* ── Selection Criteria & Substantive Testing Items ── */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <div>
                <h3 className={s.cardTitle} style={{ margin: 0 }}>
                  Items Selected for Substantive Testing
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.78rem",
                    color: "var(--text-3)",
                    marginTop: "0.1rem",
                  }}
                >
                  ISA 520 — Criteria-based selection from {docLabel}
                </p>
              </div>
            </div>
            <div className={s.cardBody}>
              {/* Selection Criteria Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* Performance card */}
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.15rem 0.55rem",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: "#2563eb",
                        color: "white",
                      }}
                    >
                      Performance
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#1e40af",
                      }}
                    >
                      Auto
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      color: "#334155",
                      lineHeight: 1.5,
                    }}
                  >
                    CY value exceeds Performance Materiality (
                    {fmtCurrency(performanceMateriality)}). Auto-assigned.
                  </p>
                </div>

                {/* Subjective card */}
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.15rem 0.55rem",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: "#d97706",
                        color: "white",
                      }}
                    >
                      Subjective
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#92400e",
                      }}
                    >
                      Auto
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      color: "#334155",
                      lineHeight: 1.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Any item where absolute % variance exceeds threshold below.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#78350f",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Threshold:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      value={subjectivePct}
                      onChange={(e) => setSubjectivePct(Number(e.target.value))}
                      style={{
                        width: "52px",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "5px",
                        border: "1px solid #fcd34d",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textAlign: "center",
                        background: "#fef9c3",
                        color: "#78350f",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#78350f",
                      }}
                    >
                      %
                    </span>
                  </div>
                </div>

                {/* Special card */}
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    background: "#faf5ff",
                    border: "1px solid #e9d5ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.15rem 0.55rem",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: "#7c3aed",
                        color: "white",
                      }}
                    >
                      Special
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#6d28d9",
                      }}
                    >
                      Manual
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.74rem",
                      color: "#334155",
                      lineHeight: 1.5,
                    }}
                  >
                    Items not auto-classified. Click the "+ Special" button in
                    any row to mark it for special attention.
                  </p>
                </div>
              </div>

              {/* Selection Table — all line items with Selection badges */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.82rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.5rem",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        PY 2021 (₦)
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        CY 2022 (₦)
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.75rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Variance
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.75rem",
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        Delta %
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 0.75rem",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Selection
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections
                      .filter((sec) => grouped[sec])
                      .map((section) => (
                        <React.Fragment key={section}>
                          <tr>
                            <td
                              colSpan={7}
                              style={{
                                padding: "0.6rem 1rem",
                                background: "#f1f5f9",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#334155",
                                borderTop: "2px solid #e2e8f0",
                              }}
                            >
                              {secLabels[section] ?? section}
                            </td>
                          </tr>
                          {grouped[section]
                            .filter((row) => row.type === "line")
                            .map((row) => {
                              const variance = row.current - row.prior;
                              const pct =
                                row.prior !== 0
                                  ? (variance / Math.abs(row.prior)) * 100
                                  : 0;
                              const isPerfLabel =
                                !row.bold &&
                                Math.abs(row.current) >= performanceMateriality;
                              const isSubjLabel =
                                !row.bold &&
                                !isPerfLabel &&
                                Math.abs(pct) >= subjectivePct;
                              const isSpecialLabel =
                                !row.bold &&
                                !isPerfLabel &&
                                !isSubjLabel &&
                                specialItems.has(row.id);
                              return (
                                <tr
                                  key={row.id}
                                  style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background: row.bold
                                      ? "#fafbfe"
                                      : isSpecialLabel
                                        ? "#faf5ff"
                                        : isPerfLabel
                                          ? "#eff6ff"
                                          : isSubjLabel
                                            ? "#fffbeb"
                                            : "white",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      fontWeight: row.bold ? 700 : 500,
                                      color: row.bold
                                        ? "#0f172a"
                                        : "var(--text)",
                                      paddingLeft: row.bold
                                        ? "1rem"
                                        : "1.75rem",
                                    }}
                                  >
                                    {row.account}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.5rem",
                                      textAlign: "center",
                                      fontFamily: "monospace",
                                      fontSize: "0.72rem",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    {row.code
                                      ? `${lgaPrefix}-${row.code}`
                                      : "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      color: "#475569",
                                    }}
                                  >
                                    {arFmt(row.prior)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 1rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      fontWeight: row.bold ? 800 : 600,
                                      color: "#0f172a",
                                    }}
                                  >
                                    {arFmt(row.current)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 0.75rem",
                                      textAlign: "right",
                                      fontFamily: "monospace",
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      color:
                                        variance >= 0 ? "#059669" : "#dc2626",
                                    }}
                                  >
                                    {row.current === 0 && row.prior === 0
                                      ? "—"
                                      : (variance >= 0 ? "+" : "") +
                                        arFmt(variance)}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.75rem 0.75rem",
                                      textAlign: "right",
                                    }}
                                  >
                                    {row.current === 0 && row.prior === 0 ? (
                                      <span
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        —
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          fontFamily: "monospace",
                                          fontSize: "0.8rem",
                                          fontWeight: 700,
                                          color:
                                            !row.bold && Math.abs(pct) >= 10
                                              ? "#dc2626"
                                              : row.bold
                                                ? "#0f172a"
                                                : "#475569",
                                        }}
                                      >
                                        {arFmtPct(pct)}
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    style={{
                                      padding: "0.4rem 0.75rem",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {row.bold ? (
                                      <span
                                        style={{
                                          color: "#cbd5e1",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        —
                                      </span>
                                    ) : isPerfLabel ? (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          padding: "0.2rem 0.55rem",
                                          borderRadius: "10px",
                                          fontSize: "0.7rem",
                                          fontWeight: 700,
                                          background: "#2563eb",
                                          color: "white",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        Performance
                                      </span>
                                    ) : isSubjLabel ? (
                                      <span
                                        style={{
                                          display: "inline-block",
                                          padding: "0.2rem 0.55rem",
                                          borderRadius: "10px",
                                          fontSize: "0.7rem",
                                          fontWeight: 700,
                                          background: "#d97706",
                                          color: "white",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        Subjective
                                      </span>
                                    ) : isSpecialLabel ? (
                                      <button
                                        onClick={() => toggleSpecial(row.id)}
                                        style={{
                                          all: "unset",
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.25rem",
                                          padding: "0.2rem 0.55rem",
                                          borderRadius: "10px",
                                          fontSize: "0.7rem",
                                          fontWeight: 700,
                                          background: "#7c3aed",
                                          color: "white",
                                          whiteSpace: "nowrap",
                                        }}
                                        title="Click to deselect"
                                      >
                                        Special ×
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => toggleSpecial(row.id)}
                                        style={{
                                          all: "unset",
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.2rem",
                                          padding: "0.15rem 0.5rem",
                                          borderRadius: "10px",
                                          fontSize: "0.68rem",
                                          fontWeight: 600,
                                          background: "#f1f5f9",
                                          color: "#64748b",
                                          border: "1px dashed #cbd5e1",
                                          whiteSpace: "nowrap",
                                        }}
                                        title="Mark as Special"
                                      >
                                        + Special
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={s.formActions}>
            <button className={s.btnPrimary} onClick={handleSaveMat}>
              <Save size={14} /> Save Materiality
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AnalyticalReviewStep;
