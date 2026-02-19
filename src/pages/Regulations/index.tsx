import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import s from "../../styles/regulations.module.css";
import ps from "../../styles/pages.module.css";
// Icons from Lucide (using what's available or similar)
import {
  Search,
  Bot,
  FileText,
  Download,
  ArrowRight,
  BookOpen,
  Scale,
  Gavel,
  Shield,
} from "lucide-react";

// Mock Data
const regulationsData = [
  // FA
  {
    cat: "fa",
    title:
      "Constitution of the Federal Republic of Nigeria, 1999 — Section 125(2)",
    date: "May 29, 1999",
    jurisdiction: "federal",
    desc: "Establishes the mandate for State Auditor-Generals to audit all LGA accounts and report findings to the House of Assembly.",
    tags: ["Constitutional mandate", "LGA audit", "Reporting"],
  },
  {
    cat: "fa",
    title: "Public Finance Management ActSections 47-52",
    date: "Jul 12, 2007",
    jurisdiction: "federal",
    desc: "Defines financial reporting standards, consolidated revenue fund requirements, and annual accounting procedures.",
    tags: ["Financial reporting", "Revenue", "Annual accounts"],
  },
  {
    cat: "fa",
    title: "Lagos State Audit Law 2015 Sections 5-8",
    date: "Jan 15, 2015",
    jurisdiction: "lagos",
    desc: "Lagos State-specific provisions for LGA financial audits, including timelines and documentation requirements.",
    tags: ["Lagos State", "Audit timelines", "Documentation"],
  },
  {
    cat: "fa",
    title: "Treasury Circular on LGA Accounting Standards",
    date: "Mar 22, 2021",
    jurisdiction: "federal",
    desc: "Updated accounting standards for local governments, including chart of accounts and accrual basis guidelines.",
    tags: ["Accounting standards", "Chart of accounts"],
  },
  // PA
  {
    cat: "pa",
    title: "Public Procurement Act 2007 — Sections 16-24",
    date: "Jun 04, 2007",
    jurisdiction: "federal",
    desc: "Establishes standards for evaluating value-for-money, programme efficiency, and effectiveness.",
    tags: ["Value for money", "Programme evaluation"],
  },
  {
    cat: "pa",
    title: "National Planning Commission Act Sections 7-12",
    date: "Dec 29, 1992",
    jurisdiction: "federal",
    desc: "Framework for assessing programme outcomes, development goals, and resource allocation efficiency.",
    tags: ["Outcomes", "Development goals"],
  },
  {
    cat: "pa",
    title: "Lagos State Performance Standards 2018",
    date: "Aug 10, 2018",
    jurisdiction: "lagos",
    desc: "Lagos-specific benchmarks for LGA performance evaluation, service delivery, and outcome measurement.",
    tags: ["Performance benchmarks", "Service delivery"],
  },
  // CA
  {
    cat: "ca",
    title: "Fiscal Responsibility Act 2007 Part IV: Procurement",
    date: "Jul 12, 2007",
    jurisdiction: "federal",
    desc: "Outlines procurement compliance requirements, competitive bidding thresholds, and anti-corruption measures.",
    tags: ["Procurement", "Compliance", "Bidding"],
  },
  {
    cat: "ca",
    title: "Code of Conduct Bureau and Tribunal Act Part II",
    date: "Sep 01, 1989",
    jurisdiction: "federal",
    desc: "Defines ethical standards and conflict-of-interest rules for public officers including LGA officials.",
    tags: ["Ethics", "Public officers"],
  },
  {
    cat: "ca",
    title: "Lagos State Public Procurement Law 2019",
    date: "Feb 18, 2019",
    jurisdiction: "lagos",
    desc: "State-level procurement compliance framework applicable to all LGAs within Lagos State.",
    tags: ["Procurement law", "Lagos State"],
  },
];

