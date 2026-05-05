import type { Request } from "express";
import { prisma } from "../config/prisma";

interface AuditLogInput {
  req: Request;
  action: string;
  entityType: string;
  entityId?: string;
  details?: unknown;
}

export async function writeAuditLog({
  req,
  action,
  entityType,
  entityId,
  details,
}: AuditLogInput) {
  await prisma.auditLog.create({
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
