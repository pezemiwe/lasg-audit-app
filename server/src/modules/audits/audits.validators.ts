import { param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import { auditStatusValues } from "./audits.service";

export const listAuditsValidator = [
  query("status")
    .optional()
    .isIn(auditStatusValues)
    .withMessage(`status must be one of: ${auditStatusValues.join(", ")}`),
  query("mandateId").optional().isString(),
  query("councilId").optional().isString(),
  query("zoneId").optional().isString(),
  query("leadId").optional().isString(),
  query("year").optional().isInt({ min: 2000 }),
  validateRequest,
];

export const auditIdValidator = [
  param("id").isString().notEmpty().withMessage("audit id is required"),
  validateRequest,
];
