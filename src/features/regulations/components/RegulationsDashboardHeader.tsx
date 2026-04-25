import React from "react";
import { Bot, BookOpen, Scale, Gavel, Shield } from "lucide-react";
import ps from "../../../styles/pages.module.css";
import type { Regulation } from "../data/regulations";

interface Props {
  regulations: Regulation[];
  onAiAssistant: () => void;
}

const RegulationsDashboardHeader: React.FC<Props> = ({
  regulations,
  onAiAssistant,
}) => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div className={ps.pageHeader}>
        <div>
          <h1 className={ps.pageTitle}>Regulatory Framework</h1>
          <p className={ps.pageSubtitle}>
            Access and search the complete repository of Lagos State and Federal
            audit laws, circulars, and standards.
          </p>
        </div>
        <button className={ps.btnPrimary} onClick={onAiAssistant}>
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
            <div className={ps.kpiValue}>{regulations.length}</div>
          </div>
        </div>
        <div className={ps.kpiCard}>
          <div className={ps.kpiIconBlue}>
            <Scale size={20} />
          </div>
          <div>
            <div className={ps.kpiLabel}>Federal Laws</div>
            <div className={ps.kpiValue}>
              {regulations.filter((r) => r.jurisdiction === "federal").length}
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
              {regulations.filter((r) => r.jurisdiction === "lagos").length}
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
  );
};

export default RegulationsDashboardHeader;
