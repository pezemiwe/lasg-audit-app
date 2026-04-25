import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  sections: string[];
  activeSection: string;
  sectionProgress: (section: string) => { answered: number; total: number };
  onSwitch: (section: string) => void;
}

const SectionSelector: React.FC<Props> = ({
  sections,
  activeSection,
  sectionProgress,
  onSwitch,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    }}
  >
    {sections.map((section) => {
      const prog = sectionProgress(section);
      const pct =
        prog.total > 0 ? Math.round((prog.answered / prog.total) * 100) : 0;
      const isActive = section === activeSection;
      return (
        <div
          key={section}
          style={{
            background: isActive ? "#ecfdf5" : "white",
            border: isActive ? "1px solid #10b981" : "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "0.75rem",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          onClick={() => onSwitch(section)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: isActive ? "#064e3b" : "#475569",
              }}
            >
              {section}
            </span>
            {isActive && <CheckCircle2 size={14} color="#10b981" />}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#1e293b",
              }}
            >
              {prog.answered}/{prog.total}
            </div>
            <div
              style={{
                width: "60px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: pct === 100 ? "#16a34a" : "#059669",
                  borderRadius: "2px",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default SectionSelector;
