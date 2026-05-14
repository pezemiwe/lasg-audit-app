import React from "react";
import type { AuditReport } from "../../../types";
import Badge from "./Badge";
import Card from "./Card";

const ReportsTab: React.FC<{ auditReports: AuditReport[] }> = ({
  auditReports,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
    {auditReports.length > 0 ? (
      auditReports.map((report) => (
        <div
          key={report.id}
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
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {report.title}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-3)",
                  marginTop: "0.2rem",
                }}
              >
                Type: {report.type} Â| Prepared by {report.preparedBy}
              </div>
            </div>
            <Badge status={report.status} />
          </div>
          <div
            style={{
              padding: "1.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            {[
              {
                label: "Submitted",
                value: report.submittedAt
                  ? new Date(report.submittedAt).toLocaleDateString("en-NG")
                  : "Pending",
              },
              {
                label: "Reviewed By",
                value: report.reviewedBy ?? "Pending",
              },
              {
                label: "Reviewed At",
                value: report.reviewedAt
                  ? new Date(report.reviewedAt).toLocaleDateString("en-NG")
                  : "Pending",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--text-3)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    ) : (
      <Card title="Audit Reports">
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--text-3)",
            fontSize: "0.875rem",
          }}
        >
          No reports submitted yet. Draft reports can be created in the Reports
          section.
        </div>
      </Card>
    )}
  </div>
);

export default ReportsTab;
