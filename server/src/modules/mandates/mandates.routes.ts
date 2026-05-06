import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { uploadMandateSignature } from "../../common/middleware/upload";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  acceptMandateController,
  completeMandateController,
  createMandateController,
  deleteMandateController,
  getMandateComplianceController,
  getMandateController,
  listMandateCouncilsController,
  listMandatesController,
  publishMandateController,
  updateMandateController,
} from "./mandates.controller";
import {
  createMandateValidator,
  mandateIdValidator,
  updateMandateValidator,
} from "./mandates.validators";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "TEAM_AUDITOR",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  asyncHandler(listMandatesController),
);
router.post(
  "/",
  requireRoles("STATE_AUDITOR_GENERAL"),
  uploadMandateSignature.single("signature"),
  createMandateValidator,
  asyncHandler(createMandateController),
);
router.get(
  "/:id",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "TEAM_AUDITOR",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  mandateIdValidator,
  asyncHandler(getMandateController),
);
router.put(
  "/:id",
  requireRoles("STATE_AUDITOR_GENERAL"),
  uploadMandateSignature.single("signature"),
  updateMandateValidator,
  asyncHandler(updateMandateController),
);
router.delete(
  "/:id",
  requireRoles("STATE_AUDITOR_GENERAL"),
  mandateIdValidator,
  asyncHandler(deleteMandateController),
);
router.patch(
  "/:id/publish",
  requireRoles("STATE_AUDITOR_GENERAL"),
  mandateIdValidator,
  asyncHandler(publishMandateController),
);
router.patch(
  "/:id/accept",
  requireRoles("HEAD_OF_LOCAL_GOVERNMENT"),
  mandateIdValidator,
  asyncHandler(acceptMandateController),
);
router.patch(
  "/:id/complete",
  requireRoles("STATE_AUDITOR_GENERAL"),
  mandateIdValidator,
  asyncHandler(completeMandateController),
);
router.get(
  "/:id/councils",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "TEAM_AUDITOR",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  mandateIdValidator,
  asyncHandler(listMandateCouncilsController),
);
router.get(
  "/:id/compliance",
  requireRoles("STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  mandateIdValidator,
  asyncHandler(getMandateComplianceController),
);

export default router;
