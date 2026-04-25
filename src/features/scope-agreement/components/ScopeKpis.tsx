import React from "react";
import { FileSignature, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { ScopeAgreement } from "../../../types";

interface Props {
  scopeAgreements: ScopeAgreement[];
}

const ScopeKpis: React.FC<Props> = ({ scopeAgreements }) => {
  return (
    <div className={s.kpiRow}>
      <div className={s.kpiCard}>
        <div className={s.kpiIconBlue}>
          <FileSignature size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Total Agreements</div>
          <div className={s.kpiValue}>{scopeAgreements.length}</div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconGreen}>
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Fully Approved</div>
          <div className={s.kpiValue}>
            {
              scopeAgreements.filter((sa) => sa.status === "Fully Approved")
                .length
            }
          </div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconAmber}>
          <Clock size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Pending Sign-Off</div>
          <div className={s.kpiValue}>
            {
              scopeAgreements.filter(
                (sa) => sa.status === "Pending LGA" || sa.status === "Draft",
              ).length
            }
          </div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconPurple}>
          <AlertCircle size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Changes Requested</div>
          <div className={s.kpiValue}>
            {
              scopeAgreements.filter((sa) => sa.status === "Changes Requested")
                .length
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeKpis;
