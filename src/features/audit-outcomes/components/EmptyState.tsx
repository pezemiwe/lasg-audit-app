import React from "react";

const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  message?: string;
}> = ({ icon, title, message }) => (
  <div
    style={{
      padding: "2rem",
      textAlign: "center",
      color: "#64748b",
      border: "1px dashed #cbd5e1",
      borderRadius: 8,
      background: "#f8fafc",
    }}
  >
    {icon && <div style={{ color: "#94a3b8", marginBottom: 8 }}>{icon}</div>}
    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155" }}>
      {title}
    </div>
    {message && (
      <div style={{ fontSize: "0.82rem", marginTop: 4 }}>{message}</div>
    )}
  </div>
);

export default EmptyState;
