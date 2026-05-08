"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditsRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
exports.auditsRouter = (0, express_1.Router)();
exports.auditsRouter.use(authenticate_1.authenticate);
// TODO: Add route guards / validation middleware per route
//# sourceMappingURL=audits.routes.js.map