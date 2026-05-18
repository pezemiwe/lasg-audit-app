import type { AuditStatus, Prisma, Role } from "../../generated/prisma/client";
import { AuditStatus as AuditStatusEnum } from "../../generated/prisma/client";
import { serializeAudit } from "./audits.serializer";
import * as auditsRepository from "./audits.repository";

export const auditStatusValues = Object.values(AuditStatusEnum);

type AuthUser = {
  id: string;
  role: Role;
};

export type ListAuditsFilters = {
  status?: AuditStatus;
  mandateId?: string;
  councilId?: string;
  zoneId?: string;
  leadId?: string;
  year?: number;
};

function getVisibilityWhere(scope: Awaited<ReturnType<typeof auditsRepository.getUserScope>>) {
  if (scope.role === "STATE_AUDITOR_GENERAL" || scope.role === "SYSTEM_ADMIN") {
    return {};
  }

  if (scope.role === "AUDIT_SUPERVISOR" && scope.zoneId) {
    return { zoneId: scope.zoneId };
  }

  if (scope.role === "AUDIT_LEAD") {
    return { leadId: scope.id };
  }

  if (scope.role === "HEAD_OF_LOCAL_GOVERNMENT" && scope.councilId) {
    return { councilId: scope.councilId };
  }

  return { id: "__no_visible_audits__" };
}

function getFilterWhere(filters: ListAuditsFilters): Prisma.AuditWhereInput {
  return {
    status: filters.status,
    mandateId: filters.mandateId,
    councilId: filters.councilId,
    zoneId: filters.zoneId,
    leadId: filters.leadId,
    year: filters.year,
  };
}

export async function listAudits(user: AuthUser, filters: ListAuditsFilters) {
  const scope = await auditsRepository.getUserScope(user.id);
  const audits = await auditsRepository.listAudits({
    ...getVisibilityWhere(scope),
    ...getFilterWhere(filters),
  });

  return audits.map(serializeAudit);
}

export async function getAudit(id: string, user: AuthUser) {
  const scope = await auditsRepository.getUserScope(user.id);
  const audit = await auditsRepository.getAuditById(id, getVisibilityWhere(scope));

  return serializeAudit(audit);
}
