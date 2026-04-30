import React from "react";
import { FileText, Clock, CheckCircle, ClipboardList } from "lucide-react";
import { LGAS } from "../../../mock/data";
import type { User } from "../../../types";
import s from "../../../styles/pages.module.css";

interface TeamAuditorDashboardProps {
  user: User;
}

const TeamAuditorDashboard: React.FC<TeamAuditorDashboardProps> = ({
  user,
}) => {
  const myLGA = LGAS.find((l) => l.id === user.lgaId);
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Assignments</h1>
          <p className={s.pageSubtitle}>
            Council: <strong>{myLGA?.name || "Not assigned"}</strong>
            {myLGA?.councilType === "LCDA" ? " (LCDA)" : " (LGA)"}, assigned
            audit tasks and deliverables
          </p>
        </div>
        <span className={s.pageBadge}>
          <FileText size={12} /> Team Auditor
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <ClipboardList size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Assigned Tasks</div>
            <div className={s.kpiValue}>6</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Completed</div>
            <div className={s.kpiValue}>2</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Next Deadline</div>
            <div className={s.kpiValue}>Mar 5</div>
            <div className={s.kpiMeta}>16 days remaining</div>
          </div>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Current Tasks</h3>
        </div>
        <div className={s.cardBody}>
          {[
            {
              title: "Revenue Verification: Cash Collections",
              desc: "Verify cash collection records for Jan-Feb 2026 across all revenue points in Mushin LGA. Cross-reference with bank deposits.",
              status: "progress" as const,
              due: "Mar 5, 2026",
            },
            {
              title: "Document Review: Procurement Files",
              desc: "Review procurement documentation for capital projects exceeding ₦50M. Verify compliance with Public Procurement Act.",
              status: "progress" as const,
              due: "Mar 12, 2026",
            },
            {
              title: "Bank Reconciliation: Q4 2025",
              desc: "Reconcile cashbook entries with bank statements for October-December 2025.",
              status: "complete" as const,
              due: "Feb 10, 2026",
            },
            {
              title: "Asset Verification: Vehicle Fleet",
              desc: "Physical verification of all registered vehicles. Document condition, location and usage logs.",
              status: "pending" as const,
              due: "Mar 20, 2026",
            },
          ].map((task, i) => (
            <div key={i} className={s.taskCard}>
              <div className={s.taskHeader}>
                <div>
                  <div className={s.taskTitle}>{task.title}</div>
                  <div className={s.taskMeta}>Due: {task.due}</div>
                </div>
                <span
                  className={
                    task.status === "progress"
                      ? s.taskStatusProgress
                      : task.status === "pending"
                        ? s.taskStatusPending
                        : s.taskStatusComplete
                  }
                >
                  {task.status === "progress"
                    ? "In Progress"
                    : task.status === "pending"
                      ? "Pending"
                      : "Completed"}
                </span>
              </div>
              <div className={s.taskBody}>{task.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamAuditorDashboard;
