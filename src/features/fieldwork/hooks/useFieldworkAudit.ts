import { useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAuditStore } from "../../../store/useAuditStore";

/**
 * Resolves which audit the current user should see on the Fieldwork page
 * based on role (lead/auditor/supervisor → their LGA; HLG or admin → first audit).
 */
export const useFieldworkAudit = (propAuditId?: string) => {
  const { user } = useAuth();
  const store = useAuditStore();

  const myAudit = useMemo(() => {
    if (!user) return undefined;
    if (propAuditId) return store.audits.find((a) => a.id === propAuditId);
    if (
      user.role === "AUDIT_LEAD" ||
      user.role === "TEAM_AUDITOR" ||
      user.role === "AUDIT_SUPERVISOR"
    ) {
      if (user.lgaId) return store.audits.find((a) => a.lgaId === user.lgaId);
      if (user.zoneId) {
        const zoneLgas = store.lgas
          .filter((l) => l.zoneId === user.zoneId)
          .map((l) => l.id);
        return store.audits.find((a) => zoneLgas.includes(a.lgaId));
      }
    }
    return store.audits[0];
  }, [user, store.audits, store.lgas, propAuditId]);

  const auditId = myAudit?.id || "";
  const lgaName =
    store.lgas.find((l) => l.id === myAudit?.lgaId)?.name || "Selected LGA";

  const isLead = user?.role === "AUDIT_LEAD";
  const isAuditor = user?.role === "TEAM_AUDITOR";
  const isSupervisor = user?.role === "AUDIT_SUPERVISOR";
  const isHlg = user?.role === "HEAD_OF_LOCAL_GOVERNMENT";
  const isWriter = isLead || isAuditor;

  return {
    user,
    store,
    myAudit,
    auditId,
    lgaName,
    isLead,
    isAuditor,
    isSupervisor,
    isHlg,
    isWriter,
  };
};
