import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuditStore } from "../../store/useAuditStore";
import LettersTab from "../../features/pre-audit/components/LettersTab";
import MeetingsTab from "../../features/pre-audit/components/MeetingsTab";
import TeamTab from "../../features/pre-audit/components/TeamTab";
import EntryMeetingModal from "../../features/pre-audit/components/EntryMeetingModal";
import BriefingModal from "../../features/pre-audit/components/BriefingModal";

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

  const [searchParamsPA, setSearchParamsPA] = useSearchParams();
  const [localTab, setLocalTab] = useState<"letters" | "meetings" | "team">(
    "letters",
  );
  const activeTab = embedded
    ? localTab
    : (searchParamsPA.get("tab") as "letters" | "meetings" | "team") ||
      "letters";
  const setActiveTab = (id: "letters" | "meetings" | "team") => {
    if (embedded) {
      setLocalTab(id);
    } else {
      setSearchParamsPA(
        (prev) => {
          prev.set("tab", id);
          return prev;
        },
        { replace: true },
      );
    }
  };
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
        padding: embedded ? "1.5rem 2rem" : "2rem",
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
          flexDirection: embedded ? "row" : "column",
          gap: "2rem",
          alignItems: embedded ? "flex-start" : "stretch",
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
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          {activeTab === "letters" && (
            <LettersTab
              myAudits={myAudits}
              letters={letters}
              user={user}
              getLGAName={getLGAName}
              sendLetter={sendLetter}
              updateLetterStatus={updateLetterStatus}
            />
          )}

          {activeTab === "meetings" && (
            <MeetingsTab
              user={user}
              myAudits={myAudits}
              getLGAName={getLGAName}
              entryMeetings={entryMeetings}
              setMeetingForm={setMeetingForm}
              setShowMeetingModal={setShowMeetingModal}
              setBriefingForm={setBriefingForm}
              setShowBriefingModal={setShowBriefingModal}
            />
          )}

          {activeTab === "team" && (
            <TeamTab
              user={user}
              users={users}
              myAudits={myAudits}
              getLGAName={getLGAName}
              getIndependenceDeclarations={getIndependenceDeclarations}
              addIndependenceDeclaration={addIndependenceDeclaration}
              showDeclForm={showDeclForm}
              setShowDeclForm={setShowDeclForm}
              declForm={declForm}
              setDeclForm={setDeclForm}
              setBriefingForm={setBriefingForm}
              setShowBriefingModal={setShowBriefingModal}
            />
          )}

          {showMeetingModal && (
            <EntryMeetingModal
              user={user}
              meetingForm={meetingForm}
              setMeetingForm={setMeetingForm}
              setShowMeetingModal={setShowMeetingModal}
              meetingTeamMembers={meetingTeamMembers}
              addEntryMeetingRecord={addEntryMeetingRecord}
            />
          )}

          {showBriefingModal && (
            <BriefingModal
              user={user}
              myAudits={myAudits}
              briefingForm={briefingForm}
              setBriefingForm={setBriefingForm}
              setShowBriefingModal={setShowBriefingModal}
              briefingTeamMembers={briefingTeamMembers}
              addBriefingRecord={addBriefingRecord}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreAudit;
