import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import s from "../../styles/regulations.module.css";
import {
  Bot,
  ArrowRight,
  Search,
  ClipboardCheck,
  ShieldAlert,
  Target,
  ListChecks,
  FileText,
  BookOpen,
  X,
  Printer,
} from "lucide-react";
import {
  auditProceduresData,
  CATEGORY_META,
  type AuditProcedure,
  type ProcedureCategory,
} from "../../features/auditProcedures/data/auditProcedures";

/**
 * Audit Procedure Reference Library.
 *
 * Mirrors the Regulations reference layout (hero → filters → grid)
 * but presents NCOA-aligned audit procedures with assertions, risks,
 * step procedures, evidence and ISA references.
 */

const categoryOptions: { value: "all" | ProcedureCategory; label: string }[] = [
  { value: "all", label: "All Sections" },
  { value: "revenue", label: "Revenue" },
  { value: "recurrent", label: "Recurrent Expenditure" },
  { value: "capital", label: "Capital Expenditure" },
  { value: "current-asset", label: "Current Assets" },
  { value: "non-current-asset", label: "Non-Current Assets" },
  { value: "current-liability", label: "Current Liabilities" },
  { value: "non-current-liability", label: "Non-Current Liabilities" },
  { value: "equity", label: "Equity / Net Assets" },
];

