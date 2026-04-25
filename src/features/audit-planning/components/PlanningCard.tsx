import React from "react";
import s from "../../../styles/pages.module.css";

interface CardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noPad?: boolean;
}

const PlanningCard: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  children,
  noPad,
}) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <div>
        <div className={s.cardTitle}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--text-3)",
              marginTop: "0.15rem",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {actions}
    </div>
    <div className={noPad ? undefined : s.cardBody}>{children}</div>
  </div>
);

export default PlanningCard;
