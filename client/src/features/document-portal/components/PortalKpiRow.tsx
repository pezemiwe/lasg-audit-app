import React from "react";
import { FolderOpen, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import s from "../../../styles/pages.module.css";

type Props = {
  total: number;
  approved: number;
  uploaded: number;
  rejected: number;
  notUploaded: number;
};

const PortalKpiRow: React.FC<Props> = ({
  total,
  approved,
  uploaded,
  rejected,
  notUploaded,
}) => (
  <div className={s.kpiRow}>
    <div className={s.kpiCard}>
      <div className={s.kpiIconBlue}>
        <FolderOpen size={20} />
      </div>
      <div>
        <div className={s.kpiLabel}>Total Documents</div>
        <div className={s.kpiValue}>{total}</div>
      </div>
    </div>
    <div className={s.kpiCard}>
      <div className={s.kpiIconGreen}>
        <CheckCircle2 size={20} />
      </div>
      <div>
        <div className={s.kpiLabel}>Approved</div>
        <div className={s.kpiValue}>{approved}</div>
      </div>
    </div>
    <div className={s.kpiCard}>
      <div className={s.kpiIconAmber}>
        <Clock size={20} />
      </div>
      <div>
        <div className={s.kpiLabel}>Pending Review</div>
        <div className={s.kpiValue}>{uploaded}</div>
      </div>
    </div>
    <div className={s.kpiCard}>
      <div className={s.kpiIconPurple}>
        <AlertTriangle size={20} />
      </div>
      <div>
        <div className={s.kpiLabel}>Rejected / Not Uploaded</div>
        <div className={s.kpiValue}>{rejected + notUploaded}</div>
      </div>
    </div>
  </div>
);

export default PortalKpiRow;
