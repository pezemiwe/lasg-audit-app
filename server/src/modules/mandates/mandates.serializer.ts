import type { MandateCouncil, Mandate, Council, User } from "../../generated/prisma/client";

type MandateWithRelations = Mandate & {
  createdBy?: Pick<User, "id" | "name" | "email" | "role">;
  councils?: Array<
    MandateCouncil & {
      council?: Council;
      acceptedBy?: Pick<User, "id" | "name" | "email" | "role"> | null;
    }
  >;
};

export function serializeMandate(mandate: MandateWithRelations) {
  return {
    id: mandate.id,
    title: mandate.title,
    year: mandate.year,
    description: mandate.description,
    startDate: mandate.startDate,
    endDate: mandate.endDate,
    scope: mandate.scope,
    objectives: mandate.objectives,
    auditTypes: mandate.auditTypes,
    signatureUrl: mandate.signatureUrl,
    targetMode: mandate.targetMode,
    status: mandate.status,
    createdById: mandate.createdById,
    createdBy: mandate.createdBy,
    publishedAt: mandate.publishedAt,
    createdAt: mandate.createdAt,
    updatedAt: mandate.updatedAt,
    councils: mandate.councils?.map((target) => ({
      id: target.id,
      mandateId: target.mandateId,
      councilId: target.councilId,
      status: target.status,
      acceptedById: target.acceptedById,
      acceptedBy: target.acceptedBy,
      acceptedAt: target.acceptedAt,
      documentPortalUnlockedAt: target.documentPortalUnlockedAt,
      questionnaireUnlockedAt: target.questionnaireUnlockedAt,
      council: target.council,
      createdAt: target.createdAt,
      updatedAt: target.updatedAt,
    })),
  };
}
