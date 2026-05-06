import type { Request, Response } from "express";
import type { MandateStatus } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  acceptMandate,
  completeMandate,
  createMandate,
  deleteMandate,
  getMandate,
  getMandateCompliance,
  listMandateCouncils,
  listMandatesWithFilters,
  publishMandate,
  updateMandate,
} from "./mandates.service";

function getSignatureUrl(file?: Express.Multer.File) {
  if (!file) {
    return undefined;
  }

  return `/uploads/mandate-signatures/${file.filename}`;
}

export async function listMandatesController(req: Request, res: Response) {
  const mandates = await listMandatesWithFilters(req.user!, {
    status: req.query.status as MandateStatus | undefined,
  });
  sendSuccess(res, mandates);
}

export async function createMandateController(req: Request, res: Response) {
  const mandate = await createMandate(
    {
      ...req.body,
      signatureUrl: getSignatureUrl(req.file) as string,
    },
    req.user!,
  );

  await writeActivityLog({
    req,
    action: "MANDATE_CREATED",
    entityType: "Mandate",
    entityId: mandate.id,
    details: { title: mandate.title, year: mandate.year, targetMode: mandate.targetMode },
  });

  sendSuccess(res, mandate, 201);
}

export async function getMandateController(req: Request, res: Response) {
  const mandate = await getMandate(req.params.id as string, req.user!);
  sendSuccess(res, mandate);
}

export async function updateMandateController(req: Request, res: Response) {
  const mandate = await updateMandate(
    req.params.id as string,
    {
      ...req.body,
      signatureUrl: getSignatureUrl(req.file),
    },
    req.user!,
  );

  await writeActivityLog({
    req,
    action: "MANDATE_UPDATED",
    entityType: "Mandate",
    entityId: mandate.id,
  });

  sendSuccess(res, mandate);
}

export async function deleteMandateController(req: Request, res: Response) {
  const mandateId = req.params.id as string;
  await deleteMandate(mandateId);

  await writeActivityLog({
    req,
    action: "MANDATE_DELETED",
    entityType: "Mandate",
    entityId: mandateId,
  });

  sendSuccess(res, null, 200, "Mandate deleted successfully");
}

export async function publishMandateController(req: Request, res: Response) {
  const mandate = await publishMandate(req.params.id as string);

  await writeActivityLog({
    req,
    action: "MANDATE_PUBLISHED",
    entityType: "Mandate",
    entityId: mandate.id,
  });

  sendSuccess(res, mandate);
}

export async function acceptMandateController(req: Request, res: Response) {
  const mandateId = req.params.id as string;
  const mandateAcceptance = await acceptMandate(mandateId, req.user!);

  await writeActivityLog({
    req,
    action: "MANDATE_ACCEPTED",
    entityType: "Mandate",
    entityId: mandateId,
  });

  sendSuccess(res, mandateAcceptance);
}

export async function completeMandateController(req: Request, res: Response) {
  const mandate = await completeMandate(req.params.id as string);

  await writeActivityLog({
    req,
    action: "MANDATE_COMPLETED",
    entityType: "Mandate",
    entityId: mandate.id,
  });

  sendSuccess(res, mandate);
}

export async function listMandateCouncilsController(req: Request, res: Response) {
  const councils = await listMandateCouncils(req.params.id as string, req.user!);
  sendSuccess(res, councils);
}

export async function getMandateComplianceController(req: Request, res: Response) {
  const compliance = await getMandateCompliance(req.params.id as string, req.user!);
  sendSuccess(res, compliance);
}
