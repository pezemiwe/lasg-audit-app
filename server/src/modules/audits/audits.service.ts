import type { AuditStatus, Prisma, Role } from "../../generated/prisma/client";
import { AuditStatus as AuditStatusEnum } from "../../generated/prisma/client";
import { serializeAudit, serializeAuditEngagement } from "./audits.serializer";
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
    return { engagements: { some: { zoneId: scope.zoneId } } };
  }

  if (scope.role === "AUDIT_LEAD") {
    return { engagements: { some: { leadId: scope.id } } };
  }

  if (scope.role === "HEAD_OF_LOCAL_GOVERNMENT" && scope.councilId) {
    return { engagements: { some: { councilId: scope.councilId } } };
  }

  return { id: "__no_visible_audits__" };
}

function getFilterWhere(filters: ListAuditsFilters): Prisma.AuditWhereInput {
  return {
    status: filters.status,
    mandateId: filters.mandateId,
    engagements:
      filters.councilId || filters.zoneId || filters.leadId
        ? {
            some: {
              councilId: filters.councilId,
              zoneId: filters.zoneId,
              leadId: filters.leadId,
            },
          }
        : undefined,
    year: filters.year,
  };
}

function getEngagementVisibilityWhere(
  scope: Awaited<ReturnType<typeof auditsRepository.getUserScope>>,
): Prisma.AuditEngagementWhereInput {
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

  return { id: "__no_visible_audit_engagements__" };
}

export async function listAudits(user: AuthUser, filters: ListAuditsFilters) {
  const scope = await auditsRepository.getUserScope(user.id);
  const audits = await auditsRepository.listAudits({
    AND: [getVisibilityWhere(scope), getFilterWhere(filters)],
  });

  return audits.map(serializeAudit);
}

export async function getAudit(id: string, user: AuthUser) {
  const scope = await auditsRepository.getUserScope(user.id);
  const audit = await auditsRepository.getAuditById(id, getVisibilityWhere(scope));

  return serializeAudit(audit);
}

export async function listAuditEngagements(auditId: string, user: AuthUser) {
  const scope = await auditsRepository.getUserScope(user.id);
  await auditsRepository.getAuditById(auditId, getVisibilityWhere(scope));
  const engagements = await auditsRepository.listAuditEngagements(
    auditId,
    getEngagementVisibilityWhere(scope),
  );

  return engagements.map(serializeAuditEngagement);
}
