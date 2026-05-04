import React from "react";
import s from "../../../styles/pages.module.css";

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div
    className={s.detailRow}
    style={{ borderBottom: "none", padding: "0.35rem 0" }}
  >
    <div className={s.detailLabel} style={{ width: "140px" }}>
      {label}
    </div>
    <div className={s.detailValue}>{value}</div>
  </div>
);

export default InfoRow;
