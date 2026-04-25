import React from "react";
import { Target, CheckCircle, AlertTriangle } from "lucide-react";
import s from "../../../styles/pages.module.css";

interface Props {
  totalFollowUps: number;
  verifiedCount: number;
  overdueCount: number;
  implementationRate: number;
}

const KpiRow: React.FC<Props> = ({
  totalFollowUps,
  verifiedCount,
  overdueCount,
  implementationRate,
}) => {
  return (
    <div className={s.kpiRow}>
      <div className={s.kpiCard}>
        <Target className={s.kpiIconBlue} />
        <div>
          <div className={s.kpiLabel}>Follow-Ups</div>
          <div className={s.kpiValue}>{totalFollowUps}</div>
          <div className={s.kpiMeta}>{verifiedCount} verified</div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <CheckCircle className={s.kpiIconGreen} />
        <div>
          <div className={s.kpiLabel}>Implementation Rate</div>
          <div className={s.kpiValue}>{implementationRate}%</div>
          <div className={s.kpiMeta}>
            {verifiedCount}/{totalFollowUps} items
          </div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <AlertTriangle className={s.kpiIconAmber} />
        <div>
          <div className={s.kpiLabel}>Overdue</div>
          <div className={s.kpiValue}>{overdueCount}</div>
          <div className={s.kpiMeta}>past target date</div>
        </div>
      </div>
    </div>
  );
};

export default KpiRow;
