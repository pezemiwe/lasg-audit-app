import { body, param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";
import { roleValues, statusValues } from "./users.service";

export const listUsersValidator = [
  query("role").optional().isIn(roleValues),
  query("status").optional().isIn(statusValues),
  query("zoneId").optional().isString(),
  query("councilId").optional().isString(),
  validateRequest,
];

export const createUserValidator = [
  body("name").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("role").isIn(roleValues),
  body("phone").optional().isString(),
  body("zoneId").optional().isString(),
  body("councilId").optional().isString(),
  body("specialisations").optional().isArray(),
  validateRequest,
];

export const getUserValidator = [param("id").isString(), validateRequest];

export const updateUserValidator = [
  param("id").isString(),
  body("name").optional().isString().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional({ nullable: true }).isString(),
  body("role").optional().isIn(roleValues),
  body("zoneId").optional({ nullable: true }).isString(),
  body("councilId").optional({ nullable: true }).isString(),
  body("specialisations").optional().isArray(),
  validateRequest,
];

export const updateUserStatusValidator = [
  param("id").isString(),
  body("status").isIn(statusValues),
  validateRequest,
];

export const updateUserPasswordValidator = [
  param("id").isString(),
  body("password").isLength({ min: 8 }),
  validateRequest,
];
