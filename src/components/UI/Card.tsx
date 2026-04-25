import React from "react";
import s from "../../styles/pages.module.css";

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  borderColor?: string;
}

/**
 * Shared card primitive — accent border on the left when `borderColor` is provided.
 * Used across Fieldwork, AuditPlanning, Reports, etc.
 */
const Card: React.FC<CardProps> = ({
  title,
  children,
  action,
  borderColor,
}) => (
  <div
    className={s.card}
    style={borderColor ? { borderLeft: `4px solid ${borderColor}` } : undefined}
  >
    {title && (
      <div
        className={s.cardHeader}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className={s.cardTitle}>{title}</h3>
        {action}
      </div>
    )}
    <div className={s.cardBody}>{children}</div>
  </div>
);

export default Card;
