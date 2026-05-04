import React from "react";
import {
  ShieldCheck,
  CheckCircle,
  ClipboardList,
  Laptop,
  Wifi,
  Car,
  Building2,
  FileText,
  Banknote,
  Users,
} from "lucide-react";
import type { Audit, User, IndependenceDeclaration } from "../../../types";
import PreAuditCard from "./PreAuditCard";

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

interface DeclForm {
  threats: string;
  safeguards: string;
}

interface TeamTabProps {
  user: User;
  users: User[];
  myAudits: Audit[];
  getLGAName: (lgaId: string) => string;
  getIndependenceDeclarations: (auditId: string) => IndependenceDeclaration[];
  addIndependenceDeclaration: (
    decl: Omit<IndependenceDeclaration, "id">,
  ) => void;
  showDeclForm: boolean;
  setShowDeclForm: React.Dispatch<React.SetStateAction<boolean>>;
  declForm: DeclForm;
  setDeclForm: React.Dispatch<React.SetStateAction<DeclForm>>;
  setBriefingForm: React.Dispatch<React.SetStateAction<BriefingForm>>;
  setShowBriefingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeamTab: React.FC<TeamTabProps> = ({
  user,
  users,
  myAudits,
  getLGAName,
  getIndependenceDeclarations,
  addIndependenceDeclaration,
  showDeclForm,
  setShowDeclForm,
  declForm,
  setDeclForm,
  setBriefingForm,
  setShowBriefingModal,
}) => {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* ── Independence & Ethics Declarations ── */}
      {myAudits.map((audit) => {
        const lgaName = getLGAName(audit.lgaId);
        const declarations = getIndependenceDeclarations(audit.id);
        const teamMembers = users.filter(
          (u) => u.id === audit.leadId || (audit.teamIds || []).includes(u.id),
        );
        const allDeclared =
          teamMembers.length > 0 &&
          teamMembers.every((tm) =>
            declarations.some((d) => d.auditorId === tm.id && d.confirmed),
          );

        return (
          <PreAuditCard
            key={`ind-${audit.id}`}
            title={`${lgaName}: Independence & Ethics Declarations`}
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
                ISA 220: Quality Management for an Audit
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#0369a1",
                  lineHeight: 1.6,
                }}
              >
                Each member of the engagement team must confirm their
                independence from the audited entity before the commencement of
                fieldwork. Any threats to independence must be identified
                together with appropriate safeguards.
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
                        background: decl?.confirmed ? "#16a34a" : "#e5e7eb",
                        color: decl?.confirmed ? "white" : "var(--text-3)",
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
                          {new Date(decl.declarationDate).toLocaleDateString(
                            "en-NG",
                          )}
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
                        I have no financial interest, direct or indirect, in the
                        audited entity.
                      </li>
                      <li>
                        I have no personal or family relationship with key
                        officials of the entity.
                      </li>
                      <li>
                        I have not provided non-audit services to the entity in
                        the current or prior period.
                      </li>
                      <li>
                        I am not aware of any other circumstance that may
                        compromise objectivity.
                      </li>
                      <li>
                        I will conduct this engagement in accordance with ISSAI
                        and ISA professional standards.
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
                      placeholder="e.g. Familiarity (previously audited same entity)"
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
          </PreAuditCard>
        );
      })}

      {/* ── Team Roster ── */}
      {myAudits.map((audit) => {
        const lgaName = getLGAName(audit.lgaId);
        return (
          <PreAuditCard
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
                  <span style={{ color: "var(--text-3)" }}>Accommodation:</span>{" "}
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
          </PreAuditCard>
        );
      })}

      {/* ── Pre-Audit Team Briefing Record (moved to Meetings tab) ── */}
      <PreAuditCard
        title="Pre-Audit Team Briefing Record"
        subtitle="Briefing held by the Audit Lead before fieldwork commencement. View full records in the Meetings tab."
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
                    value: "Audit Lead: Engr. J. Okafor",
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
                    <span style={{ fontWeight: 500 }}>{item.value}</span>
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
                <li>Role and responsibility assignment per team member</li>
                <li>Briefing on LGA background and known risk areas</li>
                <li>Document request list and evidence gathering strategy</li>
                <li>
                  Team logistics, accommodation and transport arrangements
                </li>
                <li>Communication protocol with LGA officials</li>
                <li>Confidentiality and professional conduct expectations</li>
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
                    background: person.attended ? "#f0fdf4" : "var(--bg)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: person.attended ? "#16a34a" : "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: person.attended ? "white" : "var(--text-3)",
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
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
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
                      background: person.attended ? "#bbf7d0" : "#fee2e2",
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
      </PreAuditCard>

      {/* ── Resource Planning Checklist ── */}
      <PreAuditCard
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
              icon: <Building2 size={18} style={{ color: "#d97706" }} />,
              item: "Office Space at LGA",
              status: "Pending",
              responsible: "LGA (HOD Admin)",
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
              icon: <ShieldCheck size={18} style={{ color: "#7c3aed" }} />,
              item: "Security Briefing & Protocol",
              status: "Ready",
              responsible: "Audit Lead",
              note: "Standard security detail confirmed",
            },
            {
              icon: <Banknote size={18} style={{ color: "#059669" }} />,
              item: "Per Diem & Team Allowances",
              status: "Pending",
              responsible: "Finance (LASG AG)",
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
                  resource.status === "Ready" ? "#bbf7d0" : "var(--border)",
                borderRadius: "6px",
                background:
                  resource.status === "Ready" ? "#f0fdf4" : "var(--bg-card)",
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
                      resource.status === "Ready" ? "#bbf7d0" : "#fef3c7",
                    color: resource.status === "Ready" ? "#166534" : "#92400e",
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
              <div style={{ fontSize: "0.775rem", color: "var(--text-2)" }}>
                {resource.note}
              </div>
            </div>
          ))}
        </div>
      </PreAuditCard>
    </div>
  );
};

export default TeamTab;
