import React, { useMemo } from "react";
import { useAuditStore } from "../../store/useAuditStore";
import { useAuth } from "../../hooks/useAuth";
import { Users } from "lucide-react";
import s from "../../styles/pages.module.css";
import SupervisorTeamView from "../../features/team/components/SupervisorTeamView";
import LeadTeamView from "../../features/team/components/LeadTeamView";

const TeamManagementPage: React.FC = () => {
  const { user } = useAuth();
  const zones = useAuditStore((st) => st.zones);
  const lgas = useAuditStore((st) => st.lgas);
  const audits = useAuditStore((st) => st.audits);
  const invitations = useAuditStore((st) => st.invitations);
  const mandates = useAuditStore((st) => st.mandates);
  const users = useAuditStore((st) => st.users);

  const activeMandate = useMemo(
    () =>
      mandates.find((m) => m.status === "Published" || m.status === "Active") ||
      mandates[0],
    [mandates],
  );

  if (user?.role === "AUDIT_SUPERVISOR") {
    return (
      <SupervisorTeamView
        user={user}
        zones={zones}
        lgas={lgas}
        audits={audits}
        users={users}
        activeMandate={activeMandate}
      />
    );
  }

  if (user?.role === "AUDIT_LEAD") {
    return (
      <LeadTeamView
        user={user}
        lgas={lgas}
        audits={audits}
        invitations={invitations}
        users={users}
        activeMandate={activeMandate}
      />
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
