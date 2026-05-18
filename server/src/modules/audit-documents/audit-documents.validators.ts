import { body, param } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";

export const auditDocumentsByAuditValidator = [
  param("auditId").isString().notEmpty().withMessage("audit id is required"),
  validateRequest,
];

export const uploadAuditDocumentValidator = [
  param("auditId").isString().notEmpty().withMessage("audit id is required"),
  param("documentId").isString().notEmpty().withMessage("document id is required"),
  validateRequest,
];

export const auditDocumentIdValidator = [
  param("id").isString().notEmpty().withMessage("audit document id is required"),
  validateRequest,
];

export const rejectAuditDocumentValidator = [
  param("id").isString().notEmpty().withMessage("audit document id is required"),
  body("rejectionReason").isString().trim().notEmpty().withMessage("rejectionReason is required"),
  validateRequest,
];
