import React from "react";
import { Upload, CheckCircle, ChevronLeft, AlertCircle } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { Task, User, Workpaper } from "../../../types";
import { wpStatusVariant } from "../utils/status";

interface Props {
  workpaper: Workpaper;
  task: Task | undefined;
  uploader: User | undefined;
  currentUser: User | null;
  isReviewer: boolean;
  reviewNotes: string;
  setReviewNotes: (v: string) => void;
  onBack: () => void;
  onSubmit: (id: string) => void;
  onReview: (id: string, approved: boolean) => void;
}

const WorkpaperDetail: React.FC<Props> = ({
  workpaper,
  task,
  uploader,
  currentUser,
  isReviewer,
  reviewNotes,
  setReviewNotes,
  onBack,
  onSubmit,
  onReview,
}) => {
  return (
    <div>
      <button
        className={s.btnSecondary}
        style={{ marginBottom: "1.5rem" }}
        onClick={onBack}
      >
        <ChevronLeft size={16} /> Back to Workpapers
      </button>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>{workpaper.title}</h1>
          <p className={s.pageSubtitle}>
            Task: {task?.title || "—"} | Uploaded by {uploader?.name || "—"}
          </p>
        </div>
        <StatusBadge
          label={workpaper.status}
          variant={wpStatusVariant(workpaper.status)}
          size="md"
        />
      </div>

      <div className={s.gridTwoCols}>
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Workpaper Details</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>File Name</div>
              <div className={s.detailValue}>{workpaper.fileName}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>File Size</div>
              <div className={s.detailValue}>{workpaper.fileSize}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Uploaded</div>
              <div className={s.detailValue}>
                {new Date(workpaper.uploadedAt).toLocaleString("en-NG")}
              </div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Status</div>
              <div className={s.detailValue}>
                <StatusBadge
                  label={workpaper.status}
                  variant={wpStatusVariant(workpaper.status)}
                />
              </div>
            </div>
            {workpaper.reviewerNotes && (
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Review Notes</div>
                <div className={s.detailValue} style={{ color: "#dc2626" }}>
                  {workpaper.reviewerNotes}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                paddingTop: "1rem",
                flexWrap: "wrap",
              }}
            >
              {workpaper.status === "Draft" &&
                currentUser?.id === workpaper.uploadedBy && (
                  <button
                    className={s.btnPrimary}
                    onClick={() => onSubmit(workpaper.id)}
                  >
                    <Upload size={14} /> Submit for Review
                  </button>
                )}
              {workpaper.status === "Revision Required" &&
                currentUser?.id === workpaper.uploadedBy && (
                  <button
                    className={s.btnPrimary}
                    onClick={() => onSubmit(workpaper.id)}
                  >
                    <Upload size={14} /> Resubmit
                  </button>
                )}
            </div>
          </div>
        </div>

        {isReviewer && workpaper.status === "Submitted" && (
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3 className={s.cardTitle}>Review Workpaper</h3>
            </div>
            <div className={s.cardBody}>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="review-notes">
                  Review Notes (optional)
                </label>
                <textarea
                  id="review-notes"
                  className={s.formTextarea}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes for the auditor..."
                  rows={3}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  paddingTop: "1rem",
                }}
              >
                <button
                  className={s.btnPrimary}
                  onClick={() => onReview(workpaper.id, true)}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  className={s.btnDanger}
                  onClick={() => onReview(workpaper.id, false)}
                  disabled={!reviewNotes.trim()}
                >
                  <AlertCircle size={14} /> Request Revision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkpaperDetail;
