import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { writeActivityLog } from "../activity/activity.service";
import {
  approveAuditDocument,
  listAuditDocuments,
  markAuditDocumentReviewed,
  rejectAuditDocument,
  uploadAuditDocument,
} from "./audit-documents.service";

export async function listAuditDocumentsController(req: Request, res: Response) {
  const documents = await listAuditDocuments(req.params.auditId as string, req.user!);
  sendSuccess(res, documents);
}

export async function uploadAuditDocumentController(req: Request, res: Response) {
  const document = await uploadAuditDocument(
    req.params.auditId as string,
    req.params.documentId as string,
    req.file,
    req.user!,
  );

  await writeActivityLog({
    req,
    action: "AUDIT_DOCUMENT_UPLOADED",
    entityType: "AuditDocument",
    entityId: document.id,
    details: { auditId: document.auditId, name: document.name },
  });

  sendSuccess(res, document);
}

export async function reviewAuditDocumentController(req: Request, res: Response) {
  const document = await markAuditDocumentReviewed(req.params.id as string, req.user!);

  await writeActivityLog({
    req,
    action: "AUDIT_DOCUMENT_REVIEWED",
    entityType: "AuditDocument",
    entityId: document.id,
  });

  sendSuccess(res, document);
}

export async function approveAuditDocumentController(req: Request, res: Response) {
  const document = await approveAuditDocument(req.params.id as string, req.user!);

  await writeActivityLog({
    req,
    action: "AUDIT_DOCUMENT_APPROVED",
    entityType: "AuditDocument",
    entityId: document.id,
  });

  sendSuccess(res, document);
}

export async function rejectAuditDocumentController(req: Request, res: Response) {
  const document = await rejectAuditDocument(
    req.params.id as string,
    req.body.rejectionReason,
    req.user!,
  );

  await writeActivityLog({
    req,
    action: "AUDIT_DOCUMENT_REJECTED",
    entityType: "AuditDocument",
    entityId: document.id,
    details: { rejectionReason: document.rejectionReason },
  });

  sendSuccess(res, document);
}