const Regulations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = location.pathname.includes("public-regulations");
  const showDashboardView = user && !isPublicRoute;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter Logic
  const filtered = regulationsData.filter((r) => {
    const searchMatch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const typeMatch = typeFilter === "all" || r.cat === typeFilter;
    const jurisdictionMatch =
      jurisdictionFilter === "all" || r.jurisdiction === jurisdictionFilter;

    return searchMatch && typeMatch && jurisdictionMatch;
  });

  // Counter Animation Effect
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    counters.forEach((counter) => {
      const target = +(counter.getAttribute("data-target") || 0);
      let count = 0;
      const inc = target / 50;
      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.textContent = Math.ceil(count).toString();
          setTimeout(updateCount, 15);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCount();
    });
  }, []);

  const handleAiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(user ? "/ai-assistant" : "/public-ai-assistant");
  };

  return (
    <>
      <div id="main">
        {!showDashboardView && (
          /* Hero Section */
          <section className={s.hero} aria-labelledby="hero-h">
            <div className={s.hero_inner}>
              <div className={s.hero_top}>
                <div className={s.hero_left}>
                  <div className={s.hero_label}>
                    <div className={s.hero_label_rule} aria-hidden="true"></div>
                    Comprehensive Database
                  </div>
                  <h1 className={s.hero_h1} id="hero-h">
                    Nigerian Audit <em>Regulations</em>
                    <br />& Legal Framework
                  </h1>
                  <p className={s.hero_desc}>
                    A complete, searchable repository of Federal and Lagos State
                    audit law — covering Financial, Performance, and Compliance
                    frameworks. All regulations cited, categorized, and
                    available for download.
                  </p>
                </div>

                <div className={s.hero_stats} role="list">
                  <div className={s.h_stat} role="listitem">
                    <span
                      className={`${s.h_stat_num} counter`}
                      data-target="127"
                    >
                      0
                    </span>
                    <span className={s.h_stat_lbl}>Regulations</span>
                  </div>
                  <div className={s.h_stat} role="listitem">
                    <span className={`${s.h_stat_num} counter`} data-target="3">
                      0
                    </span>
                    <span className={s.h_stat_lbl}>Audit Types</span>
                  </div>
                  <div className={s.h_stat} role="listitem">
                    <span className={`${s.h_stat_num} counter`} data-target="2">
                      0
                    </span>
                    <span className={s.h_stat_lbl}>Jurisdictions</span>
                  </div>
                </div>
              </div>

              {/* AI CTA */}
              <a
                href={user ? "/ai-assistant" : "/public-ai-assistant"}
                onClick={handleAiClick}
                className={s.ai_cta_banner}
                aria-label="Try AI Regulation Assistant"
              >
                <div className={s.ai_cta_icon} aria-hidden="true">
                  <Bot />
                </div>
                <div className={s.ai_cta_text}>
                  <h3>Need instant answers? Try the AI Regulation Assistant</h3>
                  <p>
                    Ask any question about Nigerian audit law in natural
                    language — get cited, accurate answers in seconds.
                  </p>
                </div>
                <div className={s.ai_cta_btn} aria-label="Open AI Assistant">
                  Ask AI <ArrowRight size={16} />
                </div>
              </a>
            </div>
          </section>
        )}

        {/* Filters Bar */}
        <div className={s.filters_bar} data-dashboard={showDashboardView}>
          <div className={s.filters_inner}>
            <div className={s.filters_row}>
              <div className={s.search_wrap}>
                <span className={s.search_icon} aria-hidden="true">
                  <Search />
                </span>
                <input
                  type="search"
                  className={s.search_input}
                  placeholder="Search regulations by title, jurisdiction, or keyword..."
                  aria-label="Search regulations"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className={s.filter_select}
                aria-label="Filter by audit type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Audit Types</option>
                <option value="fa">Financial Audit</option>
                <option value="pa">Performance Audit</option>
                <option value="ca">Compliance Audit</option>
              </select>

              <select
                className={s.filter_select}
                aria-label="Filter by jurisdiction"
                value={jurisdictionFilter}
                onChange={(e) => setJurisdictionFilter(e.target.value)}
              >
                <option value="all">All Jurisdictions</option>
                <option value="federal">Federal</option>
                <option value="lagos">Lagos State</option>
              </select>

              <div
                className={s.view_toggle}
                role="group"
                aria-label="View mode"
              >
                <button
                  className={`${s.view_btn} ${
                    viewMode === "grid" ? s.view_btn_active : ""
                  }`} // removed s.active because module exports are usually className based and view_btn_active is defined in css
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </button>
                <button
                  className={`${s.view_btn} ${
                    viewMode === "list" ? s.view_btn_active : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logged-in Header & Stats */}
        {showDashboardView && (
          <div style={{ marginBottom: "2rem" }}>
            <div className={ps.pageHeader}>
              <div>
                <h1 className={ps.pageTitle}>Regulatory Framework</h1>
                <p className={ps.pageSubtitle}>
                  Access and search the complete repository of Lagos State and
                  Federal audit laws, circulars, and standards.
                </p>
              </div>
              <button
                className={ps.btnPrimary}
                onClick={() => navigate("/ai-assistant")}
              >
                <Bot size={16} /> Consult AI Assistant
              </button>
            </div>

            <div className={ps.kpiRow}>
              <div className={ps.kpiCard}>
                <div className={ps.kpiIconGreen}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className={ps.kpiLabel}>Total Regulations</div>
                  <div className={ps.kpiValue}>{regulationsData.length}</div>
                </div>
              </div>
              <div className={ps.kpiCard}>
                <div className={ps.kpiIconBlue}>
                  <Scale size={20} />
                </div>
                <div>
                  <div className={ps.kpiLabel}>Federal Laws</div>
                  <div className={ps.kpiValue}>
                    {
                      regulationsData.filter(
                        (r) => r.jurisdiction === "federal",
                      ).length
                    }
                  </div>
                </div>
              </div>
              <div className={ps.kpiCard}>
                <div className={ps.kpiIconAmber}>
                  <Gavel size={20} />
                </div>
                <div>
                  <div className={ps.kpiLabel}>Lagos State Laws</div>
                  <div className={ps.kpiValue}>
                    {
                      regulationsData.filter((r) => r.jurisdiction === "lagos")
                        .length
                    }
                  </div>
                </div>
              </div>
              <div className={ps.kpiCard}>
                <div className={ps.kpiIconPurple}>
                  <Shield size={20} />
                </div>
                <div>
                  <div className={ps.kpiLabel}>Frameworks</div>
                  <div className={ps.kpiValue}>3</div>
                  <div className={ps.kpiMeta}>Fin, Perf, Compl</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={s.main_content} style={{ minHeight: "60vh" }}>
          <div className={s.reg_grid}>
            {filtered.map((r, i) => (
              <article
                className={s.reg_card}
                key={i}
                onClick={() => {
                  // Using navigate here for hypothetical detail page or just placeholder
                  // navigate(`/regulations/${r.id}`);
                }}
              >
                <div className={s.reg_top}>
                  <span className={`${s.reg_badge} ${s["reg_badge_" + r.cat]}`}>
                    {r.cat.toUpperCase()}
                  </span>
                  <h3 className={s.reg_title}>{r.title}</h3>
                </div>
                <div className={s.reg_meta}>
                  <span className={s.reg_meta_item}>
                    <span className={s.reg_meta_icon}>📅</span>
                    {r.date}
                  </span>
                  <span className={s.reg_meta_item}>
                    <span className={s.reg_meta_icon}>🏛️</span>
                    {r.jurisdiction === "federal" ? "Federal" : "Lagos State"}
                  </span>
                </div>
                <p className={s.reg_desc}>{r.desc}</p>
                <div className={s.reg_tags}>
                  {r.tags.map((t: string, idx: number) => (
                    <span className={s.reg_tag} key={idx}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={s.reg_actions}>
                  <button
                    className={`${s.reg_btn} ${s.reg_btn_view}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate to view logic
                    }}
                  >
                    View Full Text <FileText size={12} />
                  </button>
                  <button
                    className={`${s.reg_btn} ${s.reg_btn_dl}`}
                    aria-label="Download PDF"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--text-3)",
                }}
              >
                No regulations found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI */}
      <div className={s.ai_float}>
        <button
          onClick={handleAiClick}
          className={s.ai_float_btn}
          aria-label="Open AI Regulation Assistant"
        >
          <span className={s.ai_tooltip}>Ask AI Assistant</span>
          <Bot color="#1c0f00" />
        </button>
      </div>
    </>
  );
};

export default Regulations;
