import { body, param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import { documentRequirementStatusValues } from "./document-requirements.service";

export const listDocumentRequirementsValidator = [
  query("status")
    .optional()
    .isIn(documentRequirementStatusValues)
    .withMessage(`status must be one of: ${documentRequirementStatusValues.join(", ")}`),
  validateRequest,
];

export const createDocumentRequirementValidator = [
  body("name").isString().trim().notEmpty().withMessage("name is required"),
  body("description").optional({ nullable: true }).isString(),
  body("requiredFormat").isString().trim().notEmpty().withMessage("requiredFormat is required"),
  body("category").optional({ nullable: true }).isString(),
  body("sortOrder").optional().isInt({ min: 0 }),
  validateRequest,
];

export const updateDocumentRequirementValidator = [
  param("id").isString().notEmpty().withMessage("document requirement id is required"),
  body("name").optional().isString().trim().notEmpty(),
  body("description").optional({ nullable: true }).isString(),
  body("requiredFormat").optional().isString().trim().notEmpty(),
  body("category").optional({ nullable: true }).isString(),
  body("sortOrder").optional().isInt({ min: 0 }),
  body("status").optional().isIn(documentRequirementStatusValues),
  validateRequest,
];

export const documentRequirementIdValidator = [
  param("id").isString().notEmpty().withMessage("document requirement id is required"),
  validateRequest,
];
