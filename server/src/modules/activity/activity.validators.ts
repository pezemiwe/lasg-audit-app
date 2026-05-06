import { param, query } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";

export const listActivityValidator = [
  query("userId").optional().isString(),
  query("entityType").optional().isString(),
  query("entityId").optional().isString(),
  validateRequest,
];

export const getActivityValidator = [param("id").isString(), validateRequest];
