import React from "react";

const Card: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, actions, children }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "1.5rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: subtitle ? 6 : 12,
        gap: 14,
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <div
            style={{
              fontSize: "0.82rem",
              color: "#64748b",
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div>{actions}</div>
    </div>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);

export default Card;
