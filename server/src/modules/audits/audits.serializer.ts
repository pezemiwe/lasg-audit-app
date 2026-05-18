import type { Audit, Council, Mandate, MandateCouncil, User, Zone } from "../../generated/prisma/client";

type AuditWithRelations = Audit & {
  mandate?: Pick<Mandate, "id" | "title" | "year" | "status">;
  mandateCouncil?: Pick<MandateCouncil, "id" | "status" | "acceptedAt" | "rejectedAt">;
  council?: Council;
  zone?: Zone;
  lead?: Pick<User, "id" | "name" | "email" | "role"> | null;
};

export function serializeAudit(audit: AuditWithRelations) {
  return {
    id: audit.id,
    mandateId: audit.mandateId,
    mandateCouncilId: audit.mandateCouncilId,
    councilId: audit.councilId,
    zoneId: audit.zoneId,
    title: audit.title,
    year: audit.year,
    auditTypes: audit.auditTypes,
    status: audit.status,
    progress: audit.progress,
    startDate: audit.startDate,
    endDate: audit.endDate,
    leadId: audit.leadId,
    startedAt: audit.startedAt,
    completedAt: audit.completedAt,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
    mandate: audit.mandate,
    mandateCouncil: audit.mandateCouncil,
    council: audit.council,
    zone: audit.zone,
    lead: audit.lead,
  };
}
