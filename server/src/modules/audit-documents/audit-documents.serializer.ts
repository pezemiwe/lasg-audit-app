import type { AuditDocument, DocumentRequirement, User } from "../../generated/prisma/client";

type AuditDocumentWithRelations = AuditDocument & {
  documentRequirement?: DocumentRequirement | null;
  uploadedBy?: Pick<User, "id" | "name" | "email" | "role"> | null;
  reviewedBy?: Pick<User, "id" | "name" | "email" | "role"> | null;
};

export function serializeAuditDocument(document: AuditDocumentWithRelations) {
  return {
    id: document.id,
    auditEngagementId: document.auditEngagementId,
    documentRequirementId: document.documentRequirementId,
    name: document.name,
    description: document.description,
    requiredFormat: document.requiredFormat,
    category: document.category,
    sortOrder: document.sortOrder,
    status: document.status,
    fileUrl: document.fileUrl,
    originalFileName: document.originalFileName,
    mimeType: document.mimeType,
    fileSize: document.fileSize,
    uploadedById: document.uploadedById,
    uploadedBy: document.uploadedBy,
    uploadedAt: document.uploadedAt,
    reviewedById: document.reviewedById,
    reviewedBy: document.reviewedBy,
    reviewedAt: document.reviewedAt,
    rejectionReason: document.rejectionReason,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}
