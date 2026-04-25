import React from "react";
import s from "../../../styles/pages.module.css";
import StatusBadge from "../../../components/UI/StatusBadge";
import type { Mandate } from "../../../types";

const MandateOverviewTab: React.FC<{ mandate: Mandate }> = ({ mandate }) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>Mandate Details</h3>
    </div>
    <div className={s.cardBody}>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Scope</div>
        <div className={s.detailValue}>{mandate.scope}</div>
      </div>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Objectives</div>
        <div className={s.detailValue}>{mandate.objectives}</div>
      </div>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Timelines</div>
        <div className={s.detailValue}>{mandate.timelines}</div>
      </div>
      <div className={s.detailRow}>
        <div className={s.detailLabel}>Audit Types</div>
        <div className={s.detailValue}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {mandate.auditTypes.map((t) => (
              <StatusBadge key={t} label={t} variant="info" />
            ))}
          </div>
        </div>
      </div>
      {mandate.publishedAt && (
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Published</div>
          <div className={s.detailValue}>
            {new Date(mandate.publishedAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default MandateOverviewTab;
