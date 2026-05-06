import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  getZoneController,
  listZoneCouncilsController,
  listZonesController,
  updateZoneSupervisorController,
} from "./zones.controller";
import { updateZoneSupervisorValidator, zoneIdValidator } from "./zones.validators";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(listZonesController));
router.get("/:id", zoneIdValidator, asyncHandler(getZoneController));
router.get("/:id/councils", zoneIdValidator, asyncHandler(listZoneCouncilsController));
router.patch(
  "/:id/supervisors",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  updateZoneSupervisorValidator,
  asyncHandler(updateZoneSupervisorController),
);

export default router;
