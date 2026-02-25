import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import ProfessionalTextarea from "../../components/UI/ProfessionalTextarea";
import ps from "../../styles/pages.module.css";
import {
  ShieldCheck,
  FileText,
  BookOpen,
  ClipboardList,
  Phone,
  Search,
  CheckCircle,
  Clock,
  Users,
  Laptop,
  Wifi,
  Car,
  Building2,
  Banknote,
} from "lucide-react";

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

const PreAudit: React.FC<{
  auditId?: string;
  embedded?: boolean;
}> = ({ auditId, embedded }) => {
  const { user } = useAuth();
  const {
    audits,
    lgas,
    letters,
    sendLetter,
    updateLetterStatus,
    updateAuditEntryMeeting,
  } = useAuditStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "engagement" | "letters" | "meetings" | "checklist" | "team"
  >("overview");
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    auditId: "",
    date: "",
    notes: "",
  });

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
    { id: "letters", label: "Notification Letters" },
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

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Navigation - Sidebar if embedded, Tabs if standalone */}
        <div
          style={
            embedded
              ? {
                  width: "240px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }
              : {
                  width: "100%",
                  display: "flex",
                  borderBottom: "1px solid #e2e8f0",
                  marginBottom: "1.5rem",
                  overflowX: "auto",
                }
          }
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={
                  embedded
                    ? {
                        textAlign: "left",
                        padding: "0.6rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        backgroundColor: isActive ? "#eff6ff" : "transparent",
                        color: isActive ? "#1d4ed8" : "#64748b",
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }
                    : {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 1rem",
                        background: "transparent",
                        border: "none",
                        borderBottom: isActive
                          ? "2px solid #0f172a"
                          : "2px solid transparent",
                        color: isActive ? "#0f172a" : "#64748b",
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === "overview" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
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
                          <div style={{ color: "var(--text-2)" }}>
                            {audit.type}
                          </div>
                          <div style={{ color: "var(--text-2)" }}>
                            Pre-Audit
                          </div>
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
                        {
                          label: "Notifications Sent",
                          date: "Oct 05",
                          done: true,
                        },
                        { label: "Team Assigned", date: "Oct 10", done: true },
                        {
                          label: "Entry Meetings",
                          date: "Oct 15",
                          done: false,
                        },
                        {
                          label: "Fieldwork Start",
                          date: "Oct 20",
                          done: false,
                        },
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
                              background: step.done
                                ? "#059669"
                                : "var(--border)",
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
                                height: "3px",
                                background: arr[i + 1].done
                                  ? "#059669"
                                  : "#e2e8f0",
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
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-3)",
                            }}
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
                                  letter.status === "Sent"
                                    ? "#059669"
                                    : "#d97706",
                              }}
                            >
                              {letter.status}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            Letter to {getLGAName(letter.lgaId)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-2)",
                            }}
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

          {activeTab === "engagement" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* ── 1. Per-Audit Engagement Lifecycle ── */}
              {myAudits.map((audit) => {
                const lgaName = getLGAName(audit.lgaId);
                const lifecycleSteps = [
                  {
                    label: "Assignment Received",
                    done: true,
                    note: "Invitation dispatched by Supervisor",
                  },
                  {
                    label: "Assignment Acknowledged",
                    done: audit.status !== "Pending",
                    note: "Acknowledgement recorded in system",
                  },
                  {
                    label: "COI Declaration Submitted",
                    done: audit.status !== "Pending",
                    note: "Independence form completed and filed",
                  },
                  {
                    label: "Engagement Letter Issued",
                    done: audit.status !== "Pending",
                    note: `Ref: EL-2024-${audit.lgaId.toUpperCase()}`,
                  },
                  {
                    label: "Audit Charter Reviewed",
                    done: false,
                    note: "LASG Standing Instructions 2024",
                  },
                  {
                    label: "Pre-Audit Briefing Held",
                    done: false,
                    note: "Team briefing by Audit Lead",
                  },
                  {
                    label: "Notification Letter Sent",
                    done: letters.some(
                      (l) => l.lgaId === audit.lgaId && l.status !== "Draft",
                    ),
                    note: "Formal notification to LGA officials",
                  },
                  {
                    label: "Preliminary Meeting Scheduled",
                    done: !!audit.entryMeetingDate,
                    note: audit.entryMeetingDate
                      ? `Scheduled ${new Date(audit.entryMeetingDate).toLocaleDateString("en-NG")}`
                      : "Entry meeting not yet set",
                  },
                ];
                const done = lifecycleSteps.filter((s) => s.done).length;

                return (
                  <Card
                    key={audit.id}
                    title={`${lgaName} — Engagement Lifecycle`}
                    subtitle={`${done}/${lifecycleSteps.length} steps complete`}
                  >
                    {/* Progress bar */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div
                        style={{
                          height: "6px",
                          background: "var(--border)",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(done / lifecycleSteps.length) * 100}%`,
                            background:
                              done === lifecycleSteps.length
                                ? "#16a34a"
                                : "#d97706",
                            borderRadius: "99px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                      }}
                    >
                      {lifecycleSteps.map((step, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor: step.done
                              ? "#bbf7d0"
                              : "var(--border)",
                            background: step.done ? "#f0fdf4" : "var(--bg)",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "0.1rem",
                              flexShrink: 0,
                              color: step.done ? "#16a34a" : "#94a3b8",
                            }}
                          >
                            {step.done ? (
                              <CheckCircle size={16} />
                            ) : (
                              <Clock size={16} />
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: step.done ? "#166534" : "var(--text)",
                              }}
                            >
                              {step.label}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: step.done ? "#166534" : "var(--text-3)",
                                marginTop: "0.15rem",
                              }}
                            >
                              {step.note}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}

              {/* ── 2. Initial Contact Log ── */}
              <Card
                title="Initial Contact Log"
                subtitle="Record of communications made with LGA officials prior to fieldwork"
              >
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.85rem",
                    }}
                  >
                    <thead
                      style={{
                        background: "#f8fafc",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <tr>
                        {[
                          "Date",
                          "Method",
                          "LGA Officer",
                          "Position",
                          "Purpose / Summary",
                          "Recorded By",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "0.75rem 1rem",
                              color: "var(--text-3)",
                              fontSize: "0.72rem",
                              textTransform: "uppercase",
                              fontWeight: 700,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: "2024-10-02",
                          method: "Phone",
                          officer: "Alhaji M. Yusuf",
                          position: "Council Treasurer",
                          purpose:
                            "Introduced audit team, requested preliminary docs",
                          by: "Audit Lead",
                        },
                        {
                          date: "2024-10-05",
                          method: "Email",
                          officer: "Mrs T. Okonkwo",
                          position: "HOD Finance",
                          purpose: "Forwarded document request list (14 items)",
                          by: "Audit Lead",
                        },
                        {
                          date: "2024-10-08",
                          method: "In-Person",
                          officer: "Hon. A. Adeyemi",
                          position: "Council Chairman",
                          purpose:
                            "Entry meeting confirmation; access and security briefing",
                          by: "Supervisor",
                        },
                        {
                          date: "2024-10-11",
                          method: "Email",
                          officer: "Mr S. Ibrahim",
                          position: "Internal Auditor",
                          purpose: "Requested prior internal audit reports",
                          by: "Team Auditor",
                        },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          style={{ borderBottom: "1px solid var(--border)" }}
                        >
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {new Date(row.date).toLocaleDateString("en-NG")}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                fontWeight: 600,
                                fontSize: "0.78rem",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "4px",
                                background:
                                  row.method === "Phone"
                                    ? "#ede9fe"
                                    : row.method === "Email"
                                      ? "#dbeafe"
                                      : "#d1fae5",
                                color:
                                  row.method === "Phone"
                                    ? "#4c1d95"
                                    : row.method === "Email"
                                      ? "#1e40af"
                                      : "#065f46",
                              }}
                            >
                              {row.method === "Phone" ? (
                                <Phone size={11} />
                              ) : row.method === "Email" ? (
                                <FileText size={11} />
                              ) : (
                                <Users size={11} />
                              )}
                              {row.method}
                            </span>
                          </td>
                          <td
                            style={{ padding: "0.75rem 1rem", fontWeight: 600 }}
                          >
                            {row.officer}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-2)",
                            }}
                          >
                            {row.position}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-2)",
                              maxWidth: "260px",
                            }}
                          >
                            {row.purpose}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              color: "var(--text-3)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {row.by}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(user.role === "AUDIT_LEAD" ||
                  user.role === "AUDIT_SUPERVISOR") && (
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        padding: "0.5rem 1.2rem",
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Phone size={14} /> Log New Contact
                    </button>
                  </div>
                )}
              </Card>

              {/* ── 3. Background Research ── */}
              <Card
                title="Background Research & Reference Documents"
                subtitle="Prior audit findings, PAC reports, and institutional references"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      icon: <Search size={18} style={{ color: "#4f46e5" }} />,
                      title: "Prior Year Audit Report (2022/2023)",
                      desc: "LASG AG Office — Final Issued Report",
                      tag: "Regulatory",
                      tagColor: "#ede9fe",
                      tagText: "#4c1d95",
                    },
                    {
                      icon: <Search size={18} style={{ color: "#0891b2" }} />,
                      title: "Public Accounts Committee Report",
                      desc: "LASG House Committee — Q3 2023 Recommendations",
                      tag: "Legislative",
                      tagColor: "#dbeafe",
                      tagText: "#1e40af",
                    },
                    {
                      icon: <FileText size={18} style={{ color: "#16a34a" }} />,
                      title: "Internal Audit Unit Reports (LGA)",
                      desc: "Quarterly Internal Audit Reports — FY 2023",
                      tag: "Internal",
                      tagColor: "#d1fae5",
                      tagText: "#065f46",
                    },
                    {
                      icon: <BookOpen size={18} style={{ color: "#d97706" }} />,
                      title: "IPSAS Compliance Assessment",
                      desc: "International Public Sector Accounting Standards review",
                      tag: "Standards",
                      tagColor: "#fef3c7",
                      tagText: "#92400e",
                    },
                    {
                      icon: <FileText size={18} style={{ color: "#dc2626" }} />,
                      title: "Outstanding Audit Queries (3-yr)",
                      desc: "Unresolved queries from prior audit cycles",
                      tag: "High Priority",
                      tagColor: "#fee2e2",
                      tagText: "#991b1b",
                    },
                    {
                      icon: (
                        <Building2 size={18} style={{ color: "#6b7280" }} />
                      ),
                      title: "LGA Organogram & Key Personnel",
                      desc: "Current organizational structure and contacts",
                      tag: "Reference",
                      tagColor: "#f3f4f6",
                      tagText: "#374151",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1rem",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.85rem",
                        background: "var(--bg-card)",
                      }}
                    >
                      <div style={{ marginTop: "0.1rem", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "0.775rem",
                            color: "var(--text-3)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.desc}
                        </div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            background: item.tagColor,
                            color: item.tagText,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <button
                        style={{
                          padding: "0.3rem 0.65rem",
                          fontSize: "0.775rem",
                          background: "none",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "var(--primary)",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        Access
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "letters" && (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <Card
                title="Notification Letters"
                subtitle="Manage and send audit notification letters to LGAs"
              >
                {letters.filter((l) =>
                  myAudits.some((a) => a.lgaId === l.lgaId),
                ).length === 0 ? (
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-3)",
                    }}
                  >
                    No letters have been generated for your assigned audits yet.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {letters
                      .filter((l) => myAudits.some((a) => a.lgaId === l.lgaId))
                      .map((letter) => {
                        const lgaName = getLGAName(letter.lgaId);
                        const canSend =
                          user.role === "AUDIT_LEAD" &&
                          letter.status === "Draft";

                        return (
                          <div
                            key={letter.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "1.25rem",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              background: "var(--bg-card)",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Notification Letter - {lgaName}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "var(--text-2)",
                                  display: "flex",
                                  gap: "1rem",
                                  alignItems: "center",
                                }}
                              >
                                <span>Ref: {letter.id}</span>
                                <span>•</span>
                                <Badge status={letter.status} />
                                {letter.sentAt && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Sent:{" "}
                                      {new Date(
                                        letter.sentAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                              <button
                                style={{
                                  padding: "0.5rem 1rem",
                                  background: "none",
                                  border: "1px solid var(--border)",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  color: "var(--text)",
                                }}
                              >
                                Preview
                              </button>
                              {canSend && (
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Are you sure you want to send this letter to ${lgaName}?`,
                                      )
                                    ) {
                                      sendLetter(letter.id);
                                    }
                                  }}
                                  style={{
                                    padding: "0.5rem 1rem",
                                    background: "var(--primary)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  Send Letter
                                </button>
                              )}
                              {letter.status === "Sent" &&
                                user.role === "AUDIT_SUPERVISOR" && (
                                  <button
                                    onClick={() =>
                                      updateLetterStatus(
                                        letter.id,
                                        "Acknowledged",
                                      )
                                    }
                                    style={{
                                      padding: "0.5rem 1rem",
                                      background: "var(--bg-card)",
                                      color: "var(--primary)",
                                      border: "1px solid var(--primary)",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    Mark Acknowledged
                                  </button>
                                )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === "meetings" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
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
                      onClick={() => {
                        if (myAudits.length > 0) {
                          setMeetingForm({
                            auditId: myAudits[0].id,
                            date: "",
                            notes: "",
                          });
                          setShowMeetingModal(true);
                        }
                      }}
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
                            style={{
                              margin: 0,
                              fontSize: "1rem",
                              fontWeight: 700,
                            }}
                          >
                            {meeting.lgaName} LGA
                          </h3>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-3)",
                            }}
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
                              style={{
                                padding: "0.75rem 1rem",
                                fontWeight: 500,
                              }}
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
                                  background: isReceived
                                    ? "#ecfdf5"
                                    : "#fffbeb",
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
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
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
                      <span
                        style={{ fontSize: "0.85rem", color: "var(--text-2)" }}
                      >
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
                      <span
                        style={{ fontSize: "0.85rem", color: "var(--text-2)" }}
                      >
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
                      <span
                        style={{ fontSize: "0.85rem", color: "var(--text-2)" }}
                      >
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
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(280px, 1fr))",
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
                          <div
                            style={{ fontWeight: 700, color: "var(--text)" }}
                          >
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
                            <div
                              style={{ fontWeight: 700, color: "var(--text)" }}
                            >
                              Auditor {m}
                            </div>
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--text-2)",
                              }}
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
                          <span style={{ color: "var(--text-3)" }}>
                            Transport:
                          </span>{" "}
                          <span style={{ fontWeight: 500 }}>
                            Vehicle LAS-234-KD Assigned
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem" }}>
                          <span style={{ color: "var(--text-3)" }}>
                            Security:
                          </span>{" "}
                          <span style={{ fontWeight: 500 }}>
                            Standard Detail
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem" }}>
                          <span style={{ color: "var(--text-3)" }}>
                            Duration:
                          </span>{" "}
                          <span style={{ fontWeight: 500 }}>
                            3 Weeks (Oct 20 - Nov 10)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* ── Pre-Audit Team Briefing Record ── */}
              <Card
                title="Pre-Audit Team Briefing Record"
                subtitle="Briefing held by the Audit Lead before fieldwork commencement"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          color: "var(--text-3)",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Briefing Details
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem",
                        }}
                      >
                        {[
                          { label: "Date", value: "October 18, 2024" },
                          {
                            label: "Venue",
                            value: "LASG Audit Conference Room, Block C",
                          },
                          {
                            label: "Chaired By",
                            value: "Audit Lead — Engr. J. Okafor",
                          },
                          { label: "Duration", value: "2 hours 30 minutes" },
                          { label: "Minutes Ref", value: "BRIEF-2024-IKJ-001" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--text-3)",
                                minWidth: "100px",
                              }}
                            >
                              {item.label}:
                            </span>
                            <span style={{ fontWeight: 500 }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          color: "var(--text-3)",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Key Agenda Items
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "1.2rem",
                          fontSize: "0.875rem",
                          color: "var(--text-2)",
                          lineHeight: 1.8,
                        }}
                      >
                        <li>Review of audit scope, objectives and mandate</li>
                        <li>
                          Role and responsibility assignment per team member
                        </li>
                        <li>Briefing on LGA background and known risk areas</li>
                        <li>
                          Document request list and evidence gathering strategy
                        </li>
                        <li>
                          Team logistics, accommodation and transport
                          arrangements
                        </li>
                        <li>Communication protocol with LGA officials</li>
                        <li>
                          Confidentiality and professional conduct expectations
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        color: "var(--text-3)",
                        fontWeight: 700,
                        marginBottom: "0.75rem",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Attendance Register
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {[
                        {
                          name: "Engr. J. Okafor",
                          role: "Audit Lead",
                          attended: true,
                        },
                        {
                          name: "Ms. A. Bello",
                          role: "Team Auditor",
                          attended: true,
                        },
                        {
                          name: "Mr. T. Adeleke",
                          role: "Team Auditor",
                          attended: true,
                        },
                        {
                          name: "Dr. N. Eze",
                          role: "Team Auditor",
                          attended: true,
                        },
                        {
                          name: "Mrs. K. Johnson",
                          role: "Admin Support",
                          attended: false,
                        },
                      ].map((person, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.6rem 0.75rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: person.attended
                              ? "#f0fdf4"
                              : "var(--bg)",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: person.attended
                                ? "#16a34a"
                                : "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: person.attended
                                ? "white"
                                : "var(--text-3)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {person.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{ fontWeight: 600, fontSize: "0.85rem" }}
                            >
                              {person.name}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--text-3)",
                              }}
                            >
                              {person.role}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "0.2rem 0.55rem",
                              borderRadius: "4px",
                              background: person.attended
                                ? "#bbf7d0"
                                : "#fee2e2",
                              color: person.attended ? "#166534" : "#991b1b",
                            }}
                          >
                            {person.attended ? "Present" : "Absent"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "0.75rem",
                      }}
                    >
                      <button
                        style={{
                          flex: 1,
                          padding: "0.5rem 1rem",
                          background: "none",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        📄 Download Minutes
                      </button>
                      {user.role === "AUDIT_LEAD" && (
                        <button
                          style={{
                            flex: 1,
                            padding: "0.5rem 1rem",
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            justifyContent: "center",
                          }}
                        >
                          <ClipboardList size={13} /> Record New Briefing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── Resource Planning Checklist ── */}
              <Card
                title="Resource Planning Checklist"
                subtitle="Equipment, logistics, and operational readiness for fieldwork"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      icon: <Laptop size={18} style={{ color: "#4f46e5" }} />,
                      item: "Laptop / Audit Workstation",
                      status: "Ready",
                      responsible: "IT Dept / Each Auditor",
                      note: "Configured with audit software and VPN access",
                    },
                    {
                      icon: <Wifi size={18} style={{ color: "#0891b2" }} />,
                      item: "Internet Access & VPN",
                      status: "Ready",
                      responsible: "IT Dept",
                      note: "Secure remote access to LASG audit portal",
                    },
                    {
                      icon: <Car size={18} style={{ color: "#16a34a" }} />,
                      item: "Transport Arrangement",
                      status: "Ready",
                      responsible: "Admin",
                      note: "Vehicle LAS-234-KD confirmed and assigned",
                    },
                    {
                      icon: (
                        <Building2 size={18} style={{ color: "#d97706" }} />
                      ),
                      item: "Office Space at LGA",
                      status: "Pending",
                      responsible: "LGA — HOD Admin",
                      note: "Awaiting confirmation from Council Clerk",
                    },
                    {
                      icon: <FileText size={18} style={{ color: "#dc2626" }} />,
                      item: "Audit Working Paper Templates",
                      status: "Ready",
                      responsible: "Audit Lead",
                      note: "Standard LASG AG templates loaded in drive",
                    },
                    {
                      icon: (
                        <ShieldCheck size={18} style={{ color: "#7c3aed" }} />
                      ),
                      item: "Security Briefing & Protocol",
                      status: "Ready",
                      responsible: "Audit Lead",
                      note: "Standard security detail confirmed",
                    },
                    {
                      icon: <Banknote size={18} style={{ color: "#059669" }} />,
                      item: "Per Diem & Team Allowances",
                      status: "Pending",
                      responsible: "Finance — LASG AG",
                      note: "Requisition submitted; approval pending",
                    },
                    {
                      icon: <Users size={18} style={{ color: "#6b7280" }} />,
                      item: "LGA Liaison Contact List",
                      status: "Ready",
                      responsible: "Audit Lead",
                      note: "All key officer contacts confirmed and shared",
                    },
                  ].map((resource, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "1rem",
                        border: "1px solid",
                        borderColor:
                          resource.status === "Ready"
                            ? "#bbf7d0"
                            : "var(--border)",
                        borderRadius: "6px",
                        background:
                          resource.status === "Ready"
                            ? "#f0fdf4"
                            : "var(--bg-card)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {resource.icon}
                        <div
                          style={{
                            flex: 1,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {resource.item}
                        </div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "4px",
                            background:
                              resource.status === "Ready"
                                ? "#bbf7d0"
                                : "#fef3c7",
                            color:
                              resource.status === "Ready"
                                ? "#166534"
                                : "#92400e",
                          }}
                        >
                          {resource.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.775rem",
                          color: "var(--text-3)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Responsible:</span>{" "}
                        {resource.responsible}
                      </div>
                      <div
                        style={{ fontSize: "0.775rem", color: "var(--text-2)" }}
                      >
                        {resource.note}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {showMeetingModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "var(--bg-card)",
                  padding: "2rem",
                  borderRadius: "8px",
                  minWidth: "400px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 style={{ marginBottom: "1.5rem" }}>
                  Schedule Entry Meeting
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Audit / LGA
                    </label>
                    <select
                      value={meetingForm.auditId}
                      onChange={(e) =>
                        setMeetingForm({
                          ...meetingForm,
                          auditId: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    >
                      {myAudits.map((a) => (
                        <option key={a.id} value={a.id}>
                          {getLGAName(a.lgaId)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) =>
                        setMeetingForm({ ...meetingForm, date: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <div>
                    <ProfessionalTextarea
                      label="Notes / Agenda"
                      value={meetingForm.notes}
                      rows={4}
                      onChange={(e) =>
                        setMeetingForm({
                          ...meetingForm,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Enter meeting notes here..."
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      onClick={() => setShowMeetingModal(false)}
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        updateAuditEntryMeeting(
                          meetingForm.auditId,
                          meetingForm.date,
                          meetingForm.notes,
                        );
                        setShowMeetingModal(false);
                      }}
                      disabled={!meetingForm.date}
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: "var(--primary)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        opacity: !meetingForm.date ? 0.5 : 1,
                      }}
                    >
                      Save Meeting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreAudit;
