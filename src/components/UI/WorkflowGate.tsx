import React from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";
import s from "../../styles/pages.module.css";

export type AuditPhase =
  | "pre-audit"
  | "planning"
  | "fieldwork"
  | "reporting"
  | "post-audit";

const PHASE_ORDER: AuditPhase[] = [
  "pre-audit",
  "planning",
  "fieldwork",
  "reporting",
  "post-audit",
];

const PHASE_LABELS: Record<AuditPhase, string> = {
  "pre-audit": "Pre-Audit Survey",
  planning: "Audit Planning",
  fieldwork: "Fieldwork",
  reporting: "Reporting",
  "post-audit": "Post-Audit",
};

const PHASE_PREREQS: Record<AuditPhase, string> = {
  "pre-audit": "",
  planning: "Pre-Audit stage must be approved before accessing Audit Planning.",
  fieldwork: "Planning stage must be approved before starting Fieldwork.",
  reporting: "Fieldwork stage must be approved before creating Reports.",
  "post-audit":
    "Reporting must be completed (Final report) before Post-Audit activities.",
};

/**
 * Check if a given audit phase is unlocked based on stage approvals and audit status.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useWorkflowGate(phase: AuditPhase) {
  const { user } = useAuth();
  const audits = useAuditStore((st) => st.audits);
  const stageApprovals = useAuditStore((st) => st.stageApprovals);
  const reports = useAuditStore((st) => st.reports);

  if (!user) return { unlocked: false, reason: "Not authenticated" };

  /* Admin & AG always have full access */
  if (
    user.role === "SYSTEM_ADMIN" ||
    user.role === "AUDITOR_GENERAL_FEDERATION"
  )
    return { unlocked: true, reason: "" };

  /* Find the user's relevant audit */
  let userAudit = audits.find((a) => a.leadId === user.id);
  if (!userAudit && user.lgaId) {
    userAudit = audits.find((a) => a.lgaId === user.lgaId);
  }
  if (!userAudit) {
    /* If HLGA or AG, check for any audit */
    if (user.role === "HEAD_OF_LOCAL_GOVERNMENT") {
      userAudit = audits.find((a) => a.lgaId === user.lgaId);
    }
    if (user.role === "STATE_AUDITOR_GENERAL") {
      return { unlocked: true, reason: "" };
    }
    if (user.role === "AUDIT_SUPERVISOR") {
      return { unlocked: true, reason: "" };
    }
  }

  /* Pre-audit is always accessible */
  if (phase === "pre-audit") return { unlocked: true, reason: "" };

  const auditId = userAudit?.id;
  if (!auditId)
    return {
      unlocked: false,
      reason: "No audit engagement found for your account.",
    };

  const approvals = stageApprovals.filter((sa) => sa.auditId === auditId);

  if (phase === "planning") {
    const preAuditApproved = approvals.some(
      (a) => a.stage === "Pre-Audit" && a.status === "Approved",
    );
    return {
      unlocked: preAuditApproved,
      reason: preAuditApproved ? "" : PHASE_PREREQS.planning,
    };
  }

  if (phase === "fieldwork") {
    const planningApproved = approvals.some(
      (a) => a.stage === "Planning" && a.status === "Approved",
    );
    return {
      unlocked: planningApproved,
      reason: planningApproved ? "" : PHASE_PREREQS.fieldwork,
    };
  }

  if (phase === "reporting") {
    const fieldworkApproved = approvals.some(
      (a) => a.stage === "Fieldwork" && a.status === "Approved",
    );
    return {
      unlocked: fieldworkApproved,
      reason: fieldworkApproved ? "" : PHASE_PREREQS.reporting,
    };
  }

  if (phase === "post-audit") {
    const hasFinalReport = reports.some(
      (r) =>
        r.auditId === auditId &&
        (r.status === "Final" || r.status === "Approved"),
    );
    const auditCompleted =
      userAudit?.status === "Completed" || userAudit?.status === "Reporting";
    return {
      unlocked: hasFinalReport || auditCompleted,
      reason:
        hasFinalReport || auditCompleted ? "" : PHASE_PREREQS["post-audit"],
    };
  }

  return { unlocked: true, reason: "" };
}

/**
 * Visual component showing phase progression and locked state
 */
export const WorkflowGate: React.FC<{
  phase: AuditPhase;
  children: React.ReactNode;
}> = ({ phase, children }) => {
  const { unlocked, reason } = useWorkflowGate(phase);

  if (unlocked) return <>{children}</>;

  const phaseIdx = PHASE_ORDER.indexOf(phase);

  return (
    <>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>
          <Lock size={24} style={{ marginRight: "8px", color: "#9ca3af" }} />
          {PHASE_LABELS[phase]} — Locked
        </h1>
        <p className={s.pageSubtitle}>{reason}</p>
      </div>

      {/* Phase progression visual */}
      <div className={s.card}>
        <div className={s.cardBody}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1.5rem 0",
              flexWrap: "wrap",
            }}
          >
            {PHASE_ORDER.map((p, idx) => {
              const isCompleted = idx < phaseIdx;
              const isCurrent = idx === phaseIdx;
              return (
                <React.Fragment key={p}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isCompleted
                          ? "#059669"
                          : isCurrent
                            ? "#f59e0b"
                            : "#e5e7eb",
                        color: isCompleted || isCurrent ? "#fff" : "#9ca3af",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={18} />
                      ) : isCurrent ? (
                        <Lock size={18} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isCompleted
                          ? "#059669"
                          : isCurrent
                            ? "#d97706"
                            : "#9ca3af",
                        fontWeight: isCurrent ? 600 : 400,
                        textAlign: "center",
                        maxWidth: "80px",
                      }}
                    >
                      {PHASE_LABELS[p]}
                    </span>
                  </div>
                  {idx < PHASE_ORDER.length - 1 && (
                    <ArrowRight
                      size={16}
                      style={{
                        color: isCompleted ? "#059669" : "#d1d5db",
                        marginTop: "-20px",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              background: "#fef3c7",
              borderRadius: "8px",
              color: "#92400e",
              marginTop: "1rem",
            }}
          >
            <strong>Action Required:</strong> Complete and get approval for the
            previous phase to unlock {PHASE_LABELS[phase]}.
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowGate;
