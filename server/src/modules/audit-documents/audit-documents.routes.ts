import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  approveAuditDocumentController,
  rejectAuditDocumentController,
  reviewAuditDocumentController,
} from "./audit-documents.controller";
import {
  auditDocumentIdValidator,
  rejectAuditDocumentValidator,
} from "./audit-documents.validators";

const router = Router();

router.use(authenticate);

router.patch(
  "/:id/review",
  requireRoles("STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  auditDocumentIdValidator,
  asyncHandler(reviewAuditDocumentController),
);
router.patch(
  "/:id/approve",
  requireRoles("STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  auditDocumentIdValidator,
  asyncHandler(approveAuditDocumentController),
);
router.patch(
  "/:id/reject",
  requireRoles("STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  rejectAuditDocumentValidator,
  asyncHandler(rejectAuditDocumentController),
);

export default router;
