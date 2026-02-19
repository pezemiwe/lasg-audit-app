import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import ps from "../../styles/pages.module.css";
// import {
//   FileText,
//   Users,
//   CheckSquare,
//   Calendar,
//   Clock,
//   Briefcase,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";

const BADGE_COLOR: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#d1fae5", color: "#065f46" },
  "In Progress": { bg: "#fef3c7", color: "#92400e" },
  Pending: { bg: "#fee2e2", color: "#991b1b" },
  Sent: { bg: "#dbeafe", color: "#1e40af" },
  Scheduled: { bg: "#ede9fe", color: "#4c1d95" },
};

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const colors = BADGE_COLOR[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "2px",
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
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

const PreAudit: React.FC<{ auditId?: string; embedded?: boolean }> = ({
  auditId,
  embedded,
}) => {
  const { user } = useAuth();
  const { audits, lgas, letters } = useAuditStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "meetings" | "checklist" | "team"
  >("overview");

  if (!user) return null;

  // Determine relevant audits
  let myAudits =
    user.role === "AUDIT_LEAD"
      ? audits.filter((a) => a.leadId === user.id)
      : user.role === "AUDIT_SUPERVISOR"
        ? audits.filter((a) => {
            const myLgas = lgas
              .filter((l) => l.zoneId === user.zoneId)
              .map((l) => l.id);
            return myLgas.includes(a.lgaId);
          })
        : audits;

  if (auditId) {
    myAudits = audits.filter((a) => a.id === auditId);
  }

  const getLGAName = (lgaId: string) =>
    lgas.find((l) => l.id === lgaId)?.name ?? lgaId;

  const entryMeetings = myAudits
    .filter((a) => a.entryMeetingDate)
    .map((a) => ({
      id: a.id,
      lgaName: getLGAName(a.lgaId),
      date: a.entryMeetingDate!,
      notes: a.entryMeetingNotes ?? "No notes recorded.",
      status: a.status === "Pending" ? "Scheduled" : "Completed",
      attendees: [
        "Council Chairman",
        "Council Treasurer",
        "HOD Finance",
        "Audit Team Lead",
      ],
      agenda: [
        "Introduction of Audit Team",
        "Review of Audit Scope",
        "Logistics & Access",
        "Timeline Agreement",
      ],
      actionItems: [
        "Provide office space for team",
        "Grant access to financial system",
      ],
    }));

  const DOC_CHECKLIST_ITEMS = [
    {
      name: "Audited Annual Financial Statements (Prior Year)",
      category: "Financial",
      priority: "High",
    },
    {
      name: "Draft Financial Statements (Current Year)",
      category: "Financial",
      priority: "Critical",
    },
    { name: "Trial Balance", category: "Financial", priority: "High" },
    { name: "Fixed Assets Register", category: "Assets", priority: "Medium" },
    {
      name: "Bank Reconciliation Statements (all months)",
      category: "Treasury",
      priority: "High",
    },
    {
      name: "Payroll Schedules & IPPIS Reports",
      category: "HR / Payroll",
      priority: "High",
    },
    {
      name: "Internal Audit Reports",
      category: "Internal Control",
      priority: "Medium",
    },
    {
      name: "Minutes of Finance Committee Meetings",
      category: "Governance",
      priority: "Low",
    },
    {
      name: "Revenue Receipts & Collection Schedules",
      category: "Revenue",
      priority: "High",
    },
    {
      name: "Procurement Records & Contract Awards",
      category: "Procurement",
      priority: "High",
    },
    {
      name: "Stores & Inventory Records",
      category: "Assets",
      priority: "Medium",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meetings", label: "Entry Meetings" },
    { id: "checklist", label: "Document Checklist" },
    { id: "team", label: "Team Status" },
  ] as const;

  return (
    <div
      style={{
        padding: embedded ? 0 : "2rem",
        maxWidth: embedded ? "100%" : "1200px",
        margin: "0 auto",
      }}
    >
      {!embedded && (
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
            Pre-Audit Activities
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
            Engagement Preparation
          </h1>
          <p
            style={{
              color: "var(--text-3)",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            Mandate receipt, team assignment, notification letters, document
            collection and entry meeting scheduling.
          </p>
        </div>
      )}

      <div className={ps.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${ps.tabBtn} ${activeTab === tab.id ? ps.active : ""}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Dashboard Summary Chips */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            {[
              {
                label: "Total Engagements",
                value: myAudits.length,
                color: "var(--primary)",
              },
              {
                label: "Meetings Held",
                value: entryMeetings.filter((m) => m.status === "Completed")
                  .length,
                color: "#059669",
              },
              { label: "Documents Pending", value: "42", color: "#d97706" },
              {
                label: "Lead Assigned",
                value: myAudits.filter((a) => a.leadId).length,
                color: "#2563eb",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-card)",
                  padding: "1.25rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: stat.color,
                    marginTop: "0.5rem",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <Card
                title="Active Engagements"
                subtitle="Status of ongoing audit engagements"
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 0.5fr",
                      padding: "0.75rem 1rem",
                      background: "var(--bg)",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                    }}
                  >
                    <div>LGA / Entity</div>
                    <div>Type</div>
                    <div>Stage</div>
                    <div>Status</div>
                  </div>
                  {myAudits.map((audit) => (
                    <div
                      key={audit.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 0.5fr",
                        padding: "1rem",
                        borderBottom: "1px solid var(--border)",
                        alignItems: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {getLGAName(audit.lgaId)}
                      </div>
                      <div style={{ color: "var(--text-2)" }}>{audit.type}</div>
                      <div style={{ color: "var(--text-2)" }}>Pre-Audit</div>
                      <div>
                        <Badge status={audit.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card
                title="Timeline & Milestones"
                subtitle="Key dates for the current audit cycle"
              >
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {[
                    { label: "Mandate Issued", date: "Oct 01", done: true },
                    { label: "Notifications Sent", date: "Oct 05", done: true },
                    { label: "Team Assigned", date: "Oct 10", done: true },
                    { label: "Entry Meetings", date: "Oct 15", done: false },
                    { label: "Fieldwork Start", date: "Oct 20", done: false },
                  ].map((step, i, arr) => (
                    <div
                      key={step.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: step.done ? "#059669" : "var(--border)",
                          zIndex: 2,
                          marginBottom: "0.5rem",
                        }}
                      />
                      {i !== arr.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "50%",
                            width: "100%",
                            height: "2px",
                            background: step.done ? "#059669" : "var(--border)",
                            zIndex: 1,
                          }}
                        />
                      )}
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {step.label}
                      </div>
                      <div
                        style={{ fontSize: "0.7rem", color: "var(--text-3)" }}
                      >
                        {step.date}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <Card title="Recent Notifications">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {letters.slice(0, 4).map((letter) => (
                    <div
                      key={letter.id}
                      style={{
                        padding: "0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-3)",
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>{letter.sentAt}</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              letter.status === "Sent" ? "#059669" : "#d97706",
                          }}
                        >
                          {letter.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Letter to {getLGAName(letter.lgaId)}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--text-2)" }}
                      >
                        Ref: {letter.id}
                      </div>
                    </div>
                  ))}
                  {letters.length === 0 && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-3)",
                        fontStyle: "italic",
                      }}
                    >
                      No recent notifications
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === "meetings" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {entryMeetings.length === 0 ? (
            <Card title="Entry Meeting Log">
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-3)",
                }}
              >
                No entry meetings scheduled or recorded.
                <br />
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Schedule Meeting
                </button>
              </div>
            </Card>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {entryMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      background: "var(--bg)",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3
                        style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}
                      >
                        {meeting.lgaName} LGA
                      </h3>
                      <span
                        style={{ fontSize: "0.8rem", color: "var(--text-3)" }}
                      >
                        Entry Meeting •{" "}
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge status={meeting.status} />
                  </div>
                  <div
                    style={{
                      padding: "1.5rem",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          color: "var(--text-3)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Meeting Minutes & Notes
                      </h4>
                      <div
                        style={{
                          background: "var(--bg)",
                          padding: "1rem",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          lineHeight: "1.6",
                          color: "var(--text-2)",
                          minHeight: "100px",
                        }}
                      >
                        {meeting.notes}
                      </div>

                      <div style={{ marginTop: "1.5rem" }}>
                        <h4
                          style={{
                            fontSize: "0.8rem",
                            textTransform: "uppercase",
                            color: "var(--text-3)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Action Items
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.2rem",
                            color: "var(--text-2)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {meeting.actionItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div
                      style={{
                        borderLeft: "1px solid var(--border)",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          color: "var(--text-3)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Attendees
                      </h4>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          fontSize: "0.875rem",
                          color: "var(--text)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {meeting.attendees.map((person) => (
                          <li
                            key={person}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                background: "#e5e7eb",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            >
                              {person.charAt(0)}
                            </div>
                            {person}
                          </li>
                        ))}
                      </ul>
                      <button
                        style={{
                          marginTop: "2rem",
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid var(--border)",
                          background: "white",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>📄</span> View Minutes PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "checklist" && (
        <>
          <Card
            title="Document Request Checklist"
            subtitle="Tracking of required documentation from LGAs"
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem",
                }}
              >
                <thead
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        color: "var(--text-3)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Document Name
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        color: "var(--text-3)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        color: "var(--text-3)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Priority
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        color: "var(--text-3)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        color: "var(--text-3)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DOC_CHECKLIST_ITEMS.map((item, i) => {
                    const isReceived = i < 7; // Mock logic
                    return (
                      <tr
                        key={item.name}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          style={{ padding: "0.75rem 1rem", fontWeight: 500 }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--text-2)",
                          }}
                        >
                          {item.category}
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "99px",
                              fontWeight: 700,
                              background:
                                item.priority === "Critical"
                                  ? "#fee2e2"
                                  : item.priority === "High"
                                    ? "#fff7ed"
                                    : "#f3f4f6",
                              color:
                                item.priority === "Critical"
                                  ? "#991b1b"
                                  : item.priority === "High"
                                    ? "#c2410c"
                                    : "#374151",
                            }}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              color: isReceived ? "#059669" : "#d97706",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              background: isReceived ? "#ecfdf5" : "#fffbeb",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "6px",
                            }}
                          >
                            {isReceived ? "Received" : "Pending"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--text-3)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {isReceived
                            ? "Verified by Lead"
                            : "Request sent (2d ago)"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div style={{ marginTop: "1.5rem" }}>
            <Card title="Priority Definitions">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "99px",
                      fontWeight: 700,
                      background: "#fee2e2",
                      color: "#991b1b",
                    }}
                  >
                    Critical
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                    Essential for audit commencement.
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "99px",
                      fontWeight: 700,
                      background: "#fff7ed",
                      color: "#c2410c",
                    }}
                  >
                    High
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                    Required key financial records.
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "99px",
                      fontWeight: 700,
                      background: "#f3f4f6",
                      color: "#374151",
                    }}
                  >
                    Medium/Low
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                    Supporting documents.
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === "team" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {myAudits.map((audit) => {
            const lgaName = getLGAName(audit.lgaId);
            return (
              <Card
                key={audit.id}
                title={`${lgaName} Audit Team`}
                subtitle="Roster and role assignments"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Audit Lead */}
                  <div
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "#4f46e5",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      AL
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>
                        Audit Lead Name
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          fontWeight: 600,
                        }}
                      >
                        Engagement Partner
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-3)",
                          marginTop: "0.2rem",
                        }}
                      >
                        Status: Active (On-site)
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {[1, 2, 3].map((m) => (
                    <div
                      key={m}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "#e5e7eb",
                          color: "var(--text)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        TM
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text)" }}>
                          Auditor {m}
                        </div>
                        <div
                          style={{ fontSize: "0.8rem", color: "var(--text-2)" }}
                        >
                          Field Auditor
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-3)",
                            marginTop: "0.2rem",
                          }}
                        >
                          Focus: Revenue / Expenditure
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Team Logistics
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-3)" }}>
                        Accommodation:
                      </span>{" "}
                      <span style={{ fontWeight: 500 }}>
                        Lagos State Guest House, {lgaName}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-3)" }}>Transport:</span>{" "}
                      <span style={{ fontWeight: 500 }}>
                        Vehicle LAS-234-KD Assigned
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-3)" }}>Security:</span>{" "}
                      <span style={{ fontWeight: 500 }}>Standard Detail</span>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-3)" }}>Duration:</span>{" "}
                      <span style={{ fontWeight: 500 }}>
                        3 Weeks (Oct 20 - Nov 10)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreAudit;
