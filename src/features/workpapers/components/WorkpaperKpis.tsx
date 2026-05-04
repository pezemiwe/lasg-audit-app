import React from "react";
import { FileText, Clock, CheckCircle } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { Workpaper } from "../../../types";

interface Props {
  workpapers: Workpaper[];
}

const WorkpaperKpis: React.FC<Props> = ({ workpapers }) => {
  return (
    <div className={s.kpiRow}>
      <div className={s.kpiCard}>
        <div className={s.kpiIconBlue}>
          <FileText size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Total</div>
          <div className={s.kpiValue}>{workpapers.length}</div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconAmber}>
          <Clock size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Pending Review</div>
          <div className={s.kpiValue}>
            {workpapers.filter((w) => w.status === "Submitted").length}
          </div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconGreen}>
          <CheckCircle size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Approved</div>
          <div className={s.kpiValue}>
            {workpapers.filter((w) => w.status === "Approved").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkpaperKpis;
