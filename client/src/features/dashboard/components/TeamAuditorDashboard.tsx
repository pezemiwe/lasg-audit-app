import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { LGAS } from "../../../mock/data";
import { useAuditStore } from "../../../store/useAuditStore";
import type { User } from "../../../types";
import s from "../../../styles/pages.module.css";

interface TeamAuditorDashboardProps {
  user: User;
}

const TeamAuditorDashboard: React.FC<TeamAuditorDashboardProps> = ({
  user,
}) => {
  const navigate = useNavigate();
  const myLGA = LGAS.find((l) => l.id === user.lgaId);

  const tasks = useAuditStore((st) => st.tasks);
  const audits = useAuditStore((st) => st.audits);
  const invitations = useAuditStore((st) => st.invitations);
  const procedureExecutions = useAuditStore((st) => st.procedureExecutions);
  const workpapers = useAuditStore((st) => st.workpapers);

  const myInvitations = invitations.filter(
    (i) => i.userId === user.id && i.status === "Accepted",
  );
  const myAuditIds = new Set(myInvitations.map((i) => i.auditId));

  // Also include audit where user is a team member
  audits.forEach((a) => {
    if (a.teamIds?.includes(user.id)) myAuditIds.add(a.id);
  });

  const myAudits = audits.filter((a) => myAuditIds.has(a.id));
  const myTasks = tasks.filter(
    (t) =>
      t.assignedTo === user.id || (myAuditIds.has(t.auditId) && !t.assignedTo),
  );
  const myExecutions = procedureExecutions.filter(
    (e) => e.assignedTo === user.id || myAuditIds.has(e.auditId),
  );
  const myWorkpapers = workpapers.filter((w) => w.uploadedBy === user.id);

  const completedTasks = myTasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = myTasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const pendingTasks = myTasks.filter((t) => t.status === "Pending").length;
  const overdueTasks = myTasks.filter(
    (t) =>
      t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;

  const clearedExecutions = myExecutions.filter(
    (e) => e.status === "Cleared",
  ).length;
  const inProgressExecutions = myExecutions.filter(
    (e) => e.status === "In Progress",
  ).length;

  const nextDeadlineTask = myTasks
    .filter((t) => t.status !== "Completed" && t.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )[0];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const [now] = useState<number>(() => Date.now());
  const daysUntil = (d: string) => {
    const diff = Math.ceil(
      (new Date(d).getTime() - now) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const pendingInvites = invitations.filter(
    (i) => i.userId === user.id && i.status === "Pending",
  );

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Assignments</h1>
          <p className={s.pageSubtitle}>
            Council: <strong>{myLGA?.name || "Not assigned"}</strong>
            {myLGA?.councilType === "LCDA" ? " (LCDA)" : " (LGA)"}
            {myAudits.length > 0 && (
              <>
                {" "}
                &mdash; {myAudits.length} active audit
                {myAudits.length > 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
        <span className={s.pageBadge}>
          <FileText size={12} /> Team Auditor
        </span>
      </div>

      {pendingInvites.length > 0 && (
        <div
          style={{
            padding: "1rem 1.25rem",
            background: "#fefce8",
            border: "1px solid #fde047",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <AlertCircle size={18} color="#ca8a04" />
            <span style={{ fontWeight: 600, color: "#92400e" }}>
              {pendingInvites.length} pending assignment invitation
              {pendingInvites.length > 1 ? "s" : ""}
            </span>
          </div>
          <button
            className={s.btnOutline}
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
            onClick={() => navigate("/assignments")}
          >
            Review Invitations <ArrowRight size={13} />
          </button>
        </div>
      )}

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <ClipboardList size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Assigned Tasks</div>
            <div className={s.kpiValue}>{myTasks.length}</div>
            <div className={s.kpiMeta}>
              {inProgressTasks} in progress · {pendingTasks} pending
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Completed</div>
            <div className={s.kpiValue}>{completedTasks}</div>
            <div className={s.kpiMeta}>
              {myTasks.length > 0
                ? `${Math.round((completedTasks / myTasks.length) * 100)}% completion rate`
                : "No tasks assigned"}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={overdueTasks > 0 ? s.kpiIconAmber : s.kpiIconBlue}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>
              {nextDeadlineTask ? "Next Deadline" : "Deadlines"}
            </div>
            <div className={s.kpiValue}>
              {nextDeadlineTask ? formatDate(nextDeadlineTask.dueDate!) : "—"}
            </div>
            <div className={s.kpiMeta}>
              {nextDeadlineTask
                ? `${daysUntil(nextDeadlineTask.dueDate!)} days remaining`
                : overdueTasks > 0
                  ? `${overdueTasks} overdue`
                  : "All on track"}
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <FileText size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Procedures</div>
            <div className={s.kpiValue}>{myExecutions.length}</div>
            <div className={s.kpiMeta}>
              {clearedExecutions} cleared · {inProgressExecutions} in progress
            </div>
          </div>
        </div>
      </div>

      {myTasks.length === 0 && myExecutions.length === 0 ? (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <ClipboardList size={40} className={s.emptyIcon} />
              <h3 className={s.emptyTitle}>No Tasks Assigned Yet</h3>
              <p className={s.emptyDesc}>
                Your Audit Lead will assign tasks once fieldwork begins. Check
                your invitations if you haven&apos;t accepted an engagement yet.
              </p>
              {pendingInvites.length > 0 && (
                <button
                  className={s.btnPrimary}
                  onClick={() => navigate("/assignments")}
                >
                  Review Invitations
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {myTasks.length > 0 && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>My Tasks</h3>
                <button
                  className={s.btnOutline}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
                  onClick={() => navigate("/assignments")}
                >
                  View All
                </button>
              </div>
              <div className={s.cardBody}>
                {myTasks.slice(0, 5).map((task) => {
                  const isOverdue =
                    task.status !== "Completed" &&
                    task.dueDate &&
                    new Date(task.dueDate) < new Date();
                  return (
                    <div key={task.id} className={s.taskCard}>
                      <div className={s.taskHeader}>
                        <div>
                          <div className={s.taskTitle}>{task.title}</div>
                          <div className={s.taskMeta}>
                            {task.dueDate
                              ? `Due: ${formatDate(task.dueDate)}`
                              : "No due date"}
                            {isOverdue && (
                              <span
                                style={{
                                  color: "#ef4444",
                                  marginLeft: "0.5rem",
                                }}
                              >
                                · Overdue
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={
                            task.status === "In Progress"
                              ? s.taskStatusProgress
                              : task.status === "Pending"
                                ? s.taskStatusPending
                                : s.taskStatusComplete
                          }
                        >
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <div className={s.taskBody}>{task.description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {myExecutions.length > 0 && (
            <div className={s.card} style={{ marginBottom: "1.5rem" }}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>Audit Procedures</h3>
                <button
                  className={s.btnOutline}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
                  onClick={() => navigate("/fieldwork")}
                >
                  Go to Fieldwork
                </button>
              </div>
              <div className={s.cardBody}>
                {myExecutions.slice(0, 5).map((exec) => (
                  <div key={exec.id} className={s.taskCard}>
                    <div className={s.taskHeader}>
                      <div>
                        <div className={s.taskTitle}>
                          {exec.procedureDescription}
                        </div>
                        <div className={s.taskMeta}>{exec.auditArea}</div>
                      </div>
                      <span
                        className={
                          exec.status === "Cleared"
                            ? s.taskStatusComplete
                            : exec.status === "In Progress"
                              ? s.taskStatusProgress
                              : s.taskStatusPending
                        }
                      >
                        {exec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myWorkpapers.length > 0 && (
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3 className={s.cardTitle}>My Workpapers</h3>
                <button
                  className={s.btnOutline}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
                  onClick={() => navigate("/workpapers")}
                >
                  View All
                </button>
              </div>
              <div className={s.cardBody}>
                {myWorkpapers.slice(0, 3).map((wp) => (
                  <div key={wp.id} className={s.taskCard}>
                    <div className={s.taskHeader}>
                      <div>
                        <div className={s.taskTitle}>{wp.title}</div>
                        <div className={s.taskMeta}>{wp.fileName}</div>
                      </div>
                      <span
                        className={
                          wp.status === "Approved"
                            ? s.taskStatusComplete
                            : wp.status === "Submitted"
                              ? s.taskStatusProgress
                              : wp.status === "Revision Required"
                                ? s.taskStatusPending
                                : s.taskStatusPending
                        }
                      >
                        {wp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamAuditorDashboard;
