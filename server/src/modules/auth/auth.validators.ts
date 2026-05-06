import { body } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validateRequest,
];

export const resetPasswordValidator = [
  body("email").isEmail().normalizeEmail(),
  validateRequest,
];

export const newPasswordValidator = [
  body("token").isString().notEmpty(),
  body("password").isLength({ min: 8 }),
  validateRequest,
];
