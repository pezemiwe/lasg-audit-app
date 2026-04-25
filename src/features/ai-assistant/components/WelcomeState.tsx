import React from "react";
import { Sparkles } from "lucide-react";
import s from "../../../styles/ai-assistant.module.css";

interface Props {
  onExampleClick: (prompt: string) => void;
}

const EXAMPLES: { icon: string; prompt: string }[] = [
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

const WelcomeState: React.FC<Props> = ({ onExampleClick }) => {
  return (
    <div className={s.welcome_state}>
      <div className={s.welcome_icon}>
        <Sparkles size={32} color="#000" />
      </div>
      <h2 className={s.welcome_title}>Ask Me About Lagos Audit Regulations</h2>
      <p className={s.welcome_desc}>
        I'm trained on the 1999 Constitution, the Audit Act, Fiscal
        Responsibility Act, and all relevant Lagos State regulations. Ask
        anything about Financial, Performance, or Compliance audit frameworks —
        I'll cite specific sections.
      </p>

      <div className={s.welcome_examples}>
        {EXAMPLES.map((ex) => (
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
