import React from "react";
import { BarChart3, Target, Users, BookOpen, Star } from "lucide-react";

export const TABS = [
  { key: "summary", label: "Audit Review", icon: BarChart3 },
  { key: "follow-ups", label: "Follow-Up Tracker", icon: Target },
  { key: "exit-conference", label: "Exit Conference", icon: Users },
  { key: "lessons", label: "Lessons Learned", icon: BookOpen },
  { key: "quality", label: "Quality Review", icon: Star },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

interface Props {
  activeTab: TabKey;
  setActiveTab: (key: TabKey) => void;
}

const TabsNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid var(--border)",
        marginBottom: "1.5rem",
        gap: "2rem",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 0",
              fontSize: "0.9rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#064e3b" : "#64748b",
              borderBottom: isActive
                ? "2px solid #064e3b"
                : "2px solid transparent",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNav;
