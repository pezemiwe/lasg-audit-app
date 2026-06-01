import type { Request, Response } from "express";
import type { AuditStatus } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { getAuditEngagement, listMyAuditEngagements } from "./audit-engagements.service";

export async function listMyAuditEngagementsController(req: Request, res: Response) {
  const engagements = await listMyAuditEngagements(req.user!, {
    status: req.query.status as AuditStatus | undefined,
    auditId: req.query.auditId as string | undefined,
    councilId: req.query.councilId as string | undefined,
    zoneId: req.query.zoneId as string | undefined,
    leadId: req.query.leadId as string | undefined,
  });

  sendSuccess(res, engagements);
}

export async function getAuditEngagementController(req: Request, res: Response) {
  const engagement = await getAuditEngagement(req.params.id as string, req.user!);
  sendSuccess(res, engagement);
}
