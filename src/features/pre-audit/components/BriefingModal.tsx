import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Audit, User } from "../../../types";

interface AgendaItem {
  action: string;
  timeline: string;
  responsibility: string;
}

interface BriefingForm {
  auditId: string;
  date: string;
  venue: string;
  agendaItems: AgendaItem[];
}

interface BriefingModalProps {
  user: User;
  myAudits: Audit[];
  briefingForm: BriefingForm;
  setBriefingForm: React.Dispatch<React.SetStateAction<BriefingForm>>;
  setShowBriefingModal: React.Dispatch<React.SetStateAction<boolean>>;
  briefingTeamMembers: User[];
  addBriefingRecord: (
    auditId: string,
    record: {
      date: string;
      venue: string;
      agendaItems: AgendaItem[];
      recordedBy: string;
    },
  ) => void;
}

const BriefingModal: React.FC<BriefingModalProps> = ({
  user,
  myAudits,
  briefingForm,
  setBriefingForm,
  setShowBriefingModal,
  briefingTeamMembers,
  addBriefingRecord,
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
          maxWidth: "620px",
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
              Record Team Briefing
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
              }}
            >
              Pre-fieldwork briefing conducted by the Audit Lead
            </p>
          </div>
          <button
            onClick={() => setShowBriefingModal(false)}
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
                            agendaItems: briefingForm.agendaItems.filter(
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
                      <option value="">Select member...</option>
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
                addBriefingRecord(briefingForm.auditId || myAudits[0]?.id, {
                  date: briefingForm.date,
                  venue: briefingForm.venue,
                  agendaItems: briefingForm.agendaItems.filter((it) =>
                    it.action.trim(),
                  ),
                  recordedBy: user!.name,
                });
                setShowBriefingModal(false);
              }}
              disabled={
                !briefingForm.date ||
                !briefingForm.agendaItems.some((it) => it.action.trim())
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
                  !briefingForm.agendaItems.some((it) => it.action.trim())
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
  );
};

export default BriefingModal;
