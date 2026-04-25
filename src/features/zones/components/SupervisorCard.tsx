import React from "react";
import { Trash2 } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { User } from "../../../types";

interface Props {
  supervisor: User;
  onRemove: () => void;
}

const SupervisorCard: React.FC<Props> = ({ supervisor: sup, onRemove }) => {
  return (
    <div className={s.poolCard} style={{ marginTop: "0.75rem" }}>
      <div className={s.poolInfo}>
        <div className={s.poolName}>{sup.name}</div>
        <div className={s.poolMeta}>
          {sup.email} · {sup.phone}
        </div>
        <div className={s.poolTags} style={{ marginTop: "0.3rem" }}>
          {sup.specialisations?.map((sp) => (
            <span key={sp} className={s.poolTag}>
              {sp}
            </span>
          ))}
        </div>
      </div>
      <button
        className={`${s.btnDanger} ${s.btnSmall}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

export default SupervisorCard;
