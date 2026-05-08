import React from "react";
import { Upload } from "lucide-react";
import s from "../../../styles/pages.module.css";
import type { Task } from "../../../types";

interface Props {
  uploadTitle: string;
  setUploadTitle: (v: string) => void;
  uploadTaskId: string;
  setUploadTaskId: (v: string) => void;
  uploadFileName: string;
  setUploadFileName: (v: string) => void;
  tasks: Task[];
  onCancel: () => void;
  onUpload: () => void;
}

const UploadForm: React.FC<Props> = ({
  uploadTitle,
  setUploadTitle,
  uploadTaskId,
  setUploadTaskId,
  uploadFileName,
  setUploadFileName,
  tasks,
  onCancel,
  onUpload,
}) => {
  return (
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
              {tasks.map((t) => (
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
          <button className={s.btnSecondary} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={s.btnPrimary}
            onClick={onUpload}
            disabled={!uploadTitle.trim() || !uploadTaskId}
          >
            <Upload size={14} /> Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
