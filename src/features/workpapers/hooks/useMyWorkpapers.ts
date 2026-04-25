import { useMemo } from "react";
import { useAuditStore } from "../../../store/useAuditStore";
import { useAuth } from "../../../hooks/useAuth";

export function useMyWorkpapers() {
  const { user } = useAuth();
  const workpapers = useAuditStore((st) => st.workpapers);
  const tasks = useAuditStore((st) => st.tasks);
  const audits = useAuditStore((st) => st.audits);
  const lgas = useAuditStore((st) => st.lgas);

  const myAudit = useMemo(() => {
    if (!user) return null;
    if (user.role === "TEAM_AUDITOR" || user.role === "AUDIT_LEAD") {
      const myLga = lgas.find(
        (l) => l.auditLeadId === user.id || l.id === user.lgaId,
      );
      return audits.find((a) => a.lgaId === myLga?.id) || audits[0];
    }
    return audits[0];
  }, [user, audits, lgas]);

  const myWorkpapers = useMemo(
    () => (myAudit ? workpapers.filter((w) => w.auditId === myAudit.id) : []),
    [workpapers, myAudit],
  );

  const myTasks = useMemo(
    () => (myAudit ? tasks.filter((t) => t.auditId === myAudit.id) : []),
    [tasks, myAudit],
  );

  return { user, myAudit, myWorkpapers, myTasks, workpapers, tasks };
}
