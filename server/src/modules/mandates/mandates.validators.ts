import { body, param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import {
  auditTypeValues,
  mandateCouncilStatusValues,
  mandateStatusValues,
  normalizeMandateCouncilStatus,
} from "./mandates.service";

function parseArray(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to comma-separated support.
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const mandateBaseValidator = [
  body("title").isString().trim().notEmpty().withMessage("title is required"),
  body("year").isInt({ min: 2000 }).withMessage("year must be a valid year"),
  body("description").isString().trim().notEmpty().withMessage("description is required"),
  body("startDate").isISO8601().withMessage("startDate must be a valid ISO date"),
  body("endDate").isISO8601().withMessage("endDate must be a valid ISO date"),
  body("scope").isString().trim().notEmpty().withMessage("scope is required"),
  body("objectives").custom((value) => {
    const objectives = parseArray(value);
    if (objectives.length === 0 || objectives.some((item) => typeof item !== "string")) {
      throw new Error("objectives must contain at least one string");
    }
    return true;
  }),
  body("auditTypes").custom((value) => {
    const auditTypes = parseArray(value);
    if (
      auditTypes.length === 0 ||
      auditTypes.some((auditType) => !auditTypeValues.includes(auditType))
    ) {
      throw new Error(`auditTypes must contain: ${auditTypeValues.join(", ")}`);
    }
    return true;
  }),
  body("targetMode").not().exists().withMessage("targetMode is derived by the server"),
  body("targetCouncilIds")
    .optional()
    .custom((value) => {
      const targetCouncilIds = parseArray(value);
      if (targetCouncilIds.some((item) => typeof item !== "string" || item.length === 0)) {
        throw new Error("targetCouncilIds must be an array of council IDs");
      }
      return true;
    }),
];

export const createMandateValidator = [
  ...mandateBaseValidator,
  body("signature").custom((_value, { req }) => {
    if (!req.file) {
      throw new Error("signature file is required");
    }
    return true;
  }),
  validateRequest,
];

export const listMandatesValidator = [
  query("status")
    .optional()
    .isIn(mandateStatusValues)
    .withMessage(`status must be one of: ${mandateStatusValues.join(", ")}`),
  validateRequest,
];

export const updateMandateValidator = [
  param("id").isString().notEmpty(),
  body("title").optional().isString().trim().notEmpty(),
  body("year").optional().isInt({ min: 2000 }),
  body("description").optional().isString().trim().notEmpty(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("scope").optional().isString().trim().notEmpty(),
  body("objectives")
    .optional()
    .custom((value) => {
      const objectives = parseArray(value);
      if (objectives.length === 0 || objectives.some((item) => typeof item !== "string")) {
        throw new Error("objectives must contain at least one string");
      }
      return true;
    }),
  body("auditTypes")
    .optional()
    .custom((value) => {
      const auditTypes = parseArray(value);
      if (auditTypes.some((auditType) => !auditTypeValues.includes(auditType))) {
        throw new Error(`auditTypes must contain: ${auditTypeValues.join(", ")}`);
      }
      return true;
    }),
  body("targetMode").not().exists().withMessage("targetMode is derived by the server"),
  body("targetCouncilIds")
    .optional()
    .custom((value) => {
      const targetCouncilIds = parseArray(value);
      if (targetCouncilIds.some((item) => typeof item !== "string" || item.length === 0)) {
        throw new Error("targetCouncilIds must be an array of council IDs");
      }
      return true;
    }),
  validateRequest,
];

export const mandateIdValidator = [
  param("id").isString().notEmpty().withMessage("mandate id is required"),
  validateRequest,
];

export const rejectMandateValidator = [
  param("id").isString().notEmpty().withMessage("mandate id is required"),
  body("rejectionReason").optional().isString().trim().isLength({ max: 1000 }),
  validateRequest,
];

export const listMandateAcceptanceValidator = [
  param("id").isString().notEmpty().withMessage("mandate id is required"),
  query("status")
    .optional()
    .custom((value) => {
      const normalizedStatus = normalizeMandateCouncilStatus(String(value));

      if (!normalizedStatus) {
        throw new Error(
          `Invalid mandate acceptance status "${value}". Use one of: ${mandateCouncilStatusValues.join(
            ", ",
          )}`,
        );
      }

      return true;
    })
    .customSanitizer((value) => normalizeMandateCouncilStatus(String(value)))
    .isIn(mandateCouncilStatusValues),
  validateRequest,
];
