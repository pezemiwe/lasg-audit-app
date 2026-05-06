import type { Request } from "express";
import { prisma } from "../config/prisma";

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
