import { param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import { auditStatusValues } from "../audits/audits.service";

export const auditEngagementIdValidator = [
  param("id").isString().notEmpty().withMessage("audit engagement id is required"),
  validateRequest,
];

export const auditEngagementDocumentsValidator = [
  param("engagementId").isString().notEmpty().withMessage("audit engagement id is required"),
  validateRequest,
];

export const listMyAuditEngagementsValidator = [
  query("status")
    .optional()
    .isIn(auditStatusValues)
    .withMessage(`status must be one of: ${auditStatusValues.join(", ")}`),
  query("auditId").optional().isString().notEmpty().withMessage("auditId must be a string"),
  query("councilId").optional().isString().notEmpty().withMessage("councilId must be a string"),
  query("zoneId").optional().isString().notEmpty().withMessage("zoneId must be a string"),
  query("leadId").optional().isString().notEmpty().withMessage("leadId must be a string"),
  validateRequest,
];
