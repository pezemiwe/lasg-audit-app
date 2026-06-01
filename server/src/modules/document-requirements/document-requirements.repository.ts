import type { DocumentRequirementStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

export function listDocumentRequirements(filters: { status?: DocumentRequirementStatus }) {
  return prisma.documentRequirement.findMany({
    where: filters,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function getDocumentRequirementById(id: string) {
  return prisma.documentRequirement.findUniqueOrThrow({ where: { id } });
}

export function createDocumentRequirement(data: {
  name: string;
  description?: string | null;
  requiredFormat: string;
  category?: string | null;
  sortOrder?: number;
}) {
  return prisma.documentRequirement.create({
    data: {
      name: data.name,
      description: data.description,
      requiredFormat: data.requiredFormat,
      category: data.category,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export function updateDocumentRequirement(
  id: string,
  data: {
    name?: string;
    description?: string | null;
    requiredFormat?: string;
    category?: string | null;
    sortOrder?: number;
    status?: DocumentRequirementStatus;
  },
) {
  return prisma.documentRequirement.update({
    where: { id },
    data,
  });
}

export function deactivateDocumentRequirement(id: string) {
  return prisma.documentRequirement.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
}

export function listActiveDocumentRequirements() {
  return prisma.documentRequirement.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function createAuditDocumentsFromRequirements(
  tx: Prisma.TransactionClient,
  auditEngagementId: string,
  requirements: Array<{
    id: string;
    name: string;
    description: string | null;
    requiredFormat: string;
    category: string | null;
    sortOrder: number;
  }>,
) {
  if (requirements.length === 0) {
    return Promise.resolve({ count: 0 });
  }

  return tx.auditDocument.createMany({
    data: requirements.map((requirement) => ({
      auditEngagementId,
      documentRequirementId: requirement.id,
      name: requirement.name,
      description: requirement.description,
      requiredFormat: requirement.requiredFormat,
      category: requirement.category,
      sortOrder: requirement.sortOrder,
    })),
    skipDuplicates: true,
  });
}
