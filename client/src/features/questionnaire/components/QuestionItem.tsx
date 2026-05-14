import React from "react";
import StatusBadge from "../../../components/UI/StatusBadge";
import ProfessionalTextarea from "../../../components/UI/ProfessionalTextarea";
import { Pencil, Save, Trash2 } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type {
  QuestionnaireQuestion,
  QuestionnaireResponse,
} from "../../../types";

interface Props {
  q: QuestionnaireQuestion;
  idx: number;
  isLast: boolean;
  canEdit: boolean;
  existing: QuestionnaireResponse | undefined;
  answer: string;
  isDraft: boolean;
  isEditing: boolean;
  draftAnswers: Record<string, string>;
  setDraftAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  otherExplanations: Record<string, string>;
  setOtherExplanations: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setEditingQuestions: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSave: (questionId: string) => void;
  onStartEdit: (questionId: string, existingAnswer: string) => void;
  onDelete: (questionId: string) => void;
}

const QuestionItem: React.FC<Props> = ({
  q,
  idx,
  isLast,
  canEdit,
  existing,
  answer,
  isDraft,
  isEditing,
  draftAnswers,
  setDraftAnswers,
  otherExplanations,
  setOtherExplanations,
  setEditingQuestions,
  onSave,
  onStartEdit,
  onDelete,
}) => {
  return (
    <div
      style={{
        padding: "1.25rem 0",
        borderBottom: !isLast ? "1px solid var(--border)" : "none",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#064e3b",
              background: "rgba(6, 78, 59, 0.08)",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              flexShrink: 0,
            }}
          >
            Q{idx + 1}
          </span>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--text)",
              }}
            >
              {q.question}
              {q.required && (
                <span style={{ color: "#dc2626", marginLeft: "0.25rem" }}>
                  *
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-3)",
                marginTop: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {q.type.replace("-", " ")}
              {q.minWords ? ` | Min ${q.minWords} words` : ""}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
            marginLeft: "1rem",
          }}
        >
          {existing && !isDraft && (
            <StatusBadge label="Saved" variant="success" />
          )}
          {isDraft && <StatusBadge label="Unsaved" variant="warning" />}
          {!existing && !isDraft && (
            <StatusBadge label="Pending" variant="default" />
          )}
        </div>
      </div>

      {q.type === "multiple-choice" && q.options ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginLeft: "2.5rem",
          }}
        >
          {q.options.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: "0.4rem 0.75rem",
                borderRadius: "4px",
                background:
                  answer === opt.value
                    ? "rgba(6, 78, 59, 0.06)"
                    : "transparent",
                border: `1.5px solid ${answer === opt.value ? "#064e3b" : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name={q.id}
                value={opt.value}
                checked={answer === opt.value}
                disabled={!canEdit}
                onChange={() =>
                  canEdit &&
                  setDraftAnswers({
                    ...draftAnswers,
                    [q.id]: opt.value,
                  })
                }
                style={{ accentColor: "#064e3b" }}
              />
              {opt.label}
            </label>
          ))}
          {answer === "other" && (
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="text"
                className={s.formInput}
                placeholder="Please explain…"
                value={otherExplanations[q.id] || ""}
                disabled={!canEdit}
                onChange={(e) =>
                  canEdit &&
                  setOtherExplanations((prev) => ({
                    ...prev,
                    [q.id]: e.target.value,
                  }))
                }
                style={{ width: "100%", marginTop: "0.25rem" }}
              />
            </div>
          )}
        </div>
      ) : q.type === "risk-scoring" && q.options ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginLeft: "2.5rem",
          }}
        >
          {q.options.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: "0.4rem 0.75rem",
                borderRadius: "4px",
                background:
                  answer === opt.value
                    ? "rgba(234, 88, 12, 0.06)"
                    : "transparent",
                border: `1.5px solid ${answer === opt.value ? "#ea580c" : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name={q.id}
                value={opt.value}
                checked={answer === opt.value}
                disabled={!canEdit}
                onChange={() =>
                  canEdit &&
                  setDraftAnswers({
                    ...draftAnswers,
                    [q.id]: opt.value,
                  })
                }
                style={{ accentColor: "#ea580c" }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : q.type === "document-confirmation" ? (
        <div
          style={{
            marginLeft: "2.5rem",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          {["Yes", "No", "Partial"].map((opt) => (
            <button
              key={opt}
              disabled={!canEdit}
              style={{
                opacity: !canEdit ? 0.7 : 1,
                cursor: !canEdit ? "not-allowed" : "pointer",
              }}
              className={answer === opt ? s.filterChipActive : s.filterChip}
              onClick={() =>
                canEdit && setDraftAnswers({ ...draftAnswers, [q.id]: opt })
              }
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginLeft: "2.5rem",
            width: "calc(100% - 2.5rem)",
          }}
        >
          {existing && !isEditing ? (
            <div
              style={{
                borderRadius: "10px",
                border: "1.5px solid #d1fae5",
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "3px",
                  background: "linear-gradient(90deg, #16a34a, #10b981)",
                }}
              />
              <div style={{ padding: "0.875rem 1rem 0.5rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "1.7",
                    color: "var(--text, #1e293b)",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {existing.answer}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.4rem 0.875rem",
                  borderTop: "1px solid #bbf7d0",
                  background: "rgba(16,185,129,0.04)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#16a34a",
                    fontWeight: 600,
                  }}
                >
                  ✓ Saved
                  {existing.answeredAt
                    ? ` | ${new Date(existing.answeredAt).toLocaleString()}`
                    : ""}
                </span>
                {canEdit && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => onStartEdit(q.id, existing.answer)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#064e3b",
                        background: "white",
                        border: "1.5px solid #bbf7d0",
                        borderRadius: "6px",
                        padding: "0.25rem 0.625rem",
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f0fdf4")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(q.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#dc2626",
                        background: "white",
                        border: "1.5px solid #fecaca",
                        borderRadius: "6px",
                        padding: "0.25rem 0.625rem",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <ProfessionalTextarea
                value={answer}
                disabled={!canEdit}
                onChange={(e) =>
                  canEdit &&
                  setDraftAnswers({
                    ...draftAnswers,
                    [q.id]: e.target.value,
                  })
                }
                placeholder={
                  canEdit ? "Enter your response…" : "No response provided"
                }
                minWords={q.minWords}
                maxWords={q.maxWords}
                showWordCount={!!(q.minWords || q.maxWords)}
              />
              {isDraft && canEdit && (
                <div
                  style={{
                    marginTop: "0.625rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    className={`${s.btnPrimary} ${s.btnSmall}`}
                    onClick={() => onSave(q.id)}
                  >
                    <Save size={12} /> Save Response
                  </button>
                  <button
                    className={s.btnSmall}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.75rem",
                      border: "1.5px solid var(--border)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "var(--surface)",
                      color: "var(--text-2)",
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      setEditingQuestions((prev) => {
                        const next = new Set(prev);
                        next.delete(q.id);
                        return next;
                      });
                      const updated = { ...draftAnswers };
                      delete updated[q.id];
                      setDraftAnswers(updated);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isDraft && canEdit && q.type !== "open-ended" && (
        <div style={{ marginLeft: "2.5rem", marginTop: "0.75rem" }}>
          <button
            className={`${s.btnPrimary} ${s.btnSmall}`}
            onClick={() => onSave(q.id)}
          >
            <Save size={12} /> Save Response
          </button>
        </div>
      )}

      {existing && q.type !== "open-ended" && (
        <div
          style={{
            marginLeft: "2.5rem",
            marginTop: "0.5rem",
            fontSize: "0.72rem",
            color: "var(--text-3)",
          }}
        >
          Last saved by {existing.answeredBy} on{" "}
          {new Date(existing.answeredAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
