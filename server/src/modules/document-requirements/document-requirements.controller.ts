import type { Request, Response } from "express";
import type { DocumentRequirementStatus } from "../../generated/prisma/client";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  createDocumentRequirement,
  deactivateDocumentRequirement,
  getDocumentRequirement,
  listDocumentRequirements,
  updateDocumentRequirement,
} from "./document-requirements.service";

export async function listDocumentRequirementsController(req: Request, res: Response) {
  const requirements = await listDocumentRequirements({
    status: req.query.status as DocumentRequirementStatus | undefined,
  });

  sendSuccess(res, requirements);
}

export async function createDocumentRequirementController(req: Request, res: Response) {
  const requirement = await createDocumentRequirement(req.body);

  await writeActivityLog({
    req,
    action: "DOCUMENT_REQUIREMENT_CREATED",
    entityType: "DocumentRequirement",
    entityId: requirement.id,
    details: { name: requirement.name },
  });

  sendSuccess(res, requirement, 201);
}

export async function getDocumentRequirementController(req: Request, res: Response) {
  const requirement = await getDocumentRequirement(req.params.id as string);
  sendSuccess(res, requirement);
}

export async function updateDocumentRequirementController(req: Request, res: Response) {
  const requirement = await updateDocumentRequirement(req.params.id as string, req.body);

  await writeActivityLog({
    req,
    action: "DOCUMENT_REQUIREMENT_UPDATED",
    entityType: "DocumentRequirement",
    entityId: requirement.id,
  });

  sendSuccess(res, requirement);
}

export async function deleteDocumentRequirementController(req: Request, res: Response) {
  const requirement = await deactivateDocumentRequirement(req.params.id as string);

  await writeActivityLog({
    req,
    action: "DOCUMENT_REQUIREMENT_DEACTIVATED",
    entityType: "DocumentRequirement",
    entityId: requirement.id,
  });

  sendSuccess(res, requirement, 200, "Document requirement deactivated successfully");
}
