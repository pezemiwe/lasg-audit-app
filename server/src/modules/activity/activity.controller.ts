import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { getActivityById, listActivity } from "./activity.service";

export async function listActivityController(req: Request, res: Response) {
  const logs = await listActivity({
    userId: req.query.userId as string | undefined,
    entityType: req.query.entityType as string | undefined,
    entityId: req.query.entityId as string | undefined,
  });

  sendSuccess(res, logs);
}

export async function getActivityController(req: Request, res: Response) {
  const log = await getActivityById(req.params.id as string);
  sendSuccess(res, log);
}
