import React from "react";

const UserMgmtHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--primary)",
          marginBottom: "0.5rem",
        }}
      >
        System Administration
      </div>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--text)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        User Management
      </h1>
      <p
        style={{
          color: "var(--text-3)",
          marginTop: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        All platform users, their roles, zone/council assignments, and access
        levels.
      </p>
    </div>
  );
};

export default UserMgmtHeader;
