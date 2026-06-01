import type { AuditStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

export const auditEngagementInclude = {
  mandateCouncil: {
    select: { id: true, status: true, acceptedAt: true, rejectedAt: true },
  },
  council: true,
  zone: true,
  lead: {
    select: { id: true, name: true, email: true, role: true },
  },
  _count: {
    select: { documents: true },
  },
} satisfies Prisma.AuditEngagementInclude;

const auditInclude = {
  mandate: {
    select: { id: true, title: true, year: true, status: true },
  },
  engagements: {
    include: auditEngagementInclude,
    orderBy: { createdAt: "asc" },
  },
  _count: {
    select: { engagements: true },
  },
} satisfies Prisma.AuditInclude;

export function listAudits(where: Prisma.AuditWhereInput) {
  return prisma.audit.findMany({
    where,
    include: auditInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getAuditById(id: string, where?: Prisma.AuditWhereInput) {
  return prisma.audit.findFirstOrThrow({
    where: { id, ...where },
    include: auditInclude,
  });
}

export function listAuditEngagements(auditId: string, where: Prisma.AuditEngagementWhereInput) {
  return prisma.auditEngagement.findMany({
    where: { auditId, ...where },
    include: {
      ...auditEngagementInclude,
      audit: {
        select: { id: true, mandateId: true, title: true, year: true, status: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function getUserScope(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, role: true, zoneId: true, councilId: true },
  });
}

export type AuditStatusValue = AuditStatus;
