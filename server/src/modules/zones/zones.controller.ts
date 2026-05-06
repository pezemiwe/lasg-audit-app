import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  getZoneById,
  listZoneCouncils,
  listZones,
  updateZoneSupervisor,
} from "./zones.service";

export async function listZonesController(_req: Request, res: Response) {
  const zones = await listZones();
  sendSuccess(res, zones);
}

export async function getZoneController(req: Request, res: Response) {
  const zone = await getZoneById(req.params.id as string);
  sendSuccess(res, zone);
}

export async function listZoneCouncilsController(req: Request, res: Response) {
  const councils = await listZoneCouncils(req.params.id as string);
  sendSuccess(res, councils);
}

export async function updateZoneSupervisorController(req: Request, res: Response) {
  const zone = await updateZoneSupervisor(
    req.params.id as string,
    req.body.supervisorId ?? null,
  );

  await writeActivityLog({
    req,
    action: "ZONE_SUPERVISOR_UPDATED",
    entityType: "Zone",
    entityId: zone.id,
    details: { supervisorId: zone.supervisorId },
  });

  sendSuccess(res, zone);
}
