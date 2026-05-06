import type { Request } from "express";
import { prisma } from "../../config/prisma";

interface ActivityLogInput {
  req: Request;
  action: string;
  entityType: string;
  entityId?: string;
  details?: unknown;
}

export async function writeActivityLog({
  req,
  action,
  entityType,
  entityId,
  details,
}: ActivityLogInput) {
  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action,
      entityType,
      entityId,
      details: details === undefined ? undefined : JSON.parse(JSON.stringify(details)),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    },
  });
}

export function listActivity(filters: {
  userId?: string;
  entityType?: string;
  entityId?: string;
}) {
  return prisma.activityLog.findMany({
    where: filters,
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export function getActivityById(id: string) {
  return prisma.activityLog.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}
