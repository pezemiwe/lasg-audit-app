import { Router } from "express";
import { body, param } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate, requireRoles } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { writeAuditLog } from "../services/auditLogService";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const zones = await prisma.zone.findMany({
      include: {
        supervisor: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: { select: { councils: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json(zones);
  }),
);

router.get(
  "/:id",
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const zone = await prisma.zone.findUniqueOrThrow({
      where: { id },
      include: {
        supervisor: {
          select: { id: true, name: true, email: true, role: true },
        },
        councils: { orderBy: [{ type: "asc" }, { name: "asc" }] },
      },
    });

    res.json(zone);
  }),
);

router.get(
  "/:id/councils",
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const councils = await prisma.council.findMany({
      where: { zoneId: id },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    res.json(councils);
  }),
);

router.patch(
  "/:id/supervisors",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  [
    param("id").isString(),
    body("supervisorId").optional({ nullable: true }).isString(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const zone = await prisma.zone.update({
      where: { id },
      data: { supervisorId: req.body.supervisorId ?? null },
      include: {
        supervisor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    await writeAuditLog({
      req,
      action: "ZONE_SUPERVISOR_UPDATED",
      entityType: "Zone",
      entityId: zone.id,
      details: { supervisorId: zone.supervisorId },
    });

    res.json(zone);
  }),
);

export default router;
