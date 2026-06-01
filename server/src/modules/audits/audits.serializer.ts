import type {
  Audit,
  AuditEngagement,
  Council,
  Mandate,
  MandateCouncil,
  User,
  Zone,
} from "../../generated/prisma/client";

export type AuditEngagementWithRelations = AuditEngagement & {
  mandateCouncil?: Pick<MandateCouncil, "id" | "status" | "acceptedAt" | "rejectedAt">;
  council?: Council;
  zone?: Zone;
  lead?: Pick<User, "id" | "name" | "email" | "role"> | null;
  audit?: Pick<Audit, "id" | "mandateId" | "title" | "year" | "status">;
  _count?: { documents: number };
};

type AuditWithRelations = Audit & {
  mandate?: Pick<Mandate, "id" | "title" | "year" | "status">;
  engagements?: AuditEngagementWithRelations[];
  _count?: { engagements: number };
};

export function serializeAuditEngagement(engagement: AuditEngagementWithRelations) {
  return {
    id: engagement.id,
    auditId: engagement.auditId,
    mandateCouncilId: engagement.mandateCouncilId,
    councilId: engagement.councilId,
    zoneId: engagement.zoneId,
    status: engagement.status,
    progress: engagement.progress,
    leadId: engagement.leadId,
    startedAt: engagement.startedAt,
    completedAt: engagement.completedAt,
    createdAt: engagement.createdAt,
    updatedAt: engagement.updatedAt,
    audit: engagement.audit,
    mandateCouncil: engagement.mandateCouncil,
    council: engagement.council,
    zone: engagement.zone,
    lead: engagement.lead,
    documentsCount: engagement._count?.documents ?? 0,
  };
}

export function serializeAudit(audit: AuditWithRelations) {
  const engagements = audit.engagements ?? [];
  const acceptedCouncilsCount = engagements.filter(
    (engagement) => engagement.mandateCouncil?.status === "ACCEPTED",
  ).length;
  const rejectedCouncilsCount = engagements.filter(
    (engagement) => engagement.mandateCouncil?.status === "REJECTED",
  ).length;

  return {
    id: audit.id,
    mandateId: audit.mandateId,
    title: audit.title,
    year: audit.year,
    auditTypes: audit.auditTypes,
    status: audit.status,
    progress: audit.progress,
    startDate: audit.startDate,
    endDate: audit.endDate,
    startedAt: audit.startedAt,
    completedAt: audit.completedAt,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
    mandate: audit.mandate,
    engagementsCount: audit._count?.engagements ?? engagements.length,
    acceptedCouncilsCount,
    rejectedCouncilsCount,
    engagements: engagements.map(serializeAuditEngagement),
  };
}
