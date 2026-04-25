import React from "react";
import { MapPin, Users, CheckCircle, AlertCircle } from "lucide-react";
import s from "../../../styles/pages.module.css";

interface Props {
  zonesCount: number;
  assignedCount: number;
  supervisorsCount: number;
}

const ZoneKpis: React.FC<Props> = ({
  zonesCount,
  assignedCount,
  supervisorsCount,
}) => {
  return (
    <div className={s.kpiRow}>
      <div className={s.kpiCard}>
        <div className={s.kpiIconBlue}>
          <MapPin size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Total Zones</div>
          <div className={s.kpiValue}>{zonesCount}</div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconGreen}>
          <CheckCircle size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Zones Covered</div>
          <div className={s.kpiValue}>
            {assignedCount} / {zonesCount}
          </div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconAmber}>
          <AlertCircle size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Partially/Unassigned</div>
          <div className={s.kpiValue}>{zonesCount - assignedCount}</div>
        </div>
      </div>
      <div className={s.kpiCard}>
        <div className={s.kpiIconPurple}>
          <Users size={20} />
        </div>
        <div>
          <div className={s.kpiLabel}>Supervisors Pool</div>
          <div className={s.kpiValue}>{supervisorsCount}</div>
        </div>
      </div>
    </div>
  );
};

export default ZoneKpis;
