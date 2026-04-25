import React from "react";
import Badge from "./Badge";
import { FINDINGS } from "../utils/auditDocsData";

const FindingsTab: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
    {FINDINGS.map((finding) => (
      <div
        key={finding.ref}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "var(--primary)",
                fontWeight: 700,
              }}
            >
              {finding.ref}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.15rem 0.5rem",
                background: "#064e3b20",
                color: "var(--primary)",
                borderRadius: "2px",
                fontWeight: 600,
              }}
            >
              {finding.category}
            </span>
            <h3
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--text)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {finding.title}
            </h3>
          </div>
          <Badge status={finding.status} />
        </div>
        <div
          style={{
            padding: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "var(--text-3)",
                marginBottom: "0.5rem",
              }}
            >
              Observation
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-2)",
                lineHeight: 1.75,
                margin: "0 0 1.25rem",
              }}
            >
              {finding.observation}
            </p>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#991b1b",
                marginBottom: "0.5rem",
              }}
            >
              Risk
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-2)",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {finding.risk}
            </p>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#1e40af",
                marginBottom: "0.5rem",
              }}
            >
              Recommendation
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-2)",
                lineHeight: 1.75,
                margin: "0 0 1.25rem",
              }}
            >
              {finding.recommendation}
            </p>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "#065f46",
                marginBottom: "0.5rem",
              }}
            >
              Management Response
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-2)",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {finding.managementResponse}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FindingsTab;
