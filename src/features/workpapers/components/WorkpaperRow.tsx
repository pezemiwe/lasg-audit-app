import React from "react";
import { File, MessageSquare, Eye } from "lucide-react";
import StatusBadge from "../../../components/UI/StatusBadge";
import s from "../../../styles/pages.module.css";
import type { Task, User, Workpaper } from "../../../types";
import { wpStatusVariant } from "../utils/status";

interface Props {
  workpaper: Workpaper;
  task: Task | undefined;
  uploader: User | undefined;
  onView: () => void;
}

const WorkpaperRow: React.FC<Props> = ({
  workpaper,
  task,
  uploader,
  onView,
}) => {
  return (
    <div className={s.wpCard}>
      <div className={s.wpRow}>
        <div className={s.wpInfo}>
          <div className={s.wpIcon}>
            <File size={20} />
          </div>
          <div className={s.wpDetails}>
            <div className={s.wpTitle}>{workpaper.title}</div>
            <div className={s.wpMeta}>
              {workpaper.fileName} · {workpaper.fileSize} · {uploader?.name} ·{" "}
              {new Date(workpaper.uploadedAt).toLocaleDateString("en-NG")}
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
            label={workpaper.status}
            variant={wpStatusVariant(workpaper.status)}
          />
          {workpaper.reviewerNotes && (
            <div
              title={workpaper.reviewerNotes}
              style={{ color: "#dc2626", cursor: "help" }}
            >
              <MessageSquare size={16} />
            </div>
          )}
          <button
            className={s.btnIcon}
            aria-label="View workpaper"
            onClick={onView}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkpaperRow;
