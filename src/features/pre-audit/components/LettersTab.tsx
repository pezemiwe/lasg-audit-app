import React from "react";
import type {
  Audit,
  NotificationLetter,
  User,
  LetterStatus,
} from "../../../types";
import PreAuditBadge from "./PreAuditBadge";
import PreAuditCard from "./PreAuditCard";

interface LettersTabProps {
  myAudits: Audit[];
  letters: NotificationLetter[];
  user: User;
  getLGAName: (lgaId: string) => string;
  sendLetter: (letterId: string) => void;
  updateLetterStatus: (letterId: string, status: LetterStatus) => void;
}

const LettersTab: React.FC<LettersTabProps> = ({
  myAudits,
  letters,
  user,
  getLGAName,
  sendLetter,
  updateLetterStatus,
}) => {
  return (
    <div style={{ display: "grid", gap: "1.5rem", width: "100%" }}>
      <PreAuditCard
        title="Notification Letters"
        subtitle="Manage and send audit notification letters to LGAs"
      >
        {letters.filter((l) => myAudits.some((a) => a.lgaId === l.lgaId))
          .length === 0 ? (
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
                  user.role === "AUDIT_LEAD" && letter.status === "Draft";

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
                        <PreAuditBadge status={letter.status} />
                        {letter.sentAt && (
                          <>
                            <span>•</span>
                            <span>
                              Sent:{" "}
                              {new Date(letter.sentAt).toLocaleDateString()}
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
                        user.role === "HEAD_OF_LOCAL_GOVERNMENT" && (
                          <button
                            onClick={() =>
                              updateLetterStatus(letter.id, "Acknowledged")
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
      </PreAuditCard>
    </div>
  );
};

export default LettersTab;
