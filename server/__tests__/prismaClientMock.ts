import { jest } from "@jest/globals";

export const Role = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  STATE_AUDITOR_GENERAL: "STATE_AUDITOR_GENERAL",
  AUDIT_SUPERVISOR: "AUDIT_SUPERVISOR",
  AUDIT_LEAD: "AUDIT_LEAD",
  TEAM_AUDITOR: "TEAM_AUDITOR",
  HEAD_OF_LOCAL_GOVERNMENT: "HEAD_OF_LOCAL_GOVERNMENT",
} as const;

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const CouncilType = {
  LGA: "LGA",
  LCDA: "LCDA",
} as const;

export const AuditType = {
  FINANCIAL: "FINANCIAL",
  PERFORMANCE: "PERFORMANCE",
  COMPLIANCE: "COMPLIANCE",
  COMBINED: "COMBINED",
} as const;

export const MandateStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export const MandateTargetMode = {
  ALL_COUNCILS: "ALL_COUNCILS",
  SELECTED_COUNCILS: "SELECTED_COUNCILS",
} as const;

export const MandateCouncilStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

class PrismaClientKnownRequestError extends Error {
  code: string;

  constructor(message = "Prisma known request error", code = "P2000") {
    super(message);
    this.name = "PrismaClientKnownRequestError";
    this.code = code;
  }
}

export const Prisma = {
  PrismaClientKnownRequestError,
};

export class PrismaClient {
  user = {
    findUnique: jest.fn(),
  };

  $disconnect = jest.fn();
}
