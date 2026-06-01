import type { Request, Response } from "express";
import type { CouncilType } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  assignHeadOfLocalGovernment,
  getCouncilById,
  listCouncils,
  updateCouncil,
} from "./councils.service";

export async function listCouncilsController(req: Request, res: Response) {
  const councils = await listCouncils({
    zoneId: req.query.zoneId as string | undefined,
    type: req.query.type as CouncilType | undefined,
  });

  sendSuccess(res, councils);
}

export async function getCouncilController(req: Request, res: Response) {
  const council = await getCouncilById(req.params.id as string);
  sendSuccess(res, council);
}

export async function updateCouncilController(req: Request, res: Response) {
  const council = await updateCouncil(req.params.id as string, {
    contactName: req.body.contactName,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone,
  });

  await writeActivityLog({
    req,
    action: "COUNCIL_UPDATED",
    entityType: "Council",
    entityId: council.id,
  });

  sendSuccess(res, council);
}

export async function assignHeadOfLocalGovernmentController(req: Request, res: Response) {
  const council = await assignHeadOfLocalGovernment(req.params.id as string, req.body.userId);

  await writeActivityLog({
    req,
    action: "COUNCIL_HOLG_ASSIGNED",
    entityType: "Council",
    entityId: council.id,
    details: { userId: req.body.userId },
  });

  sendSuccess(res, council);
}
