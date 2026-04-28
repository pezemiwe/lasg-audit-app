import React, { useState, useMemo } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import type { User, LGA, Zone, Mandate, Audit } from "../../../types";
import StatusBadge from "../../../components/UI/StatusBadge";
import {
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import s from "../../../styles/pages.module.css";
import AssignLeadModal from "../../../components/Modals/AssignLeadModal";

type Props = {
  user: User;
  zones: Zone[];
  lgas: LGA[];
  audits: Audit[];
  users: User[];
  activeMandate: Mandate | undefined;
};

const SupervisorTeamView: React.FC<Props> = ({
  user,
  zones,
  lgas,
  audits,
  users,
  activeMandate,
}) => {
  const assignLead = useAuditStore((st) => st.assignLead);
  const openModal = useAuditStore((st) => st.openModal);

  const [modalLga, setModalLga] = useState<LGA | null>(null);

  const leads = useMemo(
    () => users.filter((u) => u.role === "AUDIT_LEAD"),
    [users],
  );

  const myZone = zones.find(
    (z) => z.id === user.zoneId || z.supervisorIds?.includes(user.id),
  );
  const myLgas = lgas.filter(
    (l) => myZone?.lgas.includes(l.id) || l.zoneId === myZone?.id,
  );
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
      },
    });
  };

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Team Management</h1>
          <p className={s.pageSubtitle}>
            {myZone?.name} Zone — Assign audit leads to {myLgas.length} council
            {myLgas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span className={s.pageBadge}>
            <Users size={12} /> Supervisor
          </span>
        </div>
      </div>

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
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {lead.name}
                            </div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#64748b" }}
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
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          {lead && (
                            <StatusBadge label="Active" variant="success" />
                          )}
                          <button
                            className={`${s.btnGold} ${s.btnSmall}`}
                            onClick={() => setModalLga(lga)}
                          >
                            {lead ? "Reassign" : "Assign Lead"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AssignLeadModal
        isOpen={!!modalLga}
        onClose={() => setModalLga(null)}
        lga={modalLga}
        users={users}
        onAssign={(lgaId, leadId) => {
          handleAssignLead(lgaId, leadId);
          setModalLga(null);
        }}
      />
    </div>
  );
};

export default SupervisorTeamView;
