import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";

const auditDocumentInclude = {
  documentRequirement: true,
  uploadedBy: {
    select: { id: true, name: true, email: true, role: true },
  },
  reviewedBy: {
    select: { id: true, name: true, email: true, role: true },
  },
} satisfies Prisma.AuditDocumentInclude;

export function listAuditDocuments(auditId: string) {
  return prisma.auditDocument.findMany({
    where: { auditId },
    include: auditDocumentInclude,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function getAuditDocumentById(id: string) {
  return prisma.auditDocument.findUniqueOrThrow({
    where: { id },
    include: {
      ...auditDocumentInclude,
      audit: true,
    },
  });
}

export function uploadAuditDocument(
  id: string,
  data: {
    fileUrl: string;
    originalFileName: string;
    mimeType: string;
    fileSize: number;
    uploadedById: string;
  },
) {
  return prisma.auditDocument.update({
    where: { id },
    data: {
      status: "UPLOADED",
      fileUrl: data.fileUrl,
      originalFileName: data.originalFileName,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      uploadedById: data.uploadedById,
      uploadedAt: new Date(),
      reviewedById: null,
      reviewedAt: null,
      rejectionReason: null,
    },
    include: auditDocumentInclude,
  });
}

export function updateAuditDocumentReview(
  id: string,
  data: {
    status: "REVIEWED" | "APPROVED" | "REJECTED";
    reviewedById: string;
    rejectionReason?: string | null;
  },
) {
  return prisma.auditDocument.update({
    where: { id },
    data: {
      status: data.status,
      reviewedById: data.reviewedById,
      reviewedAt: new Date(),
      rejectionReason: data.rejectionReason ?? null,
    },
    include: auditDocumentInclude,
  });
}

export function getAuditById(id: string) {
  return prisma.audit.findUniqueOrThrow({ where: { id } });
}

export function getUserScope(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, role: true, zoneId: true, councilId: true },
  });
}
