import React from "react";
import {
  BookOpen,
  CheckCircle,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { LessonCategory, LessonLearned, User } from "../../../types";
import { userName } from "../utils/helpers";

const LESSON_CATEGORIES: LessonCategory[] = [
  "Process Improvement",
  "Risk Management",
  "Resource Allocation",
  "Methodology",
  "Communication",
  "Technology",
];

interface Props {
  canManage: boolean;
  isHLGA: boolean;
  auditLessons: LessonLearned[];
  showLessonForm: boolean;
  setShowLessonForm: React.Dispatch<React.SetStateAction<boolean>>;
  llCategory: LessonCategory;
  setLlCategory: React.Dispatch<React.SetStateAction<LessonCategory>>;
  llImpact: "Positive" | "Negative";
  setLlImpact: React.Dispatch<React.SetStateAction<"Positive" | "Negative">>;
  llTitle: string;
  setLlTitle: React.Dispatch<React.SetStateAction<string>>;
  llDescription: string;
  setLlDescription: React.Dispatch<React.SetStateAction<string>>;
  llAction: string;
  setLlAction: React.Dispatch<React.SetStateAction<string>>;
  handleAddLesson: () => void;
  users: User[];
}

const LessonsTab: React.FC<Props> = ({
  canManage,
  isHLGA,
  auditLessons,
  showLessonForm,
  setShowLessonForm,
  llCategory,
  setLlCategory,
  llImpact,
  setLlImpact,
  llTitle,
  setLlTitle,
  llDescription,
  setLlDescription,
  llAction,
  setLlAction,
  handleAddLesson,
  users,
}) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <h3 className={s.cardTitle}>
        <BookOpen size={18} /> Lessons Learned
      </h3>
      {(canManage || isHLGA) && (
        <button
          className={s.btnPrimary}
          onClick={() => setShowLessonForm(!showLessonForm)}
        >
          <Plus size={16} /> Add Lesson
        </button>
      )}
    </div>

    {showLessonForm && (
      <div className={s.cardBody}>
        <div
          style={{
            padding: "1rem",
            background: "#fefce8",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ marginBottom: "0.75rem", fontWeight: 600 }}>
            Record a Lesson Learned
          </h4>
          <div className={s.formGrid}>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Category</label>
              <select
                className={s.formSelect}
                value={llCategory}
                onChange={(e) =>
                  setLlCategory(e.target.value as LessonCategory)
                }
              >
                {LESSON_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.formLabel}>Impact</label>
              <select
                className={s.formSelect}
                value={llImpact}
                onChange={(e) =>
                  setLlImpact(e.target.value as "Positive" | "Negative")
                }
              >
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Title *</label>
              <input
                type="text"
                className={s.formInput}
                value={llTitle}
                onChange={(e) => setLlTitle(e.target.value)}
                placeholder="Brief lesson title"
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Description *</label>
              <textarea
                className={s.formTextarea}
                rows={3}
                value={llDescription}
                onChange={(e) => setLlDescription(e.target.value)}
                placeholder="Describe what was learned and its context..."
              />
            </div>
            <div className={s.formGroupFull}>
              <label className={s.formLabel}>Action Required</label>
              <input
                type="text"
                className={s.formInput}
                value={llAction}
                onChange={(e) => setLlAction(e.target.value)}
                placeholder="What action should be taken based on this lesson"
              />
            </div>
          </div>
          <div className={s.formActions}>
            <button className={s.btnPrimary} onClick={handleAddLesson}>
              <CheckCircle size={16} /> Save Lesson
            </button>
            <button
              className={s.btnSecondary}
              onClick={() => setShowLessonForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    <div className={s.cardBody}>
      {auditLessons.length === 0 ? (
        <div className={s.emptyState}>
          <BookOpen size={40} className={s.emptyIcon} />
          <h3 className={s.emptyTitle}>No Lessons Recorded</h3>
          <p className={s.emptyDesc}>
            Document lessons learned from this audit to improve future
            engagements.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {auditLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={s.findingCard}
              style={{
                borderLeftColor:
                  lesson.impact === "Positive" ? "#059669" : "#dc2626",
              }}
            >
              <div className={s.findingHeader}>
                <h4 className={s.findingTitle}>
                  {lesson.impact === "Positive" ? (
                    <TrendingUp size={16} style={{ color: "#059669" }} />
                  ) : (
                    <TrendingDown size={16} style={{ color: "#dc2626" }} />
                  )}
                  {lesson.title}
                </h4>
                <StatusBadge label={lesson.category} variant="info" />
              </div>
              <div className={s.findingBody}>
                <p>{lesson.description}</p>
              </div>
              {lesson.actionRequired && (
                <div className={s.findingRec}>
                  <strong>Action Required:</strong> {lesson.actionRequired}
                </div>
              )}
              <div
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                Submitted by {userName(lesson.submittedBy, users)} ”¢{" "}
                {new Date(lesson.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default LessonsTab;
