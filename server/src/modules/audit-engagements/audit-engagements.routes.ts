import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { uploadAuditDocument } from "../../common/middleware/upload";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  listAuditDocumentsController,
  uploadAuditDocumentController,
} from "../audit-documents/audit-documents.controller";
import {
  auditDocumentsByEngagementValidator,
  uploadAuditDocumentValidator,
} from "../audit-documents/audit-documents.validators";
import {
  getAuditEngagementController,
  listMyAuditEngagementsController,
} from "./audit-engagements.controller";
import {
  auditEngagementIdValidator,
  listMyAuditEngagementsValidator,
} from "./audit-engagements.validators";

export const myAuditEngagementsRouter = Router();
export const auditEngagementsRouter = Router();

myAuditEngagementsRouter.use(authenticate);
auditEngagementsRouter.use(authenticate);

myAuditEngagementsRouter.get(
  "/",
  listMyAuditEngagementsValidator,
  asyncHandler(listMyAuditEngagementsController),
);

auditEngagementsRouter.get(
  "/:engagementId/documents",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  auditDocumentsByEngagementValidator,
  asyncHandler(listAuditDocumentsController),
);

auditEngagementsRouter.post(
  "/:engagementId/documents/:documentId/upload",
  requireRoles("HEAD_OF_LOCAL_GOVERNMENT"),
  uploadAuditDocument.single("file"),
  uploadAuditDocumentValidator,
  asyncHandler(uploadAuditDocumentController),
);

auditEngagementsRouter.get(
  "/:id",
  auditEngagementIdValidator,
  asyncHandler(getAuditEngagementController),
);
