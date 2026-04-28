import React from "react";
import ps from "../../../styles/pages.module.css";

const PreAuditCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className={ps.card}>
    <div className={ps.cardHeader}>
      <div>
        <div className={ps.cardTitle}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-3)",
              marginTop: "0.2rem",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div className={ps.cardBody}>{children}</div>
  </div>
);

export default PreAuditCard;
