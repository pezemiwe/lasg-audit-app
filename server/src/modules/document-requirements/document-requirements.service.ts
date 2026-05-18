import { DocumentRequirementStatus } from "../../generated/prisma/client";
import { serializeDocumentRequirement } from "./document-requirements.serializer";
import * as documentRequirementsRepository from "./document-requirements.repository";

export const documentRequirementStatusValues = Object.values(DocumentRequirementStatus);

export async function listDocumentRequirements(filters: {
  status?: DocumentRequirementStatus;
}) {
  const requirements = await documentRequirementsRepository.listDocumentRequirements(filters);
  return requirements.map(serializeDocumentRequirement);
}

export async function getDocumentRequirement(id: string) {
  const requirement = await documentRequirementsRepository.getDocumentRequirementById(id);
  return serializeDocumentRequirement(requirement);
}

export async function createDocumentRequirement(
  data: Parameters<typeof documentRequirementsRepository.createDocumentRequirement>[0],
) {
  const requirement = await documentRequirementsRepository.createDocumentRequirement(data);
  return serializeDocumentRequirement(requirement);
}

export async function updateDocumentRequirement(
  id: string,
  data: Parameters<typeof documentRequirementsRepository.updateDocumentRequirement>[1],
) {
  const requirement = await documentRequirementsRepository.updateDocumentRequirement(id, data);
  return serializeDocumentRequirement(requirement);
}

export async function deactivateDocumentRequirement(id: string) {
  const requirement = await documentRequirementsRepository.deactivateDocumentRequirement(id);
  return serializeDocumentRequirement(requirement);
}

export const listActiveDocumentRequirements =
  documentRequirementsRepository.listActiveDocumentRequirements;
export const createAuditDocumentsFromRequirements =
  documentRequirementsRepository.createAuditDocumentsFromRequirements;
