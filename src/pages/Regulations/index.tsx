import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import s from "../../styles/regulations.module.css";
import { Bot } from "lucide-react";
import { regulationsData } from "../../features/regulations/data/regulations";
import { useCounterAnimation } from "../../features/regulations/hooks/useCounterAnimation";
import RegulationsHero from "../../features/regulations/components/RegulationsHero";
import RegulationsFilters from "../../features/regulations/components/RegulationsFilters";
import RegulationsDashboardHeader from "../../features/regulations/components/RegulationsDashboardHeader";
import RegulationCard from "../../features/regulations/components/RegulationCard";

const Regulations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = location.pathname.includes("public-regulations");
  const showDashboardView = !!user && !isPublicRoute;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  useCounterAnimation([]);

  const aiHref = user ? "/ai-assistant" : "/public-ai-assistant";
  const handleAiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(aiHref);
  };

  return (
    <>
      <div id="main">
        {!showDashboardView && (
          <RegulationsHero aiHref={aiHref} onAiClick={handleAiClick} />
        )}

        <RegulationsFilters
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          jurisdictionFilter={jurisdictionFilter}
          setJurisdictionFilter={setJurisdictionFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          dashboardView={showDashboardView}
        />

        {showDashboardView && (
          <RegulationsDashboardHeader
            regulations={regulationsData}
            onAiAssistant={() => navigate("/ai-assistant")}
          />
        )}

        <div className={s.main_content} style={{ minHeight: "60vh" }}>
          <div className={s.reg_grid}>
            {filtered.map((r, i) => (
              <RegulationCard regulation={r} key={i} />
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
