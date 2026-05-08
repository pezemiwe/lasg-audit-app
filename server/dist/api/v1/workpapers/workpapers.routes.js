"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workpapersRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middleware/authenticate");
exports.workpapersRouter = (0, express_1.Router)();
exports.workpapersRouter.use(authenticate_1.authenticate);
// TODO: Add route guards / validation middleware per route
//# sourceMappingURL=workpapers.routes.js.map