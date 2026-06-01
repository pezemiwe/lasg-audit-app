import type { Request, Response } from "express";
import type { AuditStatus } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { getAudit, listAuditEngagements, listAudits } from "./audits.service";

export async function listAuditsController(req: Request, res: Response) {
  const audits = await listAudits(req.user!, {
    status: req.query.status as AuditStatus | undefined,
    mandateId: req.query.mandateId as string | undefined,
    councilId: req.query.councilId as string | undefined,
    zoneId: req.query.zoneId as string | undefined,
    leadId: req.query.leadId as string | undefined,
    year: req.query.year ? Number(req.query.year) : undefined,
  });

  sendSuccess(res, audits);
}

export async function getAuditController(req: Request, res: Response) {
  const audit = await getAudit(req.params.id as string, req.user!);
  sendSuccess(res, audit);
}

export async function listAuditEngagementsController(req: Request, res: Response) {
  const engagements = await listAuditEngagements(req.params.id as string, req.user!);
  sendSuccess(res, engagements);
}
