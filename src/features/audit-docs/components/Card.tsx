import React from "react";

const Card: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "4px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--text)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {title}
      </div>
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
    <div>{children}</div>
  </div>
);

export default Card;
