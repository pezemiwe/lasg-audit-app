import type { DocumentRequirement } from "../../generated/prisma/client";

export function serializeDocumentRequirement(requirement: DocumentRequirement) {
  return {
    id: requirement.id,
    name: requirement.name,
    description: requirement.description,
    requiredFormat: requirement.requiredFormat,
    category: requirement.category,
    sortOrder: requirement.sortOrder,
    status: requirement.status,
    createdAt: requirement.createdAt,
    updatedAt: requirement.updatedAt,
  };
}
