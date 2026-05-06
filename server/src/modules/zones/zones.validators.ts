import { body, param } from "express-validator";
import { validateRequest } from "../../common/middleware/validateRequest";

export const zoneIdValidator = [param("id").isString(), validateRequest];

export const updateZoneSupervisorValidator = [
  param("id").isString(),
  body("supervisorId").optional({ nullable: true }).isString(),
  validateRequest,
];
