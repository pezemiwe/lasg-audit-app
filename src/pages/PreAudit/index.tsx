import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import ProfessionalTextarea from "../../components/UI/ProfessionalTextarea";
import ps from "../../styles/pages.module.css";
import {
  ShieldCheck,
  FileText,
  ClipboardList,
  CheckCircle,
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
    users,
    sendLetter,
    updateLetterStatus,
    addIndependenceDeclaration,
    getIndependenceDeclarations,
    addBriefingRecord,
    addEntryMeetingRecord,
  } = useAuditStore();

  const [activeTab, setActiveTab] = useState<"letters" | "meetings" | "team">(
    "letters",
  );
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [showDeclForm, setShowDeclForm] = useState(false);
  const [declForm, setDeclForm] = useState({ threats: "", safeguards: "" });
  const [meetingForm, setMeetingForm] = useState({
    auditId: "",
    date: "",
    notes: "",
    agendaItems: [{ action: "", timeline: "", responsibility: "" }],
  });
  const [briefingForm, setBriefingForm] = useState({
    auditId: "",
    date: "",
    venue: "",
    agendaItems: [{ action: "", timeline: "", responsibility: "" }],
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

  const tabs = [
    { id: "letters", label: "Notification Letters" },
    { id: "meetings", label: "Meetings" },
    { id: "team", label: "Team Status" },
  ] as const;

  const meetingAudit =
    myAudits.find((a) => a.id === meetingForm.auditId) ?? myAudits[0];
  const briefingAudit =
    myAudits.find((a) => a.id === briefingForm.auditId) ?? myAudits[0];
  const getTeamMembers = (audit: (typeof myAudits)[0] | undefined) =>
    users.filter(
      (u) => u.id === audit?.leadId || (audit?.teamIds ?? []).includes(u.id),
    );
  const meetingTeamMembers = getTeamMembers(meetingAudit);
  const briefingTeamMembers = getTeamMembers(briefingAudit);

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

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
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
              {/* ── Action buttons for Audit Lead ── */}
              {user.role === "AUDIT_LEAD" && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => {
                      setBriefingForm({
                        auditId: myAudits[0]?.id ?? "",
                        date: "",
                        venue: "",
                        agendaItems: [
                          { action: "", timeline: "", responsibility: "" },
                        ],
                      });
                      setShowBriefingModal(true);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "var(--bg-card)",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <ClipboardList size={14} /> Record New Briefing
                  </button>
                  <button
                    onClick={() => {
                      setMeetingForm({
                        auditId: myAudits[0]?.id ?? "",
                        date: "",
                        notes: "",
                        agendaItems: [
                          { action: "", timeline: "", responsibility: "" },
                        ],
                      });
                      setShowMeetingModal(true);
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
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    + Record Entry Meeting
                  </button>
                </div>
              )}

              {/* ── Briefing Records ── */}
              {myAudits.some((a) => (a.briefings ?? []).length > 0) && (
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-3)",
                    }}
                  >
                    Team Briefing Records
                  </div>
                  {myAudits.flatMap((a) =>
                    (a.briefings ?? []).map((b) => (
                      <div
                        key={b.id}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.85rem 1.25rem",
                            background: "var(--bg)",
                            borderBottom: "1px solid var(--border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{ fontWeight: 700, fontSize: "0.95rem" }}
                            >
                              Team Briefing —{" "}
                              {new Date(b.date).toLocaleDateString()}
                            </div>
                            {b.venue && (
                              <div
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                {b.venue}
                              </div>
                            )}
                          </div>
                          <Badge status="Completed" />
                        </div>
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              fontWeight: 700,
                              color: "var(--text-3)",
                              marginBottom: "0.5rem",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Agenda & Actions
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            {b.agendaItems.map((item, i) => (
                              <div
                                key={i}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "2fr 1fr 1fr",
                                  gap: "0.75rem",
                                  padding: "0.6rem 0.75rem",
                                  borderRadius: "4px",
                                  background: "var(--bg)",
                                  border: "1px solid var(--border)",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      color: "var(--text-3)",
                                      fontSize: "0.72rem",
                                    }}
                                  >
                                    Action:
                                  </span>{" "}
                                  {item.action}
                                </div>
                                {item.timeline && (
                                  <div>
                                    <span
                                      style={{
                                        color: "var(--text-3)",
                                        fontSize: "0.72rem",
                                      }}
                                    >
                                      Timeline:
                                    </span>{" "}
                                    {item.timeline}
                                  </div>
                                )}
                                {item.responsibility && (
                                  <div>
                                    <span
                                      style={{
                                        color: "var(--text-3)",
                                        fontSize: "0.72rem",
                                      }}
                                    >
                                      Responsible:
                                    </span>{" "}
                                    {item.responsibility}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              marginTop: "0.75rem",
                              fontSize: "0.75rem",
                              color: "var(--text-3)",
                            }}
                          >
                            Recorded by {b.recordedBy} on{" "}
                            {new Date(b.recordedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )),
                  )}
                </div>
              )}

              {/* ── Entry Meetings ── */}
              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-3)",
                  }}
                >
                  Entry Meetings
                </div>
                {myAudits.flatMap((a) => a.entryMeetings ?? []).length === 0 &&
                entryMeetings.length === 0 ? (
                  <Card title="Entry Meeting Log">
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--text-3)",
                      }}
                    >
                      No entry meetings recorded yet.
                    </div>
                  </Card>
                ) : (
                  <>
                    {/* New-style entry meetings from the array */}
                    {myAudits.flatMap((a) =>
                      (a.entryMeetings ?? []).map((em) => (
                        <div
                          key={em.id}
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              padding: "0.85rem 1.25rem",
                              background: "var(--bg)",
                              borderBottom: "1px solid var(--border)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div
                                style={{ fontWeight: 700, fontSize: "0.95rem" }}
                              >
                                Entry Meeting — {getLGAName(a.lgaId)} LGA
                              </div>
                              <div
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                {new Date(em.date).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge status="Scheduled" />
                          </div>
                          <div style={{ padding: "1rem 1.25rem" }}>
                            {em.notes && (
                              <div
                                style={{
                                  marginBottom: "0.75rem",
                                  fontSize: "0.85rem",
                                  color: "var(--text-2)",
                                  background: "var(--bg)",
                                  padding: "0.75rem",
                                  borderRadius: "4px",
                                }}
                              >
                                {em.notes}
                              </div>
                            )}
                            <div
                              style={{
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                color: "var(--text-3)",
                                marginBottom: "0.5rem",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Agenda & Actions
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                              }}
                            >
                              {em.agendaItems.map((item, i) => (
                                <div
                                  key={i}
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr",
                                    gap: "0.75rem",
                                    padding: "0.6rem 0.75rem",
                                    borderRadius: "4px",
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        color: "var(--text-3)",
                                        fontSize: "0.72rem",
                                      }}
                                    >
                                      Action:
                                    </span>{" "}
                                    {item.action}
                                  </div>
                                  {item.timeline && (
                                    <div>
                                      <span
                                        style={{
                                          color: "var(--text-3)",
                                          fontSize: "0.72rem",
                                        }}
                                      >
                                        Timeline:
                                      </span>{" "}
                                      {item.timeline}
                                    </div>
                                  )}
                                  {item.responsibility && (
                                    <div>
                                      <span
                                        style={{
                                          color: "var(--text-3)",
                                          fontSize: "0.72rem",
                                        }}
                                      >
                                        Responsible:
                                      </span>{" "}
                                      {item.responsibility}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )),
                    )}
                    {/* Legacy entry meetings */}
                    {entryMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.85rem 1.25rem",
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
                                minHeight: "80px",
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
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {/* ── Independence & Ethics Declarations ── */}
              {myAudits.map((audit) => {
                const lgaName = getLGAName(audit.lgaId);
                const declarations = getIndependenceDeclarations(audit.id);
                const teamMembers = users.filter(
                  (u) =>
                    u.id === audit.leadId ||
                    (audit.teamIds || []).includes(u.id),
                );
                const allDeclared =
                  teamMembers.length > 0 &&
                  teamMembers.every((tm) =>
                    declarations.some(
                      (d) => d.auditorId === tm.id && d.confirmed,
                    ),
                  );

                return (
                  <Card
                    key={`ind-${audit.id}`}
                    title={`${lgaName} — Independence & Ethics Declarations`}
                    subtitle={`${declarations.filter((d) => d.confirmed).length}/${teamMembers.length || 1} declarations filed`}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            background: "var(--border)",
                            borderRadius: "99px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${teamMembers.length > 0 ? (declarations.filter((d) => d.confirmed).length / teamMembers.length) * 100 : 0}%`,
                              background: allDeclared ? "#16a34a" : "#d97706",
                              borderRadius: "99px",
                              transition: "width 0.4s",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: allDeclared ? "#16a34a" : "#d97706",
                          }}
                        >
                          {allDeclared ? "ALL FILED" : "PENDING"}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f0f9ff",
                        border: "1px solid #bae6fd",
                        borderRadius: "6px",
                        padding: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "#0c4a6e",
                          marginBottom: "0.5rem",
                        }}
                      >
                        ISA 220 — Quality Management for an Audit
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#0369a1",
                          lineHeight: 1.6,
                        }}
                      >
                        Each member of the engagement team must confirm their
                        independence from the audited entity before the
                        commencement of fieldwork. Any threats to independence
                        must be identified together with appropriate safeguards.
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {(teamMembers.length > 0
                        ? teamMembers
                        : [{ id: user!.id, name: user!.name, role: user!.role }]
                      ).map((member) => {
                        const decl = declarations.find(
                          (d) => d.auditorId === member.id,
                        );
                        const isSelf = member.id === user!.id;
                        return (
                          <div
                            key={member.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                              padding: "1rem",
                              borderRadius: "6px",
                              border: "1px solid",
                              borderColor: decl?.confirmed
                                ? "#bbf7d0"
                                : "var(--border)",
                              background: decl?.confirmed
                                ? "#f0fdf4"
                                : "var(--bg-card)",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: decl?.confirmed
                                  ? "#16a34a"
                                  : "#e5e7eb",
                                color: decl?.confirmed
                                  ? "white"
                                  : "var(--text-3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                flexShrink: 0,
                              }}
                            >
                              {member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {member.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-3)",
                                }}
                              >
                                {member.role.replace(/_/g, " ")}
                              </div>
                              {decl && decl.threats.length > 0 && (
                                <div style={{ marginTop: "0.35rem" }}>
                                  {decl.threats.map((t, ti) => (
                                    <span
                                      key={ti}
                                      style={{
                                        fontSize: "0.68rem",
                                        fontWeight: 600,
                                        padding: "0.1rem 0.4rem",
                                        borderRadius: "3px",
                                        background: "#fef3c7",
                                        color: "#92400e",
                                        marginRight: "0.35rem",
                                      }}
                                    >
                                      Threat: {t}
                                    </span>
                                  ))}
                                  {decl.safeguards.map((sg, si) => (
                                    <span
                                      key={si}
                                      style={{
                                        fontSize: "0.68rem",
                                        fontWeight: 600,
                                        padding: "0.1rem 0.4rem",
                                        borderRadius: "3px",
                                        background: "#d1fae5",
                                        color: "#065f46",
                                        marginRight: "0.35rem",
                                      }}
                                    >
                                      Safeguard: {sg}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {decl?.confirmed ? (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    padding: "0.3rem 0.75rem",
                                    borderRadius: "4px",
                                    background: "#bbf7d0",
                                    color: "#166534",
                                  }}
                                >
                                  <CheckCircle size={13} /> Declared{" "}
                                  {new Date(
                                    decl.declarationDate,
                                  ).toLocaleDateString("en-NG")}
                                </span>
                              ) : isSelf ? (
                                <button
                                  onClick={() => {
                                    setShowDeclForm(true);
                                    setDeclForm({
                                      threats: "",
                                      safeguards: "",
                                    });
                                  }}
                                  style={{
                                    padding: "0.4rem 0.85rem",
                                    background: "#064e3b",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  File Declaration
                                </button>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    padding: "0.3rem 0.75rem",
                                    borderRadius: "4px",
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                  }}
                                >
                                  Not Filed
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {showDeclForm && (
                      <div
                        style={{
                          marginTop: "1.5rem",
                          padding: "1.5rem",
                          background: "#f8fafc",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            marginBottom: "1rem",
                          }}
                        >
                          Independence & Ethics Declaration
                        </div>
                        <div
                          style={{
                            background: "#fff",
                            padding: "1.25rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            marginBottom: "1rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.85rem",
                              lineHeight: 1.8,
                              color: "var(--text-2)",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 0.75rem 0",
                                fontWeight: 600,
                              }}
                            >
                              I, {user!.name}, hereby declare that:
                            </p>
                            <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                              <li>
                                I have no financial interest, direct or
                                indirect, in the audited entity.
                              </li>
                              <li>
                                I have no personal or family relationship with
                                key officials of the entity.
                              </li>
                              <li>
                                I have not provided non-audit services to the
                                entity in the current or prior period.
                              </li>
                              <li>
                                I am not aware of any other circumstance that
                                may compromise objectivity.
                              </li>
                              <li>
                                I will conduct this engagement in accordance
                                with ISSAI and ISA professional standards.
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <div>
                            <label
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "var(--text-3)",
                                display: "block",
                                marginBottom: "0.35rem",
                              }}
                            >
                              Identified Threats (if any)
                            </label>
                            <input
                              value={declForm.threats}
                              onChange={(e) =>
                                setDeclForm({
                                  ...declForm,
                                  threats: e.target.value,
                                })
                              }
                              placeholder="e.g. Familiarity — previously audited same entity"
                              style={{
                                width: "100%",
                                padding: "0.6rem 0.75rem",
                                border: "1.5px solid var(--border)",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                              }}
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: "var(--text-3)",
                                display: "block",
                                marginBottom: "0.35rem",
                              }}
                            >
                              Safeguards Applied
                            </label>
                            <input
                              value={declForm.safeguards}
                              onChange={(e) =>
                                setDeclForm({
                                  ...declForm,
                                  safeguards: e.target.value,
                                })
                              }
                              placeholder="e.g. Peer review of all work by independent supervisor"
                              style={{
                                width: "100%",
                                padding: "0.6rem 0.75rem",
                                border: "1.5px solid var(--border)",
                                borderRadius: "4px",
                                fontSize: "0.85rem",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.75rem",
                          }}
                        >
                          <button
                            onClick={() => setShowDeclForm(false)}
                            style={{
                              padding: "0.5rem 1rem",
                              border: "1.5px solid var(--border)",
                              borderRadius: "4px",
                              background: "transparent",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              addIndependenceDeclaration({
                                auditId: audit.id,
                                auditorId: user!.id,
                                auditorName: user!.name,
                                confirmed: true,
                                threats: declForm.threats
                                  ? declForm.threats
                                      .split(",")
                                      .map((t) => t.trim())
                                      .filter(Boolean)
                                  : [],
                                safeguards: declForm.safeguards
                                  ? declForm.safeguards
                                      .split(",")
                                      .map((sg) => sg.trim())
                                      .filter(Boolean)
                                  : [],
                                declarationDate: new Date().toISOString(),
                              });
                              setShowDeclForm(false);
                            }}
                            style={{
                              padding: "0.5rem 1.25rem",
                              background: "#064e3b",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <ShieldCheck size={14} /> Confirm & Sign Declaration
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}

              {/* ── Team Roster ── */}
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

              {/* ── Pre-Audit Team Briefing Record (moved to Meetings tab) ── */}
              <Card
                title="Pre-Audit Team Briefing Record"
                subtitle="Briefing held by the Audit Lead before fieldwork commencement — view full records in the Meetings tab"
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
                          onClick={() => {
                            setBriefingForm({
                              auditId: myAudits[0]?.id ?? "",
                              date: "",
                              venue: "",
                              agendaItems: [
                                {
                                  action: "",
                                  timeline: "",
                                  responsibility: "",
                                },
                              ],
                            });
                            setShowBriefingModal(true);
                          }}
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

          {/* ── Entry Meeting Modal ── */}
          {showMeetingModal &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                  zIndex: 2147483000,
                  isolation: "isolate",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: -9,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    background: "#fff",
                    padding: "2rem",
                    borderRadius: "8px",
                    width: "600px",
                    maxWidth: "95vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h3 style={{ marginBottom: "1.5rem", fontWeight: 700 }}>
                    Record Entry Meeting
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
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "var(--text-3)",
                          marginBottom: "0.35rem",
                        }}
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        value={meetingForm.date}
                        onChange={(e) =>
                          setMeetingForm({
                            ...meetingForm,
                            date: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.75rem",
                          border: "1.5px solid var(--border)",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                    <div>
                      <ProfessionalTextarea
                        label="General Notes"
                        value={meetingForm.notes}
                        rows={2}
                        onChange={(e) =>
                          setMeetingForm({
                            ...meetingForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Optional general notes..."
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-3)",
                          }}
                        >
                          Agenda / Action Items
                        </label>
                        <button
                          onClick={() =>
                            setMeetingForm({
                              ...meetingForm,
                              agendaItems: [
                                ...meetingForm.agendaItems,
                                {
                                  action: "",
                                  timeline: "",
                                  responsibility: "",
                                },
                              ],
                            })
                          }
                          style={{
                            fontSize: "0.78rem",
                            padding: "0.2rem 0.6rem",
                            border: "1px solid var(--primary)",
                            borderRadius: "4px",
                            background: "transparent",
                            color: "var(--primary)",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          + Add Item
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {meetingForm.agendaItems.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.4rem",
                              padding: "0.75rem",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              background: "var(--bg)",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr auto",
                                gap: "0.5rem",
                                alignItems: "end",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "var(--text-3)",
                                    display: "block",
                                    marginBottom: "0.2rem",
                                  }}
                                >
                                  Action / Agenda
                                </label>
                                <input
                                  value={item.action}
                                  onChange={(e) => {
                                    const items = [...meetingForm.agendaItems];
                                    items[i] = {
                                      ...items[i],
                                      action: e.target.value,
                                    };
                                    setMeetingForm({
                                      ...meetingForm,
                                      agendaItems: items,
                                    });
                                  }}
                                  placeholder="Key agenda or action"
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem 0.6rem",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "var(--text-3)",
                                    display: "block",
                                    marginBottom: "0.2rem",
                                  }}
                                >
                                  Timeline
                                </label>
                                <input
                                  value={item.timeline ?? ""}
                                  onChange={(e) => {
                                    const items = [...meetingForm.agendaItems];
                                    items[i] = {
                                      ...items[i],
                                      timeline: e.target.value,
                                    };
                                    setMeetingForm({
                                      ...meetingForm,
                                      agendaItems: items,
                                    });
                                  }}
                                  placeholder="e.g. 2 weeks"
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem 0.6rem",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                  }}
                                />
                              </div>
                              {meetingForm.agendaItems.length > 1 && (
                                <button
                                  onClick={() =>
                                    setMeetingForm({
                                      ...meetingForm,
                                      agendaItems:
                                        meetingForm.agendaItems.filter(
                                          (_, j) => j !== i,
                                        ),
                                    })
                                  }
                                  style={{
                                    padding: "0.5rem 0.6rem",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "4px",
                                    background: "#fff1f2",
                                    color: "#dc2626",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <div>
                              <label
                                style={{
                                  fontSize: "0.72rem",
                                  color: "var(--text-3)",
                                  display: "block",
                                  marginBottom: "0.2rem",
                                }}
                              >
                                Responsibility
                              </label>
                              <select
                                value={item.responsibility ?? ""}
                                onChange={(e) => {
                                  const items = [...meetingForm.agendaItems];
                                  items[i] = {
                                    ...items[i],
                                    responsibility: e.target.value,
                                  };
                                  setMeetingForm({
                                    ...meetingForm,
                                    agendaItems: items,
                                  });
                                }}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem 0.6rem",
                                  border: "1.5px solid var(--border)",
                                  borderRadius: "4px",
                                  fontSize: "0.82rem",
                                }}
                              >
                                <option value="">— Select member —</option>
                                {meetingTeamMembers.map((m) => (
                                  <option key={m.id} value={m.name}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
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
                          padding: "0.65rem 1.25rem",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          addEntryMeetingRecord(meetingForm.auditId, {
                            date: meetingForm.date,
                            notes: meetingForm.notes,
                            agendaItems: meetingForm.agendaItems.filter((it) =>
                              it.action.trim(),
                            ),
                            recordedBy: user!.name,
                          });
                          setShowMeetingModal(false);
                        }}
                        disabled={
                          !meetingForm.date ||
                          !meetingForm.agendaItems.some((it) =>
                            it.action.trim(),
                          )
                        }
                        style={{
                          padding: "0.65rem 1.25rem",
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          opacity:
                            !meetingForm.date ||
                            !meetingForm.agendaItems.some((it) =>
                              it.action.trim(),
                            )
                              ? 0.5
                              : 1,
                        }}
                      >
                        Save Meeting
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body,
            )}

          {/* ── Briefing Modal ── */}
          {showBriefingModal &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                  zIndex: 2147483000,
                  isolation: "isolate",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    background: "var(--bg-card)",
                    padding: "2rem",
                    borderRadius: "8px",
                    width: "620px",
                    maxWidth: "95vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                    border: "1px solid var(--border)",
                    backgroundColor: "#fff",
                  }}
                >
                  <h3 style={{ marginBottom: "0.25rem", fontWeight: 700 }}>
                    Record Team Briefing
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-3)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Pre-fieldwork briefing conducted by the Audit Lead
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-3)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          value={briefingForm.date}
                          onChange={(e) =>
                            setBriefingForm({
                              ...briefingForm,
                              date: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-3)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          Venue (optional)
                        </label>
                        <input
                          type="text"
                          value={briefingForm.venue}
                          onChange={(e) =>
                            setBriefingForm({
                              ...briefingForm,
                              venue: e.target.value,
                            })
                          }
                          placeholder="e.g. LASG Conference Room B"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-3)",
                          }}
                        >
                          Key Agenda / Action Items
                        </label>
                        <button
                          onClick={() =>
                            setBriefingForm({
                              ...briefingForm,
                              agendaItems: [
                                ...briefingForm.agendaItems,
                                {
                                  action: "",
                                  timeline: "",
                                  responsibility: "",
                                },
                              ],
                            })
                          }
                          style={{
                            fontSize: "0.78rem",
                            padding: "0.2rem 0.6rem",
                            border: "1px solid var(--primary)",
                            borderRadius: "4px",
                            background: "transparent",
                            color: "var(--primary)",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          + Add Item
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {briefingForm.agendaItems.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.4rem",
                              padding: "0.75rem",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              background: "var(--bg)",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr auto",
                                gap: "0.5rem",
                                alignItems: "end",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "var(--text-3)",
                                    display: "block",
                                    marginBottom: "0.2rem",
                                  }}
                                >
                                  Action / Agenda
                                </label>
                                <input
                                  value={item.action}
                                  onChange={(e) => {
                                    const items = [...briefingForm.agendaItems];
                                    items[i] = {
                                      ...items[i],
                                      action: e.target.value,
                                    };
                                    setBriefingForm({
                                      ...briefingForm,
                                      agendaItems: items,
                                    });
                                  }}
                                  placeholder="Key agenda item or action"
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem 0.6rem",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "var(--text-3)",
                                    display: "block",
                                    marginBottom: "0.2rem",
                                  }}
                                >
                                  Timeline
                                </label>
                                <input
                                  value={item.timeline ?? ""}
                                  onChange={(e) => {
                                    const items = [...briefingForm.agendaItems];
                                    items[i] = {
                                      ...items[i],
                                      timeline: e.target.value,
                                    };
                                    setBriefingForm({
                                      ...briefingForm,
                                      agendaItems: items,
                                    });
                                  }}
                                  placeholder="e.g. Oct 25"
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem 0.6rem",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "4px",
                                    fontSize: "0.82rem",
                                  }}
                                />
                              </div>
                              {briefingForm.agendaItems.length > 1 && (
                                <button
                                  onClick={() =>
                                    setBriefingForm({
                                      ...briefingForm,
                                      agendaItems:
                                        briefingForm.agendaItems.filter(
                                          (_, j) => j !== i,
                                        ),
                                    })
                                  }
                                  style={{
                                    padding: "0.5rem 0.6rem",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "4px",
                                    background: "#fff1f2",
                                    color: "#dc2626",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <div>
                              <label
                                style={{
                                  fontSize: "0.72rem",
                                  color: "var(--text-3)",
                                  display: "block",
                                  marginBottom: "0.2rem",
                                }}
                              >
                                Responsibility
                              </label>
                              <select
                                value={item.responsibility ?? ""}
                                onChange={(e) => {
                                  const items = [...briefingForm.agendaItems];
                                  items[i] = {
                                    ...items[i],
                                    responsibility: e.target.value,
                                  };
                                  setBriefingForm({
                                    ...briefingForm,
                                    agendaItems: items,
                                  });
                                }}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem 0.6rem",
                                  border: "1.5px solid var(--border)",
                                  borderRadius: "4px",
                                  fontSize: "0.82rem",
                                }}
                              >
                                <option value="">— Select member —</option>
                                {briefingTeamMembers.map((m) => (
                                  <option key={m.id} value={m.name}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
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
                        onClick={() => setShowBriefingModal(false)}
                        style={{
                          padding: "0.65rem 1.25rem",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          addBriefingRecord(
                            briefingForm.auditId || myAudits[0]?.id,
                            {
                              date: briefingForm.date,
                              venue: briefingForm.venue,
                              agendaItems: briefingForm.agendaItems.filter(
                                (it) => it.action.trim(),
                              ),
                              recordedBy: user!.name,
                            },
                          );
                          setShowBriefingModal(false);
                        }}
                        disabled={
                          !briefingForm.date ||
                          !briefingForm.agendaItems.some((it) =>
                            it.action.trim(),
                          )
                        }
                        style={{
                          padding: "0.65rem 1.25rem",
                          background: "var(--primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          opacity:
                            !briefingForm.date ||
                            !briefingForm.agendaItems.some((it) =>
                              it.action.trim(),
                            )
                              ? 0.5
                              : 1,
                        }}
                      >
                        Save Briefing
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </div>
      </div>
    </div>
  );
};

export default PreAudit;
