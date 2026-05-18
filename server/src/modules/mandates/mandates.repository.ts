import type {
  AuditType,
  MandateCouncilStatus,
  MandateStatus,
  MandateTargetMode,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { createAuditDocumentsFromRequirements } from "../document-requirements/document-requirements.repository";

const mandateInclude = {
  createdBy: {
    select: { id: true, name: true, email: true, role: true },
  },
  councils: {
    include: {
      council: true,
      acceptedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      rejectedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.MandateInclude;

export function listMandates(where: Prisma.MandateWhereInput) {
  return prisma.mandate.findMany({
    where,
    include: mandateInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getMandateById(id: string, where?: Prisma.MandateWhereInput) {
  return prisma.mandate.findFirstOrThrow({
    where: { id, ...where },
    include: mandateInclude,
  });
}

export async function createMandate(data: {
  title: string;
  year: number;
  description: string;
  startDate: Date;
  endDate: Date;
  scope: string;
  objectives: string[];
  auditTypes: AuditType[];
  signatureUrl: string;
  targetMode: MandateTargetMode;
  createdById: string;
  councilIds: string[];
}) {
  return prisma.$transaction(async (tx) => {
    const mandate = await tx.mandate.create({
      data: {
        title: data.title,
        year: data.year,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        scope: data.scope,
        objectives: data.objectives,
        auditTypes: data.auditTypes,
        signatureUrl: data.signatureUrl,
        targetMode: data.targetMode,
        createdById: data.createdById,
      },
    });

    await tx.mandateCouncil.createMany({
      data: data.councilIds.map((councilId) => ({
        mandateId: mandate.id,
        councilId,
      })),
    });

    return tx.mandate.findUniqueOrThrow({
      where: { id: mandate.id },
      include: mandateInclude,
    });
  });
}

export function updateMandate(
  id: string,
  data: {
    title?: string;
    year?: number;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    scope?: string;
    objectives?: string[];
    auditTypes?: AuditType[];
    signatureUrl?: string;
  },
) {
  return prisma.mandate.update({
    where: { id },
    data,
    include: mandateInclude,
  });
}

export function updateMandateTargets(
  id: string,
  data: {
    targetMode: MandateTargetMode;
    councilIds: string[];
  },
) {
  return prisma.$transaction(async (tx) => {
    await tx.mandateCouncil.deleteMany({ where: { mandateId: id } });
    await tx.mandateCouncil.createMany({
      data: data.councilIds.map((councilId) => ({
        mandateId: id,
        councilId,
      })),
    });

    return tx.mandate.update({
      where: { id },
      data: { targetMode: data.targetMode },
      include: mandateInclude,
    });
  });
}

export function publishMandate(id: string) {
  return prisma.mandate.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
    include: mandateInclude,
  });
}

export function deleteMandate(id: string) {
  return prisma.mandate.delete({ where: { id } });
}

export function acceptMandate(id: string, councilId: string, acceptedById: string) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const accepted = await tx.mandateCouncil.update({
      where: {
        mandateId_councilId: {
          mandateId: id,
          councilId,
        },
      },
      data: {
        status: "ACCEPTED",
        acceptedById,
        acceptedAt: now,
        rejectedById: null,
        rejectedAt: null,
        rejectionReason: null,
        documentPortalUnlockedAt: now,
        questionnaireUnlockedAt: now,
      },
      include: {
        council: true,
        acceptedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        rejectedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const mandate = await tx.mandate.update({
      where: { id },
      data: { status: "ACTIVE" },
      include: mandateInclude,
    });

    const audit = await tx.audit.upsert({
      where: { mandateCouncilId: accepted.id },
      update: {},
      create: {
        mandateId: id,
        mandateCouncilId: accepted.id,
        councilId,
        zoneId: accepted.council.zoneId,
        title: `${mandate.title} - ${accepted.council.name}`,
        year: mandate.year,
        auditTypes: mandate.auditTypes,
        startDate: mandate.startDate,
        endDate: mandate.endDate,
      },
    });

    const activeRequirements = await tx.documentRequirement.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    await createAuditDocumentsFromRequirements(tx, audit.id, activeRequirements);

    return { ...accepted, mandate, audit };
  });
}

export function rejectMandate(
  id: string,
  councilId: string,
  rejectedById: string,
  rejectionReason?: string,
) {
  const now = new Date();

  return prisma.mandateCouncil.update({
    where: {
      mandateId_councilId: {
        mandateId: id,
        councilId,
      },
    },
    data: {
      status: "REJECTED",
      rejectedById,
      rejectedAt: now,
      rejectionReason,
    },
    include: {
      mandate: {
        select: {
          id: true,
          title: true,
          year: true,
          status: true,
          targetMode: true,
          publishedAt: true,
        },
      },
      council: true,
      acceptedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      rejectedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

export function completeMandate(id: string) {
  return prisma.mandate.update({
    where: { id },
    data: { status: "COMPLETED" },
    include: mandateInclude,
  });
}

export function listMandateCouncils(id: string, where?: Prisma.MandateCouncilWhereInput) {
  return prisma.mandateCouncil.findMany({
    where: { mandateId: id, ...where },
    include: {
      council: { include: { zone: true } },
      acceptedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
      rejectedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function getMandateCouncilCounts(id: string, where?: Prisma.MandateCouncilWhereInput) {
  return prisma.mandateCouncil.groupBy({
    by: ["status"],
    where: { mandateId: id, ...where },
    _count: { status: true },
  });
}

export function countMandateCouncils(id: string, where?: Prisma.MandateCouncilWhereInput) {
  return prisma.mandateCouncil.count({ where: { mandateId: id, ...where } });
}

export type MandateCouncilStatusValue = MandateCouncilStatus;

export function listCouncilIds(ids?: string[]) {
  return prisma.council.findMany({
    where: ids ? { id: { in: ids } } : undefined,
    select: { id: true },
    orderBy: { name: "asc" },
  });
}

export function getUserScope(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, role: true, zoneId: true, councilId: true },
  });
}

export type MandateVisibilityWhere = Prisma.MandateWhereInput;
export type MandateCouncilVisibilityWhere = Prisma.MandateCouncilWhereInput;
export type MandateStatusValue = MandateStatus;
