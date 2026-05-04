import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { ClipboardList, CheckCircle2, Save, FileText, X } from "lucide-react";
import s from "../../styles/pages.module.css";
import SectionSelector from "../../features/questionnaire/components/SectionSelector";
import QuestionItem from "../../features/questionnaire/components/QuestionItem";
import QuestionnaireReportModal from "../../features/questionnaire/components/QuestionnaireReportModal";

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
  const deleteResponse = useAuditStore((st) => st.deleteQuestionnaireResponse);
  const addToast = useAuditStore((st) => st.addToast);

  const canEdit =
    user?.role === "TEAM_AUDITOR" ||
    user?.role === "AUDIT_LEAD" ||
    user?.role === "HEAD_OF_LOCAL_GOVERNMENT";

  const [selectedAuditId, setSelectedAuditId] = useState<string>(
    auditId || audits[0]?.id || "",
  );

  const [prevAuditId, setPrevAuditId] = useState(auditId);
  if (auditId && prevAuditId !== auditId) {
    setPrevAuditId(auditId);
    setSelectedAuditId(auditId);
  }

  const [searchParamsQ, setSearchParamsQ] = useSearchParams();
  const [localSection, setLocalSection] = useState<string>("");
  const sections = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.section)));
  }, [questions]);
  const activeSection = embedded
    ? localSection || sections[0] || ""
    : searchParamsQ.get("section") || sections[0] || "";
  const setActiveSection = (sec: string) => {
    if (embedded) {
      setLocalSection(sec);
    } else {
      setSearchParamsQ(
        (prev) => {
          prev.set("section", sec);
          return prev;
        },
        { replace: true },
      );
    }
  };

  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [otherExplanations, setOtherExplanations] = useState<
    Record<string, string>
  >({});
  const [editingQuestions, setEditingQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [showReport, setShowReport] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);

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

  const handleStartEdit = (questionId: string, existingAnswer: string) => {
    setDraftAnswers((prev) => ({ ...prev, [questionId]: existingAnswer }));
    setEditingQuestions((prev) => new Set(prev).add(questionId));
  };

  const handleDeleteResponse = (questionId: string) => {
    deleteResponse(selectedAuditId, questionId);
    const updated = { ...draftAnswers };
    delete updated[questionId];
    setDraftAnswers(updated);
    setEditingQuestions((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
    addToast({ type: "info", title: "Response Removed" });
  };

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
      ...(answer.trim() === "other" && otherExplanations[questionId]
        ? { otherExplanation: otherExplanations[questionId] }
        : {}),
    });
    const updated = { ...draftAnswers };
    delete updated[questionId];
    setDraftAnswers(updated);
    setEditingQuestions((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
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
          ...(answer.trim() === "other" && otherExplanations[q.id]
            ? { otherExplanation: otherExplanations[q.id] }
            : {}),
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

  const handleSectionSwitch = (section: string) => {
    if (section === activeSection) return;
    const unanswered = sectionQuestions.filter((q) => !getResponse(q.id));
    if (unanswered.length > 0) {
      setSectionError(
        `Please answer all ${unanswered.length} remaining question(s) in "${activeSection}" before proceeding.`,
      );
      return;
    }
    setSectionError(null);
    setActiveSection(section);
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
                  {lga?.name || a.lgaId}: {a.type} Audit ({a.year})
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
            {totalProgress.answered}/{totalProgress.total} Responses Saved
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

      <SectionSelector
        sections={sections}
        activeSection={activeSection}
        sectionProgress={sectionProgress}
        onSwitch={handleSectionSwitch}
      />

      {sectionError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <span
            style={{ fontSize: "0.875rem", color: "#dc2626", fontWeight: 600 }}
          >
            {sectionError}
          </span>
          <button
            onClick={() => setSectionError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

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
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            {totalProgress.answered === totalProgress.total &&
              totalProgress.total > 0 && (
                <button
                  className={s.btnPrimary}
                  style={{ background: "#064e3b", borderColor: "#064e3b" }}
                  onClick={() => setShowReport(true)}
                >
                  <FileText size={14} /> Generate Report
                </button>
              )}
            {canEdit && (
              <button className={s.btnPrimary} onClick={handleSaveAll}>
                <Save size={14} /> Save All Responses
              </button>
            )}
          </div>
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
              <QuestionItem
                key={q.id}
                q={q}
                idx={idx}
                isLast={idx === sectionQuestions.length - 1}
                canEdit={canEdit}
                existing={existing}
                answer={answer}
                isDraft={isDraft}
                isEditing={editingQuestions.has(q.id)}
                draftAnswers={draftAnswers}
                setDraftAnswers={setDraftAnswers}
                otherExplanations={otherExplanations}
                setOtherExplanations={setOtherExplanations}
                setEditingQuestions={setEditingQuestions}
                onSave={handleSave}
                onStartEdit={handleStartEdit}
                onDelete={handleDeleteResponse}
              />
            );
          })}
        </div>
      </div>
      {showReport && (
        <QuestionnaireReportModal
          sections={sections}
          questions={questions}
          auditResponses={auditResponses}
          totalQuestions={totalProgress.total}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default QuestionnairePage;
