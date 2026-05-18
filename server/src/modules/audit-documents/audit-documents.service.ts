import type { Role } from "../../generated/prisma/client";
import { HttpError } from "../../common/errors/httpError";
import { serializeAuditDocument } from "./audit-documents.serializer";
import * as auditDocumentsRepository from "./audit-documents.repository";

type AuthUser = {
  id: string;
  role: Role;
};

function canReadAudit(
  audit: Awaited<ReturnType<typeof auditDocumentsRepository.getAuditById>>,
  scope: Awaited<ReturnType<typeof auditDocumentsRepository.getUserScope>>,
) {
  if (scope.role === "STATE_AUDITOR_GENERAL" || scope.role === "SYSTEM_ADMIN") {
    return true;
  }

  if (scope.role === "AUDIT_SUPERVISOR") {
    return audit.zoneId === scope.zoneId;
  }

  if (scope.role === "AUDIT_LEAD") {
    return audit.leadId === scope.id;
  }

  if (scope.role === "HEAD_OF_LOCAL_GOVERNMENT") {
    return audit.councilId === scope.councilId;
  }

  return false;
}

function canReviewAudit(
  audit: Awaited<ReturnType<typeof auditDocumentsRepository.getAuditById>>,
  scope: Awaited<ReturnType<typeof auditDocumentsRepository.getUserScope>>,
) {
  if (scope.role === "STATE_AUDITOR_GENERAL") {
    return true;
  }

  if (scope.role === "AUDIT_SUPERVISOR") {
    return audit.zoneId === scope.zoneId;
  }

  if (scope.role === "AUDIT_LEAD") {
    return audit.leadId === scope.id;
  }

  return false;
}

async function assertCanReadAudit(auditId: string, user: AuthUser) {
  const [audit, scope] = await Promise.all([
    auditDocumentsRepository.getAuditById(auditId),
    auditDocumentsRepository.getUserScope(user.id),
  ]);

  if (!canReadAudit(audit, scope)) {
    throw new HttpError(403, "You do not have access to this audit");
  }

  return { audit, scope };
}

async function assertCanReviewAudit(auditId: string, user: AuthUser) {
  const [audit, scope] = await Promise.all([
    auditDocumentsRepository.getAuditById(auditId),
    auditDocumentsRepository.getUserScope(user.id),
  ]);

  if (!canReviewAudit(audit, scope)) {
    throw new HttpError(403, "You do not have permission to review this audit document");
  }

  return { audit, scope };
}

export async function listAuditDocuments(auditId: string, user: AuthUser) {
  await assertCanReadAudit(auditId, user);
  const documents = await auditDocumentsRepository.listAuditDocuments(auditId);

  return documents.map(serializeAuditDocument);
}

export async function uploadAuditDocument(
  auditId: string,
  documentId: string,
  file: Express.Multer.File | undefined,
  user: AuthUser,
) {
  if (!file) {
    throw new HttpError(400, "Document file is required");
  }

  const { audit, scope } = await assertCanReadAudit(auditId, user);

  if (scope.role !== "HEAD_OF_LOCAL_GOVERNMENT" || audit.councilId !== scope.councilId) {
    throw new HttpError(403, "Only the HoLG for this council can upload documents");
  }

  const document = await auditDocumentsRepository.getAuditDocumentById(documentId);

  if (document.auditId !== auditId) {
    throw new HttpError(400, "Document does not belong to this audit");
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
  await assertCanReviewAudit(document.auditId, user);

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
  await assertCanReviewAudit(document.auditId, user);

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
  await assertCanReviewAudit(document.auditId, user);

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
