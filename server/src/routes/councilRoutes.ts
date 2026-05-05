import { Router } from "express";
import { CouncilType } from "../generated/prisma/client";
import { body, param, query } from "express-validator";
import { prisma } from "../config/prisma";
import { authenticate, requireRoles } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { writeAuditLog } from "../services/auditLogService";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  [
    query("zoneId").optional().isString(),
    query("type").optional().isIn(Object.values(CouncilType)),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const councils = await prisma.council.findMany({
      where: {
        zoneId: req.query.zoneId as string | undefined,
        type: req.query.type as CouncilType | undefined,
      },
      include: { zone: true },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    res.json(councils);
  }),
);

router.get(
  "/:id",
  [param("id").isString(), validateRequest],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const council = await prisma.council.findUniqueOrThrow({
      where: { id },
      include: {
        zone: true,
        parentLga: true,
        lcdas: { orderBy: { name: "asc" } },
      },
    });

    res.json(council);
  }),
);

router.put(
  "/:id",
  requireRoles("SYSTEM_ADMIN", "STATE_AUDITOR_GENERAL"),
  [
    param("id").isString(),
    body("contactName").optional({ nullable: true }).isString(),
    body("contactEmail").optional({ nullable: true }).isEmail().normalizeEmail(),
    body("contactPhone").optional({ nullable: true }).isString(),
    validateRequest,
  ],
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const council = await prisma.council.update({
      where: { id },
      data: {
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
      },
    });

    await writeAuditLog({
      req,
      action: "COUNCIL_UPDATED",
      entityType: "Council",
      entityId: council.id,
    });

    res.json(council);
  }),
);

export default router;
