import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import { ClipboardList, CheckCircle2, ChevronRight, Save } from "lucide-react";
import s from "../../styles/pages.module.css";

interface QuestionnairePageProps {
  auditId?: string;
  embedded?: boolean;
}

const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  auditId,
  embedded = false,
}) => {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const questions = useAuditStore((st) => st.questionnaireQuestions);
  const responses = useAuditStore((st) => st.questionnaireResponses);
  const saveResponse = useAuditStore((st) => st.saveQuestionnaireResponse);
  const addToast = useAuditStore((st) => st.addToast);

  const canEdit =
    user?.role === "TEAM_AUDITOR" || user?.role === "HEAD_OF_LOCAL_GOVERNMENT";

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || audits[0]?.id || "",
  );

  React.useEffect(() => {
    if (auditId) {
      setSelectedAuditId(auditId);
    }
  }, [auditId]);

  const [activeSection, setActiveSection] = useState<string>("");
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});

  const sections = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.section)));
  }, [questions]);

  React.useEffect(() => {
    if (!activeSection && sections.length > 0) {
      setActiveSection(sections[0]);
    }
  }, [sections, activeSection]);

  const auditResponses = useMemo(
    () => responses.filter((r) => r.auditId === selectedAuditId),
    [responses, selectedAuditId],
  );

  const sectionQuestions = useMemo(
    () => questions.filter((q) => q.section === activeSection),
    [questions, activeSection],
  );

  const getResponse = (questionId: string) => {
    return auditResponses.find((r) => r.questionId === questionId);
  };

  const getCurrentAnswer = (questionId: string) => {
    if (draftAnswers[questionId] !== undefined) return draftAnswers[questionId];
    const existing = getResponse(questionId);
    return existing?.answer || "";
  };

  const sectionProgress = (section: string) => {
    const sectionQs = questions.filter((q) => q.section === section);
    const answered = sectionQs.filter((q) =>
      auditResponses.some((r) => r.questionId === q.id),
    ).length;
    return { answered, total: sectionQs.length };
  };

  const totalProgress = useMemo(() => {
    const answered = questions.filter((q) =>
      auditResponses.some((r) => r.questionId === q.id),
    ).length;
    return { answered, total: questions.length };
  }, [questions, auditResponses]);

  const handleSave = (questionId: string) => {
    const answer = getCurrentAnswer(questionId);
    if (!answer.trim()) {
      addToast({
        type: "error",
        title: "Answer Required",
        message: "Please provide an answer before saving",
      });
      return;
    }
    saveResponse({
      auditId: selectedAuditId,
      questionId,
      section: activeSection,
      answer: answer.trim(),
      answeredBy: user?.id || "",
    });
    const updated = { ...draftAnswers };
    delete updated[questionId];
    setDraftAnswers(updated);
    addToast({ type: "success", title: "Response Saved" });
  };

  const handleSaveAll = () => {
    let saved = 0;
    sectionQuestions.forEach((q) => {
      const answer = getCurrentAnswer(q.id);
      if (answer.trim()) {
        saveResponse({
          auditId: selectedAuditId,
          questionId: q.id,
          section: activeSection,
          answer: answer.trim(),
          answeredBy: user?.id || "",
        });
        saved++;
      }
    });
    setDraftAnswers({});
    addToast({
      type: "success",
      title: "Responses Saved",
      message: `${saved} responses saved for ${activeSection}`,
    });
  };

  return (
    <div>
      {!embedded && (
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Pre-Audit Questionnaire</h1>
            <p className={s.pageSubtitle}>
              Complete the entity understanding questionnaire to establish the
              audit planning foundation
            </p>
          </div>
          <span className={s.pageBadge}>
            <ClipboardList size={12} /> Questionnaire
          </span>
        </div>
      )}

      {!auditId && (
        <div className={s.filterBar} style={{ marginBottom: "1.5rem" }}>
          <select
            className={s.formSelect}
            value={selectedAuditId}
            onChange={(e) => {
              setSelectedAuditId(e.target.value);
              setDraftAnswers({});
            }}
            style={{ width: 320 }}
          >
            {audits.map((a) => {
              const lga = lgas.find((l) => l.id === a.lgaId);
              return (
                <option key={a.id} value={a.id}>
                  {lga?.name || a.lgaId} — {a.type} Audit ({a.year})
                </option>
              );
            })}
          </select>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-2)",
            }}
          >
            <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            {totalProgress.answered}/{totalProgress.total} Completed
          </div>
        </div>
      )}

      {embedded && auditId && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-2)",
            }}
          >
            <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            {totalProgress.answered}/{totalProgress.total} responses saved
          </div>
        </div>
      )}

      <div className={s.kpiRow}>
        {sections.map((section) => {
          const prog = sectionProgress(section);
          const pct =
            prog.total > 0 ? Math.round((prog.answered / prog.total) * 100) : 0;
          const isActive = section === activeSection;
          return (
            <div
              key={section}
              className={s.kpiCard}
              style={{
                cursor: "pointer",
                borderColor: isActive ? "#064e3b" : undefined,
                background: isActive ? "rgba(6, 78, 59, 0.03)" : undefined,
              }}
              onClick={() => setActiveSection(section)}
            >
              <div>
                <div className={s.kpiLabel}>{section}</div>
                <div className={s.kpiValue} style={{ fontSize: "1.25rem" }}>
                  {prog.answered}/{prog.total}
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <div
                    style={{
                      height: "4px",
                      background: "var(--border)",
                      borderRadius: "2px",
                      overflow: "hidden",
                      width: "100px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: pct === 100 ? "#16a34a" : "#064e3b",
                        borderRadius: "2px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{ color: isActive ? "#064e3b" : "var(--text-3)" }}
              />
            </div>
          );
        })}
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h3 className={s.cardTitle}>{activeSection}</h3>
            {!canEdit && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#64748b",
                  background: "#f1f5f9",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  border: "1px solid #e2e8f0",
                }}
              >
                View Only
              </span>
            )}
          </div>
          {canEdit && (
            <button className={s.btnPrimary} onClick={handleSaveAll}>
              <Save size={14} /> Save All Responses
            </button>
          )}
        </div>
        <div className={s.cardBody}>
          {sectionQuestions.length === 0 && (
            <div className={s.emptyState}>
              <ClipboardList size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No Questions</div>
              <div className={s.emptyDesc}>
                Select a section to view questions.
              </div>
            </div>
          )}

          {sectionQuestions.map((q, idx) => {
            const existing = getResponse(q.id);
            const answer = getCurrentAnswer(q.id);
            const isDraft =
              draftAnswers[q.id] !== undefined &&
              draftAnswers[q.id] !== (existing?.answer || "");

            return (
              <div
                key={q.id}
                style={{
                  padding: "1.25rem 0",
                  borderBottom:
                    idx < sectionQuestions.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
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
                          <span
                            style={{ color: "#dc2626", marginLeft: "0.25rem" }}
                          >
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
                    }}
                  >
                    {existing && !isDraft && (
                      <StatusBadge label="Saved" variant="success" />
                    )}
                    {isDraft && (
                      <StatusBadge label="Unsaved" variant="warning" />
                    )}
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
                  </div>
                ) : q.type === "risk-scoring" ? (
                  <div style={{ marginLeft: "2.5rem" }}>
                    <select
                      className={s.formSelect}
                      value={answer}
                      disabled={!canEdit}
                      onChange={(e) =>
                        canEdit &&
                        setDraftAnswers({
                          ...draftAnswers,
                          [q.id]: e.target.value,
                        })
                      }
                      style={{ width: 240 }}
                    >
                      <option value="">Select risk level...</option>
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                      <option value="Critical">Critical Risk</option>
                    </select>
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
                        className={
                          answer === opt ? s.filterChipActive : s.filterChip
                        }
                        onClick={() =>
                          canEdit &&
                          setDraftAnswers({ ...draftAnswers, [q.id]: opt })
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginLeft: "2.5rem" }}>
                    <textarea
                      className={s.formTextarea}
                      value={answer}
                      disabled={!canEdit}
                      readOnly={!canEdit}
                      onChange={(e) =>
                        canEdit &&
                        setDraftAnswers({
                          ...draftAnswers,
                          [q.id]: e.target.value,
                        })
                      }
                      placeholder={
                        canEdit
                          ? "Enter your response..."
                          : "No response provided"
                      }
                      style={{
                        minHeight: "80px",
                        opacity: !canEdit ? 0.7 : 1,
                        cursor: !canEdit ? "not-allowed" : "text",
                      }}
                    />
                    {q.minWords && (
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color:
                            answer.split(/\s+/).filter(Boolean).length >=
                            (q.minWords || 0)
                              ? "#16a34a"
                              : "var(--text-3)",
                          marginTop: "0.35rem",
                          fontWeight: 600,
                        }}
                      >
                        {answer.split(/\s+/).filter(Boolean).length} /{" "}
                        {q.minWords} words minimum
                      </div>
                    )}
                  </div>
                )}

                {isDraft && canEdit && (
                  <div style={{ marginLeft: "2.5rem", marginTop: "0.75rem" }}>
                    <button
                      className={`${s.btnPrimary} ${s.btnSmall}`}
                      onClick={() => handleSave(q.id)}
                    >
                      <Save size={12} /> Save Response
                    </button>
                  </div>
                )}

                {existing && (
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
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
