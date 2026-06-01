import type { Role } from "../../generated/prisma/client";
import { HttpError } from "../../common/errors/httpError";
import { serializeAuditDocument } from "./audit-documents.serializer";
import * as auditDocumentsRepository from "./audit-documents.repository";

type AuthUser = {
  id: string;
  role: Role;
};

function canReadAuditEngagement(
  engagement: Awaited<ReturnType<typeof auditDocumentsRepository.getAuditEngagementById>>,
  scope: Awaited<ReturnType<typeof auditDocumentsRepository.getUserScope>>,
) {
  if (scope.role === "STATE_AUDITOR_GENERAL" || scope.role === "SYSTEM_ADMIN") {
    return true;
  }

  if (scope.role === "AUDIT_SUPERVISOR") {
    return engagement.zoneId === scope.zoneId;
  }

  if (scope.role === "AUDIT_LEAD") {
    return engagement.leadId === scope.id;
  }

  if (scope.role === "HEAD_OF_LOCAL_GOVERNMENT") {
    return engagement.councilId === scope.councilId;
  }

  return false;
}

function canReviewAuditEngagement(
  engagement: Awaited<ReturnType<typeof auditDocumentsRepository.getAuditEngagementById>>,
  scope: Awaited<ReturnType<typeof auditDocumentsRepository.getUserScope>>,
) {
  if (scope.role === "STATE_AUDITOR_GENERAL") {
    return true;
  }

  if (scope.role === "AUDIT_SUPERVISOR") {
    return engagement.zoneId === scope.zoneId;
  }

  if (scope.role === "AUDIT_LEAD") {
    return engagement.leadId === scope.id;
  }

  return false;
}

async function assertCanReadAuditEngagement(auditEngagementId: string, user: AuthUser) {
  const [engagement, scope] = await Promise.all([
    auditDocumentsRepository.getAuditEngagementById(auditEngagementId),
    auditDocumentsRepository.getUserScope(user.id),
  ]);

  if (!canReadAuditEngagement(engagement, scope)) {
    throw new HttpError(403, "You do not have access to this audit engagement");
  }

  return { engagement, scope };
}

async function assertCanReviewAuditEngagement(auditEngagementId: string, user: AuthUser) {
  const [engagement, scope] = await Promise.all([
    auditDocumentsRepository.getAuditEngagementById(auditEngagementId),
    auditDocumentsRepository.getUserScope(user.id),
  ]);

  if (!canReviewAuditEngagement(engagement, scope)) {
    throw new HttpError(403, "You do not have permission to review this audit document");
  }

  return { engagement, scope };
}

export async function listAuditDocuments(auditEngagementId: string, user: AuthUser) {
  await assertCanReadAuditEngagement(auditEngagementId, user);
  const documents = await auditDocumentsRepository.listAuditDocuments(auditEngagementId);

  return documents.map(serializeAuditDocument);
}

export async function uploadAuditDocument(
  auditEngagementId: string,
  documentId: string,
  file: Express.Multer.File | undefined,
  user: AuthUser,
) {
  if (!file) {
    throw new HttpError(400, "Document file is required");
  }

  const { engagement, scope } = await assertCanReadAuditEngagement(auditEngagementId, user);

  if (scope.role !== "HEAD_OF_LOCAL_GOVERNMENT" || engagement.councilId !== scope.councilId) {
    throw new HttpError(403, "Only the HoLG for this council can upload documents");
  }

  const document = await auditDocumentsRepository.getAuditDocumentById(documentId);

  if (document.auditEngagementId !== auditEngagementId) {
    throw new HttpError(400, "Document does not belong to this audit engagement");
  }

  if (document.status === "APPROVED") {
    throw new HttpError(409, "Approved documents cannot be replaced");
  }

  const uploaded = await auditDocumentsRepository.uploadAuditDocument(documentId, {
    fileUrl: `/uploads/audit-documents/${file.filename}`,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    uploadedById: user.id,
  });

  return serializeAuditDocument(uploaded);
}

export async function markAuditDocumentReviewed(documentId: string, user: AuthUser) {
  const document = await auditDocumentsRepository.getAuditDocumentById(documentId);
  await assertCanReviewAuditEngagement(document.auditEngagementId, user);

  if (document.status !== "UPLOADED") {
    throw new HttpError(409, "Only uploaded documents can be marked as reviewed");
  }

  const reviewed = await auditDocumentsRepository.updateAuditDocumentReview(documentId, {
    status: "REVIEWED",
    reviewedById: user.id,
  });

  return serializeAuditDocument(reviewed);
}

export async function approveAuditDocument(documentId: string, user: AuthUser) {
  const document = await auditDocumentsRepository.getAuditDocumentById(documentId);
  await assertCanReviewAuditEngagement(document.auditEngagementId, user);

  if (!["UPLOADED", "REVIEWED"].includes(document.status)) {
    throw new HttpError(409, "Only uploaded or reviewed documents can be approved");
  }

  const approved = await auditDocumentsRepository.updateAuditDocumentReview(documentId, {
    status: "APPROVED",
    reviewedById: user.id,
  });

  return serializeAuditDocument(approved);
}

export async function rejectAuditDocument(
  documentId: string,
  rejectionReason: string,
  user: AuthUser,
) {
  const document = await auditDocumentsRepository.getAuditDocumentById(documentId);
  await assertCanReviewAuditEngagement(document.auditEngagementId, user);

  if (!["UPLOADED", "REVIEWED"].includes(document.status)) {
    throw new HttpError(409, "Only uploaded or reviewed documents can be rejected");
  }

  const rejected = await auditDocumentsRepository.updateAuditDocumentReview(documentId, {
    status: "REJECTED",
    reviewedById: user.id,
    rejectionReason,
  });

  return serializeAuditDocument(rejected);
}
