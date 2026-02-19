import React, { useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Calendar,
} from "lucide-react";
import s from "../../styles/pages.module.css";

const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const invitations = useAuditStore((st) => st.invitations);
  const acceptInvitation = useAuditStore((st) => st.acceptInvitation);
  const declineInvitation = useAuditStore((st) => st.declineInvitation);
  const openModal = useAuditStore((st) => st.openModal);
  const lgas = useAuditStore((st) => st.lgas);
  const zones = useAuditStore((st) => st.zones);
  const mandates = useAuditStore((st) => st.mandates);

  const myInvitations = useMemo(
    () => (user ? invitations.filter((i) => i.userId === user.id) : []),
    [invitations, user],
  );

  const pending = myInvitations.filter((i) => i.status === "Pending");
  const accepted = myInvitations.filter((i) => i.status === "Accepted");
  const declined = myInvitations.filter((i) => i.status === "Declined");

  const handleAccept = (invId: string) => {
    openModal({
      title: "Accept Assignment",
      message:
        "By accepting this assignment, you confirm your participation in the audit engagement. You will be expected to fulfil all assigned responsibilities within the specified timeline.",
      confirmText: "Accept Assignment",
      variant: "info",
      onConfirm: () => acceptInvitation(invId),
    });
  };

  const handleDecline = (invId: string) => {
    openModal({
      title: "Decline Assignment",
      message:
        "Are you sure you want to decline this assignment? The supervisor will be notified and may reassign the engagement.",
      confirmText: "Decline",
      variant: "danger",
      onConfirm: () => declineInvitation(invId),
    });
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "AUDIT_LEAD":
        return "Audit Lead";
      case "TEAM_AUDITOR":
        return "Team Auditor";
      case "AUDIT_SUPERVISOR":
        return "Audit Supervisor";
      default:
        return role;
    }
  };

  const getLgaName = (id?: string) =>
    lgas.find((l) => l.id === id)?.name || "—";
  const getZoneName = (id?: string) =>
    zones.find((z) => z.id === id)?.name || "—";
  const getMandateTitle = (id: string) =>
    mandates.find((m) => m.id === id)?.title || "—";

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Assignments</h1>
          <p className={s.pageSubtitle}>
            Review and respond to your audit engagement invitations
          </p>
        </div>
        <span className={s.pageBadge}>
          <Briefcase size={12} /> {user?.role.replace(/_/g, " ")}
        </span>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <Clock size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending</div>
            <div className={s.kpiValue}>{pending.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconGreen}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Accepted</div>
            <div className={s.kpiValue}>{accepted.length}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Mail size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Total</div>
            <div className={s.kpiValue}>{myInvitations.length}</div>
          </div>
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Pending Invitations
          </div>
          {pending.map((inv) => (
            <div key={inv.id} className={s.invitationCard}>
              <div className={s.invitationHeader}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      background: "#fffbeb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#d97706",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text, #0f172a)",
                      }}
                    >
                      {getRoleName(inv.role)} Assignment
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {inv.lgaId && `${getLgaName(inv.lgaId)} LGA`}
                      {inv.zoneId && `${getZoneName(inv.zoneId)} Zone`}
                      {` · Sent ${new Date(inv.sentAt).toLocaleDateString("en-NG")}`}
                    </div>
                  </div>
                </div>
                <div className={s.invitationActions}>
                  <button
                    className={`${s.btnPrimary} ${s.btnSmall}`}
                    onClick={() => handleAccept(inv.id)}
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    className={`${s.btnDanger} ${s.btnSmall}`}
                    onClick={() => handleDecline(inv.id)}
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
              <div className={s.invitationBody}>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Mandate</div>
                  <div className={s.detailValue}>
                    {getMandateTitle(inv.mandateId)}
                  </div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Role</div>
                  <div className={s.detailValue}>
                    <StatusBadge label={getRoleName(inv.role)} variant="gold" />
                  </div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Expires</div>
                  <div className={s.detailValue}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Calendar size={14} style={{ color: "#64748b" }} />
                      {new Date(inv.expiresAt).toLocaleString("en-NG")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {accepted.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Active Assignments
          </div>
          {accepted.map((inv) => (
            <div key={inv.id} className={s.invitationCard}>
              <div className={s.invitationHeader}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      background: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#16a34a",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text, #0f172a)",
                      }}
                    >
                      {getRoleName(inv.role)} —{" "}
                      {inv.lgaId
                        ? getLgaName(inv.lgaId)
                        : inv.zoneId
                          ? getZoneName(inv.zoneId)
                          : ""}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      Accepted{" "}
                      {inv.acceptedAt
                        ? new Date(inv.acceptedAt).toLocaleDateString("en-NG")
                        : ""}
                    </div>
                  </div>
                </div>
                <StatusBadge label="Active" variant="success" size="md" />
              </div>
            </div>
          ))}
        </>
      )}

      {declined.length > 0 && (
        <>
          <div className={s.sectionDivider} style={{ marginBottom: "1rem" }}>
            Declined
          </div>
          {declined.map((inv) => (
            <div
              key={inv.id}
              className={s.invitationCard}
              style={{ opacity: 0.6 }}
            >
              <div className={s.invitationHeader}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      background: "#fef2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#dc2626",
                      flexShrink: 0,
                    }}
                  >
                    <XCircle size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text, #0f172a)",
                      }}
                    >
                      {getRoleName(inv.role)} —{" "}
                      {inv.lgaId ? getLgaName(inv.lgaId) : ""}
                    </div>
                  </div>
                </div>
                <StatusBadge label="Declined" variant="error" />
              </div>
            </div>
          ))}
        </>
      )}

      {myInvitations.length === 0 && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Mail size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No assignments yet</div>
              <div className={s.emptyDesc}>
                You have not received any audit engagement invitations.
                Assignments will appear here when a supervisor or lead adds you
                to their team.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
