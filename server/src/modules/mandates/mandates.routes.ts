import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { uploadMandateSignature } from "../../common/middleware/upload";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  acceptMandateController,
  completeMandateController,
  createMandateController,
  deleteMandateController,
  getMandateAcceptanceSummaryController,
  getMandateController,
  listMandateCouncilsController,
  listMandatesController,
  publishMandateController,
  rejectMandateController,
  updateMandateController,
} from "./mandates.controller";
import {
  createMandateValidator,
  listMandateAcceptanceValidator,
  listMandatesValidator,
  mandateIdValidator,
  rejectMandateValidator,
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
  listMandatesValidator,
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
  "/:id/reject",
  requireRoles("HEAD_OF_LOCAL_GOVERNMENT"),
  rejectMandateValidator,
  asyncHandler(rejectMandateController),
);
router.patch(
  "/:id/complete",
  requireRoles("STATE_AUDITOR_GENERAL"),
  mandateIdValidator,
  asyncHandler(completeMandateController),
);
router.get(
  "/:id/acceptance/summary",
  requireRoles("STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  mandateIdValidator,
  asyncHandler(getMandateAcceptanceSummaryController),
);
router.get(
  "/:id/acceptance",
  requireRoles(
    "SYSTEM_ADMIN",
    "STATE_AUDITOR_GENERAL",
    "AUDIT_SUPERVISOR",
    "AUDIT_LEAD",
    "TEAM_AUDITOR",
    "HEAD_OF_LOCAL_GOVERNMENT",
  ),
  listMandateAcceptanceValidator,
  asyncHandler(listMandateCouncilsController),
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

export default router;
