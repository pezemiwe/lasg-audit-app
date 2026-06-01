import { body, param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import { councilTypeValues } from "./councils.service";

export const listCouncilsValidator = [
  query("zoneId").optional().isString(),
  query("type").optional().isIn(councilTypeValues),
  validateRequest,
];

export const councilIdValidator = [param("id").isString(), validateRequest];

export const updateCouncilValidator = [
  param("id").isString(),
  body("contactName").optional({ nullable: true }).isString(),
  body("contactEmail").optional({ nullable: true }).isEmail().normalizeEmail(),
  body("contactPhone").optional({ nullable: true }).isString(),
  validateRequest,
];

export const assignHeadOfLocalGovernmentValidator = [
  param("id").isString().notEmpty().withMessage("council id is required"),
  body("userId").isString().notEmpty().withMessage("userId is required"),
  validateRequest,
];
