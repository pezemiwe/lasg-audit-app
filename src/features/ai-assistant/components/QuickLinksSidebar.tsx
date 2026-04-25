import React from "react";
import { BookOpen, Scale, Clock, DollarSign, Info } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

interface Props {
  setInput: (v: string) => void;
}

const QuickLinksSidebar: React.FC<Props> = ({ setInput }) => {
  return (
    <aside className={s.right_sidebar} aria-label="Reference Panel">
      <div className={s.sidebar_section}>
        <h3 className={s.sidebar_section_title}>Quick Links</h3>
        <div className={s.quick_links}>
          <button
            className={s.quick_link}
            onClick={() => setInput("What does Section 125(2) say?")}
          >
            <BookOpen size={12} className={s.quick_link_icon} />
            Section 125(2)
          </button>
          <button
            className={s.quick_link}
            onClick={() => setInput("Explain the Fiscal Responsibility Act")}
          >
            <Scale size={12} className={s.quick_link_icon} />
            Fiscal Responsibility Act
          </button>
          <button
            className={s.quick_link}
            onClick={() => setInput("What are the audit timelines?")}
          >
            <Clock size={12} className={s.quick_link_icon} />
            Audit Timelines
          </button>
          <button
            className={s.quick_link}
            onClick={() => setInput("Procurement compliance rules")}
          >
            <DollarSign size={12} className={s.quick_link_icon} />
            Procurement Rules
          </button>
          <button
            className={s.quick_link}
            onClick={() => setInput("Lagos State Audit Law 2015")}
          >
            <Info size={12} className={s.quick_link_icon} />
            Lagos State Law
          </button>
        </div>
      </div>
    </aside>
  );
};

export default QuickLinksSidebar;