const AuditProcedures: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = location.pathname.includes("public-audit-procedures");
  const showDashboardView = !!user && !isPublicRoute;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ProcedureCategory>("all");
  const [active, setActive] = useState<AuditProcedure | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return auditProceduresData.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        p.account.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.ncoaPrefix.toLowerCase().includes(q) ||
        p.assertions.some((a) => a.toLowerCase().includes(q)) ||
        p.risks.some((r) => r.toLowerCase().includes(q)) ||
        p.references.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [search, category]);

  // Lock background scroll when modal is open.
  useEffect(() => {
    if (active) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [active]);

  // ESC closes the modal.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const aiHref = user ? "/ai-audit-procedures" : "/public-ai-audit-procedures";
  const handleAiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(aiHref);
  };

  return (
    <>
      <div id="main">
        {!showDashboardView && (
          <section className={s.hero} aria-labelledby="ap-hero-h">
            <div className={s.hero_inner}>
              <div className={s.hero_top}>
                <div className={s.hero_left}>
                  <div className={s.hero_label}>
                    <div className={s.hero_label_rule} aria-hidden="true"></div>
                    NCOA-Aligned Reference
                  </div>
                  <h1 className={s.hero_h1} id="ap-hero-h">
                    Audit <em>Procedures</em>
                    <br />& Working Programmes
                  </h1>
                  <p className={s.hero_desc}>
                    A complete, ISA-compliant reference of audit procedures for
                    every National Chart of Accounts (NCOA) line: Revenue,
                    Expenditure, Assets, Liabilities and Equity. Risks,
                    assertions, evidence and step-by-step procedures, designed
                    for Lagos State LGA audits.
                  </p>
                </div>

                <div className={s.hero_stats} role="list">
                  <div className={s.h_stat} role="listitem">
                    <span className={s.h_stat_num}>
                      {auditProceduresData.length}
                    </span>
                    <span className={s.h_stat_lbl}>Procedures</span>
                  </div>
                  <div className={s.h_stat} role="listitem">
                    <span className={s.h_stat_num}>8</span>
                    <span className={s.h_stat_lbl}>NCOA Sections</span>
                  </div>
                  <div className={s.h_stat} role="listitem">
                    <span className={s.h_stat_num}>ISA</span>
                    <span className={s.h_stat_lbl}>Compliant</span>
                  </div>
                </div>
              </div>

              <a
                href={aiHref}
                onClick={handleAiClick}
                className={s.ai_cta_banner}
                aria-label="Ask AI Audit Assistant"
              >
                <div className={s.ai_cta_icon} aria-hidden="true">
                  <Bot />
                </div>
                <div className={s.ai_cta_text}>
                  <h3>
                    Need procedure guidance? <span>Ask the AI Assistant</span>
                  </h3>
                  <p>
                    Get tailored sample sizes, risk responses and ISA citations
                    for any account.
                  </p>
                </div>
                <ArrowRight />
              </a>
            </div>
          </section>
        )}

        {/* Filter bar */}
        <div
          className={s.filters_bar}
          data-dashboard={showDashboardView ? "true" : "false"}
        >
          <div className={s.filters_inner}>
            <div className={s.filters_row}>
              <div className={s.search_wrap}>
                <span className={s.search_icon} aria-hidden="true">
                  <Search />
                </span>
                <input
                  type="search"
                  className={s.search_input}
                  placeholder="Search by account, NCOA code, risk or ISA reference..."
                  aria-label="Search audit procedures"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className={s.filter_select}
                aria-label="Filter by NCOA section"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "all" | ProcedureCategory)
                }
              >
                {categoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard summary header */}
        {showDashboardView && (
          <div
            style={{
              padding: "1.25rem 2rem 0.5rem",
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Audit Procedure Library
                </h2>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    color: "#64748b",
                    fontSize: "0.875rem",
                  }}
                >
                  ISA-compliant procedures for every NCOA line; click any card
                  for full guidance.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "0.625rem",
                  width: "100%",
                  marginTop: "0.75rem",
                }}
              >
                {(Object.keys(CATEGORY_META) as ProcedureCategory[]).map(
                  (k) => {
                    const m = CATEGORY_META[k];
                    const isActive = category === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setCategory(isActive ? "all" : k)}
                        style={{
                          background: isActive ? m.border : "#fff",
                          color: isActive ? "#fff" : m.color,
                          border: `1.5px solid ${isActive ? m.border : "#e2e8f0"}`,
                          padding: "0.75rem 1rem",
                          borderRadius: "10px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "0.75rem",
                          textAlign: "left",
                          boxShadow: isActive
                            ? `0 4px 12px ${m.border}40`
                            : "0 1px 3px rgba(0,0,0,0.06)",
                          transition: "all 0.15s",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.25rem",
                            height: "2.25rem",
                            borderRadius: "8px",
                            background: isActive
                              ? "rgba(255,255,255,0.2)"
                              : m.bg,
                            fontSize: "1.2rem",
                            lineHeight: 1,
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          {m.icon}
                        </span>
                        <span style={{ lineHeight: 1.3 }}>{m.label}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}

        <div className={s.main_content} style={{ minHeight: "60vh" }}>
          <div className={s.reg_grid}>
            {filtered.map((p) => {
              const meta = CATEGORY_META[p.category];
              return (
                <article
                  key={p.code}
                  className={s.reg_card}
                  onClick={() => setActive(p)}
                  style={{
                    borderTop: `4px solid var(--primary)${meta.border}`,
                    cursor: "pointer",
                  }}
                >
                  <div className={s.reg_top}>
                    <span
                      className={s.reg_badge}
                      style={{
                        background: meta.bg,
                        color: "var(--primary)",
                        borderColor: meta.border,
                      }}
                    >
                      {meta.icon} {meta.label}
                    </span>
                    <h3 className={s.reg_title}>{p.account}</h3>
                  </div>
                  <div className={s.reg_meta}>
                    <span className={s.reg_meta_item}>
                      <span className={s.reg_meta_icon}>🏷️</span>
                      {p.code}
                    </span>
                    <span className={s.reg_meta_item}>
                      <span className={s.reg_meta_icon}>📚</span>
                      NCOA {p.ncoaPrefix}
                    </span>
                  </div>
                  <p className={s.reg_desc}>
                    <strong>Assertions:</strong>{" "}
                    {p.assertions.slice(0, 3).join(", ")}
                    {p.assertions.length > 3 ? "…" : ""}
                  </p>
                  <div className={s.reg_tags}>
                    {p.risks.slice(0, 2).map((r, i) => (
                      <span className={s.reg_tag} key={i} title={r}>
                        {r.length > 48 ? r.slice(0, 48) + "…" : r}
                      </span>
                    ))}
                  </div>
                  <div className={s.reg_actions}>
                    <button
                      className={`${s.reg_btn} ${s.reg_btn_view}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(p);
                      }}
                    >
                      View Procedure <FileText size={12} />
                    </button>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#64748b",
                        fontWeight: 600,
                        alignSelf: "center",
                      }}
                    >
                      {p.procedures.length} steps
                    </span>
                  </div>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--text-3)",
                }}
              >
                No procedures match your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {active && (
        <ProcedureModal procedure={active} onClose={() => setActive(null)} />
      )}

      <div className={s.ai_float}>
        <button
          onClick={handleAiClick}
          className={s.ai_float_btn}
          aria-label="Open AI Audit Assistant"
        >
          <span className={s.ai_tooltip}>Ask AI Assistant</span>
          <Bot color="#1c0f00" />
        </button>
      </div>
    </>
  );
};

/* ───────────────────────── Procedure Modal ───────────────────────── */

interface ModalProps {
  procedure: AuditProcedure;
  onClose: () => void;
}

const ProcedureModal: React.FC<ModalProps> = ({ procedure: p, onClose }) => {
  const meta = CATEGORY_META[p.category];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proc-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem 1rem",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          maxWidth: "880px",
          width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          overflow: "hidden",
          border: `1px solid ${meta.border}33`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${meta.bg} 0%, #ffffff 100%)`,
            padding: "1.5rem 1.75rem",
            borderBottom: `4px solid var(--primary)${meta.border}`,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: meta.border,
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {meta.icon} {meta.label}
            </span>
            <span
              style={{
                background: "#fff",
                color: "var(--primary)",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                border: `1px solid ${meta.border}66`,
              }}
            >
              {p.code}
            </span>
            <span
              style={{
                background: "#fff",
                color: "#475569",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
              }}
            >
              NCOA {p.ncoaPrefix}
            </span>
          </div>
          <h2
            id="proc-title"
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.25,
            }}
          >
            {p.account}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close procedure"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              width: 36,
              height: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#475569",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem 1.75rem", color: "#1f2937" }}>
          <Section
            icon={<Target size={16} />}
            title="Audit Objectives"
            color={meta.border}
          >
            <ul style={ulStyle}>
              {p.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<ClipboardCheck size={16} />}
            title="Assertions Tested"
            color={meta.border}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {p.assertions.map((a) => (
                <span
                  key={a}
                  style={{
                    background: meta.bg,
                    color: "var(--primary)",
                    border: `1px solid ${meta.border}66`,
                    padding: "0.3rem 0.625rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </Section>

          <Section
            icon={<ShieldAlert size={16} />}
            title="Key Risks of Misstatement"
            color="#dc2626"
          >
            <ul style={ulStyle}>
              {p.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<ListChecks size={16} />}
            title="Audit Procedures"
            color={meta.border}
          >
            <ol
              style={{
                margin: 0,
                paddingLeft: "1.25rem",
                lineHeight: 1.6,
                fontSize: "0.9rem",
              }}
            >
              {p.procedures.map((step, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  {step}
                </li>
              ))}
            </ol>
          </Section>

          <Section
            icon={<FileText size={16} />}
            title="Evidence to Obtain"
            color={meta.border}
          >
            <ul style={ulStyle}>
              {p.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<BookOpen size={16} />}
            title="ISA & Regulatory References"
            color={meta.border}
          >
            <ul style={ulStyle}>
              {p.references.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.75rem",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: "#fff",
              border: "1px solid #cbd5e1",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#334155",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Printer size={14} /> Print
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: meta.border,
              color: "#fff",
              border: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ulStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1.25rem",
  lineHeight: 1.6,
  fontSize: "0.9rem",
};

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon, title, color, children }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <h4
      style={{
        margin: "0 0 0.5rem",
        fontSize: "0.85rem",
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      {icon}
      {title}
    </h4>
    {children}
  </div>
);

export default AuditProcedures;
