"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentsRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
exports.assignmentsRouter = (0, express_1.Router)();
exports.assignmentsRouter.use(authenticate_1.authenticate);
// TODO: Add route guards / validation middleware per route
//# sourceMappingURL=assignments.routes.js.map