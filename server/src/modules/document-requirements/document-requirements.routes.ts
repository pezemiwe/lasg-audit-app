import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  createDocumentRequirementController,
  deleteDocumentRequirementController,
  getDocumentRequirementController,
  listDocumentRequirementsController,
  updateDocumentRequirementController,
} from "./document-requirements.controller";
import {
  createDocumentRequirementValidator,
  documentRequirementIdValidator,
  listDocumentRequirementsValidator,
  updateDocumentRequirementValidator,
} from "./document-requirements.validators";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  listDocumentRequirementsValidator,
  asyncHandler(listDocumentRequirementsController),
);
router.post(
  "/",
  requireRoles("SYSTEM_ADMIN"),
  createDocumentRequirementValidator,
  asyncHandler(createDocumentRequirementController),
);
router.get(
  "/:id",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL", "AUDIT_SUPERVISOR", "AUDIT_LEAD"),
  documentRequirementIdValidator,
  asyncHandler(getDocumentRequirementController),
);
router.put(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  updateDocumentRequirementValidator,
  asyncHandler(updateDocumentRequirementController),
);
router.delete(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  documentRequirementIdValidator,
  asyncHandler(deleteDocumentRequirementController),
);

export default router;
