import React from "react";
import { ClipboardList } from "lucide-react";
import type { Audit, User } from "../../../types";
import PreAuditBadge from "./PreAuditBadge";
import PreAuditCard from "./PreAuditCard";

interface AgendaItem {
  action: string;
  timeline: string;
  responsibility: string;
}

interface MeetingForm {
  auditId: string;
  date: string;
  notes: string;
  agendaItems: AgendaItem[];
}

interface BriefingForm {
  auditId: string;
  date: string;
  venue: string;
  agendaItems: AgendaItem[];
}

interface EntryMeetingView {
  id: string;
  lgaName: string;
  date: string;
  notes: string;
  status: string;
  attendees: string[];
  agenda: string[];
  actionItems: string[];
}

interface MeetingsTabProps {
  user: User;
  myAudits: Audit[];
  getLGAName: (lgaId: string) => string;
  entryMeetings: EntryMeetingView[];
  setMeetingForm: React.Dispatch<React.SetStateAction<MeetingForm>>;
  setShowMeetingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBriefingForm: React.Dispatch<React.SetStateAction<BriefingForm>>;
  setShowBriefingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MeetingsTab: React.FC<MeetingsTabProps> = ({
  user,
  myAudits,
  getLGAName,
  entryMeetings,
  setMeetingForm,
  setShowMeetingModal,
  setBriefingForm,
  setShowBriefingModal,
}) => {
  return (
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
                agendaItems: [{ action: "", timeline: "", responsibility: "" }],
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
                agendaItems: [{ action: "", timeline: "", responsibility: "" }],
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
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      Team Briefing · {new Date(b.date).toLocaleDateString()}
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
                  <PreAuditBadge status="Completed" />
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
          <PreAuditCard title="Entry Meeting Log">
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-3)",
              }}
            >
              No entry meetings recorded yet.
            </div>
          </PreAuditCard>
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
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        Entry Meeting · {getLGAName(a.lgaId)} LGA
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
                    <PreAuditBadge status="Scheduled" />
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
                  <PreAuditBadge status={meeting.status} />
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
  );
};

export default MeetingsTab;
