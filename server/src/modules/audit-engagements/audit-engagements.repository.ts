import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { auditEngagementInclude } from "../audits/audits.repository";

const engagementInclude = {
  ...auditEngagementInclude,
  audit: {
    select: {
      id: true,
      mandateId: true,
      title: true,
      year: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  },
} satisfies Prisma.AuditEngagementInclude;

export function listAuditEngagements(where: Prisma.AuditEngagementWhereInput) {
  return prisma.auditEngagement.findMany({
    where,
    include: engagementInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getAuditEngagementById(id: string, where?: Prisma.AuditEngagementWhereInput) {
  return prisma.auditEngagement.findFirstOrThrow({
    where: { id, ...where },
    include: engagementInclude,
  });
}

export function getUserScope(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, role: true, zoneId: true, councilId: true },
  });
}
