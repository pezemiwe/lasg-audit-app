import React from "react";
import {
  BookOpen,
  Scale,
  Clock,
  DollarSign,
  Info,
  ClipboardCheck,
  ListChecks,
  ShieldAlert,
  Target,
  FileText,
} from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";
import type { AIAssistantTopic } from "./WelcomeState";

interface Props {
  setInput: (v: string) => void;
  topic?: AIAssistantTopic;
}

interface QL {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const REG_LINKS: QL[] = [
  {
    icon: <BookOpen size={12} />,
    label: "Section 125(2)",
    prompt: "What does Section 125(2) say?",
  },
  {
    icon: <Scale size={12} />,
    label: "Fiscal Responsibility Act",
    prompt: "Explain the Fiscal Responsibility Act",
  },
  {
    icon: <Clock size={12} />,
    label: "Audit Timelines",
    prompt: "What are the audit timelines?",
  },
  {
    icon: <DollarSign size={12} />,
    label: "Procurement Rules",
    prompt: "Procurement compliance rules",
  },
  {
    icon: <Info size={12} />,
    label: "Lagos State Law",
    prompt: "Lagos State Audit Law 2015",
  },
];

const PROC_LINKS: QL[] = [
  {
    icon: <ClipboardCheck size={12} />,
    label: "FAAC Procedures",
    prompt:
      "List the substantive procedures for FAAC allocations under NCOA 1101.",
  },
  {
    icon: <ListChecks size={12} />,
    label: "Payroll Tests",
    prompt:
      "Design payroll audit tests including ghost worker and PAYE remittance checks.",
  },
  {
    icon: <Target size={12} />,
    label: "Sample Size",
    prompt:
      "Recommend a sample size and sampling method for a high-risk population of 320 invoices.",
  },
  {
    icon: <ShieldAlert size={12} />,
    label: "Risk Responses",
    prompt:
      "What are common risks of material misstatement for capital expenditure and how do I respond?",
  },
  {
    icon: <FileText size={12} />,
    label: "Audit Evidence",
    prompt:
      "List the minimum audit evidence to retain for an infrastructure project audit.",
  },
];

const TITLES: Record<AIAssistantTopic, string> = {
  regulations: "Quick Links",
  "audit-procedures": "Procedure Shortcuts",
};

const QuickLinksSidebar: React.FC<Props> = ({
  setInput,
  topic = "regulations",
}) => {
  const links = topic === "audit-procedures" ? PROC_LINKS : REG_LINKS;
  return (
    <aside className={s.right_sidebar} aria-label="Reference Panel">
      <div className={s.sidebar_section}>
        <h3 className={s.sidebar_section_title}>{TITLES[topic]}</h3>
        <div className={s.quick_links}>
          {links.map((l) => (
            <button
              key={l.label}
              className={s.quick_link}
              onClick={() => setInput(l.prompt)}
            >
              <span className={s.quick_link_icon}>{l.icon}</span>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default QuickLinksSidebar;
