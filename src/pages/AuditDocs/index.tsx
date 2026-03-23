import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const MAP: Record<string, { bg: string; color: string }> = {
    Approved: { bg: "#d1fae5", color: "#065f46" },
    Complete: { bg: "#d1fae5", color: "#065f46" },
    Submitted: { bg: "#dbeafe", color: "#1e40af" },
    "Under Review": { bg: "#fef3c7", color: "#92400e" },
    Draft: { bg: "#f3f4f6", color: "#6b7280" },
    Pending: { bg: "#f3f4f6", color: "#6b7280" },
    Rejected: { bg: "#fee2e2", color: "#991b1b" },
    "In Progress": { bg: "#dbeafe", color: "#1e40af" },
    Completed: { bg: "#d1fae5", color: "#065f46" },
  };
  const c = MAP[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

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

const FINDINGS = [
  {
    ref: "AUD-2025-001",
    category: "Financial",
    title: "Unreconciled Difference in Bank Balances",
    observation:
      "The bank balance per the general ledger differs from the bank statements by ₦14,320,000 as at 31 December 2024. No reconciliation was performed for 4 months.",
    risk: "Material misstatement; potential misappropriation of funds.",
    recommendation:
      "The LGA should prepare monthly bank reconciliation statements and ensure independent review by the head of finance.",
    managementResponse:
      "Management acknowledges the gap. A bank reconciliation exercise was completed on 15 Jan 2025. Controls have been tightened.",
    status: "Under Review",
  },
  {
    ref: "AUD-2025-002",
    category: "Procurement",
    title: "Single-Sourced Contracts Without Prior Approval",
    observation:
      "Three contracts totalling ₦87,500,000 were awarded by single-source without obtaining the required Bureau of Public Procurement (BPP) approval.",
    risk: "Violation of Public Procurement Act 2007 §68. Exposure to value-for-money risk.",
    recommendation:
      "All procurements above ₦15 million must be competitively tendered with BPP oversight. Management should obtain retrospective approvals or refer matters to the procurement tribunal.",
    managementResponse:
      "Management is engaging BPP for guidance. Emergency procurement was claimed but documentation is incomplete.",
    status: "Pending",
  },
  {
    ref: "AUD-2025-003",
    category: "Payroll",
    title: "Ghost Worker Suspicion — 2 Unverifiable Staff",
    observation:
      "Two employees (IDs: PS-1142 and PS-1143) appear on the payroll with cumulative payments of ₦4,320,000 but could not be physically verified during staff enumeration.",
    risk: "Potential fraud; loss of public funds. Criminal liability under EFCC Act.",
    recommendation:
      "Immediately suspend payments to these employees pending verification. Refer for full investigation and engage EFCC if fraud is confirmed.",
    managementResponse:
      "Matter referred to HR for verification. Payments withheld pending investigation.",
    status: "Submitted",
  },
  {
    ref: "AUD-2025-004",
    category: "Revenue",
    title: "Undocumented IGR Collections",
    observation:
      "Revenue receipts totalling ₦8,400,000 in market levy collections were not backed by receipts or documented in the revenue register.",
    risk: "Loss of government revenue; potential diversion of IGR.",
    recommendation:
      "Install electronic receipting system for all IGR collection points. Conduct a reconciliation of all undocumented collections.",
    managementResponse:
      "A digital receipting solution has been procured. Implementation scheduled for Q2 2025.",
    status: "Approved",
  },
];

const WORKPAPER_CHECKLIST = [
  {
    ref: "WP-A1",
    title: "Audit Engagement Acceptance Form",
    status: "Complete",
  },
  {
    ref: "WP-A2",
    title: "Independence Declaration — All Team Members",
    status: "Complete",
  },
  { ref: "WP-A3", title: "Engagement Letter", status: "Complete" },
  { ref: "WP-B1", title: "Risk Assessment Memorandum", status: "Complete" },
  {
    ref: "WP-B2",
    title: "Materiality Calculation Worksheet",
    status: "Complete",
  },
  { ref: "WP-B3", title: "Audit Programme (Signed)", status: "Complete" },
  {
    ref: "WP-C1",
    title: "Internal Control Questionnaire",
    status: "In Progress",
  },
  {
    ref: "WP-C2",
    title: "Control Testing Schedules (All Areas)",
    status: "In Progress",
  },
  { ref: "WP-D1", title: "Revenue Test of Details", status: "Complete" },
  {
    ref: "WP-D2",
    title: "Payroll Substantive Testing Schedule",
    status: "Complete",
  },
  { ref: "WP-D3", title: "Procurement Vouching Schedule", status: "Complete" },
  {
    ref: "WP-D4",
    title: "Bank Confirmation & Reconciliation",
    status: "Complete",
  },
  { ref: "WP-D5", title: "Fixed Assets Verification Sheet", status: "Pending" },
  {
    ref: "WP-E1",
    title: "Summary of Findings & Recommendations",
    status: "In Progress",
  },
  {
    ref: "WP-E2",
    title: "Management Representation Letter Request",
    status: "Pending",
  },
  { ref: "WP-E3", title: "Draft Audit Report", status: "Pending" },
];

const AuditDocs: React.FC = () => {
  const { user } = useAuth();
  const { audits, lgas, workpapers, reports } = useAuditStore();
  const [activeTab, setActiveTab] = useState<
    "findings" | "workpapers" | "reports" | "completeness"
  >("findings");

  if (!user) return null;

  const myAudit =
    user.role === "AUDIT_LEAD"
      ? audits.find((a) => a.leadId === user.id)
      : audits[0];

  const auditId = myAudit?.id ?? "audit-1";
  const lgaName = lgas.find((l) => l.id === myAudit?.lgaId)?.name ?? "N/A";
  const auditWorkpapers = workpapers.filter((w) => w.auditId === auditId);
  const auditReports = reports.filter((r) => r.auditId === auditId);

  const complete = WORKPAPER_CHECKLIST.filter(
    (w) => w.status === "Complete",
  ).length;
  const completePct = Math.round((complete / WORKPAPER_CHECKLIST.length) * 100);

  const tabs = [
    { id: "findings" as const, label: "Findings & Recommendations" },
    { id: "workpapers" as const, label: "Working Papers" },
    { id: "reports" as const, label: "Audit Reports" },
    { id: "completeness" as const, label: "File Completeness" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
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
            Audit Documentation
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
            Documentation & Reporting
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            {lgaName} — Working papers, findings, audit reports and file
            completeness tracker.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {[
            { label: "Findings", value: FINDINGS.length, color: "#991b1b" },
            {
              label: "Workpapers",
              value: auditWorkpapers.length,
              color: "#1e40af",
            },
            {
              label: "File Complete",
              value: `${completePct}%`,
              color: completePct >= 80 ? "#065f46" : "#92400e",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "0.75rem 1rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "3px",
                textAlign: "center",
                minWidth: "90px",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-3)",
                  marginTop: "0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid var(--border)",
          marginBottom: "2rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: "0.875rem",
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-3)",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "findings" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
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
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
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
      )}

      {activeTab === "workpapers" && (
        <Card
          title="Working Papers Register"
          subtitle={`${auditWorkpapers.length} working papers uploaded`}
        >
          {auditWorkpapers.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.83rem",
                }}
              >
                <thead>
                  <tr style={{ background: "var(--bg)" }}>
                    {[
                      "Reference",
                      "Title",
                      "Type",
                      "Uploaded By",
                      "Date",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--text-3)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditWorkpapers.map((wp, i) => (
                    <tr
                      key={wp.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: i % 2 === 0 ? "transparent" : "var(--bg)",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          fontFamily: "monospace",
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        {wp.id.toUpperCase()}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {wp.title}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          color: "var(--text-2)",
                        }}
                      >
                        {wp.fileName}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          color: "var(--text-2)",
                        }}
                      >
                        {wp.uploadedBy}
                      </td>
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          color: "var(--text-3)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(wp.uploadedAt).toLocaleDateString("en-NG")}
                      </td>
                      <td style={{ padding: "0.9rem 1rem" }}>
                        <Badge status={wp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-3)",
              }}
            >
              <p style={{ fontSize: "0.9rem" }}>
                No working papers uploaded yet.
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                Upload workpapers from the Workpapers section.
              </p>
            </div>
          )}
        </Card>
      )}

      {activeTab === "reports" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
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
                      Type: {report.type} · Prepared by {report.preparedBy}
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
                        ? new Date(report.submittedAt).toLocaleDateString(
                            "en-NG",
                          )
                        : "Pending",
                    },
                    {
                      label: "Reviewed By",
                      value: report.reviewedBy ?? "Pending",
                    },
                    {
                      label: "Reviewed At",
                      value: report.reviewedAt
                        ? new Date(report.reviewedAt).toLocaleDateString(
                            "en-NG",
                          )
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
                No reports submitted yet. Draft reports can be created in the
                Reports section.
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "completeness" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <Card
            title="File Completeness Checklist"
            subtitle={`${complete} of ${WORKPAPER_CHECKLIST.length} items complete`}
          >
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {WORKPAPER_CHECKLIST.map((item) => (
                <div
                  key={item.ref}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                    padding: "0.6rem 0.75rem",
                    background: "var(--bg)",
                    borderRadius: "3px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "2px",
                      background:
                        item.status === "Complete"
                          ? "#064e3b"
                          : item.status === "In Progress"
                            ? "#c8930a"
                            : "transparent",
                      border: `2px solid ${item.status === "Complete" ? "#064e3b" : item.status === "In Progress" ? "#c8930a" : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.status === "Complete" && (
                      <span style={{ color: "#fff", fontSize: "0.65rem" }}>
                        ✓
                      </span>
                    )}
                    {item.status === "In Progress" && (
                      <span style={{ color: "#fff", fontSize: "0.65rem" }}>
                        …
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.72rem",
                        color: "var(--text-3)",
                        marginRight: "0.5rem",
                      }}
                    >
                      {item.ref}
                    </span>
                    <span style={{ fontSize: "0.83rem", color: "var(--text)" }}>
                      {item.title}
                    </span>
                  </div>
                  <Badge status={item.status} />
                </div>
              ))}
            </div>
          </Card>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <Card title="Overall Completion">
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <div
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "140px",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <svg
                    viewBox="0 0 140 140"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: "rotate(-90deg)",
                    }}
                  >
                    <circle
                      cx="70"
                      cy="70"
                      r="58"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="58"
                      fill="none"
                      stroke="#064e3b"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - completePct / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "var(--primary)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {completePct}%
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-3)",
                        marginTop: "0.25rem",
                      }}
                    >
                      Complete
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {[
                    { label: "Complete", value: complete, color: "#064e3b" },
                    {
                      label: "In Progress",
                      value: WORKPAPER_CHECKLIST.filter(
                        (w) => w.status === "In Progress",
                      ).length,
                      color: "#c8930a",
                    },
                    {
                      label: "Pending",
                      value: WORKPAPER_CHECKLIST.filter(
                        (w) => w.status === "Pending",
                      ).length,
                      color: "#6b7280",
                    },
                  ].map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: s.color,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginTop: "0.25rem",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Quality Control Sign-off">
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {[
                  {
                    role: "Audit Lead",
                    name: "Mr. Femi Adeyemi (Ikeja)",
                    status: "Signed",
                    date: "24 Jan 2025",
                  },
                  {
                    role: "Supervisor Review",
                    name: "Mrs. Ngozi Okafor (Ikeja Zone)",
                    status: "Signed",
                    date: "28 Jan 2025",
                  },
                  {
                    role: "Quality Reviewer",
                    name: "Mr. Babatunde Adesanya",
                    status: "In Progress",
                    date: "—",
                  },
                  {
                    role: "Auditor-General",
                    name: "Hon. Adebayo Oluwaseun",
                    status: "Pending",
                    date: "—",
                  },
                ].map((qc) => (
                  <div
                    key={qc.role}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 1rem",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "var(--text)",
                        }}
                      >
                        {qc.role}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--text-3)" }}
                      >
                        {qc.name}
                        {qc.date !== "—" ? ` · ${qc.date}` : ""}
                      </div>
                    </div>
                    <Badge
                      status={
                        qc.status === "Signed"
                          ? "Approved"
                          : qc.status === "In Progress"
                            ? "In Progress"
                            : "Pending"
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDocs;
