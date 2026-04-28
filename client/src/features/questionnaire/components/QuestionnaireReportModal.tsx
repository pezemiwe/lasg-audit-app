import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type {
  QuestionnaireQuestion,
  QuestionnaireResponse,
} from "../../../types";

interface Props {
  sections: string[];
  questions: QuestionnaireQuestion[];
  auditResponses: QuestionnaireResponse[];
  totalQuestions: number;
  onClose: () => void;
}

const QuestionnaireReportModal: React.FC<Props> = ({
  sections,
  questions,
  auditResponses,
  totalQuestions,
  onClose,
}) =>
  createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
          marginBottom: "2rem",
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
              Pre-Audit Questionnaire Report
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
              }}
            >
              Comprehensive responses — all {totalQuestions} questions answered
            </p>
          </div>
          <button
            onClick={onClose}
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
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {sections.map((section) => {
            const qs = questions.filter((q) => q.section === section);
            return (
              <div key={section} style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#064e3b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    borderBottom: "2px solid #d1fae5",
                    paddingBottom: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {section}
                </h3>
                {qs.map((q, idx) => {
                  const resp = auditResponses.find(
                    (r) => r.questionId === q.id,
                  );
                  const optionLabel =
                    q.options && resp
                      ? (q.options.find((o) => o.value === resp.answer)
                          ?.label ?? resp.answer)
                      : resp?.answer;
                  return (
                    <div
                      key={q.id}
                      style={{
                        marginBottom: "1rem",
                        padding: "0.875rem 1rem",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#64748b",
                          fontWeight: 600,
                          marginBottom: "0.25rem",
                        }}
                      >
                        Q{idx + 1}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#1e293b",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {q.question}
                      </div>
                      {resp ? (
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#064e3b",
                            fontWeight: 500,
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "6px",
                            padding: "0.5rem 0.75rem",
                          }}
                        >
                          {optionLabel}
                          {resp.otherExplanation && (
                            <div
                              style={{
                                marginTop: "0.35rem",
                                fontSize: "0.82rem",
                                color: "#475569",
                              }}
                            >
                              <em>Explanation:</em> {resp.otherExplanation}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#dc2626",
                            fontStyle: "italic",
                          }}
                        >
                          No response recorded
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button className={s.btnPrimary} onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );

export default QuestionnaireReportModal;
