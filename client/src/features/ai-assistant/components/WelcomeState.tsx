import React from "react";
import { Sparkles } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

export type AIAssistantTopic = "regulations" | "audit-procedures";

interface Props {
  onExampleClick: (prompt: string) => void;
  topic?: AIAssistantTopic;
}

const REG_EXAMPLES: { icon: string; prompt: string }[] = [
  {
    icon: "📊",
    prompt:
      "What are the financial reporting requirements for LGAs under the 1999 Constitution?",
  },
  {
    icon: "🏛️",
    prompt: "Explain the role and powers of the State Auditor General",
  },
  {
    icon: "⚖️",
    prompt: "What triggers a compliance audit for an LGA?",
  },
  {
    icon: "📈",
    prompt: "How are performance audits different from financial audits?",
  },
];

const PROC_EXAMPLES: { icon: string; prompt: string }[] = [
  {
    icon: "💰",
    prompt:
      "What audit procedures should I perform on FAAC allocations (NCOA 1101)?",
  },
  {
    icon: "👥",
    prompt:
      "Walk me through payroll audit procedures including ghost-worker tests.",
  },
  {
    icon: "🏗️",
    prompt:
      "How do I audit a capital project, from BOQ to certificate of completion?",
  },
  {
    icon: "🧾",
    prompt:
      "Suggest sample size and risk responses for a high-risk receivables population of 480 items.",
  },
];

const COPY: Record<
  AIAssistantTopic,
  { title: string; desc: string; examples: typeof REG_EXAMPLES }
> = {
  regulations: {
    title: "Ask Me About Lagos Audit Regulations",
    desc: "I'm trained on the 1999 Constitution, the Audit Act, Fiscal Responsibility Act, and all relevant Lagos State regulations. Ask anything about Financial, Performance, or Compliance audit frameworks; I'll cite specific sections.",
    examples: REG_EXAMPLES,
  },
  "audit-procedures": {
    title: "Ask Me About Audit Procedures",
    desc: "I'm trained on ISA 200–720, IPSAS, the National Chart of Accounts and Lagos State LGA audit programmes. Ask me how to design procedures, sample sizes, risk responses, audit evidence and ISA citations for any account.",
    examples: PROC_EXAMPLES,
  },
};

const WelcomeState: React.FC<Props> = ({
  onExampleClick,
  topic = "regulations",
}) => {
  const copy = COPY[topic];
  return (
    <div className={s.welcome_state}>
      <div className={s.welcome_icon}>
        <Sparkles size={32} color="#000" />
      </div>
      <h2 className={s.welcome_title}>{copy.title}</h2>
      <p className={s.welcome_desc}>{copy.desc}</p>

      <div className={s.welcome_examples}>
        {copy.examples.map((ex) => (
          <button
            key={ex.prompt}
            className={s.example_card}
            onClick={() => onExampleClick(ex.prompt)}
          >
            <span className={s.example_icon}>{ex.icon}</span>
            <p className={s.example_text}>{ex.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeState;
