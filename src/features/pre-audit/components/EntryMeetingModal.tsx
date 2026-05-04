import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { User } from "../../../types";
import ProfessionalTextarea from "../../../components/UI/ProfessionalTextarea";

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

interface EntryMeetingModalProps {
  user: User;
  meetingForm: MeetingForm;
  setMeetingForm: React.Dispatch<React.SetStateAction<MeetingForm>>;
  setShowMeetingModal: React.Dispatch<React.SetStateAction<boolean>>;
  meetingTeamMembers: User[];
  addEntryMeetingRecord: (
    auditId: string,
    record: {
      date: string;
      notes: string;
      agendaItems: AgendaItem[];
      recordedBy: string;
    },
  ) => void;
}

const EntryMeetingModal: React.FC<EntryMeetingModalProps> = ({
  user,
  meetingForm,
  setMeetingForm,
  setShowMeetingModal,
  meetingTeamMembers,
  addEntryMeetingRecord,
}) => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 2147483000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      className="backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              Record Entry Meeting
            </h2>
          </div>
          <button
            onClick={() => setShowMeetingModal(false)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div
          style={{
            padding: "1.5rem 2rem",
            maxHeight: "75vh",
            overflowY: "auto",
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
                            agendaItems: meetingForm.agendaItems.filter(
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
                      <option value="">Select member...</option>
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
                !meetingForm.agendaItems.some((it) => it.action.trim())
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
                  !meetingForm.agendaItems.some((it) => it.action.trim())
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
  );
};

export default EntryMeetingModal;
