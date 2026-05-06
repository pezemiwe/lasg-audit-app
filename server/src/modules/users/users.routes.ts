import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authMiddleware";
import { asyncHandler } from "../../common/utils/asyncHandler";
import {
  createUserController,
  deactivateUserController,
  getUserController,
  listUserRolesController,
  listUsersController,
  updateUserController,
  updateUserPasswordController,
  updateUserStatusController,
} from "./users.controller";
import {
  createUserValidator,
  getUserValidator,
  listUsersValidator,
  updateUserPasswordValidator,
  updateUserStatusValidator,
  updateUserValidator,
} from "./users.validators";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  listUsersValidator,
  asyncHandler(listUsersController),
);
router.post(
  "/",
  requireRoles("SYSTEM_ADMIN"),
  createUserValidator,
  asyncHandler(createUserController),
);
router.get(
  "/roles",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  listUserRolesController,
);
router.get(
  "/:id",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  getUserValidator,
  asyncHandler(getUserController),
);
router.put(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  updateUserValidator,
  asyncHandler(updateUserController),
);
router.patch(
  "/:id/status",
  requireRoles("SYSTEM_ADMIN"),
  updateUserStatusValidator,
  asyncHandler(updateUserStatusController),
);
router.patch(
  "/:id/password",
  requireRoles("SYSTEM_ADMIN"),
  updateUserPasswordValidator,
  asyncHandler(updateUserPasswordController),
);
router.delete(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  getUserValidator,
  asyncHandler(deactivateUserController),
);

export default router;
