import { Router } from "express";
import bcrypt from "bcryptjs";
import { Role, UserStatus } from "../generated/prisma/client";
import { body, param, query } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate, requireRoles } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { serializeUser } from "../serializers/userSerializer";
import { writeAuditLog } from "../services/auditLogService";

const router = Router();

const roleValues = Object.values(Role);
const statusValues = Object.values(UserStatus);

router.use(authenticate);

router.get(
  "/",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  [
    query("role").optional().isIn(roleValues),
    query("status").optional().isIn(statusValues),
    query("zoneId").optional().isString(),
    query("councilId").optional().isString(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      where: {
        role: req.query.role as Role | undefined,
        status: req.query.status as UserStatus | undefined,
        zoneId: req.query.zoneId as string | undefined,
        councilId: req.query.councilId as string | undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, users.map(serializeUser));
  }),
);

router.post(
  "/",
  requireRoles("SYSTEM_ADMIN"),
  [
    body("name").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("role").isIn(roleValues),
    body("phone").optional().isString(),
    body("zoneId").optional().isString(),
    body("councilId").optional().isString(),
    body("specialisations").optional().isArray(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        zoneId: req.body.zoneId,
        councilId: req.body.councilId,
        specialisations: req.body.specialisations ?? [],
        passwordHash,
      },
    });

    await writeAuditLog({
      req,
      action: "USER_CREATED",
      entityType: "User",
      entityId: user.id,
      details: { role: user.role, email: user.email },
    });

    sendSuccess(res, serializeUser(user), 201);
  }),
);

router.get(
  "/roles",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  (_req, res) => {
    sendSuccess(res, roleValues);
  },
);

router.get(
  "/:id",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    sendSuccess(res, serializeUser(user));
  }),
);

router.put(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  [
    param("id").isString(),
    body("name").optional().isString().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional({ nullable: true }).isString(),
    body("role").optional().isIn(roleValues),
    body("zoneId").optional({ nullable: true }).isString(),
    body("councilId").optional({ nullable: true }).isString(),
    body("specialisations").optional().isArray(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        zoneId: req.body.zoneId,
        councilId: req.body.councilId,
        specialisations: req.body.specialisations,
      },
    });

    await writeAuditLog({
      req,
      action: "USER_UPDATED",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, serializeUser(user));
  }),
);

router.patch(
  "/:id/status",
  requireRoles("SYSTEM_ADMIN"),
  [param("id").isString(), body("status").isIn(statusValues), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: { status: req.body.status },
    });

    await writeAuditLog({
      req,
      action: "USER_STATUS_UPDATED",
      entityType: "User",
      entityId: user.id,
      details: { status: user.status },
    });

    sendSuccess(res, serializeUser(user));
  }),
);

router.patch(
  "/:id/password",
  requireRoles("SYSTEM_ADMIN"),
  [param("id").isString(), body("password").isLength({ min: 8 }), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    await writeAuditLog({
      req,
      action: "USER_PASSWORD_UPDATED",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, null, 200, "Password updated successfully");
  }),
);

router.delete(
  "/:id",
  requireRoles("SYSTEM_ADMIN"),
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    await writeAuditLog({
      req,
      action: "USER_DEACTIVATED",
      entityType: "User",
      entityId: user.id,
    });

    sendSuccess(res, null, 200, "User deactivated successfully");
  }),
);

export default router;
