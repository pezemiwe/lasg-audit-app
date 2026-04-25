import React, { useState, useMemo } from "react";
import { type AuditStore } from "../../../store/useAuditStore";
import type { User, AnalyticFlag, PreliminaryAnalytic } from "../../../types";
import { BarChart3, Check, Sparkles, Search } from "lucide-react";
import s from "../../../styles/pages.module.css";
import PlanningCard from "./PlanningCard";
import { flagConfig } from "../constants";
import { fmtCurrency, fmtPercent } from "../utils/format";

const PreliminaryAnalyticsStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: User;
}> = ({ audit, lgaName, analytics, store, user }) => {
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const hasAnalytics = analytics.length > 0;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(analytics.map((a) => a.category)));
    return ["all", ...cats];
  }, [analytics]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return analytics;
    return analytics.filter((a) => a.category === activeCategory);
  }, [analytics, activeCategory]);

  const flagCounts = useMemo(() => {
    const counts = { Investigate: 0, Adverse: 0, Favorable: 0, Neutral: 0 };
    analytics.forEach((a) => {
      counts[a.flag]++;
    });
    return counts;
  }, [analytics]);

  const handleGenerate = () => {
    store.generatePreliminaryAnalytics(audit.id, user.id);
  };

  if (!hasAnalytics) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <PlanningCard
          title="Preliminary Analytical Procedures"
          subtitle="ISA 520 - Analytical Procedures as Risk Assessment"
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
            Preliminary analytics compare the current year financial data
            against prior year figures, budgets, and industry benchmarks to
            identify areas of significant variance that may indicate risk of
            material misstatement.
          </div>
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <BarChart3
              size={48}
              style={{ color: "#d1d5db", marginBottom: "1rem" }}
            />
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.95rem",
                marginBottom: "0.5rem",
              }}
            >
              No Analytics Generated Yet
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-3)",
                marginBottom: "1.5rem",
                maxWidth: "400px",
                margin: "0 auto 1.5rem",
              }}
            >
              Generate preliminary analytics based on available financial data
              for {lgaName}. The system will compute year-on-year variances and
              flag items requiring investigation.
            </div>
            <button className={s.btnPrimary} onClick={handleGenerate}>
              <Sparkles size={14} /> Generate Preliminary Analytics
            </button>
          </div>
        </PlanningCard>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        className={s.kpiRow}
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {(
          ["Investigate", "Adverse", "Favorable", "Neutral"] as AnalyticFlag[]
        ).map((flag) => {
          const cfg = flagConfig[flag];
          const FlagIcon = cfg.icon;
          return (
            <div key={flag} className={s.kpiCard}>
              <div
                className={s.kpiIcon}
                style={{
                  background: cfg.bg,
                  color: cfg.text,
                  border: `1px solid ${cfg.bg}`,
                }}
              >
                <FlagIcon size={22} />
              </div>
              <div>
                <div className={s.kpiLabel}>{flag}</div>
                <div className={s.kpiValue}>{flagCounts[flag]}</div>
                <div className={s.kpiMeta}>
                  {flag === "Investigate"
                    ? "Requires follow-up"
                    : flag === "Adverse"
                      ? "Unfavorable trend"
                      : flag === "Favorable"
                        ? "Positive movement"
                        : "Within expectations"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PlanningCard
        title="Analytical Results"
        subtitle={`${analytics.length} metrics analysed for ${lgaName}`}
        actions={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={
                  activeCategory === cat ? s.filterChipActive : s.filterChip
                }
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        }
        noPad
      >
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Prior Year</th>
                <th style={{ textAlign: "right" }}>Current Year</th>
                <th style={{ textAlign: "right" }}>Variance</th>
                <th style={{ textAlign: "right" }}>% Change</th>
                <th>Flag</th>
                <th>Auditor Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const cfg = flagConfig[a.flag];
                const FlagIcon = cfg.icon;
                const isRatio = a.category === "Ratio";
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.metric}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "3px",
                          background: "#f1f5f9",
                          color: "#475569",
                        }}
                      >
                        {a.category}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {isRatio ? `${a.priorYear}%` : fmtCurrency(a.priorYear)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {isRatio
                        ? `${a.currentYear}%`
                        : fmtCurrency(a.currentYear)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontFamily: "monospace",
                        color: a.variance >= 0 ? "#059669" : "#dc2626",
                      }}
                    >
                      {a.variance >= 0 ? "+" : ""}
                      {isRatio ? `${a.variance}pp` : fmtCurrency(a.variance)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        color:
                          Math.abs(a.variancePercent) > 15
                            ? "#dc2626"
                            : "var(--text)",
                      }}
                    >
                      {fmtPercent(a.variancePercent)}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: cfg.bg,
                          color: cfg.text,
                          textTransform: "uppercase",
                        }}
                      >
                        <FlagIcon size={11} />
                        {a.flag}
                      </span>
                    </td>
                    <td>
                      {noteEditing === a.id ? (
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <input
                            className={s.formInput}
                            style={{
                              fontSize: "0.78rem",
                              padding: "0.3rem 0.5rem",
                              width: "180px",
                            }}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                store.updateAnalyticNote(a.id, noteText);
                                setNoteEditing(null);
                              }
                            }}
                          />
                          <button
                            className={s.btnIcon}
                            onClick={() => {
                              store.updateAnalyticNote(a.id, noteText);
                              setNoteEditing(null);
                            }}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            color: a.investigationNote
                              ? "var(--text)"
                              : "#94a3b8",
                            textAlign: "left",
                            padding: "0.2rem",
                            maxWidth: "180px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={a.investigationNote || "Click to add note"}
                          onClick={() => {
                            setNoteEditing(a.id);
                            setNoteText(a.investigationNote || "");
                          }}
                        >
                          {a.investigationNote || "Add note..."}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PlanningCard>

      <PlanningCard
        title="Investigation Summary"
        subtitle="Items flagged for further audit attention"
      >
        {analytics.filter((a) => a.flag === "Investigate").length === 0 ? (
          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--text-3)",
              fontStyle: "italic",
            }}
          >
            No items flagged for investigation
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {analytics
              .filter((a) => a.flag === "Investigate")
              .map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      color: "#991b1b",
                      flexShrink: 0,
                      marginTop: "0.15rem",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {a.metric}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#7f1d1d" }}>
                      Variance of {fmtPercent(a.variancePercent)} ({a.category})
                      - requires explanation from management and may indicate
                      elevated risk of material misstatement.
                    </div>
                    {a.investigationNote && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem",
                          borderRadius: "3px",
                          background: "#fff",
                          border: "1px solid #fecaca",
                          fontSize: "0.78rem",
                        }}
                      >
                        <strong>Note:</strong> {a.investigationNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </PlanningCard>
    </div>
  );
};

export default PreliminaryAnalyticsStep;
