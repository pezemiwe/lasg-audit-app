import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_USERS } from "../../mock/data";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Plus,
  ChevronLeft,
  File,
  AlertCircle,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const wpStatusVariant = (st: string) => {
  switch (st) {
    case "Draft":
      return "default" as const;
    case "Submitted":
      return "info" as const;
    case "Reviewed":
      return "warning" as const;
    case "Approved":
      return "success" as const;
    case "Revision Required":
      return "error" as const;
    default:
      return "default" as const;
  }
};

const WorkpapersPage: React.FC = () => {
  const { user } = useAuth();
  const workpapers = useAuditStore((st) => st.workpapers);
  const tasks = useAuditStore((st) => st.tasks);
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);
  const uploadWorkpaper = useAuditStore((st) => st.uploadWorkpaper);
  const updateWorkpaperStatus = useAuditStore((st) => st.updateWorkpaperStatus);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedWp, setSelectedWp] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTaskId, setUploadTaskId] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  const myAudit = useMemo(() => {
    if (!user) return null;
    if (user.role === "TEAM_AUDITOR" || user.role === "AUDIT_LEAD") {
      const myLga = lgas.find(
        (l) => l.auditLeadId === user.id || l.id === user.lgaId,
      );
      return audits.find((a) => a.lgaId === myLga?.id) || audits[0];
    }
    return audits[0];
  }, [user, audits, lgas]);

  const myWorkpapers = useMemo(
    () => (myAudit ? workpapers.filter((w) => w.auditId === myAudit.id) : []),
    [workpapers, myAudit],
  );

  const myTasks = useMemo(
    () => (myAudit ? tasks.filter((t) => t.auditId === myAudit.id) : []),
    [tasks, myAudit],
  );

  const selectedDetail = useMemo(
    () => workpapers.find((w) => w.id === selectedWp),
    [workpapers, selectedWp],
  );

  const handleUpload = () => {
    if (!uploadTitle.trim() || !uploadTaskId || !myAudit || !user) return;
    uploadWorkpaper({
      auditId: myAudit.id,
      taskId: uploadTaskId,
      title: uploadTitle.trim(),
      uploadedBy: user.id,
      fileName: uploadFileName || `${uploadTitle.replace(/\s+/g, "_")}.xlsx`,
      fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      status: "Draft",
    });
    setUploadTitle("");
    setUploadTaskId("");
    setUploadFileName("");
    setShowUpload(false);
  };

  const handleSubmit = (wpId: string) => {
    openModal({
      title: "Submit Workpaper",
      message:
        "Submit this workpaper for review by the Audit Lead? Once submitted, you will not be able to make changes unless revision is requested.",
      confirmText: "Submit for Review",
      variant: "info",
      onConfirm: () => {
        updateWorkpaperStatus(wpId, "Submitted");
        addToast({ type: "success", title: "Workpaper Submitted" });
      },
    });
  };

  const handleReview = (wpId: string, approved: boolean) => {
    if (approved) {
      updateWorkpaperStatus(wpId, "Approved");
      addToast({ type: "success", title: "Workpaper Approved" });
    } else {
      updateWorkpaperStatus(wpId, "Revision Required", reviewNotes);
      addToast({
        type: "warning",
        title: "Revision Requested",
        message: "The auditor will be notified",
      });
    }
    setReviewNotes("");
    setSelectedWp(null);
  };

  const isReviewer =
    user?.role === "AUDIT_LEAD" || user?.role === "AUDIT_SUPERVISOR";

  if (selectedDetail) {
    const task = tasks.find((t) => t.id === selectedDetail.taskId);
    const uploader = MOCK_USERS.find((u) => u.id === selectedDetail.uploadedBy);

    return (
      <div>
        <button
          className={s.btnSecondary}
          style={{ marginBottom: "1.5rem" }}
          onClick={() => setSelectedWp(null)}
        >
          <ChevronLeft size={16} /> Back to Workpapers
        </button>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>{selectedDetail.title}</h1>
            <p className={s.pageSubtitle}>
              Task: {task?.title || "—"} · Uploaded by {uploader?.name || "—"}
            </p>
          </div>
          <StatusBadge
            label={selectedDetail.status}
            variant={wpStatusVariant(selectedDetail.status)}
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
                <div className={s.detailValue}>{selectedDetail.fileName}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>File Size</div>
                <div className={s.detailValue}>{selectedDetail.fileSize}</div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Uploaded</div>
                <div className={s.detailValue}>
                  {new Date(selectedDetail.uploadedAt).toLocaleString("en-NG")}
                </div>
              </div>
              <div className={s.detailRow}>
                <div className={s.detailLabel}>Status</div>
                <div className={s.detailValue}>
                  <StatusBadge
                    label={selectedDetail.status}
                    variant={wpStatusVariant(selectedDetail.status)}
                  />
                </div>
              </div>
              {selectedDetail.reviewerNotes && (
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Review Notes</div>
                  <div className={s.detailValue} style={{ color: "#dc2626" }}>
                    {selectedDetail.reviewerNotes}
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
                {selectedDetail.status === "Draft" &&
                  user?.id === selectedDetail.uploadedBy && (
                    <button
                      className={s.btnPrimary}
                      onClick={() => handleSubmit(selectedDetail.id)}
                    >
                      <Upload size={14} /> Submit for Review
                    </button>
                  )}
                {selectedDetail.status === "Revision Required" &&
                  user?.id === selectedDetail.uploadedBy && (
                    <button
                      className={s.btnPrimary}
                      onClick={() => handleSubmit(selectedDetail.id)}
                    >
                      <Upload size={14} /> Resubmit
                    </button>
                  )}
              </div>
            </div>
          </div>

          {isReviewer && selectedDetail.status === "Submitted" && (
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
                    onClick={() => handleReview(selectedDetail.id, true)}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className={s.btnDanger}
                    onClick={() => handleReview(selectedDetail.id, false)}
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
  }

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Workpapers</h1>
          <p className={s.pageSubtitle}>
            Upload, manage, and review audit working papers
          </p>
        </div>
        {(user?.role === "TEAM_AUDITOR" || user?.role === "AUDIT_LEAD") && (
          <button
            className={s.btnPrimary}
            onClick={() => setShowUpload(!showUpload)}
          >
            <Plus size={14} /> {showUpload ? "Cancel" : "Upload Workpaper"}
          </button>
        )}
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <FileText size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total</div>
            <div className={s.kpiValue}>{myWorkpapers.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Review</div>
            <div className={s.kpiValue}>
              {myWorkpapers.filter((w) => w.status === "Submitted").length}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Approved</div>
            <div className={s.kpiValue}>
              {myWorkpapers.filter((w) => w.status === "Approved").length}
            </div>
          </div>
        </div>
      </div>

      {showUpload && (
        <div className={s.card} style={{ marginBottom: "1.5rem" }}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Upload New Workpaper</h3>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="wp-title">
                  Title
                </label>
                <input
                  id="wp-title"
                  className={s.formInput}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Revenue Collections Working Schedule"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="wp-task">
                  Related Task
                </label>
                <select
                  id="wp-task"
                  className={s.formSelect}
                  value={uploadTaskId}
                  onChange={(e) => setUploadTaskId(e.target.value)}
                >
                  <option value="">Select task...</option>
                  {myTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="wp-file">
                  File Name
                </label>
                <input
                  id="wp-file"
                  className={s.formInput}
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="document.xlsx"
                />
              </div>
            </div>
            <div className={s.formActions}>
              <button
                className={s.btnSecondary}
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </button>
              <button
                className={s.btnPrimary}
                onClick={handleUpload}
                disabled={!uploadTitle.trim() || !uploadTaskId}
              >
                <Upload size={14} /> Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {myWorkpapers.length > 0 ? (
        myWorkpapers.map((wp) => {
          const task = tasks.find((t) => t.id === wp.taskId);
          const uploader = MOCK_USERS.find((u) => u.id === wp.uploadedBy);
          return (
            <div key={wp.id} className={s.wpCard}>
              <div className={s.wpRow}>
                <div className={s.wpInfo}>
                  <div className={s.wpIcon}>
                    <File size={20} />
                  </div>
                  <div className={s.wpDetails}>
                    <div className={s.wpTitle}>{wp.title}</div>
                    <div className={s.wpMeta}>
                      {wp.fileName} · {wp.fileSize} · {uploader?.name} ·{" "}
                      {new Date(wp.uploadedAt).toLocaleDateString("en-NG")}
                    </div>
                    {task && <div className={s.wpMeta}>Task: {task.title}</div>}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <StatusBadge
                    label={wp.status}
                    variant={wpStatusVariant(wp.status)}
                  />
                  {wp.reviewerNotes && (
                    <div
                      title={wp.reviewerNotes}
                      style={{ color: "#dc2626", cursor: "help" }}
                    >
                      <MessageSquare size={16} />
                    </div>
                  )}
                  <button
                    className={s.btnIcon}
                    aria-label="View workpaper"
                    onClick={() => setSelectedWp(wp.id)}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <FileText size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No workpapers yet</div>
              <div className={s.emptyDesc}>
                Upload your first working paper to begin documenting audit
                evidence and findings.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkpapersPage;
