import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../../components/UI/StatusBadge";
import {
  Users,
  UserPlus,
  MapPin,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Send,
  X,
} from "lucide-react";
import s from "../../styles/pages.module.css";
// import type { User } from "../../types";

const TeamManagementPage: React.FC = () => {
  const { user } = useAuth();
  const zones = useAuditStore((st) => st.zones);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const invitations = useAuditStore((st) => st.invitations);
  const mandates = useAuditStore((st) => st.mandates);
  const assignLead = useAuditStore((st) => st.assignLead);
  const sendInvitation = useAuditStore((st) => st.sendInvitation);
  const openModal = useAuditStore((st) => st.openModal);
  const addToast = useAuditStore((st) => st.addToast);
  const users = useAuditStore((st) => st.users);
  const addUser = useAuditStore((st) => st.addUser);

  const [assigningLga, setAssigningLga] = useState<string | null>(null);
  const [invitingAuditor, setInvitingAuditor] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });

  const leads = useMemo(
    () => users.filter((u) => u.role === "AUDIT_LEAD"),
    [users],
  );
  const auditors = useMemo(
    () => users.filter((u) => u.role === "TEAM_AUDITOR"),
    [users],
  );

  const activeMandate = useMemo(
    () =>
      mandates.find((m) => m.status === "Published" || m.status === "Active") ||
      mandates[0],
    [mandates],
  );

  if (user?.role === "AUDIT_SUPERVISOR") {
    const myZone = zones.find((z) => z.supervisorIds?.includes(user.id));
    const myLgas = lgas.filter((l) => myZone?.lgas.includes(l.id));
    const assignedLeadIds = new Set(
      myLgas.filter((l) => l.auditLeadId).map((l) => l.auditLeadId!),
    );
    const assignedCount = myLgas.filter((l) => l.auditLeadId).length;

    const handleAssignLead = (lgaId: string, leadId: string) => {
      const lead = users.find((u) => u.id === leadId);
      const lga = lgas.find((l) => l.id === lgaId);
      const lgaAudit = audits.find((a) => a.lgaId === lgaId) || null;

      openModal({
        title: "Assign Audit Lead",
        message: `Assign ${lead?.name} as the lead auditor for ${lga?.name}? An invitation will be sent for their acceptance.`,
        confirmText: "Assign & Invite",
        variant: "info",
        onConfirm: () => {
          if (lgaAudit && activeMandate) {
            assignLead(lgaId, leadId, lgaAudit.id, activeMandate.id);
          } else if (activeMandate) {
            const tempAuditId = `audit-temp-${Date.now()}`;
            assignLead(lgaId, leadId, tempAuditId, activeMandate.id);
          }
          setAssigningLga(null);
        },
      });
    };

    const handleCreateLead = () => {
      if (!newLead.name || !newLead.email) {
        addToast({
          type: "warning",
          title: "Missing fields",
          message: "Name and Email are required.",
        });
        return;
      }

      addUser({
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        role: "AUDIT_LEAD",
        zoneId: user.zoneId, // Assign to this supervisor's zone by default? Or leave empty? Let's assign.
        specialisations: ["Financial"], // Default
        experience: [],
      });

      addToast({
        type: "success",
        title: "Lead Created",
        message: `${newLead.name} added to the team.`,
      });
      setNewLead({ name: "", email: "", phone: "" });
      setShowCreateLead(false);
    };

    return (
      <div>
        <div className={s.pageHeader}>
          <div>
            <h1 className={s.pageTitle}>Team Management</h1>
            <p className={s.pageSubtitle}>
              {myZone?.name} Zone — Assign audit leads to {myLgas.length}{" "}
              council
              {myLgas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className={s.btnPrimary}
              onClick={() => setShowCreateLead(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <UserPlus size={16} /> Create New Lead
            </button>
            <span className={s.pageBadge}>
              <Users size={12} /> Supervisor
            </span>
          </div>
        </div>

        {/* Create Lead Modal (Simple implementation) */}
        {showCreateLead && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "2rem 1rem",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "600px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                overflow: "hidden",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                  padding: "1.5rem 2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "white",
                      margin: 0,
                      fontSize: "1.25rem",
                      fontWeight: 700,
                    }}
                  >
                    Register New Audit Lead
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateLead(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div
                style={{
                  padding: "1.5rem 2rem",
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <label className={s.label}>Full Name</label>
                  <input
                    className={s.input}
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    placeholder="e.g. Adewale Baku"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label className={s.label}>Email Address</label>
                  <input
                    className={s.input}
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                    placeholder="e.g. adewale@lasg.gov.ng"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className={s.label}>Phone Number</label>
                  <input
                    className={s.input}
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                    placeholder="e.g. 08012345678"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <button
                    className={s.btnSecondary}
                    onClick={() => setShowCreateLead(false)}
                  >
                    Cancel
                  </button>
                  <button className={s.btnPrimary} onClick={handleCreateLead}>
                    Create Lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <div className={s.kpiIconBlue}>
              <MapPin size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Councils in Zone</div>
              <div className={s.kpiValue}>{myLgas.length}</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconGreen}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Leads Assigned</div>
              <div className={s.kpiValue}>
                {assignedCount} / {myLgas.length}
              </div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconAmber}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Pending</div>
              <div className={s.kpiValue}>{myLgas.length - assignedCount}</div>
            </div>
          </div>
          <div className={s.kpiCard}>
            <div className={s.kpiIconPurple}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className={s.kpiLabel}>Available Leads</div>
              <div className={s.kpiValue}>
                {leads.filter((l) => !assignedLeadIds.has(l.id)).length}
              </div>
            </div>
          </div>
        </div>

        <div className={s.card}>
          <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>Council Lead Assignments</h3>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Council</th>
                  <th>Contact</th>
                  <th>Assigned Lead</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myLgas.map((lga) => {
                  const lead = lga.auditLeadId
                    ? users.find((u) => u.id === lga.auditLeadId)
                    : null;
                  const isAssigning = assigningLga === lga.id;

                  return (
                    <React.Fragment key={lga.id}>
                      <tr>
                        <td style={{ fontWeight: 600 }}>{lga.name}</td>
                        <td style={{ fontSize: "0.82rem", color: "#64748b" }}>
                          {lga.contactName}
                        </td>
                        <td>
                          {lead ? (
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {lead.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#64748b",
                                }}
                              >
                                {lead.email}
                              </div>
                            </div>
                          ) : (
                            <span
                              style={{ fontSize: "0.82rem", color: "#94a3b8" }}
                            >
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td>
                          <StatusBadge
                            label={lead ? "Assigned" : "Pending"}
                            variant={lead ? "success" : "warning"}
                          />
                        </td>
                        <td>
                          {lead ? (
                            <StatusBadge label="Active" variant="success" />
                          ) : (
                            <button
                              className={`${s.btnGold} ${s.btnSmall}`}
                              onClick={() =>
                                setAssigningLga(isAssigning ? null : lga.id)
                              }
                            >
                              Assign Lead
                            </button>
                          )}
                        </td>
                      </tr>
                      {isAssigning && (
                        <tr style={{ background: "#f8fafc" }}>
                          <td colSpan={5} style={{ padding: "1rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Select Audit Lead:
                              </span>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignLead(lga.id, e.target.value);
                                  }
                                }}
                                defaultValue=""
                                style={{
                                  flex: 1,
                                  padding: "0.5rem",
                                  border: "1px solid var(--border)",
                                  borderRadius: "4px",
                                  background: "white",
                                }}
                              >
                                <option value="" disabled>
                                  Choose a lead...
                                </option>
                                {leads.map((lead) => (
                                  <option
                                    key={lead.id}
                                    value={lead.id}
                                    disabled={assignedLeadIds.has(lead.id)}
                                  >
                                    {lead.name} ({lead.email}){" "}
                                    {assignedLeadIds.has(lead.id)
                                      ? "(Assigned)"
                                      : ""}
                                  </option>
                                ))}
                              </select>
                              <button
                                style={{
                                  background: "transparent",
                                  border: "1px solid var(--border)",
                                  padding: "0.5rem 1rem",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                onClick={() => setAssigningLga(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === "AUDIT_LEAD") {
    const myLga = lgas.find((l) => l.auditLeadId === user.id);
    const myAudit = audits.find((a) => a.lgaId === myLga?.id);
    const teamInvitations = invitations.filter(
      (i) => i.auditId === myAudit?.id && i.role === "TEAM_AUDITOR",
    );
    const acceptedAuditorIds = new Set(
      teamInvitations
        .filter((i) => i.status === "Accepted")
        .map((i) => i.userId),
    );
    const pendingAuditorIds = new Set(
      teamInvitations
        .filter((i) => i.status === "Pending")
        .map((i) => i.userId),
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
                          <div
                            style={{ fontSize: "0.75rem", color: "#64748b" }}
                          >
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
                            ?.map(
                              (e) => lgas.find((l) => l.id === e)?.name || e,
                            )
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
                      <div
                        className={s.poolTags}
                        style={{ marginTop: "0.2rem" }}
                      >
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
                  Click "Invite Auditors" to browse the available auditor pool
                  and build your engagement team.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardBody}>
        <div className={s.emptyState}>
          <Users size={40} className={s.emptyIcon} />
          <div className={s.emptyTitle}>Team Management</div>
          <div className={s.emptyDesc}>
            This section is available to Audit Supervisors and Audit Leads.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementPage;
