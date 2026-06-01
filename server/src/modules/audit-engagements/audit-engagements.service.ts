import type { AuditStatus, Prisma, Role } from "../../generated/prisma/client";
import { serializeAuditEngagement } from "../audits/audits.serializer";
import * as auditEngagementsRepository from "./audit-engagements.repository";

type AuthUser = {
  id: string;
  role: Role;
};

export type ListAuditEngagementsFilters = {
  status?: AuditStatus;
  auditId?: string;
  councilId?: string;
  zoneId?: string;
  leadId?: string;
};

function getVisibilityWhere(
  scope: Awaited<ReturnType<typeof auditEngagementsRepository.getUserScope>>,
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

function getFilterWhere(filters: ListAuditEngagementsFilters): Prisma.AuditEngagementWhereInput {
  return {
    status: filters.status,
    auditId: filters.auditId,
    councilId: filters.councilId,
    zoneId: filters.zoneId,
    leadId: filters.leadId,
  };
}

export async function listMyAuditEngagements(
  user: AuthUser,
  filters: ListAuditEngagementsFilters = {},
) {
  const scope = await auditEngagementsRepository.getUserScope(user.id);
  const engagements = await auditEngagementsRepository.listAuditEngagements({
    AND: [getVisibilityWhere(scope), getFilterWhere(filters)],
  });

  return engagements.map(serializeAuditEngagement);
}

export async function getAuditEngagement(id: string, user: AuthUser) {
  const scope = await auditEngagementsRepository.getUserScope(user.id);
  const engagement = await auditEngagementsRepository.getAuditEngagementById(
    id,
    getVisibilityWhere(scope),
  );

  return serializeAuditEngagement(engagement);
}
