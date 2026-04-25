import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import type { User, LGA, Mandate, Audit, Invitation } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import { Users, UserPlus, AlertCircle, Briefcase, Send } from "lucide-react";
import s from "../../../styles/pages.module.css";

type Props = {
  user: User;
  lgas: LGA[];
  audits: Audit[];
  invitations: Invitation[];
  users: User[];
  activeMandate: Mandate | undefined;
};

const LeadTeamView: React.FC<Props> = ({
  user,
  lgas,
  audits,
  invitations,
  users,
  activeMandate,
}) => {
  const sendInvitation = useAuditStore((st) => st.sendInvitation);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);

  const [invitingAuditor, setInvitingAuditor] = useState(false);

  const auditors = useMemo(
    () => users.filter((u) => u.role === "TEAM_AUDITOR"),
    [users],
  );

  const myLga = lgas.find((l) => l.auditLeadId === user.id);
  const myAudit = audits.find((a) => a.lgaId === myLga?.id);
  const teamInvitations = invitations.filter(
    (i) => i.auditId === myAudit?.id && i.role === "TEAM_AUDITOR",
  );
  const acceptedAuditorIds = new Set(
    teamInvitations.filter((i) => i.status === "Accepted").map((i) => i.userId),
  );
  const pendingAuditorIds = new Set(
    teamInvitations.filter((i) => i.status === "Pending").map((i) => i.userId),
  );
  const invitedIds = new Set(teamInvitations.map((i) => i.userId));

  const handleInviteAuditor = (auditorId: string) => {
    const auditor = users.find((u) => u.id === auditorId);
    openModal({
      title: "Invite Team Auditor",
      message: `Send an invitation to ${auditor?.name} to join the audit team for ${myLga?.name}?`,
      confirmText: "Send Invitation",
      variant: "info",
      onConfirm: () => {
        if (myAudit && activeMandate) {
          sendInvitation({
            userId: auditorId,
            role: "TEAM_AUDITOR",
            lgaId: myLga?.id,
            auditId: myAudit.id,
            mandateId: activeMandate.id,
          });
        }
        addToast({
          type: "success",
          title: "Invitation Sent",
          message: `Invitation sent to ${auditor?.name}`,
        });
      },
    });
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Build Your Team</h1>
          <p className={s.pageSubtitle}>
            {myLga?.name} — Invite auditors from the available pool to your
            engagement team
          </p>
        </div>
        <button
          className={s.btnPrimary}
          onClick={() => setInvitingAuditor(!invitingAuditor)}
        >
          <UserPlus size={14} />{" "}
          {invitingAuditor ? "Close Pool" : "Invite Auditors"}
        </button>
      </div>

      <div className={s.kpiRow}>
        <div className={s.kpiCard}>
          <div className={s.kpiIconBlue}>
            <Users size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Team Members</div>
            <div className={s.kpiValue}>{acceptedAuditorIds.size}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconAmber}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Pending Invitations</div>
            <div className={s.kpiValue}>{pendingAuditorIds.size}</div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconPurple}>
            <Briefcase size={20} />
          </div>
          <div>
            <div className={s.kpiLabel}>Available Pool</div>
            <div className={s.kpiValue}>
              {auditors.filter((a) => !invitedIds.has(a.id)).length}
            </div>
          </div>
        </div>
      </div>

      {teamInvitations.length > 0 && (
        <div className={s.card} style={{ marginBottom: "1.5rem" }}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Current Team</h3>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialisations</th>
                  <th>Experience</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamInvitations.map((inv) => {
                  const auditor = users.find((u) => u.id === inv.userId);
                  return (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{auditor?.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {auditor?.email}
                        </div>
                      </td>
                      <td>
                        <div className={s.poolTags}>
                          {auditor?.specialisations?.map((sp) => (
                            <span key={sp} className={s.poolTag}>
                              {sp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        {auditor?.experience
                          ?.map((e) => lgas.find((l) => l.id === e)?.name || e)
                          .join(", ") || "—"}
                      </td>
                      <td>
                        <StatusBadge
                          label={inv.status}
                          variant={
                            inv.status === "Accepted"
                              ? "success"
                              : inv.status === "Pending"
                                ? "warning"
                                : inv.status === "Declined"
                                  ? "error"
                                  : "default"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {invitingAuditor && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Available Auditor Pool</h3>
          </div>
          <div className={s.cardBody}>
            {auditors
              .filter((a) => !invitedIds.has(a.id))
              .map((auditor) => (
                <div key={auditor.id} className={s.poolCard}>
                  <div className={s.poolInfo}>
                    <div className={s.poolName}>{auditor.name}</div>
                    <div className={s.poolMeta}>
                      {auditor.email} · Workload: {auditor.workload || 0}
                    </div>
                    <div className={s.poolTags} style={{ marginTop: "0.2rem" }}>
                      {auditor.specialisations?.map((sp) => (
                        <span key={sp} className={s.poolTag}>
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`${s.btnPrimary} ${s.btnSmall}`}
                    onClick={() => handleInviteAuditor(auditor.id)}
                  >
                    <Send size={12} /> Invite
                  </button>
                </div>
              ))}
            {auditors.filter((a) => !invitedIds.has(a.id)).length === 0 && (
              <div className={s.emptyState}>
                <Users size={40} className={s.emptyIcon} />
                <div className={s.emptyTitle}>All auditors invited</div>
                <div className={s.emptyDesc}>
                  All available auditors have been invited to teams.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {teamInvitations.length === 0 && !invitingAuditor && (
        <div className={s.card}>
          <div className={s.cardBody}>
            <div className={s.emptyState}>
              <Users size={40} className={s.emptyIcon} />
              <div className={s.emptyTitle}>No team members yet</div>
              <div className={s.emptyDesc}>
                Click "Invite Auditors" to browse the available auditor pool and
                build your engagement team.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTeamView;
