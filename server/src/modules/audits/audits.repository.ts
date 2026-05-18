import type { AuditStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

const auditInclude = {
  mandate: {
    select: { id: true, title: true, year: true, status: true },
  },
  mandateCouncil: {
    select: { id: true, status: true, acceptedAt: true, rejectedAt: true },
  },
  council: true,
  zone: true,
  lead: {
    select: { id: true, name: true, email: true, role: true },
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

export function getUserScope(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, role: true, zoneId: true, councilId: true },
  });
}

export type AuditStatusValue = AuditStatus;
