import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { MOCK_USERS } from "../../mock/data";
import { FileText, Plus } from "lucide-react";
import s from "../../styles/pages.module.css";
import { useMyWorkpapers } from "../../features/workpapers/hooks/useMyWorkpapers";
import UploadForm from "../../features/workpapers/components/UploadForm";
import WorkpaperKpis from "../../features/workpapers/components/WorkpaperKpis";
import WorkpaperRow from "../../features/workpapers/components/WorkpaperRow";
import WorkpaperDetail from "../../features/workpapers/components/WorkpaperDetail";

const WorkpapersPage: React.FC = () => {
  const uploadWorkpaper = useAuditStore((st) => st.uploadWorkpaper);
  const updateWorkpaperStatus = useAuditStore((st) => st.updateWorkpaperStatus);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);

  const { user, myAudit, myWorkpapers, myTasks, workpapers, tasks } =
    useMyWorkpapers();

  const [showUpload, setShowUpload] = useState(false);
  const [selectedWp, setSelectedWp] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTaskId, setUploadTaskId] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

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
      <WorkpaperDetail
        workpaper={selectedDetail}
        task={task}
        uploader={uploader}
        currentUser={user ?? null}
        isReviewer={isReviewer}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        onBack={() => setSelectedWp(null)}
        onSubmit={handleSubmit}
        onReview={handleReview}
      />
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

      <WorkpaperKpis workpapers={myWorkpapers} />

      {showUpload && (
        <UploadForm
          uploadTitle={uploadTitle}
          setUploadTitle={setUploadTitle}
          uploadTaskId={uploadTaskId}
          setUploadTaskId={setUploadTaskId}
          uploadFileName={uploadFileName}
          setUploadFileName={setUploadFileName}
          tasks={myTasks}
          onCancel={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}

      {myWorkpapers.length > 0 ? (
        myWorkpapers.map((wp) => {
          const task = tasks.find((t) => t.id === wp.taskId);
          const uploader = MOCK_USERS.find((u) => u.id === wp.uploadedBy);
          return (
            <WorkpaperRow
              key={wp.id}
              workpaper={wp}
              task={task}
              uploader={uploader}
              onView={() => setSelectedWp(wp.id)}
            />
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
