import React from "react";
import { FileText, Download } from "lucide-react";
import s from "../../../styles/regulations.module.css";
import type { Regulation } from "../data/regulations";

interface Props {
  regulation: Regulation;
}

const RegulationCard: React.FC<Props> = ({ regulation: r }) => {
  return (
    <article className={s.reg_card} onClick={() => {}}>
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
  );
};

export default RegulationCard;
