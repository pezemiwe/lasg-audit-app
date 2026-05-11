import type { Role } from "../../generated/prisma/client";
import {
  AuditType,
  MandateCouncilStatus,
  MandateStatus,
  MandateTargetMode,
} from "../../generated/prisma/client";
import { HttpError } from "../../common/errors/httpError";
import { serializeMandate } from "./mandates.serializer";
import * as mandatesRepository from "./mandates.repository";

export const auditTypeValues = Object.values(AuditType);
export const mandateStatusValues = Object.values(MandateStatus);
export const mandateCouncilStatusValues = Object.values(MandateCouncilStatus);

type AuthUser = {
  id: string;
  role: Role;
};

type ListMandatesFilters = {
  status?: MandateStatus;
};

type ListMandateAcceptanceFilters = {
  status?: MandateCouncilStatus;
};

type MandateInput = {
  title: string;
  year: number;
  description: string;
  startDate: string;
  endDate: string;
  scope: string;
  objectives: string[] | string;
  auditTypes: AuditType[] | string;
  signatureUrl: string;
  targetCouncilIds?: string[] | string;
};

function parseArrayField(value: string[] | string | undefined, fieldName: string) {
  if (value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to comma-separated support.
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDate(value: string, fieldName: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${fieldName} must be a valid date`);
  }

  return date;
}

export function normalizeMandateCouncilStatus(value?: string) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();
  const aliases: Record<string, MandateCouncilStatus> = {
    PENDING: "PENDING",
    PENDING_ACCEPTANCE: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
  };

  return aliases[normalized];
}

function getVisibilityWhere(scope: Awaited<ReturnType<typeof mandatesRepository.getUserScope>>) {
  if (scope.role === "STATE_AUDITOR_GENERAL" || scope.role === "SYSTEM_ADMIN") {
    return {};
  }

  if (scope.councilId) {
    return {
      councils: {
        some: { councilId: scope.councilId },
      },
    };
  }

  if (scope.zoneId) {
    return {
      councils: {
        some: {
          council: { zoneId: scope.zoneId },
        },
      },
    };
  }

  return { id: "__no_visible_mandates__" };
}

function getCouncilVisibilityWhere(
  scope: Awaited<ReturnType<typeof mandatesRepository.getUserScope>>,
) {
  if (scope.role === "STATE_AUDITOR_GENERAL" || scope.role === "SYSTEM_ADMIN") {
    return {};
  }

  if (scope.councilId) {
    return { councilId: scope.councilId };
  }

  if (scope.zoneId) {
    return { council: { zoneId: scope.zoneId } };
  }

  return { councilId: "__no_visible_councils__" };
}

async function resolveTargets(targetCouncilIds?: string[] | string) {
  const selectedIds = parseArrayField(targetCouncilIds, "targetCouncilIds");
  const uniqueSelectedIds = [...new Set(selectedIds)];
  const targetMode =
    uniqueSelectedIds.length > 0 ? MandateTargetMode.SELECTED_COUNCILS : MandateTargetMode.ALL_COUNCILS;

  if (targetMode === MandateTargetMode.SELECTED_COUNCILS) {
    const councils = await mandatesRepository.listCouncilIds(uniqueSelectedIds);

    if (councils.length !== uniqueSelectedIds.length) {
      throw new HttpError(400, "One or more selected councils do not exist");
    }

    return {
      targetMode,
      councilIds: councils.map((council) => council.id),
    };
  }

  const councils = await mandatesRepository.listCouncilIds();

  if (councils.length === 0) {
    throw new HttpError(400, "Councils must exist before creating a mandate");
  }

  return {
    targetMode,
    councilIds: councils.map((council) => council.id),
  };
}

function normalizeMandateInput(data: MandateInput) {
  const objectives = parseArrayField(data.objectives, "objectives");
  const auditTypes = parseArrayField(data.auditTypes, "auditTypes") as AuditType[];
  const invalidAuditTypes = auditTypes.filter((auditType) => !auditTypeValues.includes(auditType));
  const startDate = parseDate(data.startDate, "startDate");
  const endDate = parseDate(data.endDate, "endDate");

  if (endDate <= startDate) {
    throw new HttpError(400, "endDate must be after startDate");
  }

  if (objectives.length === 0) {
    throw new HttpError(400, "At least one objective is required");
  }

  if (auditTypes.length === 0) {
    throw new HttpError(400, "At least one audit type is required");
  }

  if (invalidAuditTypes.length > 0) {
    throw new HttpError(400, `Invalid audit type: ${invalidAuditTypes.join(", ")}`);
  }

  return {
    ...data,
    year: Number(data.year),
    startDate,
    endDate,
    objectives,
    auditTypes,
  };
}

export async function listMandates(user: AuthUser) {
  const scope = await mandatesRepository.getUserScope(user.id);
  const mandates = await mandatesRepository.listMandates(getVisibilityWhere(scope));
  return mandates.map(serializeMandate);
}

export async function listMandatesWithFilters(user: AuthUser, filters: ListMandatesFilters) {
  const scope = await mandatesRepository.getUserScope(user.id);
  const mandates = await mandatesRepository.listMandates({
    ...getVisibilityWhere(scope),
    status: filters.status,
  });
  return mandates.map(serializeMandate);
}

export async function createMandate(data: MandateInput, user: AuthUser) {
  const normalized = normalizeMandateInput(data);
  const targets = await resolveTargets(data.targetCouncilIds);
  const mandate = await mandatesRepository.createMandate({
    ...normalized,
    targetMode: targets.targetMode,
    councilIds: targets.councilIds,
    createdById: user.id,
  });

  return serializeMandate(mandate);
}

export async function getMandate(id: string, user: AuthUser) {
  const scope = await mandatesRepository.getUserScope(user.id);
  const mandate = await mandatesRepository.getMandateById(id, getVisibilityWhere(scope));
  return serializeMandate(mandate);
}

export async function updateMandate(id: string, data: Partial<MandateInput>, user: AuthUser) {
  const existing = await mandatesRepository.getMandateById(id);

  if (existing.status !== "DRAFT") {
    throw new HttpError(409, "Only draft mandates can be updated");
  }

  const normalized = normalizeMandateInput({
    title: data.title ?? existing.title,
    year: data.year ?? existing.year,
    description: data.description ?? existing.description,
    startDate: data.startDate ?? existing.startDate.toISOString(),
    endDate: data.endDate ?? existing.endDate.toISOString(),
    scope: data.scope ?? existing.scope,
    objectives: data.objectives ?? existing.objectives,
    auditTypes: data.auditTypes ?? existing.auditTypes,
    signatureUrl: data.signatureUrl ?? existing.signatureUrl,
    targetCouncilIds: data.targetCouncilIds,
  });

  let mandate = await mandatesRepository.updateMandate(id, normalized);

  if (data.targetCouncilIds !== undefined) {
    const targets = await resolveTargets(data.targetCouncilIds);
    mandate = await mandatesRepository.updateMandateTargets(id, targets);
  }

  return serializeMandate(mandate);
}

export async function deleteMandate(id: string) {
  const existing = await mandatesRepository.getMandateById(id);

  if (existing.status !== "DRAFT") {
    throw new HttpError(409, "Only draft mandates can be deleted");
  }

  await mandatesRepository.deleteMandate(id);
}

export async function publishMandate(id: string) {
  const existing = await mandatesRepository.getMandateById(id);

  if (existing.status !== "DRAFT") {
    throw new HttpError(409, "Only draft mandates can be published");
  }

  const mandate = await mandatesRepository.publishMandate(id);
  return serializeMandate(mandate);
}

export async function acceptMandate(id: string, user: AuthUser) {
  const scope = await mandatesRepository.getUserScope(user.id);

  if (!scope.councilId) {
    throw new HttpError(403, "User is not assigned to a council");
  }

  const mandate = await mandatesRepository.getMandateById(id, {
    status: { in: ["PUBLISHED", "ACTIVE"] },
    councils: {
      some: { councilId: scope.councilId },
    },
  });
  const target = mandate.councils?.find((item) => item.councilId === scope.councilId);

  if (target?.status !== "PENDING") {
    throw new HttpError(409, "Mandate has already been responded to for this council");
  }

  const accepted = await mandatesRepository.acceptMandate(id, scope.councilId, user.id);
  return {
    id: accepted.id,
    mandateId: accepted.mandateId,
    councilId: accepted.councilId,
    status: accepted.status,
    mandate: {
      id: accepted.mandate.id,
      title: accepted.mandate.title,
      year: accepted.mandate.year,
      status: accepted.mandate.status,
      targetMode: accepted.mandate.targetMode,
      publishedAt: accepted.mandate.publishedAt,
    },
    council: accepted.council,
    acceptedBy: accepted.acceptedBy,
    rejectedBy: accepted.rejectedBy,
    acceptedAt: accepted.acceptedAt,
    rejectedAt: accepted.rejectedAt,
    rejectionReason: accepted.rejectionReason,
    documentPortalUnlockedAt: accepted.documentPortalUnlockedAt,
    questionnaireUnlockedAt: accepted.questionnaireUnlockedAt,
    audit: accepted.audit,
  };
}

export async function rejectMandate(id: string, user: AuthUser, rejectionReason?: string) {
  const scope = await mandatesRepository.getUserScope(user.id);

  if (!scope.councilId) {
    throw new HttpError(403, "User is not assigned to a council");
  }

  const mandate = await mandatesRepository.getMandateById(id, {
    status: { in: ["PUBLISHED", "ACTIVE"] },
    councils: {
      some: { councilId: scope.councilId },
    },
  });
  const target = mandate.councils?.find((item) => item.councilId === scope.councilId);

  if (target?.status !== "PENDING") {
    throw new HttpError(409, "Mandate has already been responded to for this council");
  }

  const rejected = await mandatesRepository.rejectMandate(
    id,
    scope.councilId,
    user.id,
    rejectionReason,
  );

  return {
    id: rejected.id,
    mandateId: rejected.mandateId,
    councilId: rejected.councilId,
    status: rejected.status,
    mandate: rejected.mandate,
    council: rejected.council,
    acceptedBy: rejected.acceptedBy,
    rejectedBy: rejected.rejectedBy,
    acceptedAt: rejected.acceptedAt,
    rejectedAt: rejected.rejectedAt,
    rejectionReason: rejected.rejectionReason,
    documentPortalUnlockedAt: rejected.documentPortalUnlockedAt,
    questionnaireUnlockedAt: rejected.questionnaireUnlockedAt,
  };
}

export async function completeMandate(id: string) {
  const existing = await mandatesRepository.getMandateById(id);

  if (existing.status !== "ACTIVE") {
    throw new HttpError(409, "Only active mandates can be completed");
  }

  const mandate = await mandatesRepository.completeMandate(id);
  return serializeMandate(mandate);
}

export async function listMandateCouncils(
  id: string,
  user: AuthUser,
  filters: ListMandateAcceptanceFilters = {},
) {
  const scope = await mandatesRepository.getUserScope(user.id);
  await mandatesRepository.getMandateById(id, getVisibilityWhere(scope));
  return mandatesRepository.listMandateCouncils(id, {
    ...getCouncilVisibilityWhere(scope),
    status: filters.status,
  });
}

export async function getMandateAcceptanceSummary(id: string, user: AuthUser) {
  const scope = await mandatesRepository.getUserScope(user.id);
  await mandatesRepository.getMandateById(id, getVisibilityWhere(scope));

  const councilWhere = getCouncilVisibilityWhere(scope);
  const [totalCouncils, grouped] = await Promise.all([
    mandatesRepository.countMandateCouncils(id, councilWhere),
    mandatesRepository.getMandateCouncilCounts(id, councilWhere),
  ]);
  const acceptedCouncils =
    grouped.find((item) => item.status === "ACCEPTED")?._count.status ?? 0;
  const rejectedCouncils =
    grouped.find((item) => item.status === "REJECTED")?._count.status ?? 0;
  const pendingCouncils =
    grouped.find((item) => item.status === "PENDING")?._count.status ?? 0;

  return {
    mandateId: id,
    totalCouncils,
    acceptedCouncils,
    rejectedCouncils,
    pendingCouncils,
    acceptanceRate:
      totalCouncils === 0 ? 0 : Number(((acceptedCouncils / totalCouncils) * 100).toFixed(2)),
    rejectionRate:
      totalCouncils === 0 ? 0 : Number(((rejectedCouncils / totalCouncils) * 100).toFixed(2)),
  };
}
