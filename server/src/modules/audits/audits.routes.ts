import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { uploadAuditDocument } from "../../common/middleware/upload";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  listAuditDocumentsController,
  uploadAuditDocumentController,
} from "../audit-documents/audit-documents.controller";
import {
  auditDocumentsByAuditValidator,
  uploadAuditDocumentValidator,
} from "../audit-documents/audit-documents.validators";
import { getAuditController, listAuditsController } from "./audits.controller";
import { auditIdValidator, listAuditsValidator } from "./audits.validators";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  listAuditsValidator,
  asyncHandler(listAuditsController),
);

router.get(
  "/:auditId/documents",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  auditDocumentsByAuditValidator,
  asyncHandler(listAuditDocumentsController),
);

router.post(
  "/:auditId/documents/:documentId/upload",
  requireRoles("HEAD_OF_LOCAL_GOVERNMENT"),
  uploadAuditDocument.single("file"),
  uploadAuditDocumentValidator,
  asyncHandler(uploadAuditDocumentController),
);

router.get(
  "/:id",
  auditIdValidator,
  asyncHandler(getAuditController),
);

export default router;
