import React from "react";
import { Bot, ArrowRight } from "lucide-react";
import s from "../../../styles/regulations.module.css";

interface Props {
  aiHref: string;
  onAiClick: (e: React.MouseEvent) => void;
}

const RegulationsHero: React.FC<Props> = ({ aiHref, onAiClick }) => {
  return (
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
              A complete, searchable repository of Federal and Lagos State audit
              law, covering Financial, Performance, and Compliance frameworks.
              All regulations cited, categorized, and available for download.
            </p>
          </div>

          <div className={s.hero_stats} role="list">
            <div className={s.h_stat} role="listitem">
              <span className={`${s.h_stat_num} counter`} data-target="127">
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

        <a
          href={aiHref}
          onClick={onAiClick}
          className={s.ai_cta_banner}
          aria-label="Try AI Regulation Assistant"
        >
          <div className={s.ai_cta_icon} aria-hidden="true">
            <Bot />
          </div>
          <div className={s.ai_cta_text}>
            <h3>Need instant answers? Try the AI Regulation Assistant</h3>
            <p>
              Ask any question about Nigerian audit law in natural language and
              get cited, accurate answers in seconds.
            </p>
          </div>
          <div className={s.ai_cta_btn} aria-label="Open AI Assistant">
            Ask AI <ArrowRight size={16} />
          </div>
        </a>
      </div>
    </section>
  );
};

export default RegulationsHero;
